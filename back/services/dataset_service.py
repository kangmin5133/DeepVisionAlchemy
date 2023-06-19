from fastapi import Depends
from sqlalchemy.orm import Session
from db.database import get_db
from db import crud, schemas
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
    
    return data

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
        blob_data = read_image_in_gcs(bucket_name, blob.name, json_key)
        data.append(blob_data)
    return data

def read_image_in_s3(bucket_name, object_key, access_key_id, secret_access_key):
    s3 = boto3.client('s3', 
                      aws_access_key_id=access_key_id, 
                      aws_secret_access_key=secret_access_key)
    
    response = s3.get_object(Bucket=bucket_name, Key=object_key)
    # data = response['Body'].read().decode('utf-8')  # text 파일의 경우
    data = response['Body'].read()  # binary 파일의 경우, 예를 들어 이미지 파일
    
    return data

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
        object_data = read_image_in_s3(bucket_name, content['Key'], access_key_id, secret_access_key)
        data.append(object_data)
    
    return data


async def create_dataset(request : dict, db:Session):
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
    else: # Local Upload
        pass

    # create dataset schema
    user_info = request.get("user")
    email = user_info.get("email")
    count = len(file_list[1:])
    
    user_obj = await auth_service.getUser(email,db)
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
    db_dataset = crud.create_dataset(db=db,dataset=dataset)
    dataset_info = db_dataset.__dict__
    del dataset_info['_sa_instance_state']
    del dataset_info['dataset_credential']

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
    if results.dataset_type == DataSrcType.Amazon_S3.value:

        # todo : change get_files_in_s3 to mongoDB query
        file_names_list = get_files_in_s3(bucket_name = results.dataset_bucket_name,
                                          prefix = results.dataset_prefix,
                                          access_key_id = credential["access_key_id"], 
                                          secret_access_key = credential["access_key_secret"])
        
        images = read_images_range_in_s3(bucket_name = results.dataset_bucket_name,
                                         file_names_list = file_names_list,
                                         start = startIndex, end = endIndex, 
                                         access_key_id = credential["access_key_id"], 
                                         secret_access_key = credential["access_key_secret"])
        
    elif results.dataset_type == DataSrcType.Google_Cloud_Storage.value:

        json_key = json.loads(credential["json_file"])

        # todo : change get_files_in_gcs to mongoDB query
        file_names_list = get_files_in_gcs(bucket_name = results.dataset_bucket_name,
                                          prefix = results.dataset_prefix,
                                          json_key = json_key)

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
    

async def getDatasetImage(dataset_id : int, db: Session):
    pass
    
