from datetime import timedelta
import secrets

class Config(object):
    TESTING = True
    DEBUG=True
    PASS_LOGIN_REQUIRED = False
    
    HOST="localhost"
    PORT=8888

    # storage
    LOCAL_STORAGE="../storage"