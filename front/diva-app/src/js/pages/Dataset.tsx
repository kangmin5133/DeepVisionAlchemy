import React,{useState,} from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone"; // 추가
import {
  Box,
  Table,Tr,Th,Thead,Tbody,
  Heading,
  Image,
  Text,
  Flex,
  SimpleGrid,
  Spacer,
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
  VStack
} from "@chakra-ui/react";
import config from "../../conf/config";

import logo from '../../assets/DIVA_logo_white.png';
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

import { useSelector } from 'react-redux';
import { RootState } from '../store/index';  
import { User } from '../actions/authActions';

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

const Dataset: React.FC<DatasetProps> = ({sideBarVisible}) => {

  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const user = useSelector((state: RootState) => state.auth.user);
  
  const paddingLeft = sideBarVisible ? '300px' : '8';

  const { isOpen, onOpen, onClose } = useDisclosure()

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

  // 드래그&드랍을 위한 hook
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      setFileState({ jsonFile: acceptedFiles[0] });
    },
    // accept: 'application/json',
    maxFiles: 1,
  });

  // bucket info input
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

  const handleSaveClick = async () => {
    console.log("is Logined? : ",isLoggedIn)
    console.log("user : ", user)

    let dataToSend: {
      credentials?: { accessKeyId?: string; secretAccessKey?: string; jsonFile?: string };
      bucketInfo: BucketInfo;
      datasetInfo: { name: string; desc: string };
      user: User | null;
    } = {
      bucketInfo,
      datasetInfo: { name: datasetInfo.name, desc: datasetInfo.desc },
      user,
    };

    // S3
    if (selectedBox === "Amazon S3") {
      const encodedCredentials = {
        accessKeyId: btoa(credentials.accessKeyId),
        secretAccessKey: btoa(credentials.secretAccessKey),
      };
      dataToSend = { ...dataToSend, credentials: encodedCredentials };
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
      dataToSend = { ...dataToSend, credentials: encodedCredentials };
    }

    // Make the API request
    await fetch(`${config.serverUrl}/rest/api/dataset/create`, {
      method: 'POST',
      body: JSON.stringify(dataToSend),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    onClose();
  };

  const handleDataSrcClick = (boxName: string) => {
    setSelectedBox(boxName);
  };

  return (
    <Box p={8} pl={paddingLeft} transition="all 0.5s ease-in-out" pt="60px" overflow="auto" height="100vh" minH="100vh"
    backgroundImage={bgImage}
    backgroundPosition="center"
    backgroundSize="cover">
      <Breadcrumbs />
      {/* add dataset */}
      <Card
        backgroundRepeat='no-repeat'
        bgSize='cover'
        bgPosition='10%'
        p='16px'
        w="50%"
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
                  <Box {...getRootProps()} style={{ cursor: 'pointer', border: '1px solid gray', padding: '20px', marginTop: '20px' }}>
                    <input {...getInputProps()} />
                    {isDragActive ? (
                      <p>Drop the files here ...</p>
                    ) : (
                      <p>Drag & drop a JSON file here, or click to select file</p>
                    )}
                    
                  </Box>
                {bucketInputForm()}
                </VStack>
              </Box>
            )}

            <FormControl >
              <FormLabel>Name</FormLabel>
              <Input mb="2px" placeholder="Dataset name" />
              <FormLabel>Description</FormLabel>
              <Input mb="2px" placeholder="Dataset Description" />
            </FormControl>
          
            {/* Add more form controls as needed */}
            
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSaveClick}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      </Card>
      {/*Dataset list*/}
      <DatasetTableRow />
    </Box>
    
  );
}

export default Dataset;