from fastapi import Depends, HTTPException
from PIL import Image
import io
from datetime import datetime
import cv2
from io import BytesIO

# for mysql 
from sqlalchemy.orm import Session
from db.mysql.database import get_db
from db.mysql import crud, schemas

# for mongo
from db.mongo import structure
from db.mongo.database import get_nosql_db
from dataclasses import asdict
from db.mongo.structure import Image as ImageForm

import asyncio
from configs.config import Config
from configs.enums import *
from . import auth_service 

# encryption
import base64
from cryptography.fernet import Fernet

# for GCS
from google.cloud import storage
from google.oauth2.service_account import Credentials
import json

# for S3
import boto3

def encrypt_data(data: dict):
    data_str = json.dumps(data)  # Convert dict to string
    data_bytes = data_str.encode()  # Convert string to bytes
    cipher_suite = Fernet(Config.CREDENTIAL_ENCRYPT_KEY)
    cipher_text = cipher_suite.encrypt(data_bytes)  # Encrypt the bytes
    return cipher_text

def decrypt_data(cipher_text: str):
    cipher_suite = Fernet(Config.CREDENTIAL_ENCRYPT_KEY)
    data_bytes = cipher_suite.decrypt(cipher_text)  # Decrypt the cipher text
    data_str = data_bytes.decode()  # Convert bytes back to string
    data = json.loads(data_str)  # Convert string back to dict
    return data

def get_files_in_s3(bucket_name, prefix, access_key_id, secret_access_key):
    s3 = boto3.client('s3', 
                      aws_access_key_id=access_key_id, 
                      aws_secret_access_key=secret_access_key,
                      )
    
    response = s3.list_objects(Bucket=bucket_name, Prefix=prefix)
    return [content['Key'] for content in response.get('Contents', [])][1:]

def get_files_in_gcs(bucket_name:str, prefix:str, json_key:json):    
    # credentials = Credentials.from_service_account_file(json_key_path)
    # json_key = json.loads(json_key_string)
    print(type)
    credentials = Credentials.from_service_account_info(json_key)
    storage_client = storage.Client(credentials=credentials)
    
    blobs = storage_client.list_blobs(bucket_name, prefix=prefix)

    return [blob.name for blob in blobs][1:]

def read_image_in_gcs(bucket_name:str, blob_name:str, json_key : json):

    # json_key = json.loads(json_key_string)
    credentials = Credentials.from_service_account_info(json_key)
    storage_client = storage.Client(credentials=credentials)
    
    bucket = storage_client.get_bucket(bucket_name)
    blob = bucket.get_blob(blob_name)
    # data = blob.download_as_text()  # text 파일의 경우
    data = blob.download_as_bytes()  # binary 파일의 경우, 예를 들어 이미지 파일

    image = Image.open(io.BytesIO(data))
    width, height = image.size
    
    return data, width, height

def read_images_range_in_gcs(bucket_name, file_names_list, start, end, json_key):
    credentials = Credentials.from_service_account_info(json_key)
    storage_client = storage.Client(credentials=credentials)
    bucket = storage_client.get_bucket(bucket_name)
    data_list = []
    for i in range(start, end):
        blob = bucket.get_blob(file_names_list[i])
        data = blob.download_as_bytes()
        data_list.append(data)

    return data_list

def read_all_images_in_gcs(bucket_name:str, prefix:str, json_key : json):
   
    credentials = Credentials.from_service_account_info(json_key)
    storage_client = storage.Client(credentials=credentials)
    
    blobs = storage_client.list_blobs(bucket_name, prefix=prefix)
    
    data = []
    for blob in blobs:
        blob_data, w, h = read_image_in_gcs(bucket_name, blob.name, json_key)
        data.append(blob_data)
    return data

