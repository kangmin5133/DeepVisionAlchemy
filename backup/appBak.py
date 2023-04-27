from fastapi import FastAPI, File, UploadFile,Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from segment_anything import sam_model_registry, SamPredictor
import numpy as np
import cv2
from PIL import Image
import uvicorn
import base64
from pycocotools import mask
import logging

app = FastAPI()

origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

sam_checkpoint = "models/sam_vit_h_4b8939.pth"
model_type = "vit_h"
device = "cuda"

sam = sam_model_registry[model_type](checkpoint=sam_checkpoint)
sam.to(device=device)
predictor = SamPredictor(sam)

def apply_mask_to_image(image: np.ndarray, mask_data: np.ndarray) -> np.ndarray:

    h, w = mask_data.shape[-2:]
    color = np.array([30/255, 144/255, 255/255, 0.6])
    h, w = mask_data.shape[-2:]
    mask_image = mask_data.reshape(h, w, 1) * color.reshape(1, 1, -1)
    mask_data = (mask_image * 255).astype(np.uint8)
    mask_data = cv2.cvtColor(mask_data,cv2.COLOR_BGRA2RGBA)

    image_rgba = cv2.cvtColor(image, cv2.COLOR_BGR2RGBA)
    masked_image = cv2.addWeighted(image_rgba, 1, mask_data, 1, 0)
    result_image = cv2.cvtColor(masked_image, cv2.COLOR_RGBA2RGB)

    return result_image, mask_data

def binary_mask_converter(mask_data: np.ndarray) -> np.ndarray:
    h, w = mask_data.shape[-2:]
    mask_image = mask_data.reshape(h, w, 1)
    mask_data = mask_image.astype(np.uint8)
    return mask_data

# ctrl = + / shift = bbox / left click = include / right click = exclude
@app.post("/predict/point")
async def predict_point(image: UploadFile = File(...), 
                  x: int = Form(...), 
                  y: int = Form(...),
                  shift_key: bool = Form(False), 
                  ctrl_key: bool = Form(False)):
    
    image_pil = Image.open(image.file)
    image_np = np.array(image_pil)
    print(f"x : {x} , y : {y}, shift_key : {shift_key}, ctrl_key : {ctrl_key}")
    predictor.set_image(image_np)
    masks, scores, logits = predictor.predict(
        point_coords=np.array([[x, y]]),
        point_labels=np.array([1]),
        multimask_output=True,
    )

    best_index = [i for i,score in enumerate(scores) if np.amax(scores) == score]

    # output_image, masked = apply_mask_to_image(image_np, masks[best_index])
    # for binary mask
    binary_mask = binary_mask_converter(masks[best_index])

    # for image
    # retval, buffer_img = cv2.imencode(".jpg", output_image)
    # base64_image = base64.b64encode(buffer_img).decode("utf-8")

    binary_mask = np.squeeze(binary_mask)
    binary_mask = (binary_mask > 0).astype(np.uint8)
    # print("\nfinal binary_mask : ",binary_mask)
    # rle = mask.encode(np.asfortranarray(binary_mask))

    # # RLE를 JSON 직렬화 가능한 형식으로 변환
    # rle_json = {"size": rle["size"], "counts": rle["counts"].decode("utf-8")}
    h ,w, c= [i for i in image_np.shape]
    mask_json = {"size": [h,w], "maskData": binary_mask.tolist()}

    return JSONResponse(content= {"mask":mask_json})

@app.post("/predict/bbox")
async def predict_point(image: UploadFile = File(...), 
                  x1: int = Form(...), 
                  y1: int = Form(...),
                  x2: int = Form(...), 
                  y2: int = Form(...)):
    
    image_pil = Image.open(image.file)
    image_np = np.array(image_pil)
    input_box = np.array([x1,y1,x2,y2])
    print(f"bbox : {input_box}")
    predictor.set_image(image_np)
    masks, _, _ = predictor.predict(
            point_coords=None,
            point_labels=None,
            box=input_box[None, :],
            multimask_output=False,
        )
    # output_image, masked = apply_mask_to_image(image_np, masks[0])

    # for binary mask
    binary_mask = binary_mask_converter(masks[0])

    #for image
    # retval, buffer_img = cv2.imencode(".jpg", output_image)
    # base64_image = base64.b64encode(buffer_img).decode("utf-8")

    # 이진 마스크
    binary_mask = np.squeeze(binary_mask)
    binary_mask = (binary_mask > 0).astype(np.uint8)

    # 이진 마스크를 RLE로 변환
    # rle = mask.encode(np.asfortranarray(binary_mask))

    # # RLE를 JSON 직렬화 가능한 형식으로 변환
    # rle_json = {"size": rle["size"], "counts": rle["counts"].decode("utf-8")}

    h ,w, c= [i for i in image_np.shape]
    mask_json = {"size": [h,w],"bbox":input_box.tolist(),"maskData": binary_mask.tolist()}
    return JSONResponse(content= {"mask":mask_json})

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8002)