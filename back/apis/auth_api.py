from fastapi import APIRouter, File, UploadFile, Form, Body, Response, Depends
from fastapi.responses import RedirectResponse
from fastapi.responses import JSONResponse
import numpy as np
from PIL import Image
import json
from configs.config import Config
from configs.oauth import Oauth
from services import auth_service
import httpx
from urllib.parse import urlencode

router = APIRouter()

@router.get('/rest/api/auth/login/social/naver')
def naverSocialLogin():
    url = f"https://nid.naver.com/oauth2.0/authorize?client_id={Config.NAVER_CLIENT_ID}&redirect_uri={Config.NAVER_REDIRECT_URI}&response_type=code"
    return RedirectResponse(url)

@router.get('/rest/api/auth/social/naver/callback')
async def naverSocialLoginCallback(code: str):
     async with httpx.AsyncClient() as client:
        token_request = await client.get(f"https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id={Config.NAVER_CLIENT_ID}&client_secret={Config.NAVER_CLIENT_SECRET}&code={code}")
        token_json = token_request.json()

        access_token = token_json.get("access_token")
        profile_request = await client.get("https://openapi.naver.com/v1/nid/me", headers={"Authorization" : f"Bearer {access_token}"},)
        profile_data = profile_request.json()
    
        response = await auth_service.socialLogin(loginFrom="naver",profile_data = profile_data,token_data = token_json)
        
        query_data = {
        "email": response.get("email"),
        "name": response.get("name"),
        "social_id": response.get("social_id"),
        "user_id": response.get("user_id"),
        "provider": response.get("provider"),
        }
        query_string = urlencode(query_data)
        redirect_url = f"{Config.DIVA_REDIRECT_URL}?{query_string}"
        # return res
        return RedirectResponse(url=redirect_url)

@router.get('/rest/api/auth/login/social/kakao')
def kakaoSocialLogin():
    kakao_oauth_url=f"https://kauth.kakao.com/oauth/authorize?client_id={Config.KAKAO_CLIENT_ID}&redirect_uri={Config.KAKAO_REDIRECT_URI}&response_type=code"
    return RedirectResponse(kakao_oauth_url)

@router.get('/rest/api/auth/social/kakao/callback')
async def kakaoSocialLoginCallback(code: str):
    oauth = Oauth()
    auth_info = await oauth.auth(code)
    access_token = auth_info['access_token']
    profile_data = await oauth.userinfo("Bearer " + auth_info['access_token'])

    
    response = await auth_service.socialLogin(loginFrom="kakao",profile_data = profile_data,token_data = auth_info)
    if response.get("access_token") is None:
        return Response("Invalid Access") 
    else:
        query_data = {
        "email": response.get("email"),
        "name": response.get("name"),
        "social_id": response.get("social_id"),
        "user_id": response.get("user_id"),
        "provider": response.get("provider"),
        }
        query_string = urlencode(query_data)
        redirect_url = f"{Config.DIVA_REDIRECT_URL}?{query_string}"
        return RedirectResponse(url=redirect_url)

@router.get('/rest/api/auth/login/social/google')
def googleSocialLogin():
    app_key = Config.GOOGLE_CLIENT_ID
    scope = "https://www.googleapis.com/auth/userinfo.email " + \
            "https://www.googleapis.com/auth/userinfo.profile"
    
    redirect_uri = Config.GOOGLE_REDIRECT_URI
    google_auth_api = "https://accounts.google.com/o/oauth2/v2/auth"
    
    google_auth_url = f"{google_auth_api}?client_id={app_key}&response_type=code&redirect_uri={redirect_uri}&scope={scope}"
    
    return RedirectResponse(google_auth_url)

@router.get('/rest/api/auth/social/google/callback')
async def googleSocialLoginCallback(code: str):
    google_token_api = "https://oauth2.googleapis.com/token"

    google_token_api += \
        f"?client_id={Config.GOOGLE_CLIENT_ID}&client_secret={Config.GOOGLE_CLIENT_SECRET}&code={code}&grant_type=authorization_code&redirect_uri={Config.GOOGLE_REDIRECT_URI}&state=random_string"
    async with httpx.AsyncClient() as client:
        response = await client.post(google_token_api)
        token_data  = response.json()

    async with httpx.AsyncClient() as client:
        response = await client.get(url=Config.GOOGLE_USER_INFO_URL,
                                    params={
            'access_token': token_data.get("access_token")
        })
        user_info  = response.json()

    profile_data = {
        'username': user_info['email'],
        'first_name': user_info.get('given_name', ''),
        'last_name': user_info.get('family_name', ''),
        'nickname': user_info.get('nickname', ''),
        'name': user_info.get('name', ''),
        'image': user_info.get('picture', None),
        'path': "google",
    }
    response = await auth_service.socialLogin(loginFrom="google",profile_data = profile_data,token_data = token_data)
    if response.get("access_token") is None:
        return Response("Invalid Access") 

    query_data = {
    "email": response.get("email"),
    "name": response.get("name"),
    "social_id": response.get("social_id"),
    "user_id": response.get("user_id"),
    "provider": response.get("provider"),
    }
    query_string = urlencode(query_data)
    redirect_url = f"{Config.DIVA_REDIRECT_URL}?{query_string}"
    return RedirectResponse(url=redirect_url)