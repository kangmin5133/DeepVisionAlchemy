from pymongo import MongoClient


def get_nosql_db():
    client = MongoClient('localhost', 8833)
    db = client['dva']
    return db