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

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    // 서버로 보낼 요청을 구성
    // 예를 들어, 선택된 툴과 클릭 좌표를 함께 보낼 수 있습니다.
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
        // 여기서 Canvas에 그림을 그릴 수 있습니다.
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
  
  return (
    <Box 
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
      <Flex direction="row" align="center" justify="space-between">

        <Flex left="5vw" align="center" justify="center" height="90vh" w="80vw">
        <Box position="relative">
        <HStack>
            <Box marginLeft={8}>
                <Button variant="ghost" onClick={() => handlePrevNextClick('prev')}>
                  <IconBox> 
                    <FontAwesomeIcon 
                    size="2x"
                    style={{ fontWeight: 'bold' }}
                    icon={faChevronLeft} 
                    color="black"/>
                  </IconBox>
                </Button>
            </Box>
            <Box position="relative">
                <Image 
                  borderRadius={5} 
                  src={currentImage}
                  onLoad={handleImageLoad} // 이미지 로드 시 handleImageLoad 호출
                />
                <canvas 
                  ref={canvasRef}
                  width={canvasSize.width} 
                  height={canvasSize.height} 
                  style={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0 }} /* ... 스타일 및 기타 설정 */>
                </canvas>
            </Box>
            <Box marginRight={8}>
                <Button variant="ghost" onClick={() => handlePrevNextClick('next')}>
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
      <UtilityBar 
        imageFiles={imageFiles} 
        onTableRowClick={handleTableRowClick}
        selectedRowId={selectedRowId}
        setSelectedRowId={setSelectedRowId}
        />
      {/* Image List Table component */}
      </Flex>
    </Box>
  );
}

export default Project;