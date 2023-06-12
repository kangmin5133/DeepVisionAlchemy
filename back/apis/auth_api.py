from fastapi import APIRouter, File, UploadFile, Form, Body, Response, Depends, HTTPException, status
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from db.database import get_db
from fastapi.responses import JSONResponse
# import numpy as np
# from PIL import Image
# import json
import bcrypt
from configs.config import Config
from configs.oauth import Oauth
from services import auth_service
import httpx
from urllib.parse import urlencode

import jwt
from fastapi.security import OAuth2PasswordBearer
from fastapi.security.oauth2 import OAuth2PasswordRequestForm
from datetime import timedelta
from datetime import datetime
from db.schemas import *

from starlette.requests import Request


router = APIRouter(prefix="/rest/api/auth")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, Config.JWT_SECRET_KEY, algorithm="HS256")
    return encoded_jwt

def decode_token(token: str):
    try:
        # JWT 토큰 해독
        decoded_data = jwt.decode(token, Config.JWT_SECRET_KEY, algorithms="HS256")

        # 해독된 데이터로 User 객체 생성
        auth_user = AuthUser(
            email=decoded_data['email'],
            name=decoded_data['name'],
            social_id=decoded_data['social_id'],
            user_id=decoded_data['user_id'],
            provider=decoded_data['provider'],
            access_token=decoded_data['access_token']
        )
        return auth_user

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Access token is expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

def _parse_cookie(credentials: str) -> Optional[str]:
    if not credentials:
        return None
    if "access_token=" not in credentials:
        return None
    cookies = credentials.split("; ")
    for cookie in cookies:
        if cookie.startswith("access_token="):
            return cookie.replace("access_token=", "")
    return None

async def get_cookie_authorization(request: Request) -> Optional[str]:
    cookie_authorization: str = request.headers.get("Cookie")
    return _parse_cookie(cookie_authorization)

async def get_token(credentials: Optional[str] = Depends(get_cookie_authorization)) -> Optional[str]:
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )
    return credentials

async def get_current_user(token: str = Depends(get_token)):

    print("\ntoken : ",token)

    user = decode_token(token)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

@router.get("/users/me/", response_model=AuthUser)
async def read_users_me(current_user: AuthUser = Depends(get_current_user)):
    return current_user

@router.get('/login/social/naver')
def naverSocialLogin():
    url = f"https://nid.naver.com/oauth2.0/authorize?client_id={Config.NAVER_CLIENT_ID}&redirect_uri={Config.NAVER_REDIRECT_URI}&response_type=code"
    return RedirectResponse(url)

@router.get('/social/naver/callback')
async def naverSocialLoginCallback(code: str, db: Session = Depends(get_db)):
     async with httpx.AsyncClient() as client:
        token_request = await client.get(f"https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id={Config.NAVER_CLIENT_ID}&client_secret={Config.NAVER_CLIENT_SECRET}&code={code}")
        token_json = token_request.json()

        access_token = token_json.get("access_token")
        profile_request = await client.get("https://openapi.naver.com/v1/nid/me", headers={"Authorization" : f"Bearer {access_token}"},)
        profile_data = profile_request.json()
    
        response = await auth_service.socialLogin(loginFrom="naver",profile_data = profile_data,token_data = token_json, db=db)
        if response.get("is_user") == True:
            query_data = {
            "email": response.get("email"),
            "name": response.get("name"),
            "social_id": response.get("social_id"),
            "user_id": response.get("user_id"),
            "provider": response.get("provider"),
            }
            query_string = urlencode(query_data)
            redirect_url = f"{Config.DIVA_REDIRECT_URL}?{query_string}"
        else :
            query_data = {
            "email": response.get("email"),
            "name": response.get("name"),
            "social_id": response.get("social_id"),
            "user_id": response.get("user_id"),
            "provider": response.get("provider"),
            }
            query_string = urlencode(query_data)
            redirect_url = f"{Config.DIVA_REGISTER_REDIRECT_URL}?{query_string}"

        # return res
        return RedirectResponse(url=redirect_url)

@router.get('/login/social/kakao')
def kakaoSocialLogin():
    kakao_oauth_url=f"https://kauth.kakao.com/oauth/authorize?client_id={Config.KAKAO_CLIENT_ID}&redirect_uri={Config.KAKAO_REDIRECT_URI}&response_type=code"
    return RedirectResponse(kakao_oauth_url)

