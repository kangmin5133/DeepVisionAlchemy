from fastapi import APIRouter, File, UploadFile, Form, Body, Response, Depends, HTTPException, status
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from db.mysql.database import get_db
from fastapi.responses import JSONResponse

from configs.config import Config
from services import workspace_service, project_service
import httpx
from urllib.parse import urlencode

router = APIRouter(prefix="/rest/api/project")


@router.post("/create")
async def createProject(request: dict = None, db: Session = Depends(get_db)):
    """
    request
    data type : Project
      projectName: '',
      projectDescription: '',
      datasetId : 0,
      workspaceId : 0,
      preprocessing: false,
      preprocessTags : [],
      taskType: '',
      classTags : []
    """
    print("request : ", request)
    if request.get("userId") is None:
        raise HTTPException(status_code=404,detail="user_id is missing")
    if request.get("projectName") is None:
        raise HTTPException(status_code=404,detail="project name must required!")
    if request.get("datasetId") is None:
        raise HTTPException(status_code=404,detail="dataset id must required!")
    if request.get("workspaceId") is None:
        raise HTTPException(status_code=404,detail="workspace id must required!")
    if request.get("taskType") is None:
        raise HTTPException(status_code=404,detail="project task type must required!")

    response = await project_service.create_project(request = request, db = db)
    print("response : ",response)

    return JSONResponse(content=response)

@router.get("/get/by/projectid")
async def getProjectByProjectId(project_id: int = None, db: Session = Depends(get_db)):
    if project_id is None:
        raise HTTPException(status_code=404,detail="project id must required!")
    
    response = await project_service.get_project_by_project_id(project_id = project_id,db = db)
    return JSONResponse(content=response)

@router.get("/get/by/workspaceid")
async def getProjectsByUserIdAndWorkspaceId(workspace_id:int=None,db: Session = Depends(get_db)):
    if workspace_id is None:
        raise HTTPException(status_code=404,detail="workspace id must required!")
    
    response = await project_service.get_projects_by_workspace_id(workspace_id = workspace_id,db = db)
    print("response : ",response)
    return JSONResponse(content=response)

@router.post("/labeling/oneclick")
async def oneClickSegmentation(request: dict = None,db: Session = Depends(get_db)):
    print("\nlabeling oneclick segment request : ", request)
    if request.get("dataset_id") is None:
        raise HTTPException(status_code=404,detail="dataset_id must required!")
    
    if request.get("file_name") is None:
        raise HTTPException(status_code=404,detail="file_name must required!")
    
    if request.get('x') is None or request.get('y') is None:
        raise HTTPException(status_code=404,detail="coords must required!")
    
    parseData = {"dataset_id" : request.get("dataset_id"), 
                 "file_name" : request.get("file_name"),
                 "mode" : "oneclick",
                 "coords":[request.get("x"),request.get("y")]}
    
    print("parseData : ",parseData)
    response = await project_service.image_labeling(parseData,db)
    print("labeling oneclick segment response status ",response)
    return JSONResponse(content=response.json())


@router.post("/labeling/bbox")
async def bboxSegmentation(request: dict = None,db: Session = Depends(get_db)):
    print("\nlabeling bbox segment request : ", request)
    if request.get("dataset_id") is None:
        raise HTTPException(status_code=404,detail="dataset_id must required!")
    
    if request.get("file_name") is None:
        raise HTTPException(status_code=404,detail="file_name must required!")
    
    if request.get("startX") is None or request.get("startY") is None or request.get("endX") is None or request.get("endY") is None:
        raise HTTPException(status_code=404,detail="bbox must required!")
    
    parseData = {"dataset_id" : request.get("dataset_id"), 
                 "file_name" : request.get("file_name"),
                 "mode" : "bbox",
                 "bbox":[request.get("startX"), request.get("startY"), request.get("endX"), request.get("endY")]}
    
    response = await project_service.image_labeling(parseData,db)
    print("labeling bbox segment response status : ",response)

    return JSONResponse(content=response.json())

@router.post("/labeling/global")
async def bboxSegmentation(request: dict = None,db: Session = Depends(get_db)):
    print("\nlabeling global segment request : ", request)
    if request.get("dataset_id") is None:
        raise HTTPException(status_code=404,detail="dataset_id must required!")
    
    if request.get("file_name") is None:
        raise HTTPException(status_code=404,detail="file_name must required!")
    
    parseData = {"dataset_id" : request.get("dataset_id"), 
                "file_name" : request.get("file_name"),
                "mode" : "global"}
    response = await project_service.image_labeling(parseData,db)
    print("labeling global segment response status : ",response)

    return JSONResponse(content=response.json())
