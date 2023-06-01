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
    
    #kakao social login config
    
    #google social login config
    



