from mobile_sam import sam_model_registry, SamAutomaticMaskGenerator, SamPredictor
import torch

model_type = "vit_t"
sam_checkpoint = "models/MobileSAM/weights/mobile_sam.pt"
device = "cuda" if torch.cuda.is_available() else "cpu"

mobile_sam = sam_model_registry[model_type](checkpoint=sam_checkpoint)
mobile_sam.to(device=device)
mobile_sam.eval()

# mask_generator = SamAutomaticMaskGenerator(mobile_sam)
mask_generator = SamAutomaticMaskGenerator(
    model=mobile_sam,
    points_per_side=32,
    pred_iou_thresh=0.86,
    stability_score_thresh=0.92,
    crop_n_layers=1,
    crop_n_points_downscale_factor=2,
    min_mask_region_area=100,  # Requires open-cv to run post-processing
)
predictor = SamPredictor(mobile_sam)
print("model load : SAM load successfuly")