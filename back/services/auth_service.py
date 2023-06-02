import json
from configs.config import Config
from utils.auth_util import verify_google_token

from fastapi import Depends
from sqlalchemy.orm import Session
from db.database import get_db
from db import crud, schemas

from configs.enums import *

async def socialLogin(loginFrom : str,
                      profile_data : dict,
                      token_data : dict,
                      db: Session
                      ):

    if loginFrom == "naver":
        response = profile_data.get("response")
        provider_id = ProviderType.Naver.value
        email = response.get("email")
        name = response.get("name")
        social_id = response.get("id")
        access_token = token_data.get("access_token")
        refresh_token = token_data.get("refresh_token",None)

    elif loginFrom == "kakao":
        response = profile_data.get("kakao_account")
        provider_id = ProviderType.Kakao.value
        email = response.get("email")
        name = response.get("profile").get("nickname")
        social_id = profile_data.get("id")
        access_token = token_data.get("access_token")
        refresh_token = token_data.get("refresh_token",None)

    elif loginFrom == "google":
        email = profile_data.get("username")
        provider_id = ProviderType.Google.value
        name = profile_data.get("name")
        social_id = verify_google_token(token_data["id_token"])
        access_token = token_data.get("access_token")
        refresh_token = token_data.get("refresh_token",None)    

    response_data = {"email":email,
                     "name":name,
                     "social_id" : social_id,
                     "provider":provider_id,
                     "user_type_id" : UserType.default().value,
                     "membership_id" : Membership.default().value,
                     "access_token":access_token,
                     "refresh_token":refresh_token}
    
    user = crud.get_user(db, email)
    if not user:
        user_in = schemas.UserCreate(
                                     email=email, 
                                     name=name, 
                                     social_id=social_id, 
                                     provider=provider_id, 
                                     user_type_id=UserType.default().value,
                                     membership_id=Membership.default().value
                                     )
        user = crud.create_user(db, user_in)
    
    print("response_data : ",response_data)

    return response_data