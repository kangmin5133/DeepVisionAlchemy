from enum import Enum, unique, IntEnum

@unique
class ProviderType(Enum):
    
    Google = 1

    Naver = 2

    Kakao = 3

    @classmethod
    def default(cls):
        pass

@unique
class UserType(Enum):
    
    Personal = 1

    Enterprise = 2

    @classmethod
    def default(cls):
        return cls.Personal
    
@unique
class Membership(Enum):
    
    Free = 1

    Business = 2

    Vip = 3

    @classmethod
    def default(cls):
        return cls.Free
    

@unique
class DataSrcType(Enum):
    
    Amazon_S3 = 1

    Google_Cloud_Storage = 2

    Microsoft_Azure_Blob_Storage = 3

    Cloudinary = 4

    Local_Upload = 5 

    @classmethod
    def default(cls):
        pass


@unique
class WorkspaceType(Enum):
    
    Labeling = 1

    Generation = 2

    Restoration = 3

    @classmethod
    def default(cls):
        return cls.Labeling