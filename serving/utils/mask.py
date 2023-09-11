def mask_to_coco_format(mask):
    coords = []
    flat_mask = mask[0]  # 첫 번째 차원만 사용
    for y, row in enumerate(flat_mask):
        for x, value in enumerate(row):
            if value:  # True인 경우에만 좌표를 추가
                coords.extend([x, y])
    return [coords]