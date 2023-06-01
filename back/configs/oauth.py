from .config import Config
import httpx

class Oauth:
    def __init__(self):
        self.auth_server = "https://kauth.kakao.com%s"
        self.api_server = "https://kapi.kakao.com%s"
        self.default_header = {
            "Content-Type": "application/x-www-form-urlencoded",
            "Cache-Control": "no-cache",
        }

    async def auth(self, code):
        async with httpx.AsyncClient() as client:
            response = await client.post(
                url=self.auth_server % "/oauth/token",
                headers=self.default_header,
                data={
                    "grant_type": "authorization_code",
                    "client_id": Config.KAKAO_CLIENT_ID,
                    "client_secret": Config.KAKAO_CLIENT_SECRET,
                    "redirect_uri": Config.KAKAO_REDIRECT_URI,
                    "code": code,
                },
            )
        return response.json()

    async def refresh(self, refresh_token):
        async with httpx.AsyncClient() as client:
            response = await client.post(
                url=self.auth_server % "/oauth/token",
                headers=self.default_header,
                data={
                    "grant_type": "refresh_token",
                    "client_id": Config.KAKAO_CLIENT_ID,
                    "client_secret": Config.KAKAO_CLIENT_SECRET,
                    "refresh_token": refresh_token,
                },
            )
        return response.json()

    async def userinfo(self, bearer_token):
        async with httpx.AsyncClient() as client:
            response = await client.post(
                url=self.api_server % "/v2/user/me",
                headers={
                    **self.default_header,
                    **{"Authorization": bearer_token}
                },
                data={}
            )
        return response.json()