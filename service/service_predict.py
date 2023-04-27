import logging
import torch
from .SAMpredictor import predictor
from .InPaintpredictor import inpaint_img_with_lama
from .stable_diffusion import fill_img_with_sd,replace_img_with_sd
from utils import apply_mask_to_image, binary_mask_converter, dilate_mask, save_array_to_img, binary_to_255
import numpy as np
import cv2
import base64
device = "cuda" if torch.cuda.is_available() else "cpu"

coords,labels=[],[]

def segment_anything(image:np.ndarray,
                     x: int = None ,
                     y: int = None,
                     alt_key: bool = False,
                     ctrl_key: bool = False,
                     bbox:np.ndarray = None):
    
    predictor.set_image(image)

    if ctrl_key or alt_key:
        coords.append([x,y])
    else:
        coords.clear()

    if ctrl_key:
        labels.append(1)
    elif alt_key:
        labels.append(0)
    elif ctrl_key == False and alt_key == False:
        labels.clear()
    
    if ctrl_key or alt_key:
        print(f"coords : {coords}, labels : {labels}")

    if bbox is not None:
        masks, scores, _ = predictor.predict(
            point_coords=None,
            point_labels=None,
            box=bbox[None, :],
            multimask_output=False,
        )
    elif bbox == None and (ctrl_key or alt_key):
        masks, scores, logits = predictor.predict(
            point_coords=np.array(coords),
            point_labels=np.array(labels),
            multimask_output=True,
        )
    elif bbox == None and (ctrl_key==False and alt_key==False):
        masks, scores, logits = predictor.predict(
            point_coords=np.array([[x, y]]),
            point_labels=np.array([1]),
            multimask_output=True,
        )

    best_index = [i for i,score in enumerate(scores) if np.amax(scores) == score]
    if bbox is not None:
        binary_mask = binary_mask_converter(masks[0])
    else:
        binary_mask = binary_mask_converter(masks[best_index])

    binary_mask = np.squeeze(binary_mask)
    binary_mask = (binary_mask > 0).astype(np.uint8)
    
    h ,w, c= [i for i in image.shape]
    if bbox is not None:
        json_data = {"size": [h,w],"bbox":bbox.tolist(), "maskData": binary_mask.tolist()}
    else:
        json_data = {"size": [h,w],"maskData": binary_mask.tolist()}

    return json_data


def remove_anything(image:np.ndarray,
                     mask:np.ndarray):
    
    mask = mask.astype(np.uint8) * 255

    mask_dil = dilate_mask(mask)

    img_inpainted = inpaint_img_with_lama(image, mask_dil, device=device)

    # save image
    # img_inpainted_p = "test.jpg"
    # save_array_to_img(img_inpainted, img_inpainted_p)

    # convert color
    result = cv2.cvtColor(img_inpainted, cv2.COLOR_BGR2RGB)

    retval, buffer_img = cv2.imencode(".jpg", result)
    base64_image = base64.b64encode(buffer_img).decode("utf-8")
    h ,w, c= [i for i in image.shape]
    json_data = {"size": [h,w],"image":base64_image}

    return json_data

def fill_anything(image:np.ndarray,
                     mask:np.ndarray,
                     prompt:str):
    
    mask = mask.astype(np.uint8) * 255

    mask_dil = dilate_mask(mask)

    # torch.manual_seed(0)
    img_replaced = fill_img_with_sd(
            image, mask_dil, prompt, device=device)
    
    # convert color
    result = cv2.cvtColor(img_replaced, cv2.COLOR_BGR2RGB)

    # save image
    img_result_p = "result.jpg"

    save_array_to_img(result, img_result_p)

    retval, buffer_img = cv2.imencode(".jpg", result)
    base64_image = base64.b64encode(buffer_img).decode("utf-8")
    h ,w, c= [i for i in image.shape]
    json_data = {"size": [h,w],"image":base64_image}

    return json_data
    
def replace_anything(image:np.ndarray,
                     mask:np.ndarray,
                     prompt:str):
    
    mask = mask.astype(np.uint8) * 255

    mask_dil = dilate_mask(mask)

    # torch.manual_seed(0)
    img_replaced = replace_img_with_sd(
            image, mask_dil, prompt, device=device)
    
    # convert color
    result = cv2.cvtColor(img_replaced, cv2.COLOR_BGR2RGB)

    retval, buffer_img = cv2.imencode(".jpg", result)
    base64_image = base64.b64encode(buffer_img).decode("utf-8")
    h ,w, c= [i for i in image.shape]
    json_data = {"size": [h,w],"image":base64_image}

    return json_data





    