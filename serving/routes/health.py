from fastapi import APIRouter, File, UploadFile

router = APIRouter(prefix="/health")

@router.get("/check")
async def health_check():
    # 추론 로직
    pass