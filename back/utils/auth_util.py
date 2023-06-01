from google.oauth2 import id_token
from google.auth.transport import requests
from configs.config import Config

def verify_google_token(idt):
    try:
        # Specify the CLIENT_ID of the app that accesses the backend:
        idinfo = id_token.verify_oauth2_token(idt, requests.Request(),audience=Config.GOOGLE_CLIENT_ID)

        if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            raise ValueError('Wrong issuer.')

        # ID token is valid. Get the user's Google Account ID from the decoded token.
        userid = idinfo['sub']
        return userid

    except ValueError:
        # Invalid token
        return None