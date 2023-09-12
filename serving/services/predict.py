from models.SamLoader import predictor
import torch
import numpy as np
import cv2
from config.config import Config
from utils.mask import mask_to_coco_format, find_contour

device = "cuda" if torch.cuda.is_available() else "cpu"
coords,labels=[],[]

async def segment_anything(request : dict):
    # Todo: 
    """
    1. load image 
    2. check global, coords, bbox
    3. predict
    4. return segmented coords
    """
    dataset_id = request.get("dataset_id")
    image_path = request.get("image_path")
    image = cv2.imread(f'{Config.LOCAL_STORAGE}/{dataset_id}/{image_path}')
    predictor.set_image(image)

    if request.get("coords"):
        coords = request.get("coords")
        masks, scores, logits = predictor.predict(
            point_coords=np.array([coords]),
            point_labels=np.array([1]),
            multimask_output=True
            )
        best_index = [i for i,score in enumerate(scores) if np.amax(scores) == score]
        mask_coords = mask_to_coco_format(masks[best_index])
        binary_mask = (masks[best_index] > 0).astype(np.uint8)
        largest_contour = find_contour(binary_mask[0])
        response = {"masks": mask_coords, "outline": largest_contour}
    
    elif request.get("bbox"):
        pass
    elif request.get("global"):
        pass

    return response

    
