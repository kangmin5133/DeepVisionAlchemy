import React,{useState,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone"; // 추가
import {
  Box,
  Image,
  Text,
  Flex,
  SimpleGrid,
  Circle,
  Spacer,
  useDisclosure, 
  Button, 
  Modal, 
  ModalOverlay, 
  ModalContent,
  ModalHeader, 
  ModalCloseButton, 
  ModalBody, 
  ModalFooter, 
  FormControl,
  FormLabel, 
  Input,
  VStack,
  HStack,
  useColorMode,
  Menu, MenuButton, MenuList, MenuItem, IconButton
} from "@chakra-ui/react";
import { AiFillFile } from 'react-icons/ai';
import { AddIcon, ViewIcon} from "@chakra-ui/icons";
import { FaTh } from 'react-icons/fa';

import config from "../../conf/config";

import Breadcrumbs from "../components/Breadcrumbs";
import bgImage from "../../assets/alchemistic.png";
import { FaPlus } from "react-icons/fa";

import { chunk } from 'lodash';
import Card from "../components/Card/Card";
import CardHeader from "../components/Card/CardHeader";
import CardBody from "../components/Card/CardBody";
import ObjectCard from '../components/Card/ObjectCard';



import S3logo from "../../assets/Amazon-S3-Logo.png";
import GCSlogo from "../../assets/Google_Storage-Logo.png";
import uploadlogo from "../../assets/Upload-Icon.png";

import axios from "axios"; 
import UserAuthState from "../states/userAuthState"
import { User } from '../actions/authActions';

import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; 

import Table from "../components/Table/Table";

// interface
interface DatasetProps {
  sideBarVisible : boolean;
}
interface Credentials {
  accessKeyId: string;
  secretAccessKey: string;
}
interface FileState {
  jsonFile: File | null;
  zipFile: File | null; 
}
interface BucketInfo {
  bucketName: string;
  prefix: string;
}
interface datasetInfo{
  name: string,
  desc : string,
}
interface DatasetData {
  dataset_id : number;
  org_id : number | null;
  creator_id : number; 
  dataset_name : string ;
  dataset_desc : string | null;
  dataset_type : number;
  dataset_count : number;
  dataset_prefix : string | null;
  created : string;
}

const Dataset: React.FC<DatasetProps> = ({sideBarVisible}) => {
  // states 
  const { isLoggedIn, user} = UserAuthState();
  const paddingLeft = sideBarVisible ? '300px' : '8';
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedBox, setSelectedBox] = useState<string | null>(null);
  const [credentials, setCredentials] = useState<Credentials>({
    accessKeyId: '',
    secretAccessKey: '',
  });
  const [bucketInfo, setBucketInfo] = useState<BucketInfo>({
    bucketName: '',
    prefix: '',
  });
  const [datasetInfo, setDatasetInfo] = useState<datasetInfo>({
    name: '',
    desc: '',
  });
  const [fileState, setFileState] = useState<FileState>({
    jsonFile: null,
    zipFile: null,
  });
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [detailViewActive, setDetailViewActive] = useState<boolean>(false);

  const [datasetData, setDatasetData] = useState<DatasetData[]>([]);
  const [selectedDatasetId, setSelectedDatasetId] = useState<number>(0);
  // const [selectedObjId, setSelectedObjId] = useState<number>(0);

  const selectedDataset : DatasetData | undefined = datasetData.find(dataset => dataset.dataset_id === selectedDatasetId);
  const [imageData, setImageData] = useState<any>(null);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const columns = [
    { header: 'Dataset Name', field: 'dataset_name' },
    { header: 'Type', field: 'dataset_type' },
    { header: 'Count', field: 'dataset_count' },
    { header: 'Created', field: 'created' }
    // 다른 열 정의
  ];

  const previewContainerStyle = {
    position: 'absolute' as 'absolute',
    bottom: 24,
    width: sideBarVisible ? `calc(96.5% - ${paddingLeft})` : `93.4vw`,    
    height: isPreviewOpen ? '60vh' : '5vh',
    transition: '0.5s ease-in-out',
    overflow: 'hidden',
  };
  
  const previewButtonStyle = {
    top: 0,
    height: 'auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
  };

  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = "linear-gradient(127.09deg, rgba(5, 20, 40, 0.94) 19.41%, rgba(10, 25, 45, 0.49) 76.65%)";
  const cardDarkColor = "rgba(40, 60, 70, 1)";
  const cardLightColor = "linear-gradient(127.09deg, rgba(140, 140, 140, 0.94) 19.41%, rgba(200, 200, 200, 0.49) 76.65%)";

  const [viewMode, setViewMode] = useState<string>('table');
  const [orderMode, setOrderMode] = useState<string>('latest');

  const [thumbnails, setThumbnails] = useState<{ [key: number]: string }>({});

  //funcs
  const fetchImageData = async (datasetId: number, startIndex: number, endIndex: number, maxResult: number) => {
    const response = await axios.get(`${config.serverUrl}/rest/api/dataset/get/images`, {
        params: {
            dataset_id: datasetId,
            startIndex: startIndex,
            endIndex: endIndex,
            maxResult: maxResult
        }
    });
    return response.data;
  }

  const fetchThumbnail = async (datasetId: number) => {
    const response = await axios.get(`${config.serverUrl}/rest/api/dataset/get/thumbnail`, {
        params: {
            dataset_id: datasetId
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

  //components
  const datasetDetailView = () => {

    const commonCardProps = {
      backgroundRepeat: 'no-repeat',
      bgSize: 'cover',
      bgPosition: '10%',
      // bgColor: "gray.700",
      p: '0px 16px 16px 16px',
      h: "100%",
      borderWidth: "2px",
      borderColor: "teal",
      borderStyle : "dashed",
      // mb: 4,
      _hover: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        transition: 'background-color 0.2s',
      },
    };

    const commonCardBodyProps = {
      direction: 'column' as const,
      color:'white',
      h:'100%',
      p: '0px 10px 20px 10px',
      w:'100%',
      justifyContent:"center",
      align:"center"
    };

    if (isPreviewOpen){
      if (!detailViewActive || selectedDatasetId === 0) {
        return (
          <Card {...commonCardProps}>
            <Box style={previewButtonStyle} onClick={togglePreview}>
              {isPreviewOpen ? '▼' : '▲'}
            </Box>
              <CardBody h='100%' w='100%'>
                <Flex {...commonCardBodyProps}>
                    No Selected Dataset
                </Flex>
              </CardBody>
          </Card>
        );
      }
      return (
        <Card {...commonCardProps}>
          <Box style={previewButtonStyle} onClick={togglePreview}>
            {isPreviewOpen ? '▼' : '▲'}
          </Box>
              <CardBody h='100%' w='100%'> 
                <Flex {...commonCardBodyProps}>
                    {selectedDataset && (
                      <Box>
                        <Box h='100%' w='100%'>
                          <Text fontSize="xl" align="center" justifyContent="center">
                            Dataset Preview
                          </Text>
                          <Carousel 
                            showThumbs={false} 
                            showStatus={false} 
                            onChange={handleSlideChange}
                            selectedItem={currentSlide}
                          >
                            {imageData && imageData.images.map((image: any, index: number) => (
                              <Box 
                              key={index}
                              h="400px" 
                              w="100%"
                              >
                                <Image 
                                src={`data:image/jpeg;base64,${image.image}`} 
                                objectFit="contain" 
                                maxWidth="100%" 
                                maxHeight="100%" 
                                borderRadius="16px"/>
                              </Box>
                            ))}
                          </Carousel>
                        </Box>
                        <Text fontSize="xl">Name: {selectedDataset.dataset_name}</Text>
                        <Text fontSize="xl">Description: {selectedDataset.dataset_desc || 'No description provided'}</Text>
                        {/* Add more fields as needed */}
                      </Box>
                    )}
                </Flex>
              </CardBody>
          </Card>
      )
    } else {
      return(
        <Card {...commonCardProps}>
          <Box style={previewButtonStyle} onClick={togglePreview}>
            {isPreviewOpen ? '▼' : '▲'}
          </Box>
          {/* <CardBody h='100%' w='100%'>
            <Flex {...commonCardBodyProps}/>
              
            
          </CardBody> */}
        </Card>
      )
    }
  }

  const bucketInputForm = () => {
    return (
      <>
        <FormControl>
          <FormLabel>BUCKET NAME</FormLabel>
          <Input
            placeholder="BUCKET NAME"
            value={bucketInfo.bucketName}
            onChange={(e) =>
              setBucketInfo({ ...bucketInfo, bucketName: e.target.value })
            }
          />
        </FormControl>
        <FormControl>
        <FormLabel>PREFIX</FormLabel>
        <Input
          placeholder="PREFIX"
          value={bucketInfo.prefix}
          onChange={(e) =>
            setBucketInfo({ ...bucketInfo, prefix: e.target.value })
          }
        />
      </FormControl>
    </>
    );
  }

  const LocalFileInputForm = () => {
    return (
      <>
        {/* <FormControl>
          <FormLabel>BUCKET NAME</FormLabel>
          <Input
            placeholder="BUCKET NAME"
            value={bucketInfo.bucketName}
            onChange={(e) =>
              setBucketInfo({ ...bucketInfo, bucketName: e.target.value })
            }
          />
        </FormControl>
        <FormControl>
        <FormLabel>PREFIX</FormLabel>
        <Input
          placeholder="PREFIX"
          value={bucketInfo.prefix}
          onChange={(e) =>
            setBucketInfo({ ...bucketInfo, prefix: e.target.value })
          }
        />
      </FormControl> */}
    </>
    );
  }

  // hooks
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      setFileState({ zipFile: acceptedFiles[0] , jsonFile: acceptedFiles[0] });
    },
    // accept: 'application/json',
    maxFiles: 1,
  });
  
  useEffect(() => {
      if (user) {
          const fetchData = async () => {
              const response = await axios.get(`${config.serverUrl}/rest/api/dataset/get`, {
                  params: {
                    user_id: user.user_id
                  }
              });
              console.log("response.data : ",response.data)
              // 데이터를 상태에 저장
              setDatasetData(response.data);
          }
        // fetchData 함수를 호출하여 데이터 불러오기 시작
          fetchData();
      }
  }, [user]);

  useEffect(() => {
    if (selectedDatasetId) {
        fetchImageData(selectedDatasetId, 0, 5, 5)
        .then((data) => {
            setImageData(data);
        })
        .catch((error) => {
            console.error("Error fetching image data:", error);
        });
    }
  }, [selectedDatasetId]);

  useEffect(() => {
    // 데이터셋 배열을 순회하면서 각각의 썸네일을 가져오는 로직
    datasetData.forEach(async (dataset) => {
      const thumbnailData = await fetchThumbnail(dataset.dataset_id);
      setThumbnails((prevThumbnails) => ({
        ...prevThumbnails,
        [dataset.dataset_id]: thumbnailData.image,
      }));
    });
  }, [datasetData]); // datasetData가 변경될 때만 실행

  useEffect(() => {
    console.log("selectedDatasetId : ",selectedDatasetId)
    console.log("detailViewActive : ",detailViewActive)
  }, [selectedDatasetId,detailViewActive]);
  
  
  // handlers
  const onFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedFileName(e.target.files[0].name);
    }
  };

  const handleRegisterClick = async () => {    
    let jsonData: {
      credentials?: { accessKeyId?: string; secretAccessKey?: string; jsonFile?: string };
      bucketInfo?: BucketInfo;
      datasetInfo: { name: string; desc: string };
      user: { email: string; name: string } | null;
      dataType: string;
    } = {
      bucketInfo,
      datasetInfo: { name: datasetInfo.name, desc: datasetInfo.desc },
      user: user ? { email: user.email, name: user.name } : null,
      dataType: selectedBox || '',
    };

    // S3
    if (selectedBox === "Amazon S3") {
      const encodedCredentials = {
        accessKeyId: btoa(credentials.accessKeyId),
        secretAccessKey: btoa(credentials.secretAccessKey),
      };
      jsonData = { ...jsonData, credentials: encodedCredentials };

      try {
        console.log("jsonData : ",jsonData)
        await axios.post(`${config.serverUrl}/rest/api/dataset/create`, jsonData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        console.error(error);
      }
    }

    // Google Cloud Storage
    else if (selectedBox === "Google Cloud Storage" && fileState.jsonFile instanceof File) {
      const fileContent = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target?.result as string);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(fileState.jsonFile as File);
      });

      const encodedCredentials = { jsonFile: fileContent };
      jsonData = { ...jsonData, credentials: encodedCredentials };

      try {
        console.log("jsonData : ",jsonData)
        await axios.post(`${config.serverUrl}/rest/api/dataset/create`, jsonData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        console.error(error);
      }

    }

    else if (selectedBox === 'Local upload' && fileState.zipFile instanceof File) {
      console.log("zip file proccessing start!")
      const LocalFileMetaData = {
        datasetInfo: { name: datasetInfo.name, desc: datasetInfo.desc },
        user: user ? { email: user.email, name: user.name } : null,
        dataType: selectedBox || '',
      };

      const formData = new FormData();

      formData.append('zipFile', fileState.zipFile);  // 실제 파일 객체를 FormData에 추가
      formData.append('jsonData',JSON.stringify(LocalFileMetaData));
    
      try {
        await axios.post(`${config.serverUrl}/rest/api/dataset/create/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } catch (error) {
        console.error("File upload failed:", error);
      }
    }
    onClose();
  };

  const handleLocalFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const extension = file.name.split('.').pop()?.toLowerCase();

      if (extension !== 'zip') {
        alert('Only .zip files are allowed.');
        return;
      }
      // 용량 확인 (500MB)
      if (file.size > 500 * 1024 * 1024) {
        alert('File size exceeds 500MB.');
        return;
      }
      setUploadedFileName(file.name);
    }
  };

  const handleDataSrcClick = (boxName: string) => {
    setSelectedBox(boxName);
  };
  const handleSlideChange = (currentIndex: number) => {
    setCurrentSlide(currentIndex);
  };
  const handleRowClick = (row: any) => {
    setSelectedDatasetId(row.dataset_id); // 또는 row.user_id, row.workspace_id 등
    setDetailViewActive(true);
    setIsPreviewOpen(true);
  };
  const togglePreview = () => {
    setIsPreviewOpen(!isPreviewOpen);
  };
  const handleCardClick = (id: number) => {
    // ID를 사용하여 필요한 작업 수행
    console.log("selected ID : ",id)
    setSelectedDatasetId(id); // 또는 row.user_id, row.workspace_id 등
    setDetailViewActive(true);
    setIsPreviewOpen(true);
  };

  return (
    <Box p={8} pl={paddingLeft} bg={colorMode === "dark" ? bgColor : "gray.100"} 
    transition="all 0.5s ease-in-out" pt="60px" overflow="hidden" height="100vh" minH="100vh"
    backgroundPosition="center"
    backgroundSize="cover"
    >
      <HStack spacing={2}>
        <Breadcrumbs />
        <Spacer />
        <Button rightIcon={<AddIcon />} colorScheme="teal" variant="outline" onClick={onOpen}>
          Add Dataset
        </Button>
      </HStack>
      <HStack spacing={2}>
      <Spacer />
        <Menu>
          <MenuButton>
          order by ▿
          </MenuButton>  
          <MenuList>
            <MenuItem onClick={() => setOrderMode('latest')}>latest</MenuItem>
            <MenuItem onClick={() => setOrderMode('oldest')}>oldest</MenuItem>
            <MenuItem onClick={() => setOrderMode('A-Z')}>A-Z</MenuItem>
          </MenuList>
        </Menu>
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Options"
            icon={<FaTh />}
            variant="outline"
          />
          <MenuList>
            <MenuItem onClick={() => setViewMode('table')}>Table View</MenuItem>
            <MenuItem onClick={() => setViewMode('grid')}>Grid View</MenuItem>
          </MenuList>
        </Menu>
      </HStack>
      <HStack>
        <VStack h='100%' w='100%'>
        {/* Input Modal */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent bg="rgba(40, 40, 40, 0.9)">
            <ModalHeader>Add a new dataset</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
            <SimpleGrid columns={3} spacing={10} mb={4}>
              <VStack>
              <Box
                w="100%"
                h="100px"
                bg="gray.200"
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
                onClick={() => handleDataSrcClick("Amazon S3")}
                cursor="pointer"
                border={selectedBox === 'Amazon S3' ? "2px solid blue" : "none"}
                borderRadius="18px"
              >
                <Image src={S3logo} objectFit="contain" maxWidth="90%" maxHeight="90%" />
              </Box>
              <Text>Amazon S3</Text>
              </VStack>
              <VStack>
              <Box
                w="100%"
                h="100px"
                bg="gray.200"
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
                onClick={() => handleDataSrcClick("Google Cloud Storage")}
                cursor="pointer"
                border={selectedBox === 'Google Cloud Storage' ? "2px solid blue" : "none"}
                borderRadius="18px"
              >
                <Image src={GCSlogo} objectFit="contain" maxWidth="90%" maxHeight="90%" />
              </Box>
              <Text>Google Cloud Storage</Text>
              </VStack>
              <VStack>
              <Box
                w="100%"
                h="100px"
                bg="gray.200"
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
                onClick={() =>  handleDataSrcClick("Local upload")}
                cursor="pointer"
                border={selectedBox === 'Local upload' ? "2px solid blue" : "none"}
                borderRadius="18px"
              >
                <Image src={uploadlogo} objectFit="contain" maxWidth="90%" maxHeight="90%"/>

              </Box>
              <Text>Local upload</Text>
              </VStack>
            </SimpleGrid>
              {/* 선택된 박스에 따라서 다른 입력 컴포넌트 보여주기 */}
              {selectedBox === 'Amazon S3' && (
                <Box p={4} style={{border: '1px solid gray'}} borderRadius="10px">
                  <VStack spacing={2} alignItems="flex-start">
                    <FormControl>
                      <FormLabel>ACCESS_KEY_ID</FormLabel>
                      <Input
                        placeholder="ACCESS_KEY_ID"
                        value={credentials.accessKeyId}
                        onChange={(e) =>
                          setCredentials({ ...credentials, accessKeyId: e.target.value })
                        }
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>ACCESS_KEY_SECRET</FormLabel>
                      <Input
                        placeholder="ACCESS_KEY_SECRET"
                        type="password"
                        value={credentials.secretAccessKey}
                        onChange={(e) =>
                          setCredentials({ ...credentials, secretAccessKey: e.target.value })
                        }
                      />
                    </FormControl>
                    {bucketInputForm()}
                  </VStack>
                </Box>
              )}

              {selectedBox === 'Google Cloud Storage' && (
                <Box p={4} style={{border: '1px solid gray'}} borderRadius="15px">
                  <VStack spacing={2} alignItems="flex-start">
                    <Box {...getRootProps()} style={{ cursor: 'pointer', padding: '20px', marginTop: '20px' }}
                    borderStyle="dashed"
                    borderWidth="1px"
                    borderRadius="10px"
                    borderColor="gray.400"
                    >
                      <input {...getInputProps({onChange: onFileUpload})} />
                      {uploadedFileName ? (
                        <Box display="flex" alignItems="center">
                        <AiFillFile size="40" />
                        <Text ml={2}>{uploadedFileName}</Text>
                        </Box>
                      ) : (
                        isDragActive ? (
                          <Text>Drop the files here ...</Text>
                        ) : (
                          <Text>Drag & drop a JSON file here, or click to select file</Text>
                        )
                      )}
                      
                    </Box>
                  {bucketInputForm()}
                  </VStack>
                </Box>
              )}

              {
                selectedBox === 'Local upload' && (
                  <Box p={4} style={{border: '1px solid gray'}} borderRadius="15px">
                    <VStack spacing={2} alignItems="flex-start">
                      <Box {...getRootProps()} style={{ cursor: 'pointer', padding: '20px', marginTop: '20px' }}
                        borderStyle="dashed"
                        borderWidth="1px"
                        borderRadius="10px"
                        borderColor="gray.400"
                      >
                        <input {...getInputProps({onChange: handleLocalFileUpload})} />
                        {uploadedFileName ? (
                          <Box display="flex" alignItems="center">
                            <AiFillFile size="40" />
                            <Text ml={2}>{uploadedFileName}</Text>
                          </Box>
                        ) : (
                          isDragActive ? (
                            <Text>Drop the zip files here ...</Text>
                          ) : (
                            <Text>Drag & drop a zip file here, or click to select file</Text>
                          )
                        )}
                      </Box>
                      {LocalFileInputForm()}
                    </VStack>
                  </Box>
                )
              }

              <FormControl >
                <FormLabel>Name</FormLabel>
                <Input mb="2px" placeholder="Dataset name" 
                value={datasetInfo.name}
                onChange={(e) =>
                  setDatasetInfo({ ...datasetInfo, name: e.target.value })
                }
                />
                <FormLabel>Description</FormLabel>
                <Input mb="2px" placeholder="Dataset Description" 
                value={datasetInfo.desc}
                onChange={(e) =>
                  setDatasetInfo({ ...datasetInfo, desc: e.target.value })
                }
                />
              </FormControl>
            
              {/* Add more form controls as needed */}
              
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleRegisterClick}>
                Register
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        {/*Dataset list table & Dataset card grid*/}
        {
        viewMode === 'table' ?
        <Table
          title={"Datasets"}
          columns={columns}
          data={datasetData}
          handleRowClick={handleRowClick}
          // 필요한 다른 props
        />
        :
        <Carousel
        showThumbs={false}
        showStatus={false}
        showIndicators={!isPreviewOpen}
        emulateTouch
        >
          {chunk(datasetData, 8).map((pageDatasets) => (
            <SimpleGrid columns={4} spacing={6} 
            style={{
              marginBottom: '0.6rem',
              padding : "2rem" // 원하는 간격 값으로 조정
            }}
            >
              {pageDatasets.map((dataset) => (
                <ObjectCard
                  id={dataset.dataset_id}
                  objectType = "dataset"
                  imageSrc={thumbnails[dataset.dataset_id]} // 적절한 이미지 소스
                  title={dataset.dataset_name}
                  onClick={handleCardClick}
                />
              ))}
            </SimpleGrid>        
          ))}
        
        </Carousel>
        }
        <Box style={previewContainerStyle}>
          {datasetDetailView()}
        </Box>
        </VStack>
      </HStack>
    </Box>
  );
}

export default Dataset;