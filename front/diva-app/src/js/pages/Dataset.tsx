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
  HStack
} from "@chakra-ui/react";
import { AiFillFile } from 'react-icons/ai';

import config from "../../conf/config";

import Breadcrumbs from "../components/Breadcrumbs";
import bgImage from "../../assets/alchemistic.png";
import SpaceCard from "../components/SpaceCard";
import { FaPlus } from "react-icons/fa";

import Card from "../components/Card/Card";
import CardHeader from "../components/Card/CardHeader";
import CardBody from "../components/Card/CardBody";

import DatasetTableRow from "../components/Table/DatasetTable";

import S3logo from "../../assets/Amazon-S3-Logo.png";
import GCSlogo from "../../assets/Google_Storage-Logo.png";
import uploadlogo from "../../assets/Upload-Icon.png";

import axios from "axios"; 
import UserAuthState from "../states/userAuthState"
import { User } from '../actions/authActions';

import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; 

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
  });
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [detailViewActive, setDetailViewActive] = useState<boolean>(false);

  const [datasetData, setDatasetData] = useState<DatasetData[]>([]);
  const [selectedDatasetId, setSelectedDatasetId] = useState<number>(0);

  const selectedDataset : DatasetData | undefined = datasetData.find(dataset => dataset.dataset_id === selectedDatasetId);
  const [imageData, setImageData] = useState<any>(null);

  const [currentSlide, setCurrentSlide] = useState(0);
  
  const [showUDButtons, setShowUDButtons] = useState(false);

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

  //components
  const datasetDetailView = () => {
    if (!detailViewActive || selectedDatasetId === 0) {
      return (
        <Card
          backgroundRepeat='no-repeat'
          bgSize='cover'
          bgPosition='10%'
          bgColor="gray.700"
          p='16px'
          h = "100%"
          borderStyle="dashed"
          borderWidth="2px"
          borderColor="gray.400"
          mb={4}
          _hover={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            transition: 'background-color 0.2s',
          }}
          >
            <CardBody h='100%' w='100%'>
              <Flex
                direction='column'
                color='white'
                h='100%'
                p='0px 10px 20px 10px'
                w='100%'
                justifyContent="center"
                align="center">
                  No Selected Dataset
              </Flex>
            </CardBody>
        </Card>
      );
    }
    return (
      <Card
          backgroundRepeat='no-repeat'
          bgSize='cover'
          bgPosition='10%'
          bgColor="gray.700"
          p='16px'
          h = "100%"
          borderWidth="2px"
          borderColor="gray.400"
          mb={4}
          _hover={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            transition: 'background-color 0.2s',
          }}
          >
            <CardBody h='100%' w='100%'>
              <Flex
                direction='column'
                color='white'
                h='100%'
                p='0px 10px 20px 10px'
                w='100%'
                justifyContent="center"
                align="center">
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

  // hooks
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      setFileState({ jsonFile: acceptedFiles[0] });
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
    // let jsonData: {
    //   credentials?: { accessKeyId?: string; secretAccessKey?: string; jsonFile?: string };
    //   bucketInfo: BucketInfo;
    //   datasetInfo: { name: string; desc: string };
    //   user: User | null;
    //   dataType: string;
    // } = {
    //   bucketInfo,
    //   datasetInfo: { name: datasetInfo.name, desc: datasetInfo.desc },
    //   user,
    //   dataType: selectedBox || '',
    // };
    
    let jsonData: {
      credentials?: { accessKeyId?: string; secretAccessKey?: string; jsonFile?: string };
      bucketInfo: BucketInfo;
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
    }

    // Make the API request
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

    onClose();
  };
  const handleDataSrcClick = (boxName: string) => {
    setSelectedBox(boxName);
  };
  const handleSlideChange = (currentIndex: number) => {
    setCurrentSlide(currentIndex);
  };

  return (
    <Box p={8} pl={paddingLeft} transition="all 0.5s ease-in-out" pt="60px" overflow="auto" height="100vh" minH="100vh"
    backgroundImage={bgImage}
    backgroundPosition="center"
    backgroundSize="cover">
      <Breadcrumbs />
      <HStack>
        <VStack h='100%' w='100%'>
        {/* add dataset card*/}
        <Card
          backgroundRepeat='no-repeat'
          bgSize='cover'
          bgPosition='10%'
          p='16px'
          // w="50%"
          borderStyle="dashed"
          borderWidth="2px"
          borderColor="gray.400"
          onClick={onOpen}
          cursor="pointer"
          mb={4}
          _hover={{ // 이 부분을 추가
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            transition: 'background-color 0.2s',
          }}
          >
          <CardBody h='100%' w='100%'>
            <Flex
              direction='column'
              color='white'
              h='100%'
              p='0px 10px 20px 10px'
              w='100%'
              justifyContent="center"
              align="center">
                <Circle size="50px" bg="gray.400" color="white" onClick={onOpen}>
                  <FaPlus size="24px" />
                </Circle>
                <Text mt="10px" fontSize="lg" color="white">
                  Add Dataset
                </Text>
            </Flex>
          </CardBody>
          {/* Input Modal */}
          <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
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
        </Card>
        {/*Dataset list table*/}
        <DatasetTableRow 
        datasetData = {datasetData}
        selectedDatasetId = {selectedDatasetId}
        setSelectedDatasetId={setSelectedDatasetId} 
        setDetailViewActive={setDetailViewActive}
        setShowUDButtons = {setShowUDButtons}
        showUDButtons = {showUDButtons}/>
        </VStack>
        {datasetDetailView()}
      </HStack>
    </Box>
    
  );
}

export default Dataset;