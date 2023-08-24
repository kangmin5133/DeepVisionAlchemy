from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from db.mysql.database import get_db
from db.mysql.schemas import ProjectCreate
from db.mysql import crud, schemas
import asyncio
from configs.config import Config
from configs.enums import *
import json

def get_project_list(query_results):
    result_list = []
    for result in query_results:
        dict_form ={}
        dict_form["project_id"] = result.project_id
        dict_form["project_name"] = result.project_name
        dict_form["workspace_id"] = result.workspace_id
        dict_form["project_desc"] = result.desc
        dict_form["project_type"] = result.project_type
        dict_form["project_preproccess"] = result.project_preproccess
        dict_form["preproccess_tags"] = json.loads(result.preproccess_tags.replace("'", '"')) if result.preproccess_tags else None
        dict_form["project_classes"] = json.loads(result.project_classes.replace("'", '"')) if result.project_classes else None
        dict_form["created"] = str(result.created).split(" ")[0].replace("-","/")
        result_list.append(dict_form)
    return result_list

async def create_project(request:dict, db:Session):
    project_name = request.get("projectName")
    project_description = request.get("projectDescription")
    dataset_id = request.get("datasetId")
    workspace_id = request.get("workspaceId")
    preprocessing = request.get("preprocessing")
    preprocess_tags = request.get("preprocessTags")
    task_type = request.get("taskType")
    class_tags = request.get("classTags")
    
    if task_type == "classification":
        project_type = 1
    elif task_type == "objectDetection":
        project_type = 2
    elif task_type == "semanticSegmentation":
        project_type = 3
    elif task_type == "instanceSegmentation":
        project_type = 4

    new_project = ProjectCreate(
        project_name=project_name,
        project_type = project_type,
        desc=project_description,
        workspace_id=workspace_id,
        project_preproccess = preprocessing,
        preproccess_tags=str(preprocess_tags) if preprocessing else None,
        project_classes=str(class_tags),
    )
    project_obj = crud.create_project(db = db, project = new_project)
    project = crud.associate_project_with_dataset(db = db, project_id = project_obj.project_id, dataset_id = dataset_id)

    project_dict = {}
    project_dict["project_id"] = project.project_id
    project_dict["project_name"] = project.project_name
    project_dict["workspace_id"] = project.workspace_id
    project_dict["project_desc"] = project.desc
    project_dict["project_type"] = project.project_type
    project_dict["project_preproccess"] = project.project_preproccess
    project_dict["preproccess_tags"] =json.loads(project.preproccess_tags.replace("'", '"')) if project.preproccess_tags else None
    project_dict["project_classes"] = json.loads(project.project_classes.replace("'", '"')) if project.project_classes else None
    project_dict["created"] = str(project.created).split(" ")[0].replace("-","/")
    return project_dict

async def get_project_by_project_id(project_id:int, db:Session):
    pass

async def get_projects_by_workspace_id(workspace_id :int, db:Session):
   query_results = crud.get_projects_by_workspace_id(workspace_id = workspace_id,db=db)
   results = get_project_list(query_results)
   return results