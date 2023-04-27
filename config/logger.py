import logging
import sys

def setup_logger():
    log_format = "%(asctime)s - %(levelname)s - %(message)s"
    logging.basicConfig(level=logging.INFO, format=log_format, handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler("/home/tbelldev/workspace/autoLabeling/SA/logs/app.log")
    ])
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)