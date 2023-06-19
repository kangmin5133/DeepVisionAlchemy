from fastapi import APIRouter, File, UploadFile, Form, Body, Response, Depends, HTTPException, status
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from db.database import get_db
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
    
    if request.get("user_id") is None:
        raise HTTPException(status_code=404,detail="user_id required")
    
    if request.get("workspace_type_id") is None:
        raise HTTPException(status_code=404,detail="workspace_type_id required")
    
    response = await workspace_service.create_workspace(request = request,db = db)
    return JSONResponse(content=response)

@router.get("/get")
async def getWorkSpaceByUserId(request: dict = None, db: Session = Depends(get_db)):
    if request is None:
        raise HTTPException(status_code=404,detail="request is none")
    
    if request.get("user_id") is None:
        raise HTTPException(status_code=404,detail="user_id required")
    
    response = await workspace_service.get_workspaces_by_creator_id(creator_id = request.get("user_id"),db = db)
    return JSONResponse(content=response)
