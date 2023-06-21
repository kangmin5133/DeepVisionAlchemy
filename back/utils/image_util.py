import base64

def image_encode_base64(image_path):
    with open(image_path, "rb") as image_file:
    # Convert the image data to a base64 string
        encoded_string = base64.b64encode(image_file.read()).decode()
    return encoded_string
