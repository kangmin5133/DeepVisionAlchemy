import json
from configs.config import Config
from utils.auth_util import verify_google_token

async def socialLogin(loginFrom,profile_data,token_data):

    if loginFrom == "naver":
        response = profile_data.get("response")
        email = response.get("email")
        name = response.get("name")
        social_id = response.get("id")
        user_id = email.split("@")[0]
        access_token = token_data.get("access_token")
        refresh_token = token_data.get("refresh_token",None)

    elif loginFrom == "kakao":
        response = profile_data.get("kakao_account")
        email = response.get("email")
        name = response.get("profile").get("nickname")
        social_id = profile_data.get("id")
        user_id = email.split("@")[0]
        access_token = token_data.get("access_token")
        refresh_token = token_data.get("refresh_token",None)

    elif loginFrom == "google":
        email = profile_data.get("username")
        name = profile_data.get("name")
        social_id = verify_google_token(token_data["id_token"])

        user_id = email.split("@")[0]
        access_token = token_data.get("access_token")
        refresh_token = token_data.get("refresh_token",None)

    

    response_data = {"email":email,
                     "name":name,
                     "social_id" : social_id,
                     "user_id":user_id,
                     "provider":loginFrom,
                     "access_token":access_token,
                     "refresh_token":refresh_token}
    
    print("response_data : ",response_data)

    return response_data