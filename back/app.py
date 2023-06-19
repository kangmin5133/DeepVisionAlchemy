from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from apis import auth_api, dataset_api, workspace_api
# from config.logger import setup_logger

app = FastAPI()

origins = [
   "http://210.113.122.196:8830",
   "http://210.113.122.196:8830/login",
   "http://210.113.122.196:8830/loginLoading"
# "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_api.router)
app.include_router(dataset_api.router)
app.include_router(workspace_api.router)

if __name__ == "__main__":
    # setup_logger()
    uvicorn.run(app, host="0.0.0.0", port=8831)