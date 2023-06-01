class Config(object):
    TESTING = True
    DEBUG=True
    PASS_LOGIN_REQUIRED = False
    
    HOST="0.0.0.0"
    PORT=8831
    
    # cors
    CORS_RESOURCES={r"*": {"origins": ["*"]}}
    
    # 
    JSON_AS_ASCII=False

    #social login
    #register page URL
    DIVA_HOME_URL = "http://210.113.122.196:8830"
    DIVA_REGISTER_URL = DIVA_HOME_URL+"/login"
    DIVA_REDIRECT_URL = DIVA_HOME_URL+"/loginLoading"

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
    GOOGLE_CLIENT_ID = "782804132648-j39m97crp6fknle1j7hae5tmr427e523.apps.googleusercontent.com"
    GOOGLE_CLIENT_SECRET = "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"
    GOOGLE_REDIRECT_URI = "http://localhost:8831/rest/api/auth/social/google/callback"
    GOOGLE_ACCESS_TOKEN_OBTAIN_URL = 'https://oauth2.googleapis.com/token'
    GOOGLE_USER_INFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo'



