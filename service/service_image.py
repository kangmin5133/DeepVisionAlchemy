import numpy as np

import cv2
import base64
from glob import glob
from config import config
from diffusers import DiffusionPipeline
from diffusers import DPMSolverMultistepScheduler
import torch

# Set the device ID
device_id = 1  # use the ID of the GPU you want to use
torch.cuda.set_device(device_id)

pipeline = DiffusionPipeline.from_pretrained("runwayml/stable-diffusion-v1-5")
pipeline.to("cuda")
pipeline.scheduler = DPMSolverMultistepScheduler.from_config(pipeline.scheduler.config)


def get_sample_images():
    json_data = {"images":[]}
    images = [cv2.imread(i) for i in glob(config.Config.IMAGE_ROOT_PATH+"/*.jpg")]
    for image in images:
        # image_cvt = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        retval , buffer_img = cv2.imencode(".jpg", image)
        if not retval:
            raise Exception("Could not encode image")
        base64_image = base64.b64encode(buffer_img).decode("utf-8")
        
        json_data["images"].append(base64_image)
    return json_data

def get_inputs(prompt,batch_size=1):
    generator = [torch.Generator("cuda").manual_seed(i) for i in range(batch_size)]
    prompts = batch_size * [prompt]
    num_inference_steps = 20

    return {"prompt": prompts, "generator": generator, "num_inference_steps": num_inference_steps}

def get_generated_images(prompt:str,seed:int):

    prompt+=",hard rim lighting photography--beta --ar 2:3  --beta --upbeta"

    json_data = {"images":[]}
    pipeline.enable_attention_slicing()
    images = pipeline(**get_inputs(prompt,batch_size=seed)).images

    for image in images:
        gn_img_np = np.array(image)
        image_cvt = cv2.cvtColor(gn_img_np, cv2.COLOR_BGR2RGB)
        retval , buffer_img = cv2.imencode(".jpg", image_cvt)
        base64_image = base64.b64encode(buffer_img).decode("utf-8")
        json_data["images"].append(base64_image)

    return json_data
