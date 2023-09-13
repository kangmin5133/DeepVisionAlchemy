from models.SamLoader import predictor, mask_generator
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
        # oneclick, bbox
        return data coords = [x1,y1,x2,y2,........]
        # global
        return data coords = [[x1,y1,x2,y2,........],]
    """
    dataset_id = request.get("dataset_id")
    image_path = request.get("image_path")
    image = cv2.imread(f'{Config.LOCAL_STORAGE}/{dataset_id}/{image_path}')

    if request.get("coords"):
        predictor.set_image(image)
        coords = request.get("coords")
        masks, scores, logits = predictor.predict(
            point_coords=np.array([coords]),
            point_labels=np.array([1]),
            multimask_output=True
            )
        best_index = [i for i,score in enumerate(scores) if np.amax(scores) == score]
        # mask_coords = mask_to_coco_format(masks[best_index])
        binary_mask = (masks[best_index] > 0).astype(np.uint8)
        largest_contour = find_contour(binary_mask[0])

        flattened_contour_data = [coord for pair in largest_contour for coord in pair]
        response = {"masks": flattened_contour_data}

    
    elif request.get("bbox"):
        predictor.set_image(image)
        bbox = np.array(request.get("bbox"))
        masks, scores, _ = predictor.predict(
            point_coords=None,
            point_labels=None,
            box=bbox[None, :],
            multimask_output=False,
        )
        best_index = [i for i,score in enumerate(scores) if np.amax(scores) == score]
        # mask_coords = mask_to_coco_format(masks[best_index])
        binary_mask = (masks[best_index] > 0).astype(np.uint8)
        largest_contour = find_contour(binary_mask[0])

        flattened_contour_data = [coord for pair in largest_contour for coord in pair]
        response = {"masks": flattened_contour_data}

    elif request.get("global_segment"):
        masks = mask_generator.generate(image)
        mask_list=[]
        for mask in masks:
            contour = find_contour(mask["segmentation"])
            flattened_contour = [coord for pair in contour for coord in pair]
            mask_list.append(flattened_contour)
        response = {"masks": mask_list}

    return response

    
