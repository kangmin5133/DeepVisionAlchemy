from fastapi import FastAPI
from routes import inference, health
import uvicorn
import logging

app = FastAPI()
logging.basicConfig()

app.include_router(inference.router)
app.include_router(health.router)

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8888)