from fastapi import APIRouter, File, UploadFile
from models.SamLoader import predictor
from config.config import Config

router = APIRouter(prefix="/serving/api/inference")

@router.post("/sam")
async def sam_predict(request: dict):
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
    # Todo: 
    """
    1. load image 
    2. check global, coords, bbox
    3. predict
    4. return segmented coords
    """

    pass