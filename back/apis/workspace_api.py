from fastapi import APIRouter, File, UploadFile, Form, Body, Response, Depends, HTTPException, status
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from db.mysql.database import get_db
from fastapi.responses import JSONResponse

from configs.config import Config
from services import workspace_service
import httpx
from urllib.parse import urlencode

router = APIRouter(prefix="/rest/api/workspace")


@router.post("/create")
async def createWorkSpace(request: dict = None, db: Session = Depends(get_db)):
    if request is None:
        raise HTTPException(status_code=404,detail="request is none")
    
    jsonData = request.get("jsonData")
    
    if jsonData.get("creator_id") is None:
        raise HTTPException(status_code=404,detail="creator_id required")
    
    if jsonData.get("workspace_type_id") is None:
        raise HTTPException(status_code=404,detail="workspace_type_id required")
    
    response = await workspace_service.create_workspace(request = jsonData ,db = db)
    return JSONResponse(content=str(response))

@router.get("/get")
async def getWorkSpaceByUserId(creator_id: int = None, db: Session = Depends(get_db)):
    print("getWorkSpaceByUserId in")
    if creator_id is None:
        raise HTTPException(status_code=404,detail="creator_id required")
    
    response = await workspace_service.get_workspaces_by_creator_id(creator_id = creator_id,db = db)
    return JSONResponse(content=response)
