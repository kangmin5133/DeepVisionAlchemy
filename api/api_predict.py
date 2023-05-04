import logging
from fastapi import APIRouter, File, UploadFile, Form
from fastapi.responses import JSONResponse

from service import service_predict
import numpy as np
from PIL import Image
import json

router = APIRouter()

@router.post("/predict/point")
async def predict_point(image: UploadFile = File(...),
                         x: int = Form(...),
                         y: int = Form(...),
                         alt_key: bool = Form(False),
                         ctrl_key: bool = Form(False)):
    
    # logging.info(f"Received request for predict_point: x={x}, y={y},\
    #               shift_key={shift_key}, ctrl_key={ctrl_key}")

    print(f"Received request for predict_point: x={x}, y={y}, alt_key={alt_key}, ctrl_key={ctrl_key}")
        
    image_pil = Image.open(image.file)
    image_np = np.array(image_pil)
    mask_data = service_predict.segment_anything(image = image_np,
                                 x=x,
                                 y=y,
                                 alt_key=alt_key,
                                 ctrl_key=ctrl_key)
    
    response = {"mask": mask_data}

    return JSONResponse(content=response)

@router.post("/predict/bbox")
async def predict_bbox(image: UploadFile = File(...),
                        x1: int = Form(...),
                        y1: int = Form(...),
                        x2: int = Form(...),
                        y2: int = Form(...)):
    
    image_pil = Image.open(image.file)
    image_np = np.array(image_pil)
    input_box = np.array([x1,y1,x2,y2])

    # logging.info(f"Received request for predict_bbox: {input_box}")

    print(f"Received request for predict_bbox: {input_box}")

    mask_data = service_predict.segment_anything(image = image_np,
                                 bbox = input_box)
    response = {"mask": mask_data}
    
    return JSONResponse(content=response)

@router.post("/predict/remove")
async def remove_mask_area(image: UploadFile = File(...),
                           mask: str = Form(...)):
    
    image_pil = Image.open(image.file)
    image_np = np.array(image_pil)

    mask_list = json.loads(mask)
    mask_array = np.array(mask_list)

    nonzero_indices = np.argwhere(mask_array != 0)

    min_y, min_x = np.min(nonzero_indices, axis=0)
    max_y, max_x = np.max(nonzero_indices, axis=0)

    width = max_x - min_x + 1
    height = max_y - min_y + 1

    area = width * height 

    print(f"Received request for remove mask area: {area}")

    response = service_predict.remove_anything(image=image_np,
                    mask=mask_array)

    return JSONResponse(content=response)

@router.post("/predict/replace")
async def replace_mask_area(image: UploadFile = File(...),
                           mask: str = Form(...),
                           prompt: str = Form(...)):
    
    image_pil = Image.open(image.file)
    image_np = np.array(image_pil)

    mask_list = json.loads(mask)
    mask_array = np.array(mask_list)

    nonzero_indices = np.argwhere(mask_array != 0)

    min_y, min_x = np.min(nonzero_indices, axis=0)
    max_y, max_x = np.max(nonzero_indices, axis=0)

    width = max_x - min_x + 1
    height = max_y - min_y + 1

    area = width * height 

    print(f"Received request for replace mask area: {area}, prompt : {prompt}")

    response = service_predict.fill_anything(image=image_np,
                    mask=mask_array,prompt=prompt)

    return JSONResponse(content=response)

@router.post("/predict/relocate")
async def relocate_mask_area(image: UploadFile = File(...),
                           mask: str = Form(...),
                           prompt: str = Form(...)):
    
    image_pil = Image.open(image.file)
    image_np = np.array(image_pil)

    mask_list = json.loads(mask)
    mask_array = np.array(mask_list)

    nonzero_indices = np.argwhere(mask_array != 0)

    min_y, min_x = np.min(nonzero_indices, axis=0)
    max_y, max_x = np.max(nonzero_indices, axis=0)

    width = max_x - min_x + 1
    height = max_y - min_y + 1

    area = width * height 

    print(f"Received request for relocate mask area: {area}, prompt : {prompt}")

    response = service_predict.replace_anything(image=image_np,
                    mask=mask_array,prompt=prompt)

    return JSONResponse(content=response)
