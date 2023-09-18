import React, {useEffect,useState, useRef} from "react";
import { useLocation} from "react-router-dom";
import {
  Box,
  HStack,
  Flex,
  Image,
  Button
} from "@chakra-ui/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import ToolBar from "../components/ToolBar/Toolbar"
import UtilityBar from "../components/ToolBar/Utilitybar"
import config from "../../conf/config";
import axios from "axios"; 
import IconBox from "../components/IconBox";

//libraries
import styled, { keyframes } from 'styled-components';

interface ProjectProps {
  onHideSidebar: () => void; 
  onShowSidebar: () => void;
}

type ClassTag = {
  name: string;
  color: string;
};


interface ProjectData {
  project_id : number;
  project_name : string;
  project_desc : string | null;
  workspace_id : number; 
  dataset_id : number;
  org_id : number | null;
  creator_id : number; 
  preproccess_tags : string[] | null;
  project_classes : ClassTag[]
  created : string;
}

interface ImageFile {
  id : number;
  dataset_id : number;
  width : number;
  height : number;
  file_name : string;
  license : number;
  created : string;
}
// for manage mask
interface Mask {
  project_id: number;
  dataset_id: number;
  image_id: number;
  annotation_id : number;
  segmentation: number[]; // 마스크의 좌표
  className: string; 
  color: string;
};

interface currentMask {
  project_id: number;
  dataset_id: number;
  image_id: number;
  annotation_id : number;
  segmentation: number[]; // 마스크의 좌표
  className: string; 
  color: string;
};

interface ClassSelectorProps {
  position: { x: number; y: number } | null;
  selectedMaskData: Mask; // maskData의 구체적인 타입에 따라 수정 필요
  onSelect: (selectedClass: ClassTag) => void;
}

// for draw mask
type Segmentation = number[];

// style components
const Left = styled.div`
width: 100%;
position: absolute;
top: 0;
left: 0;
height: 1px;
layer-background-color:#ffffff;
border: 2px dashed #3182ce;
`;
const Top = styled.div`
height: 100%;
position: absolute;
top: 0;
left: 0;
width: 1px;
layer-background-color:#ffffff;
border: 2px dashed #3182ce;
`;
const Right = styled.div`
width: 100%;
position: absolute;
top: 0;
left: 0;
height: 1px;
layer-background-color:#ffffff;
border: 2px dashed #3182ce;
`;
const Down = styled.div`
height: 100%;
position: absolute;
top: 0;
left: 0;
width: 1px;
layer-background-color:#ffffff;
border: 2px dashed #3182ce;
`;
const GuideLine = styled.div`
top: 60px;
left: 5vw;
right:25vw;
pointer-events: none;
z-index: 0;
`;
const rotateAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;
const LoadingAnimation = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.5); // 반투명 배경
  display: flex;
  justify-content: center;
  align-items: center;
  
  &::before {
    content: '';
    width: 50px;
    height: 50px;
    border: 5px solid #000;
    border-top-color: transparent;
    border-radius: 50%;
    animation: ${rotateAnimation} 1s linear infinite;
  }
`;

const ClassTagButton = styled.button`
  border-radius: 18px;
  margin: 5px;
  cursor: pointer;
  padding: 5px 10px;
`;

const ClassBox = styled.button`
  background-color: rgba(50, 50, 50, 1);
  border-radius: 18px;
  border: 0.15rem solid white;
  margin: 5px;
  cursor: pointer;
  padding: 5px 10px;
  color: white;
  transition: background-color 0.3s;

  &:hover {
    background-color: rgba(70, 70, 70, 1);
  }
