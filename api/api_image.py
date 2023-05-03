from fastapi import APIRouter, File, UploadFile, Form, Body
from fastapi.responses import JSONResponse
import numpy as np
from PIL import Image
import json

from service import service_image


router = APIRouter()

@router.get("/image/sample")
def get_sample_images():
    response = service_image.get_sample_images()
    return JSONResponse(content=response)

@router.post("/image/generate")
def get_sample_images(text_prompt: str = Body(...),
                       manual_seed: int = Body(...)):
    
    response = service_image.get_generated_images(prompt=text_prompt,
                                                  seed=manual_seed)
    return JSONResponse(content=response)