from fastapi import APIRouter, File, UploadFile
from fastapi.responses import JSONResponse
from config.config import Config
from pydantic import BaseModel, Field
from typing import List, Optional
from services.predict import segment_anything

router = APIRouter(prefix="/serving/api/inference")

class SamRequest(BaseModel):
    dataset_id: int
    image_path: str
    global_segment: Optional[bool] = Field(None, alias="global")
    coords: Optional[List[int]]
    bbox: Optional[List[int]]

@router.post("/sam")
async def sam_predict(request : SamRequest = None):
    # 추론 로직
    """
    request :
        dataset_id[Required] : int
        image_path[Required]: str
        global[Optional] : boolean = False
        coords[Optional] : [[x1(int),y1(int)],[x1(int),y1(int)],...]
        bbox[Optional] : [x1,y1,x2,y2]
    return :
        mask : [[x1,y1,x2,y2,x3,y3,......]]
    """

    print("\nsam serving request : ", request.dict())

    response = await segment_anything(request.dict())
    return JSONResponse(content=response)