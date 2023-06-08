import json
from configs.config import Config
from utils.auth_util import verify_google_token
import bcrypt
from fastapi import Depends
from sqlalchemy.orm import Session
from db.database import get_db
from db import crud, schemas
import asyncio
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

    user = crud.get_user(db, email)
    if user is None:
        response_data = {"email":email,
                     "name":name,
                     "social_id" : social_id,
                     "provider":provider_id,
                     "user_type_id" : UserType.default().value,
                     "membership_id" : Membership.default().value,
                     "access_token":access_token,
                     "refresh_token":refresh_token,
                     "is_user": False}
    else:
        response_data = {"email":email,
                     "name":name,
                     "social_id" : social_id,
                     "provider":provider_id,
                     "user_type_id" : UserType.default().value,
                     "membership_id" : Membership.default().value,
                     "access_token":access_token,
                     "refresh_token":refresh_token,
                     "is_user": True}
        # user_in = schemas.UserCreate(
        #                              email=email, 
        #                              name=name, 
        #                              social_id=social_id, 
        #                              provider=provider_id, 
        #                              user_type_id=UserType.default().value,
        #                              membership_id=Membership.default().value
        #                              )
        # user = crud.create_user(db, user_in)
    
    print("response_data : ",response_data)

    return response_data

async def getUser(email:str,db: Session):
    user = crud.get_user(db, email)
    return user

async def emailLogin(jsonData : dict ,
                      db: Session
                      ):
    pass

async def createOrg(jsonData : dict ,
                    user_info : dict,
                      db: Session):
    if jsonData.get("orgName") and jsonData.get("orgEmail") is not None:
        orgName = jsonData.get("orgName")
        orgEmail = jsonData.get("orgEmail")
        org_in = schemas.OrganizationCreate(
                                    org_email=orgEmail, 
                                    org_name=orgName, 
                                    creator_id=user_info["user_id"]
                                    )
        crud.create_organization(db, org_in)
        org_info = crud.get_organizations(db)
        print("org_info:",org_info[0].__dict__)
        org_dict = org_info[0].__dict__
        if '_sa_instance_state' in org_dict:
            del org_dict['_sa_instance_state']

        print("[createOrg query] : ",org_dict)
        return org_dict

async def register(jsonData : dict ,
                      db: Session
                      ):
    
    print("jsonData :",jsonData)
    email = jsonData.get("userEmail")
    name = jsonData.get("userName")
    social_id = jsonData.get("social_id",None)
    provider_id= jsonData.get("provider",None)
    user_pw = jsonData.get("passwordConfirm",None)
    if jsonData.get("orgName") is not None:
        user_type_id = UserType.Enterprise.value
    else:
        user_type_id = UserType.Personal.value

    if social_id is None:
        user_in = schemas.UserCreate(
                                    email=email, 
                                    name=name, 
                                    user_pw=bcrypt.hashpw(user_pw.encode('utf-8'),bcrypt.gensalt()).decode(),
                                    provider=provider_id,
                                    user_type_id=user_type_id,
                                    membership_id=Membership.default().value
                                    )
    else:
        user_in = schemas.UserCreate(
                                    email=email, 
                                    name=name, 
                                    social_id=social_id,
                                    provider=provider_id,
                                    user_type_id=user_type_id,
                                    membership_id=Membership.default().value
                                    )
    crud.create_user(db, user_in)
    user_info = crud.get_user(db,email)
    user_dict = user_info.__dict__
    if '_sa_instance_state' in user_dict:
        del user_dict['_sa_instance_state']
    print("[register query] : ",user_dict)
    org_dict = await createOrg(jsonData,user_dict,db)

    if org_dict is not None:
        return user_dict, org_dict
    else:
        return user_dict



    


        



