from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from api import api_predict, api_image
# from config.logger import setup_logger

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

app.include_router(api_predict.router)
app.include_router(api_image.router)

if __name__ == "__main__":
    # setup_logger()
    uvicorn.run(app, host="0.0.0.0", port=8002)