def read_image_in_s3(bucket_name, object_key, access_key_id, secret_access_key):
    s3 = boto3.client('s3', 
                      aws_access_key_id=access_key_id, 
                      aws_secret_access_key=secret_access_key)
    
    response = s3.get_object(Bucket=bucket_name, Key=object_key)
    # data = response['Body'].read().decode('utf-8')  # text 파일의 경우
    data = response['Body'].read()  # binary 파일의 경우, 예를 들어 이미지 파일

    image = Image.open(io.BytesIO(data))
    width, height = image.size
    
    return data, width, height

def read_images_range_in_s3(bucket_name, file_names_list, start, end, access_key_id, secret_access_key):
    s3 = boto3.client('s3', 
                      aws_access_key_id=access_key_id, 
                      aws_secret_access_key=secret_access_key)
    data_list = []
    for i in range(start, end):
        response = s3.get_object(Bucket=bucket_name, Key=file_names_list[i])
        data = response['Body'].read()
        data_list.append(data)

    return data_list

def read_all_images_in_s3(bucket_name, prefix, access_key_id, secret_access_key):
    s3 = boto3.client('s3', 
                      aws_access_key_id=access_key_id, 
                      aws_secret_access_key=secret_access_key)
    
    response = s3.list_objects(Bucket=bucket_name, Prefix=prefix)
    
    data = []
    for content in response.get('Contents', []):
        object_data, w, h = read_image_in_s3(bucket_name, content['Key'], access_key_id, secret_access_key)
        data.append(object_data)
    
    return data

async def create_dataset(request : dict, db:Session, zipFile=None):
    """
    create dataset data into (mySQL , MongoDB)
    return type : Dataset
    """
    file_list = []
    bucket_name = request["bucketInfo"].get("bucketName",None)
    prefix = request["bucketInfo"].get("prefix",None)
    dataset_credential = None
    # get file list for insert mongoDB - images
    if request["dataType"] =="Amazon S3":
        dataset_type = DataSrcType.Amazon_S3.value
        # get credential 
        credential = request.get('credentials')
        access_key_id_b64 = credential.get("accessKeyId")
        access_key_secret_b64 = credential.get("secretAccessKey")

        # decode
        access_key_id = base64.b64decode(access_key_id_b64).decode()
        access_key_secret = base64.b64decode(access_key_secret_b64).decode()

        
        dataset_credential ={"access_key_id":access_key_id,
                             "access_key_secret":access_key_secret}
        en_dataset_credential = encrypt_data(dataset_credential)

        file_list = get_files_in_s3(bucket_name=bucket_name,
                        prefix=prefix,
                        access_key_id=access_key_id,
                        secret_access_key = access_key_secret)
        
    elif request["dataType"] =="Google Cloud Storage":

        dataset_type = DataSrcType.Google_Cloud_Storage.value

        # get credential 
        credential = request.get('credentials')
        json_file_data_url = credential.get("jsonFile")

        # extract the base64 data from the data URL
        json_file_data_b64 = json_file_data_url.split(',')[1]
        # decode
        json_file = base64.b64decode(json_file_data_b64).decode()
        json_key = json.loads(json_file)

        dataset_credential ={"json_file":json_key}
        en_dataset_credential = encrypt_data(dataset_credential)

        file_list = get_files_in_gcs(bucket_name=bucket_name,
                        prefix=prefix,
                        json_key = json_key)
        
        
    elif request["dataType"] =="Local Upload" and zipFile: # Local Upload
        dataset_type = DataSrcType.Local_Upload.value
        en_dataset_credential = None
        bucket_name = None
        prefix = None
        # Todo
        """
         1. 파일 저장 위치 지정
         2. 파일 검증
         3. 압축 해제 & 파일 리스트 생성
         2. 파일 저장
         """

    # create dataset schema & insert to mysql
    user_info = request.get("user")
    email = user_info.get("email")
    count = len(file_list)
    user_obj = crud.get_user(db, email)
    org_info = crud.get_organization_by_creator_id(db,user_obj.user_id)
    organization_id = None
    if org_info is not None:
        # organization = org_info.org_id
        organization_id = org_info.org_id

    dataset_info = request.get("datasetInfo")
    
    dataset = schemas.DatasetCreate(dataset_name=dataset_info.get("name"),
                          dataset_type = dataset_type,
                          creator_id=user_obj.user_id,
                          org_id = organization_id,
                          dataset_desc = dataset_info.get("desc",None),
                          dataset_credential = en_dataset_credential,
                          dataset_count = count,
                          dataset_bucket_name = bucket_name,
                          dataset_prefix = prefix
                         )
    print("\ndataset : ",dataset)
    db_dataset = crud.create_dataset(db=db,dataset=dataset)
    dataset_info = db_dataset.__dict__
    del dataset_info['_sa_instance_state']
    del dataset_info['dataset_credential']

    # create Image dataclass form & insert to mongodb
    """
    id: int
    dataset_id : int
    width: int
    height: int
    file_name: str
    license: Optional[int]
    created: Optional[str]
    """
    db = get_nosql_db()
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    if dataset_type == DataSrcType.Google_Cloud_Storage.value:
        for i,name in enumerate(file_list):
            #bucket_name:str, blob_name:str, json_key : json
            _, w, h = read_image_in_gcs(bucket_name = bucket_name,
                              blob_name = name,
                              json_key = json_key)
            
            image = ImageForm(i,dataset_info["dataset_id"],w, h, name, 1, now_str)
            db.images.insert_one(asdict(image))
            
            
    elif dataset_type == DataSrcType.Amazon_S3.value:
        #bucket_name, object_key, access_key_id, secret_access_key
        for i,name in enumerate(file_list):
            _, w, h = read_image_in_s3(bucket_name = bucket_name,
                            object_key = name,
                            access_key_id = access_key_id,
                            secret_access_key = access_key_secret)
            
            image = ImageForm(i,dataset_info["dataset_id"],w, h, name, 1, now_str)
            db.images.insert_one(asdict(image))

    elif dataset_type == DataSrcType.Local_Upload.value:
        # Todo
        pass

    return dataset_info
    
