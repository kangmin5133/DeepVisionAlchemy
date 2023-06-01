from enum import Enum, unique, IntEnum

@unique
class DataTypes(Enum):
    
    SelfSupplied = 1

    Crawling = 2

    Uploaded = 3

    @classmethod
    def default(cls):
        return cls.SelfSupplied
