import cv2
import numpy as np

def mask_to_coco_format(mask):
    coords = []
    flat_mask = mask[0]  # 첫 번째 차원만 사용
    for y, row in enumerate(flat_mask):
        for x, value in enumerate(row):
            if value:  # True인 경우에만 좌표를 추가
                coords.extend([x, y])
    return [coords]


def find_contour(mask):
    # 바이너리 마스크에서 외곽선 찾기
    contours, _ = cv2.findContours(mask.astype(np.uint8), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    # 가장 큰 외곽선만 선택하기
    largest_contour = max(contours, key=cv2.contourArea)
    
    # 외곽선 좌표를 (x, y) 형식의 리스트로 변환
    largest_contour = largest_contour.squeeze().tolist()
    
    return largest_contour