`;

const Project: React.FC<ProjectProps> = ({onHideSidebar,onShowSidebar}) => {

  // states
  const location = useLocation();
  const projectId = location.state?.projectId;
  const [projectData,setProjectData] = useState<ProjectData>({
    project_id : 0,
    project_name : '',
    project_desc : '',
    workspace_id : 0,
    dataset_id : 0,
    org_id : 0,
    creator_id : 0, 
    project_classes : [],
    preproccess_tags :[],
    created : ''
  })
  const [imageFiles,setImageFiles] = useState<ImageFile[]>([])
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  // canvas states
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [currentImage, setCurrentImage] = useState<string>("");
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  const [selectedRowId, setSelectedRowId] = useState<number>(0); // 선택된 행의 ID를 저장

  // bbox drawing states
  const [startPoint, setStartPoint] = useState<{ x: number, y: number } | null>(null);
  const [endPoint, setEndPoint] = useState<{ x: number, y: number } | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

  // scroll (scale up, down)
  const [scale, setScale] = useState<number>(1);
  const flexContainerRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLImageElement>(null);
  const [isImageOverflow,setIsImageOverflow] = useState(false);

  const [originalCanvasSize, setOriginalCanvasSize] = useState({ width: 0, height: 0 });

  // mask object manage
  const [masksData, setMasksData] = useState<Mask[]>([]);
  const [currentMasksData, setCurrentMasksData] = useState<currentMask[]>([]);
  const [selectedMaskIndex, setSelectedMaskIndex] = useState<number | null>(null);

  // loading animation
  const [isLoading, setIsLoading] = useState(false);

  // class
  const [position, setPosition] = useState<{ x: number, y: number } | null>(null);
  const selectedMaskData = masksData.find(mask => mask.annotation_id === selectedMaskIndex);

  // funcs
  const fetchProjectData = async (projectId: number) => {
    const response = await axios.get(`${config.serverUrl}/rest/api/project/get/by/projectid`, {
        params: {
          project_id: projectId,
        }
    });
    return response.data;
  }

  const fetchDatasetFileList = async (datasetId: number) => {
    const response = await axios.get(`${config.serverUrl}/rest/api/dataset/get/filenames`, {
        params: {
          dataset_id: datasetId,
        }
    });
    return response.data;
  }

  const fetchImages = async (datasetId: number,imageId:number) => {
    const response = await axios.get(`${config.serverUrl}/rest/api/dataset/get/image`, {
        params: {
            dataset_id: datasetId,
            image_id : imageId
        }
    });
    // 응답에서 base64 이미지를 가져와 Data URL로 변환
    const base64Image = response.data.image;
    const imageUrl = `data:image/jpeg;base64,${base64Image}`;
    return {
      ...response.data,
      image: imageUrl // 변환된 이미지 URL 반환
    };
  }

  const calculateButtonPrevPosition = (scale: number) => {
    // scale 값이 1보다 크면 왼쪽으로, 1보다 작으면 오른쪽으로 이동
    const ratio = 500;
    const offset = scale > 1 ? (scale - 1) * -ratio : (1 - scale) * ratio;
    
    return `translateX(${offset}px)`;
  };
  
  const calculateButtonNextPosition = (scale: number) => {
    // scale 값이 1보다 크면 오른쪽으로, 1보다 작으면 왼쪽으로 이동
    const ratio = 500;
    const offset = scale > 1 ? (scale - 1) * ratio : (1 - scale) * -ratio;
    
    return `translateX(${offset}px)`;
  };  

  const drawSegmentation = (ctx: CanvasRenderingContext2D, mask: Segmentation, isSelected?: boolean, color?: string) : void => {

    const parseRGB = (color: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
      return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
      } : null;
    };
    // console.log("drawSegmentation start")
    const blue600 = { r: 49, g: 130, b: 206 }; // blue.600
  
    // 윤곽선과 그림자 설정
    ctx.strokeStyle = `rgba(${blue600.r}, ${blue600.g}, ${blue600.b}, 0.8)`;
    ctx.lineWidth = isSelected ? 6 : 2; // 선택된 경우 굵게
    ctx.shadowColor = `rgba(${blue600.r}, ${blue600.g}, ${blue600.b}, 1)`;
    ctx.shadowBlur = 8;
  
    // 채워진 영역의 색상 설정
    if (color) {
      const rgb = parseRGB(color);
      if (rgb) {
          ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5)`;  // 원하는 투명도(0.5)로 설정
          ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.8)`;
          ctx.lineWidth = isSelected ? 6 : 2; // 선택된 경우 굵게
          ctx.shadowColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`;
          ctx.shadowBlur = 8;
      }
    }
    else{
      ctx.fillStyle = `rgba(${blue600.r}, ${blue600.g}, ${blue600.b}, 0.5)`; // 반투명한 파란색
      ctx.strokeStyle = `rgba(${blue600.r}, ${blue600.g}, ${blue600.b}, 0.8)`;
      ctx.lineWidth = isSelected ? 6 : 2; // 선택된 경우 굵게
      ctx.shadowColor = `rgba(${blue600.r}, ${blue600.g}, ${blue600.b}, 1)`;
      ctx.shadowBlur = 8;
    }
    
  
    // 연속된 좌표 데이터에서 좌표쌍을 가져와서 선을 그립니다.
    ctx.beginPath();
    // ctx.moveTo(mask.segmentation[0], mask.segmentation[1]);
    // for (let i = 2; i < mask.segmentation.length; i += 2) {
    //   ctx.lineTo(mask.segmentation[i], mask.segmentation[i + 1]);
    // }

    ctx.moveTo(mask[0], mask[1]);
    for (let i = 2; i < mask.length; i += 2) {
      ctx.lineTo(mask[i], mask[i + 1]);
    }
  
    // 윤곽선을 닫고 그림
    ctx.closePath();
    ctx.fill();  // 채워진 영역을 그립니다.
    ctx.stroke();
    // console.log("drawSegmentation done")
  };

  const drawMultipleSegmentations = (ctx: CanvasRenderingContext2D, masks: Segmentation[]) : void => {
    masks.forEach(segmentation => {
        drawSegmentation(ctx, segmentation);
    });
  };
  
  const pointInPolygon = (point: [number, number], polygon: Segmentation): boolean => {
    // console.log("pointInPolygon start")
    let isInside = false;
    // const coords = polygon.segmentation;
    const coords = polygon;
    for (let i = 0, j = coords.length - 2; i < coords.length; j = i, i += 2) {
      const xi = coords[i], yi = coords[i + 1];
      const xj = coords[j], yj = coords[j + 1];
  
      const intersect = ((yi > point[1]) !== (yj > point[1]))
        && (point[0] < (xj - xi) * (point[1] - yi) / (yj - yi) + xi);
      if (intersect) isInside = !isInside;
    }
  
    return isInside;
  };


  // handlers
  const handleToolClick = (tool: string) => {
    if (selectedTool === tool) {
      setSelectedTool(null);  // 같은 도구를 다시 클릭하면 선택 해제
    } else {
      setSelectedTool(tool);
    }

    if (tool === "globalSegment"){
      const dataset_id = projectData.dataset_id;
      const file_name = imageFiles[currentImageIndex].file_name; // 또는 현재 이미지의 파일 이름
      const requestData = {
        dataset_id,
        file_name,
      };
      axios.post(`${config.serverUrl}/rest/api/project/labeling/global`, { ...requestData})
          .then(response => {
            const maskData = response.data
            console.log("response data : ",response.data)
            const canvas = canvasRef.current;
            if (canvas) {
              const ctx = canvas.getContext('2d');
              if (ctx) {
                drawMultipleSegmentations(ctx, maskData.masks);
              }
            }
          })
          .catch(error => {
            // 실패 시 처리
          });
    }
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.currentTarget;
    setCanvasSize({ width: img.width, height: img.height });
    setOriginalCanvasSize({ width: img.width, height: img.height });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (selectedTool === 'bbox') {
      const canvas = canvasRef.current;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setStartPoint({ x: x, y: y });
        setDrawing(true);
      }
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (selectedTool === 'bbox' && drawing) {
      const canvas = canvasRef.current;
      if (canvas && startPoint) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setEndPoint({ x: x, y: y });

        const ctx = canvas.getContext('2d');
        if (ctx) {
          // 이전에 그렸던 박스를 지우기 위해 캔버스를 클리어
          ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);

          // 새로운 박스를 그림
          ctx.beginPath();
          ctx.rect(startPoint.x, startPoint.y, x - startPoint.x, y - startPoint.y);
          // 네온 사인 효과를 위한 그림자 설정
          ctx.shadowColor = "lime";
          ctx.shadowBlur = 10;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
          
          ctx.strokeStyle = "rgba(0, 255, 0, 1)";
          ctx.lineWidth = 2;
          ctx.stroke();

          // 그림자 효과를 초기화
          ctx.shadowColor = "transparent";
          ctx.shadowBlur = 0;
        }
      }
    }
  };
  
  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const dataset_id = projectData.dataset_id;
      const file_name = imageFiles[currentImageIndex].file_name; // 또는 현재 이미지의 파일 이름
      const requestData = {
        dataset_id,
        file_name,
      };
  
      if (selectedTool === 'bbox' && drawing && startPoint) {
        setDrawing(false);
        setEndPoint({ x: x, y: y });
        
        const coordinates = {
          startX: startPoint.x,
          startY: startPoint.y,
          endX: x,
          endY: y
        };
        
        axios.post(`${config.serverUrl}/rest/api/project/labeling/bbox`, { ...requestData, ...coordinates})
          .then(response => {
            const maskData = response.data
            console.log("response data : ",response.data)
            const canvas = canvasRef.current;
            if (canvas) {
              const ctx = canvas.getContext('2d');
              if (ctx) {
                drawSegmentation(ctx, maskData.masks);
              }
            }
          })
          .catch(error => {
            // 실패 시 처리
          });
      }
    }
  };

  const handleScroll = (e: React.WheelEvent<HTMLDivElement>) => {
    // e.preventDefault();
    let MIN_SCALE = 0.5
    let MAX_SCALE = 3
    let newScale = scale;
    if (e.deltaY < 0) {
      // 스크롤 업: 확대
      newScale = scale * 1.1;
    } else {
      // 스크롤 다운: 축소
      newScale = scale / 1.1;
    }

    if (newScale >= MIN_SCALE && newScale <= MAX_SCALE) {
      e.preventDefault();
    }
    setScale(newScale);
  }; 

  const handleImageClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const coords = [x, y];
    const dataset_id = projectData.dataset_id;
    const file_name = imageFiles[currentImageIndex].file_name; // 또는 현재 이미지의 파일 이름
    const requestData = {
      dataset_id,
      file_name,
    };
    if (selectedTool === "oneClickSegment") {
      // console.log("oneClickSegment start")
        // oneClickSegment일 때의 동작
        // console.log("requestData : ",{ ...requestData, x, y })
        axios.post(`${config.serverUrl}/rest/api/project/labeling/oneclick`, { ...requestData, x, y })
          .then(response => {
            const maskData = response.data
            // console.log("response data : ",response.data)

            //testing...
            const newMask = {
              project_id: projectData.project_id,
              dataset_id: projectData.dataset_id,
              image_id: imageFiles[currentImageIndex].id, // 이 부분은 실제 이미지의 ID로 수정해야 할 수도 있습니다.
              annotation_id : masksData.length,
              segmentation: maskData.masks,
              className: "", // 기본적으로 빈 문자열로 초기화
              color: "" // 기본적으로 빈 문자열로 초기화
          };
  
            setMasksData(prevMasks => [...prevMasks, newMask]);
            // setMasksData(prevMasks => [...prevMasks, maskData.masks]);
            const canvas = canvasRef.current;
            if (canvas) {
              const ctx = canvas.getContext('2d');
              if (ctx) {
                drawSegmentation(ctx, maskData.masks);
              }
            }
          })
          .catch(error => {
            // 실패 시 처리
          });
    } else if(selectedTool === "defaultPointer"){
      // console.log("defaultPointer start")
      for (let i = 0; i < masksData.length; i++) {
        const maskPolygon = masksData[i];
        if ( maskPolygon.image_id === currentImageIndex && pointInPolygon([x, y], maskPolygon.segmentation)) {
          setSelectedMaskIndex(masksData[i].annotation_id);
          setPosition({x:x,y:y}) // for class selector components
          break;
        }
      }
    }
  };

  const handleTableRowClick = (index: number) => {
    // console.log("handleTableRowClick start")
    const selectedImage = imageFiles[index];
    fetchImages(projectData.dataset_id, selectedImage.id)
      .then((fetchedImage) => {
        setCurrentImageIndex(index);
        setCurrentImage(fetchedImage.image);
      })
      .catch((error) => {
        console.error("Error fetching image:", error);
      });
  };

  const handlePrevNextClick = (direction: 'prev' | 'next') => {
    // console.log("handlePrevNextClick start")
    if (currentImageIndex !== null) {
      let newIndex = direction === 'prev' ? currentImageIndex - 1 : currentImageIndex + 1;
      if (newIndex >= 0 && newIndex < imageFiles.length) {
        setSelectedRowId(imageFiles[newIndex].id); // 선택된 행의 ID 업데이트
        handleTableRowClick(newIndex);
      }
    }
  };

  const handleClassSelect = (selectedClass : ClassTag) => {
    // 선택된 클래스를 사용하여 선택된 마스크 데이터의 className을 업데이트
    if (!selectedMaskData) return; // 선택된 마스크 데이터가 없으면 반환

    // masksData에서 현재 선택된 마스크 데이터의 index 찾기
    const maskIndex = masksData.findIndex(mask => mask.annotation_id === selectedMaskData.annotation_id);
    
    // 찾지 못하면 반환
    if (maskIndex === -1) return;

    // 선택된 마스크 데이터의 className과 color 업데이트
    const updatedMask = {
        ...selectedMaskData,
        className: selectedClass.name,
        color: selectedClass.color
    };

    // masksData 배열 업데이트
    const updatedMasksData = [...masksData];
    updatedMasksData[maskIndex] = updatedMask;

    setMasksData(updatedMasksData);
    setPosition(null);
  }

  //components
  const MiniViewer = () => {

    const [miniViewerSize, setMiniViewerSize] = useState(() => {
      if (flexContainerRef.current) {
        const flexContainer = flexContainerRef.current.getBoundingClientRect();
        return {
          width: flexContainer.width * 0.2,
          height: flexContainer.height * 0.2
        };
      }
      return null;
    });
    const miniViewerBoxContainerRef = useRef<HTMLDivElement>(null);
    const miniViewerImageContainerRef = useRef<HTMLImageElement>(null);
    const [dragging, setDragging] = useState(false);
    const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
    const [viewportPos, setViewportPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [viewportWidth, setViewportWidth] = useState<number | null>(null);
    const [viewportHeight, setViewportHeight] = useState<number | null>(null);
    const [accumulatedDelta, setAccumulatedDelta] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
    const flexContainer = flexContainerRef.current;
    const imageContainer  = imageContainerRef.current;
    const canvasContainer = canvasRef.current;
    
    // hooks
    useEffect(() => {
      // const flexContainer = flexContainerRef.current;
      if (flexContainer && canvasContainer && imageContainer && miniViewerBoxContainerRef.current) {
        const flexWidth = flexContainer.getBoundingClientRect().width;
        const flexHeight = flexContainer.getBoundingClientRect().height;

        const miniViewerSize = miniViewerBoxContainerRef.current.getBoundingClientRect();
        const newViewportWidth = (miniViewerSize.width * flexWidth) / canvasContainer.getBoundingClientRect().width;
        const newViewportHeight = (miniViewerSize.height * flexHeight) / canvasContainer.getBoundingClientRect().height;

        setViewportWidth(newViewportWidth);
        setViewportHeight(newViewportHeight);

        const flexContainerRect = flexContainer.getBoundingClientRect();
        const canvasContainerRect = canvasContainer.getBoundingClientRect();

        const newViewportX = ((flexContainerRect.left - canvasContainerRect.left) / canvasContainerRect.width) * miniViewerSize.width ;
        const newViewportY = ((flexContainerRect.top - canvasContainerRect.top) / canvasContainerRect.height) * miniViewerSize.height;

        setViewportPos({ x: newViewportX, y: newViewportY });
      
      }
    }, [flexContainer, canvasContainer]);

    // handlers
    const handleDragStart = (e: React.MouseEvent) => {
      setDragStart({ x: e.clientX, y: e.clientY });
      setDragging(true);
    };

    const handleDrag = (e: React.MouseEvent) => {
      if (dragging && dragStart && viewportWidth && viewportHeight && miniViewerBoxContainerRef.current && imageContainerRef.current && flexContainerRef.current) {
        let deltaX = e.clientX - dragStart.x;
        let deltaY = e.clientY - dragStart.y;

        const maxX = miniViewerBoxContainerRef.current.getBoundingClientRect().width - viewportWidth;
        const maxY = miniViewerBoxContainerRef.current.getBoundingClientRect().height - viewportHeight;

        const scaleFactorX = imageContainerRef.current.getBoundingClientRect().width / miniViewerBoxContainerRef.current.getBoundingClientRect().width;
        const scaleFactorY = imageContainerRef.current.getBoundingClientRect().height / miniViewerBoxContainerRef.current.getBoundingClientRect().height;

        const scaledDeltaX = deltaX * scaleFactorX
        const scaledDeltaY = deltaY * scaleFactorY

        const newAccumulatedDeltaX = accumulatedDelta.x + scaledDeltaX;
        const newAccumulatedDeltaY = accumulatedDelta.y + scaledDeltaY;

        setAccumulatedDelta({ x: newAccumulatedDeltaX, y: newAccumulatedDeltaY });

        const newX = Math.min(Math.max(0, viewportPos.x + deltaX), maxX);
        const newY = Math.min(Math.max(0, viewportPos.y + deltaY), maxY);

        setViewportPos({ x: newX, y: newY });
    
        // 원래 이미지의 위치를 변경
        if (imageContainerRef.current && canvasRef.current) {
          const newTransform = `scale(${scale}) translate(${-newAccumulatedDeltaX}px, ${-newAccumulatedDeltaY}px)`;
          imageContainerRef.current.style.transform = newTransform;
          canvasRef.current.style.transform = newTransform;
        }
    
        setDragStart({ x: e.clientX, y: e.clientY });

      }
    };

    const handleDragEnd = () => {
      setDragging(false);
      setDragStart(null);
      setAccumulatedDelta({ x: 0, y: 0 });
    };

    return (
      <Box
      ref={miniViewerBoxContainerRef}
      position="absolute"
      right="25vw"
      bottom="0"
      zIndex="3"
      w={`${miniViewerSize ? miniViewerSize.width + 'px' : 'auto'}`}
      h={`${miniViewerSize ? miniViewerSize.height + 'px' : 'auto'}`}
      bg="rgba(50,50,50,0.5)"
    >
      <Image
        ref={miniViewerImageContainerRef}
        src={currentImage}
        width="100%"
        height="100%"
        objectFit="contain"
      />
      {viewportWidth && viewportHeight && viewportPos ? (
        <Box
          position="absolute"
          top={`${viewportPos.y}px`}
          left={`${viewportPos.x}px`}
          w={`${viewportWidth}px`}
          h={`${viewportHeight}px`}
          bg="rgba(144, 238, 144, 0.5)"
          onMouseDown={handleDragStart}
          onMouseMove={handleDrag}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
        ></Box>
      ): null}
    </Box>
    );
  };

  function ClassSelector({position, selectedMaskData, onSelect}:ClassSelectorProps) {
    console.log("ClassSelector ON")
    console.log("project_classes :",projectData.project_classes)
    if (!projectData.project_classes) return null;
    console.log("projectData.classes null")
    if (!position) return null;
    const handleClassClick = (selectedClass:ClassTag) => {
      onSelect(selectedClass);
    }
    
    return (
      <Box style={{ position: 'absolute', top: position.y, left: position.x }}>
        <ClassBox>
            {projectData.project_classes.map((tag, index) => ( // tag와 index 사용
            <ClassTagButton 
              key={index} 
              onClick={() => handleClassClick(tag)} 
              style={{backgroundColor: tag.color}} // 색상을 지정
            >
              {tag.name}
            </ClassTagButton>
          ))}
        </ClassBox> 
      </Box>
    );
  };

  // hooks
  useEffect(() => {
    onHideSidebar();
    return () => onShowSidebar();
  }, [onHideSidebar, onShowSidebar]);

  useEffect(() => {
    if (projectId) {
      fetchProjectData(projectId)
        .then((data) => {
          setProjectData(data);
        })
        .catch((error) => {
            console.error("Error fetching image data:", error);
        });
    }
  }, [projectId]);

  useEffect(() => {
    if (projectData.dataset_id) {
      fetchDatasetFileList(projectData.dataset_id)
        .then((data) => {
          setImageFiles(data);
          fetchImages(projectData.dataset_id, currentImageIndex)
          .then((fetchedImage) => {
            setCurrentImage(fetchedImage.image);
          })
        })
        .catch((error) => {
            console.error("Error fetching image files:", error);
        });
    }
  }, [projectData]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // 투명도 설정
        ctx.globalAlpha = 0.5;
      }
    }
  }, [canvasSize]);
  
  useEffect(() => {
    console.log("Init projectId : ",projectId)
    console.log("projectData : ",projectData)
    console.log("Image files : ",imageFiles)
    console.log("currentImageIndex : ",currentImageIndex)
    console.log("masksData : ",masksData)
  }, [projectId,projectData,imageFiles,currentImageIndex,masksData]);

  useEffect(() => {
    console.log("selected Tool : ",selectedTool)
  }, [selectedTool]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      setCtx(context);
    }
  }, [canvasRef]);

  useEffect(() => {
    const flexContainer = flexContainerRef.current;
    const imageContainer = imageContainerRef.current;
    if (flexContainer && imageContainer) {
      const imageSection = imageContainer.getBoundingClientRect()
  
      const isOverflow = flexContainer.offsetWidth < imageSection.width || 
                         flexContainer.offsetHeight < imageSection.height ;
  
      setIsImageOverflow(isOverflow);
    } else {
      console.log("flexContainer or imageContainer is null");
    }
  
  }, [scale]);

  useEffect(() => {
    const handleMouseMove = (e : MouseEvent) => {
      const left = document.getElementById("left");
      const top = document.getElementById("top");
      const right = document.getElementById("right");
      const down = document.getElementById("down");

      if (left && top && right && down && selectedTool === "oneClickSegment") {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        left.style.width = mouseX - 2 + "px";
        left.style.left = 0 + 'px';
        left.style.top = mouseY + 'px';
        top.style.height = mouseY - 2 + "px";
        top.style.left = mouseX + 'px';
        top.style.top = 0 + 'px';
        
        right.style.width = document.body.clientWidth - mouseX - 2 + "px";
        right.style.left = mouseX + 2 + 'px';
        right.style.top = mouseY + 'px';
        down.style.height = document.body.clientHeight - mouseY - 2 + "px";
        down.style.left = mouseX + 'px';
        down.style.top = mouseY + 2 + 'px';
      }
    };

    // flexContainerRef가 null이 아니라면 이벤트 리스너를 추가합니다.
    if (flexContainerRef && flexContainerRef.current) {
      flexContainerRef.current.addEventListener('mousemove', handleMouseMove);
    }

    // 컴포넌트가 언마운트될 때 이벤트 리스너를 제거합니다.
    return () => {
      if (flexContainerRef && flexContainerRef.current) {
        flexContainerRef.current.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [flexContainerRef, selectedTool]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
          for (let i = 0; i < masksData.length; i++) {
              if (masksData[i].image_id === currentImageIndex) {
                  const mask = masksData[i].segmentation;
                  const isSelected = masksData[i].annotation_id === selectedMaskIndex; // 현재 마스크가 선택된 마스크인지 확인
                  if (masksData[i].color !== ""){
                    drawSegmentation(ctx, mask, isSelected, masksData[i].color);
                  }
                  else{
                    drawSegmentation(ctx, mask, isSelected); // 선택 여부에 따라 스타일 적용하여 그리기
                  }
                  
              }
            } // 모든 마스크 다시 그리기
        }
    }
  }, [selectedMaskIndex, masksData, currentImageIndex]);

  useEffect(() => {
    let currentmask = [];
    for (let i = 0; i < masksData.length; i++) {
        if (masksData[i].image_id === currentImageIndex) {
          currentmask.push(masksData[i])
        } 
    }
    setCurrentMasksData(currentmask)

    setIsLoading(true);
    const timeoutId = setTimeout(() => {
      // 여기에 원하는 코드를 작성합니다.
      if (currentMasksData.length !== 0){
         // 로딩 애니메이션 활성화
        setSelectedMaskIndex(currentMasksData[0].annotation_id);
        setIsLoading(false);
      }else{
        setSelectedMaskIndex(null);
        setIsLoading(false);
      }
    }, 200); // 1000ms = 1초
    

    return () => {
      clearTimeout(timeoutId); // 타임아웃 취소
      
    };
    
  }, [currentImageIndex]);

  return (
    <Flex 
    bgColor="gray.500" 
    transition="all 0.5s ease-in-out" pt="60px" 
    overflow="hidden" 
    height="100vh" minH="100vh"
    backgroundPosition="center"
    backgroundSize="cover"
    style={{
      background: `
        repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(0, 0, 0, 0.5) 20px),
        repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(0, 0, 0, 0.5) 20px),
        gray`
    }}
    >
      <ToolBar selectedTool={selectedTool} onToolClick={handleToolClick}/>
      
      <Flex ref={flexContainerRef} direction="row" align="center" overflow="hidden" >

        <Flex 
        align="center" justify="center" 
        height="calc(100vh - 60px)" 
        w="80vw"
        maxW="70vw"
        overflow="hidden"
        >
        <Box position="relative">
        <HStack>
            <Box position="relative" marginLeft={8} zIndex={2}>
                <Button 
                variant="ghost" 
                onClick={() => handlePrevNextClick('prev')}
                // style={{transform : calculateButtonPrevPosition(scale)}}
                style={{
                  transform: isImageOverflow ? 'none' : calculateButtonPrevPosition(scale),
                  position: isImageOverflow ? 'fixed' : 'relative',
                  left: isImageOverflow ? '5vw' : 'unset'
                }}
                >
                  <IconBox> 
                    <FontAwesomeIcon 
                    size="2x"
                    style={{ fontWeight: 'bold' }}
                    icon={faChevronLeft} 
                    color="black"/>
                  </IconBox>
                </Button>
            </Box>
            <Box position="relative" onWheel={handleScroll} style={{ transform: `scale(${scale})`}}
            >
                <Image 
                  ref={imageContainerRef}
                  borderRadius={5} 
                  src={currentImage}
                  onLoad={handleImageLoad} // 이미지 로드 시 handleImageLoad 호출
                  boxShadow={"0 0 8px #3182ce, 0 0 16px #3182ce, 0 0 24px #3182ce, 0 0 32px #3182ce"}
                  style={{ transform: `scale(${scale})`         
                  }}
                />
                <canvas 
                  ref={canvasRef}
                  width={canvasSize.width} 
                  height={canvasSize.height} 
                  style={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0,
                    cursor: (selectedTool === 'bbox' || selectedTool === 'oneClickSegment') ? 'crosshair' : 'default',
                    transform: `scale(${scale})`
                  }}
                  onClick={handleImageClick}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  />
                  {isLoading && <LoadingAnimation />}
                  {
                    selectedMaskData && selectedMaskData.className === "" && position &&
                    <ClassSelector position={position} selectedMaskData={selectedMaskData} onSelect={handleClassSelect}/>
                  }
            </Box>
            <Box position="relative" marginRight={8} zIndex={2}>
                <Button 
                variant="ghost" 
                onClick={() => handlePrevNextClick('next')}
                style={{
                  transform : isImageOverflow ? 'none' : calculateButtonNextPosition(scale),
                  position: isImageOverflow ? 'fixed' : 'relative',
                  right: isImageOverflow ? '25vw' : 'unset'
                }}
                >
                <IconBox> 
                  <FontAwesomeIcon 
                  size="2x"
                  style={{ fontWeight: 'bold' }}
                  icon={faChevronRight} 
                  color="black"/>
                </IconBox>
                </Button>
            </Box>
            
        </HStack>
        </Box>
        {isImageOverflow && (
          <MiniViewer />
        )}
        {selectedTool === "oneClickSegment" && (
          <GuideLine>
            <Left id={"left"} />
            <Top id={"top"} />
            <Right id={"right"} />
            <Down id={"down"} />
          </GuideLine>
        )}
        </Flex>
      </Flex>
      <UtilityBar 
        imageFiles={imageFiles} 
        onTableRowClick={handleTableRowClick}
        selectedRowId={selectedRowId}
        setSelectedRowId={setSelectedRowId}
        />
    </Flex>
  );
}

export default Project;