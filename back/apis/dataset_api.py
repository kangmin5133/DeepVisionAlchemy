from fastapi import APIRouter, File, UploadFile, Form, Body, Response, Depends, HTTPException, status
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from db.mysql.database import get_db
from fastapi.responses import JSONResponse
import json
from configs.config import Config
from services import dataset_service
import httpx
from urllib.parse import urlencode

router = APIRouter(prefix="/rest/api/dataset")

@router.get("/get")
async def getDatasetByUserId(user_id: int = None, db: Session = Depends(get_db)):
    if user_id is None:
        raise HTTPException(status_code=404,detail="user id must required!")
    
    response = await dataset_service.get_dataset_list(user_id = user_id,db = db)
    return JSONResponse(content=response)

@router.get("/get/images")
async def getImageDataRange(dataset_id: int = None,
                            startIndex: int = 0,
                            endIndex : int =4,
                            maxResult :int = 5, 
                            db: Session = Depends(get_db)):
    if dataset_id is None:
        raise HTTPException(status_code=404,detail="dataset_id must required!")
    
    response = await dataset_service.get_dataset_images_range(dataset_id = dataset_id,
                                                     startIndex = startIndex,
                                                     endIndex = endIndex,
                                                     maxResult = maxResult,
                                                     db = db)
    return JSONResponse(content=response)

@router.get("/get/image")
async def getImageData(dataset_id: int = None,image_id : int = None, db: Session = Depends(get_db)):
    if dataset_id is None:
        raise HTTPException(status_code=404,detail="dataset_id must required!")
    
    response = await dataset_service.getDatasetImage(dataset_id = dataset_id,image_id=image_id,is_thumbnail=False,db = db)
    return JSONResponse(content=response)

@router.get("/get/thumbnail")
async def getImageThumbnail(dataset_id: int = None, db: Session = Depends(get_db)):
    if dataset_id is None:
        raise HTTPException(status_code=404,detail="dataset_id must required!")
    
    response = await dataset_service.getDatasetImage(dataset_id = dataset_id,image_id = 0,is_thumbnail=True,db = db)
    return JSONResponse(content=response)

@router.get("/get/filenames")
async def getImageFileName(dataset_id: int = None, db: Session = Depends(get_db)):
    if dataset_id is None:
        raise HTTPException(status_code=404,detail="dataset_id must required!")
    
    response = await dataset_service.getImageFileList(dataset_id = dataset_id, db = db)
    return JSONResponse(content=response)


@router.post("/create")
async def createDataset(request:dict, db: Session = Depends(get_db)):
    print("request from createDataset: ",request)

    if request["dataType"] is None:
        raise HTTPException(status_code=401,detail="dataType missing")
    
    if request["dataType"] == "Local upload":
        pass
    else:
        bucket_name = request["bucketInfo"]["bucketName"]
        if bucket_name is None:
            raise HTTPException(status_code=401,detail="must require bucketName")
        
        prefix = request["bucketInfo"]["prefix"]
        if prefix is None:
            raise HTTPException(status_code=401,detail="must require prefix")
        
    response = await dataset_service.create_dataset(request = request , db = db)

    return JSONResponse(content=str(response))

# for local upload dataset
@router.post("/create/upload")
async def createLocalDataset(zipFile: UploadFile = File(...),
                             jsonData: str = Form(...), 
                             db: Session = Depends(get_db)):
    print("Received file:", zipFile.filename)
    try:
        json_data = json.loads(jsonData)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON format")

    datasetInfo = json_data.get("datasetInfo", {})
    user = json_data.get("user", None)
    dataType = json_data.get("dataType", '')

    request = {"datasetInfo":datasetInfo,"user":user,"dataType":dataType}

    response = await dataset_service.create_dataset(request = request, db = db, zipFile = zipFile)
    return JSONResponse(content=str(response))

@router.post("/update")
async def updateDataset(request:dict, db: Session = Depends(get_db)):
    pass

@router.delete("/delete")
async def deleteDataset(request:dict, db: Session = Depends(get_db)):
    pass