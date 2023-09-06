import React, {useEffect,useState, useRef} from "react";
import { useNavigate ,useLocation} from "react-router-dom";
import {
  Box,
  Center,
  HStack,
  Heading,
  Flex,
  Image,
  VStack,
  Button
} from "@chakra-ui/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import ToolBar from "../components/ToolBar/Toolbar"
import UtilityBar from "../components/ToolBar/Utilitybar"
import config from "../../conf/config";
import axios from "axios"; 
import IconBox from "../components/IconBox";

interface ProjectProps {
  onHideSidebar: () => void; 
  onShowSidebar: () => void;
}

interface ProjectData {
  project_id : number;
  project_name : string;
  project_desc : string | null;
  workspace_id : number; 
  dataset_id : number;
  org_id : number | null;
  creator_id : number; 
  preprocess_processes : string[] | null;
  classes : string[]
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
    preprocess_processes : [],
    classes : [],
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

  // handlers
  const handleToolClick = (tool: string) => {
    if (selectedTool === tool) {
      setSelectedTool(null);  // 같은 도구를 다시 클릭하면 선택 해제
    } else {
      setSelectedTool(tool);
    }
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.currentTarget;
    setCanvasSize({ width: img.width, height: img.height });
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
    if (selectedTool === 'bbox' && drawing) {
      setDrawing(false);
      setEndPoint({ x: e.clientX, y: e.clientY });
      // 여기에 박스 그리기를 완료하고 서버로 보낼 로직을 넣으면 됩니다.
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

  const handleImageClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const x = e.clientX;
    const y = e.clientY;
    const coords = [x, y];
    const dataset_id = projectData.dataset_id;
    const file_name = currentImage; // 또는 현재 이미지의 파일 이름
    const requestData = {
      dataset_id,
      file_name,
    };
    switch (selectedTool) {
      case "globalSegment":
        // globalSegment일 때의 동작
        axios.post("/api/segment/global", requestData)
          .then(response => {
            // 성공 시 처리
          })
          .catch(error => {
            // 실패 시 처리
          });
        break;
        
      case "oneClickSegment":
        // oneClickSegment일 때의 동작
        axios.post("/api/segment/one-click", { ...requestData, x, y })
          .then(response => {
            // 성공 시 처리
          })
          .catch(error => {
            // 실패 시 처리
          });
        break;
        
      case "bbox":
        // bbox일 때의 동작
        // 여기에는 bbox 그리기와 관련된 로직이 들어갈 것입니다.
        // 예를 들면, 첫 클릭에서는 시작점을 설정하고,
        // 두 번째 클릭에서는 끝점을 설정하여 bbox를 그립니다.
        break;
        
      default:
        // 그 외 도구일 때의 동작
        break;
    }
  };

  const handleTableRowClick = (index: number) => {
    setCurrentImageIndex(index);
    const selectedImage = imageFiles[index];
    fetchImages(projectData.dataset_id, selectedImage.id)
      .then((fetchedImage) => {
        setCurrentImage(fetchedImage.image);
      })
      .catch((error) => {
        console.error("Error fetching image:", error);
      });
  };

  const handlePrevNextClick = (direction: 'prev' | 'next') => {
    if (currentImageIndex !== null) {
      
      let newIndex = direction === 'prev' ? currentImageIndex - 1 : currentImageIndex + 1;
      if (newIndex >= 0 && newIndex < imageFiles.length) {
        setSelectedRowId(imageFiles[newIndex].id); // 선택된 행의 ID 업데이트
        handleTableRowClick(newIndex);
      }
    }
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
  }, [projectId,projectData,imageFiles,currentImageIndex]);

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
      
      <Flex direction="row" align="center" >

        <Flex align="center" justify="center" 
        height="calc(100vh - 60px)" 
        w="80vw"
        maxW="70vw"
        overflow="auto"
         >
        <Box position="relative">
        <HStack>
            <Box position="relative" marginLeft={8}>
                <Button variant="ghost" onClick={() => handlePrevNextClick('prev')}
                style={{transform : calculateButtonPrevPosition(scale)}}
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
            <Box position="relative" onWheel={handleScroll} style={{ transform: `scale(${scale})`}}>
                <Image 
                  borderRadius={5} 
                  src={currentImage}
                  onLoad={handleImageLoad} // 이미지 로드 시 handleImageLoad 호출
                  boxShadow={"0 0 8px #3182ce, 0 0 16px #3182ce, 0 0 24px #3182ce, 0 0 32px #3182ce"}
                  style={{ transform: `scale(${scale})`}}
                />
                <canvas 
                  ref={canvasRef}
                  width={canvasSize.width} 
                  height={canvasSize.height} 
                  style={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0,
                    cursor: selectedTool === 'bbox' ? 'crosshair' : 'default',
                    transform: `scale(${scale})`
                  }}
                  onClick={handleImageClick}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  />
            </Box>
            <Box position="relative" marginRight={8}>
                <Button variant="ghost" onClick={() => handlePrevNextClick('next')}
                style={{transform : calculateButtonNextPosition(scale)}}
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