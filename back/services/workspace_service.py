from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from db.mysql.database import get_db
from db.mysql import crud, schemas
import asyncio
from configs.config import Config
from configs.enums import *
from . import auth_service 
import uuid

async def create_workspace(request:dict, db:Session):
    """
    create workspace - schema

    creator_id: int
    workspace_type_id : int
    workspace_name: str
    workspcae_info: Optional[str] = None
    invitation_link: str
    org_id: Optional[int] = None
    """
    user_id = request.get("creator_id")
    workspace_type_id = request.get("workspace_type_id")
    if workspace_type_id not in [WorkspaceType.Labeling.value,WorkspaceType.Generation.value,WorkspaceType.Restoration.value]:
        raise HTTPException(status_code=404,detail="your workspace_type_id is must have only one of {1,2,3}")
    workspace_name = request.get("workspace_name")
    workspcae_info = request.get("workspcae_info",None)
    org_id = request.get("org_id",None)
    required = {"user_id" : user_id,"workspace_type_id":workspace_type_id,"workspace_name":workspace_name}
    for k,v in required.items():
        if v is None:
            raise HTTPException(status_code=404,detail=f"{k} must required!")
    unique_id = uuid.uuid4()

    invitation_link = Config.DIVA_HOME_URL+f"/{unique_id}"
    workspace = schemas.WorkspaceCreate(
                          creator_id=user_id,
                          workspace_type_id = workspace_type_id,
                          workspace_name=workspace_name,
                          workspcae_info = workspcae_info,
                          org_id = org_id,
                          invitation_link = invitation_link
                         )
    result = crud.create_workspace(db= db, workspace = workspace)
    del result["_sa_instance_state"]
    return result

async def get_workspace_by_invitation_link(invitation_link:str, db:Session):
    pass

async def get_workspaces_by_creator_id(creator_id:int, db:Session):
    results = crud.get_workspaces_by_creator_id(db= db,creator_id=creator_id)
    result_list = []
    # todo - add team members profile image, projects count
    for result in results:
        dict_form ={}
        dict_form["workspace_id"] = result.workspace_id
        dict_form["org_id"] = result.org_id
        dict_form["creator_id"] = result.creator_id
        dict_form["workspace_type_id"] = result.workspace_type_id
        dict_form["workspace_name"] = result.workspace_name
        dict_form["workspace_info"] = result.workspace_info
        dict_form["invitation_link"] = result.invitation_link
        dict_form["created"] = str(result.created).split(" ")[0].replace("-","/")
        result_list.append(dict_form)
    return result_list
        
    
    