@router.get('/social/kakao/callback')
async def kakaoSocialLoginCallback(code: str,db: Session = Depends(get_db)):
    oauth = Oauth()
    auth_info = await oauth.auth(code)
    access_token = auth_info['access_token']
    profile_data = await oauth.userinfo("Bearer " + auth_info['access_token'])

    
    response = await auth_service.socialLogin(loginFrom="kakao",profile_data = profile_data,token_data = auth_info, db=db)
    if response.get("access_token") is None:
        return Response("Invalid Access") 
    else:
        if response.get("is_user") == True:
            query_data = {
            "email": response.get("email"),
            "name": response.get("name"),
            "social_id": response.get("social_id"),
            "user_id": response.get("user_id"),
            "provider": response.get("provider"),
            }
            query_string = urlencode(query_data)
            redirect_url = f"{Config.DIVA_REDIRECT_URL}?{query_string}"
        else :
            query_data = {
            "email": response.get("email"),
            "name": response.get("name"),
            "social_id": response.get("social_id"),
            "user_id": response.get("user_id"),
            "provider": response.get("provider"),
            }
            query_string = urlencode(query_data)
            redirect_url = f"{Config.DIVA_REGISTER_REDIRECT_URL}?{query_string}"

    return RedirectResponse(url=redirect_url)

@router.get('/login/social/google')
def googleSocialLogin():
    app_key = Config.GOOGLE_CLIENT_ID
    scope = "https://www.googleapis.com/auth/userinfo.email " + \
            "https://www.googleapis.com/auth/userinfo.profile"
    
    redirect_uri = Config.GOOGLE_REDIRECT_URI
    google_auth_api = "https://accounts.google.com/o/oauth2/v2/auth"
    
    google_auth_url = f"{google_auth_api}?client_id={app_key}&response_type=code&redirect_uri={redirect_uri}&scope={scope}"
    
    return RedirectResponse(google_auth_url)

@router.get('/social/google/callback')
async def googleSocialLoginCallback(code: str, db: Session = Depends(get_db)):
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
    response = await auth_service.socialLogin(loginFrom="google",profile_data = profile_data,token_data = token_data, db=db)
    if response.get("access_token") is None:
        return Response("Invalid Access") 

    if response.get("is_user") == True:
            query_data = {
            "email": response.get("email"),
            "name": response.get("name"),
            "social_id": response.get("social_id"),
            "user_id": response.get("user_id"),
            "provider": response.get("provider"),
            # "access_token" : response.get("access_token")
            }
            query_string = urlencode(query_data)
            redirect_url = f"{Config.DIVA_REDIRECT_URL}?{query_string}"
            return RedirectResponse(url=redirect_url)
            # jwt_token = jwt.encode(query_data, Config.JWT_SECRET_KEY)
            # redirect_url = f"{Config.DIVA_REDIRECT_URL}?{jwt_token}"
            # # redirect_url = Config.DIVA_REDIRECT_URL
            # response = RedirectResponse(url=redirect_url)
            # # response.set_cookie(
            # #     "access_token",
            # #     value=jwt_token,
            # #     httponly=True,
            # #     max_age=1800,
            # #     expires=1800,
            # # )
            # return response
    else :
        query_data = {
            "email": response.get("email"),
            "name": response.get("name"),
            "social_id": response.get("social_id"),
            "user_id": response.get("user_id"),
            "provider": response.get("provider")
            }
        query_string = urlencode(query_data)
        redirect_url = f"{Config.DIVA_REGISTER_REDIRECT_URL}?{query_string}"
        return RedirectResponse(url=redirect_url)
    
@router.post('/login/email')
async def emailLogin(request:dict, db: Session = Depends(get_db)):
    jsonData = request.get("jsonData")

    print("jsonData : ",jsonData)
    user = await auth_service.getUser(jsonData.get("userEmail"),db)
    if user is None:
        raise HTTPException(status_code=404,detail="user no exist")
    
    user_password = jsonData.get("userPassword")
    origin_password = user.user_pw
    check_result = bcrypt.checkpw(user_password.encode("utf-8"), origin_password.encode('utf-8'))
    if check_result is False:
        raise HTTPException(status_code=404,detail="password doesn't match")
    
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=Config.JWT_ACCESS_TOKEN_EXPIRES
    )

    user_dict = user.__dict__

    query_data = {
            "email": user_dict.get("email"),
            "name": user_dict.get("name"),
            "social_id": user_dict.get("social_id"),
            "user_id": user_dict.get("user_id"),
            "provider": user_dict.get("provider"),
            # "access_token" : response.get("access_token")
            }
    return JSONResponse(content={"access_token": access_token, "token_type": "bearer", "user": query_data})

@router.post('/register')
async def createUser(request:dict, db: Session = Depends(get_db)):
    jsonData = request.get("jsonData")
    user = await auth_service.getUser(jsonData.get("userEmail"),db)
    if user:
        raise HTTPException(status_code=404,detail="user already exist")
    
    user,org = await auth_service.register(jsonData,db)
    response = {"user_info":user,"org_info":org}

    return JSONResponse(content=str(response))

@router.get('/logout')
async def logout():
    return {"detail": "Successfully logged out"}