async def get_dataset_list(user_id : int, db:Session):
    """
    return dataset list by creator_id 
    return type : Dataset[]
    """
    result_list = []
    dict_form ={}
    results = crud.get_datasets_by_creator_id(db = db, creator_id = user_id)
    for result in results:
        dict_form ={}
        dict_form["dataset_id"] = result.dataset_id
        dict_form["org_id"] = result.org_id
        dict_form["creator_id"] = result.creator_id
        dict_form["dataset_name"] = result.dataset_name
        dict_form["dataset_desc"] = result.dataset_desc
        dict_form["dataset_type"] = result.dataset_type
        dict_form["dataset_count"] = result.dataset_count
        dict_form["dataset_prefix"] = result.dataset_prefix
        dict_form["created"] = str(result.created).split(" ")[0].replace("-","/")
        result_list.append(dict_form)
    return result_list

async def get_dataset_images_range(dataset_id : int, 
                                startIndex:int, 
                                endIndex:int, 
                                maxResult:int,
                                db: Session):
    
    results = crud.get_dataset_by_dataset_id(db = db, dataset_id = dataset_id)
    

    credential = decrypt_data(results.dataset_credential)  # return json
    
    image_info_list = []
    # get images path from mongoDB
    db = get_nosql_db()
    collection = db['images']
    query = {'dataset_id': dataset_id, 'id': {'$gte': startIndex, '$lt': endIndex}}
    result = collection.find(query)
    result_list = list(result)
    file_names_list = [doc["file_name"] for doc in result_list]
    
    if len(file_names_list) == 0:
        raise HTTPException(status_code=404,detail="dataset doesn't exist")
    
    if results.dataset_type == DataSrcType.Amazon_S3.value:
        images = read_images_range_in_s3(bucket_name = results.dataset_bucket_name,
                                         file_names_list = file_names_list,
                                         start = startIndex, end = endIndex, 
                                         access_key_id = credential["access_key_id"], 
                                         secret_access_key = credential["access_key_secret"])
        
    elif results.dataset_type == DataSrcType.Google_Cloud_Storage.value:
        json_key = json.loads(credential["json_file"])
        images = read_images_range_in_gcs(bucket_name = results.dataset_bucket_name,
                                          file_names_list = file_names_list,
                                         start = startIndex, end = endIndex, 
                                         json_key = json_key)
        
    
    for i in range(len(file_names_list[startIndex:endIndex])):
        base64_image = base64.b64encode(images[i]).decode('utf-8')
        image_info_list.append({"file_name":file_names_list[i],"image":base64_image})
    
    response = {"dataset_id": dataset_id, 
                 "images" : image_info_list}
    
    print(f"dataset_id : {dataset_id} images count : {len(image_info_list)}")
    return response
    

