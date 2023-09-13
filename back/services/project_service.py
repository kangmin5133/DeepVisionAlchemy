from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from db.mysql.database import get_db
from db.mysql.schemas import ProjectCreate
from db.mysql import crud, schemas
import asyncio
from configs.config import Config
from configs.enums import *
import json
import requests

def get_project_list(query_results,db):
    result_list = []
    for result in query_results:
        print("result as dict : ",result.__dict__)
        dataset_ids = crud.get_dataset_ids_by_project_id(project_id=result.project_id,db=db)
        print("dataset_ids : ",dataset_ids)
        dict_form ={}
        dict_form["project_id"] = result.project_id
        dict_form["creator_id"] = result.creator_id
        dict_form["project_name"] = result.project_name
        dict_form["workspace_id"] = result.workspace_id
        dict_form["project_desc"] = result.desc
        dict_form["project_type"] = result.project_type
        dict_form["dataset_id"] = dataset_ids[0] if len(dataset_ids) != 0 else None
        dict_form["project_preproccess"] = result.project_preproccess
        dict_form["preproccess_tags"] = json.loads(result.preproccess_tags.replace("'", '"')) if result.preproccess_tags else None
        dict_form["project_classes"] = json.loads(result.project_classes.replace("'", '"')) if result.project_classes else None
        dict_form["created"] = str(result.created).split(" ")[0].replace("-","/")
        result_list.append(dict_form)
    return result_list

async def create_project(request:dict, db:Session):

    print("\n\n\n Request from create dataset : \n", request)
    creator_id = request.get("userId")
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
        creator_id=creator_id,
        workspace_id=workspace_id,
        project_preproccess = preprocessing,
        preproccess_tags=str(preprocess_tags) if preprocessing else None,
        project_classes=str(class_tags),
    )
    project_obj = crud.create_project(db = db, project = new_project)
    project = crud.associate_project_with_dataset(db = db, project_id = project_obj.project_id, dataset_id = dataset_id)
    project_dict = {}
    project_dict["project_id"] = project_obj.project_id
    project_dict["creator_id"] = project_obj.creator_id
    project_dict["project_name"] = project_obj.project_name
    project_dict["workspace_id"] = project_obj.workspace_id
    project_dict["dataset_id"] = dataset_id
    project_dict["project_desc"] = project_obj.desc
    project_dict["project_type"] = project_obj.project_type
    project_dict["project_preproccess"] = project_obj.project_preproccess
    project_dict["preproccess_tags"] =json.loads(project_obj.preproccess_tags.replace("'", '"')) if project_obj.preproccess_tags else None
    project_dict["project_classes"] = json.loads(project_obj.project_classes.replace("'", '"')) if project_obj.project_classes else None
    project_dict["created"] = str(project_obj.created).split(" ")[0].replace("-","/")
    return project_dict

async def get_project_by_project_id(project_id:int, db:Session):
    query_result =crud.get_project(project_id = project_id,db=db)
    dataset_ids = crud.get_dataset_ids_by_project_id(project_id=project_id,db=db)
    
    project_dict = {}
    project_dict["project_id"] = query_result.project_id
    project_dict["creator_id"] = query_result.creator_id
    project_dict["project_name"] = query_result.project_name
    project_dict["workspace_id"] = query_result.workspace_id
    project_dict["dataset_id"] = dataset_ids[0] if len(dataset_ids) != 0 else None
    project_dict["project_desc"] = query_result.desc
    project_dict["project_type"] = query_result.project_type
    project_dict["project_preproccess"] = query_result.project_preproccess
    project_dict["preproccess_tags"] =json.loads(query_result.preproccess_tags.replace("'", '"')) if query_result.preproccess_tags else None
    project_dict["project_classes"] = json.loads(query_result.project_classes.replace("'", '"')) if query_result.project_classes else None
    project_dict["created"] = str(query_result.created).split(" ")[0].replace("-","/")
    return project_dict

async def get_projects_by_workspace_id(workspace_id :int, db:Session):
   query_results = crud.get_projects_by_workspace_id(workspace_id = workspace_id,db=db)
   results = get_project_list(query_results,db)
   return results


async def image_labeling(request:dict, db:Session):
    dataset_id = request.get("dataset_id")
    file_name = request.get("file_name")
    mode = request.get("mode")

    parsed_data = {
        "dataset_id": dataset_id,
        "file_name": file_name,
        "mode": mode
    }
    URL = f'{Config.SERVING_URL}/serving/api/inference/sam'
    if mode == "oneclick":
        print("oneclick mode request sending")
        parsed_data["coords"] = request.get("coords")
        response = requests.post(URL, json={"dataset_id": dataset_id,"image_path": file_name,"coords": parsed_data["coords"]})

    elif mode == "bbox":
        parsed_data["bbox"] = request.get("bbox")
        response = requests.post(URL, json={"dataset_id": dataset_id,"image_path": file_name,"bbox": parsed_data["bbox"]})

    elif mode == "global":
        response = requests.post(URL, json={"dataset_id": dataset_id,"image_path": file_name,"global": True})

    return response

