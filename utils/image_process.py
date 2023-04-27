import numpy as np
import cv2
from PIL import Image

def apply_mask_to_image(image: np.ndarray, mask_data: np.ndarray) -> np.ndarray:
    # Your code here.
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

def dilate_mask(mask, dilate_factor=15):
    mask = mask.astype(np.uint8)
    mask = cv2.dilate(
        mask,
        np.ones((dilate_factor, dilate_factor), np.uint8),
        iterations=1
    )
    return mask

def save_array_to_img(img_arr, img_p):
    Image.fromarray(img_arr.astype(np.uint8)).save(img_p)

def binary_to_255(binary_data):
    return np.frombuffer(binary_data, dtype=np.uint8) * 255.0