async def getDatasetImage(dataset_id : int, image_id: int,is_thumbnail: bool, db: Session):
    
    results = crud.get_dataset_by_dataset_id(db = db, dataset_id = dataset_id)
    
    # get images path from mongoDB
    db = get_nosql_db()
    collection = db['images']
    try:
        query = {'dataset_id': dataset_id, 'id': image_id}
        result = collection.find(query)[0]
        if len(result)==0:
        # raise HTTPException(status_code=404,detail="no data registered")
        # make emtpy image for test
            if is_thumbnail: 
                width, height = 256, 128
                gray_value = 128
                image = Image.new("L", (width, height), gray_value)
                image = image.resize((256, 128))
            buffered = BytesIO()
            image.save(buffered, format="JPEG")
            image_bytes = buffered.getvalue()
    except:
        if is_thumbnail: 
            width, height = 256, 128
            gray_value = 128
            image = Image.new("L", (width, height), gray_value)
            image = image.resize((256, 128))
        buffered = BytesIO()
        image.save(buffered, format="JPEG")  # 또는 원하는 형식, 예: "PNG"
        image_bytes = buffered.getvalue()    

    if results.dataset_type == DataSrcType.Amazon_S3.value:
        credential = decrypt_data(results.dataset_credential) 
        image_bytes, width, height = read_image_in_s3(bucket_name = results.dataset_bucket_name,
                                  object_key = result["file_name"],
                                  access_key_id = credential["access_key_id"],
                                  secret_access_key = credential["access_key_secret"]) #bucket_name, object_key, access_key_id, secret_access_key
        original_image = Image.open(BytesIO(image_bytes))
        if is_thumbnail: 
            new_size = (256, 128)
            original_image = original_image.resize(new_size)
        buffered = BytesIO()
        original_image.save(buffered, format="JPEG")  # 원래 형식과 동일한 형식을 사용
        image_bytes = buffered.getvalue()
        
    elif results.dataset_type == DataSrcType.Google_Cloud_Storage.value:
        credential = decrypt_data(results.dataset_credential) 
        json_key = json.loads(credential["json_file"])
        image_bytes, width, height = read_image_in_gcs(bucket_name = results.dataset_bucket_name,
                                   blob_name = result["file_name"],
                                   json_key = json_key) #blob_name:str, json_key : json
        original_image = Image.open(BytesIO(image_bytes))
        if is_thumbnail: 
            new_size = (256, 128)
            original_image = original_image.resize(new_size)
        buffered = BytesIO()
        original_image.save(buffered, format="JPEG")  # 원래 형식과 동일한 형식을 사용
        image_bytes = buffered.getvalue()
        
    base64_image = base64.b64encode(image_bytes).decode('utf-8')
    response = {"dataset_id": dataset_id, 
                 "image" : base64_image}
    
    return response

async def getImageFileList(dataset_id:int,db: Session):
    db = get_nosql_db()
    collection = db['images']
    query = {'dataset_id': dataset_id}
    result = list(collection.find(query))
    if len(result)!=0:
        for file_info in result:
            del file_info["_id"]
    return result
