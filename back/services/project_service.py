from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from db.mysql.database import get_db
from db.mysql import crud, schemas
import asyncio
from configs.config import Config
from configs.enums import *

async def create_project(request:dict, db:Session):
    pass

async def get_project_by_project_id(project_id:dict, db:Session):
    pass