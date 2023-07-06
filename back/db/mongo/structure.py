from dataclasses import dataclass
from typing import Optional, List

@dataclass
class Image:
    id: int
    width: int
    height: int
    file_name: str
    license: Optional[int]
    flickr_url: Optional[str]
    coco_url: Optional[str]
    date_captured: Optional[str]

@dataclass
class Category:
    id: int
    name: str
    supercategory: str

@dataclass
class License:
    id: int
    name: str
    url: str

@dataclass
class Annotation:
    id: int
    image_id: int
    category_id: int
    segmentation: List[List[float]]
    area: float
    bbox: List[float]
    iscrowd: int

@dataclass
class Type:
    id: int
    name: str