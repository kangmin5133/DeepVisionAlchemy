from datetime import timedelta
import secrets

class Config(object):
    TESTING = True
    DEBUG=True
    PASS_LOGIN_REQUIRED = False
    
    HOST="0.0.0.0"
    PORT=8831

    # encryption_key
    with open('configs/credential_encrypt_key.key', 'rb') as mykey:
        key = mykey.read()
    CREDENTIAL_ENCRYPT_KEY = key

    # jwt  
    JWT_SECRET_KEY=secrets.token_hex(16) + "diva"
    JWT_ACCESS_TOKEN_EXPIRES=timedelta(hours=8)
    JWT_REFRESH_TOKEN_EXPIRES=timedelta(days=30)
    JWT_COOKIE_CSRF_PROTECT=False
    
    # cors
    CORS_RESOURCES={r"*": {"origins": ["*"]}}
    
    # 
    JSON_AS_ASCII=False

    # default image directory
    IMAGES_DIR = "images/"
    DEFAULT_PROFILE_IMAGE = IMAGES_DIR+"default_profile.png"

    #social login
    #register page URL
    DIVA_HOME_URL = "http://210.113.122.196:8830"
    DIVA_REGISTER_URL = DIVA_HOME_URL+"/login"
    DIVA_REDIRECT_URL = DIVA_HOME_URL+"/loginLoading"
    DIVA_REGISTER_REDIRECT_URL = DIVA_HOME_URL+"/select/account"

    # naver social login config
    NAVER_CLIENT_ID = "0AfndQN0nZvUgg5SM7Cr"
    NAVER_CLIENT_SECRET = 'Ij5VPC2U1X'
    NAVER_AUTHORIZATION_BASE_URL = 'https://nid.naver.com/oauth2.0/authorize'
    NAVER_TOKEN_URL = 'https://nid.naver.com/oauth2.0/token'
    NAVER_REDIRECT_URI = 'http://210.113.122.196:8831/rest/api/auth/social/naver/callback'

    #kakao social login config
    KAKAO_CLIENT_ID = "8418255cc021fde6af859750367ebe9d"
    KAKAO_CLIENT_SECRET = "ck4aeuO8ZSrSQ2mVXuFDVck3vPjif2tj"
    KAKAO_REDIRECT_URI = "http://210.113.122.196:8831/rest/api/auth/social/kakao/callback"

    #google social login config
    GOOGLE_CLIENT_ID = "582818142920-5pc29hfjarua94v2o41fs7avbl2q7gga.apps.googleusercontent.com"
    GOOGLE_CLIENT_SECRET = "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"
    GOOGLE_REDIRECT_URI = "http://localhost:8831/rest/api/auth/social/google/callback"
    GOOGLE_ACCESS_TOKEN_OBTAIN_URL = 'https://oauth2.googleapis.com/token'
    GOOGLE_USER_INFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo'

    #local file storage path
    LOCAL_STORAGE="../storage"
    TEMP_PATH=LOCAL_STORAGE+"/Temp"

    # serving server
    SERVING_URL = "http://localhost:8888"



