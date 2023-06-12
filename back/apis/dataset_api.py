from fastapi import APIRouter, File, UploadFile, Form, Body, Response, Depends, HTTPException, status
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from db.database import get_db
from fastapi.responses import JSONResponse

from configs.config import Config
from services import dataset_service
import httpx
from urllib.parse import urlencode

router = APIRouter(prefix="/rest/api/dataset")

@router.get("/get")
async def getDatasetByUserId(request:dict, db: Session = Depends(get_db)):
    pass

@router.post("/create")
async def createDataset(request:dict, db: Session = Depends(get_db)):
    pass

@router.post("/update")
async def updateDataset(request:dict, db: Session = Depends(get_db)):
    pass

@router.delete("/delete")
async def deleteDataset(request:dict, db: Session = Depends(get_db)):
    pass