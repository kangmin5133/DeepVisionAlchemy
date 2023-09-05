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
    pass