from fastapi import APIRouter, File, UploadFile, Form, Body, Response, Depends, HTTPException, status
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from db.mysql.database import get_db
from fastapi.responses import JSONResponse

from configs.config import Config
from services import workspace_service
import httpx
from urllib.parse import urlencode

router = APIRouter(prefix="/rest/api/team")


@router.post("/create")
async def createTeam(request: dict = None, db: Session = Depends(get_db)):
    pass
    # return JSONResponse(content=response)

@router.get("/get")
async def getTeam(creator_id: int = None, db: Session = Depends(get_db)):
    pass
