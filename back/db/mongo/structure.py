from dataclasses import dataclass
from typing import Optional, List

@dataclass
class Image:
    id: int
    dataset_id : int
    width: int
    height: int
    file_name: str
    license: Optional[int]
    created: Optional[str]

@dataclass
class Category:
    id: int
    dataset_id : int
    project_id : int
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
    project_id : int
    dataset_id : int
    creator_id : int
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