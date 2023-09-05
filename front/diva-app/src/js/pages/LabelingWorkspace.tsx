import React, {useState, useEffect} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Grid,
  Flex,
  Text,
  Menu,
  MenuButton,
  Icon,
  Image,
  SimpleGrid,
  Spacer,
  useDisclosure,
  MenuList, MenuItem,
  Button,
  useColorMode,
  Input,
  Modal, 
  ModalOverlay, 
  ModalContent, 
  ModalHeader, 
  ModalCloseButton, 
  ModalBody, 
  ModalFooter, 
  Select, Checkbox, FormControl, FormLabel, VStack, HStack, Tag, TagLabel, TagCloseButton ,
  IconButton
} from "@chakra-ui/react";
import { ArrowForwardIcon, AddIcon} from "@chakra-ui/icons";
import { FiCopy, FiCheck } from "react-icons/fi";
import { FaTh } from 'react-icons/fa';

import UserAuthState from "../states/userAuthState"
import { useDispatch } from 'react-redux';
import { AnyAction } from 'redux';

import axios from "axios"; 
import config from "../../conf/config";

import logo from '../../assets/DIVA_logo_white.png';
import Breadcrumbs from "../components/Breadcrumbs";
import bgImage from "../../assets/alchemistic.png";

import { chunk } from 'lodash';
import Card from "../components/Card/Card";
import CardHeader from "../components/Card/CardHeader";
import CardBody from "../components/Card/CardBody";
import SpaceCard from "../components/SpaceCard";
import ObjectCard from '../components/Card/ObjectCard';

import bgCardImg from '../../assets/back-ground-image-of-card2.png';
import { IoEllipsisHorizontal } from 'react-icons/io5';
import addBtn from "../../assets/add.png"
import LineChartView from "../components/LineChartView";
import BarChartView from "../components/BarChartView";

import {
	barChartDataDashboard,
	barChartOptionsDashboard,
	lineChartDataDashboard,
	lineChartOptionsDashboard
} from '../states/testval';

import { useFormik } from "formik";
import { CopyToClipboard } from 'react-copy-to-clipboard';

import Table from "../components/Table/Table";
import { Carousel } from 'react-responsive-carousel';

interface WorkspaceProps {
  sideBarVisible : boolean;
}

interface FormValues {
  projectName: string;
  projectDescription: string;
  datasetId : number;
  workspaceId : number;
  preprocessing: boolean;
  preprocessTags : string[],
  taskType: string;
  classTags : string[];
}

interface Dataset {
  dataset_id: number;
  org_id: number;
  creator_id: number;
  dataset_name: string;
  dataset_desc: string;
  dataset_type: string;
  dataset_count: number;
  dataset_prefix: string;
  created: string;
}

interface Project {
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

const LabelingWorkspace: React.FC<WorkspaceProps> = ({sideBarVisible}) => {

  // states
  const { isLoggedIn, user} = UserAuthState();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const workspaceId = Number(searchParams.get('workspace_id'));
  if (isNaN(workspaceId)) {
    console.log("workspaceId is Nan")
  }
  const [invitationCode, setInvitationCode] =  useState<string>("");
  const [copySuccess, setCopySuccess] = useState<string>("");
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [selectedDatasetId, setSelectedDatasetId] = useState<number>(0);

  const [projectData, setProjectData] = useState<Project[]>([]);
  const [detailViewActive, setDetailViewActive] = useState<boolean>(false);
  const [selectedProjectId, setSelectedProjectId] = useState<number>(0);
  const selectedProject : Project | undefined = projectData.find(project => project.project_id === selectedProjectId);

  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = "linear-gradient(127.09deg, rgba(5, 20, 40, 0.94) 19.41%, rgba(10, 25, 45, 0.49) 76.65%)";
  const cardDarkColor = "linear-gradient(127.09deg, rgba(6, 11, 40, 0.94) 19.41%, rgba(10, 14, 35, 0.49) 76.65%)";
  const cardLightColor = "linear-gradient(127.09deg, rgba(140, 140, 140, 0.94) 19.41%, rgba(200, 200, 200, 0.49) 76.65%)";
  
  const paddingLeft = sideBarVisible ? '300px' : '8';
  const navigate = useNavigate();

  const { isOpen: isOpenInvite, onOpen: onOpenInvite, onClose: onCloseInvite } = useDisclosure();
  const { isOpen: isOpenProject, onOpen: onOpenProject, onClose: onCloseProject } = useDisclosure();

  const [classTags, setClassTags] = useState<string[]>([]);
  const [preprocessTags, setPreprocessTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>('');

  const [viewMode, setViewMode] = useState<string>('table');
  const [orderMode, setOrderMode] = useState<string>('latest');

  const formik = useFormik<FormValues>({
    initialValues: {
      projectName: '',
      projectDescription: '',
      datasetId : 0,
      workspaceId : 0,
      preprocessing: false,
      preprocessTags : [],
      taskType: 'classification',
      classTags : []
    },
    onSubmit: async (values) => {
      // submit your form to server
      if (!values.taskType) {
        values.taskType = 'classification'; // 기본값 설정
      }
      values.datasetId = selectedDatasetId || datasets[0].dataset_id;
      values.workspaceId = workspaceId;
      values.preprocessTags = preprocessTags;
      values.classTags = classTags;

      const payload = {
        ...values,
        userId: user?.user_id,  // user.user_id 추가
      };
      console.log("project create data sending.... : ",payload)
      try {
        const response = await axios.post(`${config.serverUrl}/rest/api/project/create`, payload, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        setProjectData(oldData => [...oldData, response.data]);
      } catch (error) {
        console.error(error);
      }
      onCloseProject();
    },
  });

  const preprocessingOptions = ["resize", "rotate", "grayscale", "sharpening", "contrast"];
  const columns = [
    { header: 'Project Name', field: 'project_name' },
    { header: 'Members', field: 'project_members' },
    { header: 'Task ID', field: 'project_task' },
    { header: 'Created', field: 'created' }
    // 다른 열 정의
  ];

  // const [currentSlide, setCurrentSlide] = useState(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

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


  //components
  const projectDetailView = () => {

    const commonCardProps = {
      backgroundRepeat: 'no-repeat',
      bgSize: 'cover',
      bgPosition: '10%',
      p: '0px 16px 16px 16px',
      h: "100%",
      borderWidth: "2px",
      borderColor: "teal",
      borderStyle : "dashed",
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
      if (!detailViewActive || selectedProjectId === 0) {
        return (
          <Card {...commonCardProps}>
            <Box style={previewButtonStyle} onClick={togglePreview}>
              {isPreviewOpen ? '▼' : '▲'}
            </Box>
              <CardBody h='100%' w='100%'>
                <Flex {...commonCardBodyProps}>
                    No Selected Project
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
                    {selectedProject && (
                      <Box>
                        <Box h='100%' w='100%'>
                          <Text fontSize="xl" align="center" justifyContent="center">
                            Project Detail
                          </Text>
                          {/* <Carousel 
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
                          </Carousel> */}
                        </Box>
                        <Text fontSize="xl">Name: {selectedProject.project_name}</Text>
                        <Text fontSize="xl">Description: {selectedProject.project_desc || 'No description provided'}</Text>
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
        </Card>
      )
    }
  }

  // handlers
  const handleDatasetIdChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newDatasetId = event.target.value;
    formik.setFieldValue('datasetId', newDatasetId);
    setSelectedDatasetId(Number(event.target.value));
  };

  const handleAddClassTag = () => {
    if (inputValue && !classTags.includes(inputValue)) {
      setClassTags([...classTags, inputValue]);
    }
    setInputValue('');
  };

  const handleRemoveClassTag = (tagToRemove: string) => {
    setClassTags(classTags.filter((tag) => tag !== tagToRemove));
  };

  const handleRemovePreprocessTag = (tagToRemove: string) => {
    setPreprocessTags(preprocessTags.filter((tag) => tag !== tagToRemove));
  };

  const handleCopyInviteCode = () => {
    // Here you can implement the copying invite code functionality
    onOpenInvite();
  };

  const handleRowClick = (row: any) => {
    setSelectedProjectId(row.project_id); // 또는 row.user_id, row.workspace_id 등
    setDetailViewActive(true);
    setIsPreviewOpen(true);
  };

  const togglePreview = () => {
    setIsPreviewOpen(!isPreviewOpen);
  };

  const handleCardClick = (id: number) => {
    // ID를 사용하여 필요한 작업 수행
    console.log("selected ID : ",id)
    setSelectedProjectId(id); // 또는 row.user_id, row.workspace_id 등
    setDetailViewActive(true);
    setIsPreviewOpen(true);
  };


  //hooks
  useEffect(() => {
    const fetchDatasets = async () => {
      // if (user){
      // }
      try {
        const response = await axios.get(`${config.serverUrl}/rest/api/dataset/get`, { params: { user_id: user?.user_id} });
        setDatasets(response.data);
        console.log("dataset fetched :",response.data)
      } catch (error) {
        console.error('Failed to fetch datasets:', error);
      }
    };
    fetchDatasets();
  }, [user, isOpenProject]);

  useEffect(() => {
    if (user) {
        const fetchData = async () => {
            const response = await axios.get(`${config.serverUrl}/rest/api/project/get/by/workspaceid`, {
                params: {
                  workspace_id : workspaceId
                }
            });
            console.log("get project response.data : ",response.data)
            // 데이터를 상태에 저장
            setProjectData(response.data);
        }
      // fetchData 함수를 호출하여 데이터 불러오기 시작
        fetchData();
    }
  }, [user]); 

  useEffect(() => {
    const fetchInviteCode = async () => {
      try {
        const response = await axios.get(`${config.serverUrl}/rest/api/workspace/get/invitation`, { params: { workspace_id: workspaceId} });
        setInvitationCode(response.data.invitation_code);
        console.log("invitation code fetched")
      } catch (error) {
        console.error('Failed to fetch invitation code:', error);
      }
    };
    fetchInviteCode();
  }, [user,workspaceId]);

  return (
    <Box p={8} pl={paddingLeft} bg={colorMode === "dark" ? bgColor : "gray.100"} 
    transition="all 0.5s ease-in-out" pt="60px" overflow="hidden" height="100vh" minH="100vh"
    backgroundPosition="center"
    backgroundSize="cover"
    >
      <HStack spacing={2}>
        <Breadcrumbs />
        <Spacer />
        <Button rightIcon={<AddIcon />} colorScheme="teal" variant="outline" onClick={onOpenProject}>
          Create Project
        </Button>
        <Button rightIcon={<AddIcon />} colorScheme="teal" variant="outline" onClick={handleCopyInviteCode}>
          Add Member
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
      {/* <Grid templateColumns={{ sm: '1fr', md: '1fr 1fr', '2xl': '2.5fr 0.8fr' }} my='26px' gap='18px'> */}
        {/* Invite Code Model */}
        <Modal isOpen={isOpenInvite} onClose={onCloseInvite} isCentered>
          <ModalOverlay />
          <ModalContent bg="rgba(40, 40, 40, 0.9)">
            <ModalHeader>Copy Invite Code</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack>
              <HStack spacing="24px">
                <Text>{invitationCode}</Text>
                <CopyToClipboard text={invitationCode} onCopy={() => setIsCopied(true)}>
                  <Button>{isCopied ? <FiCheck /> : <FiCopy />}</Button>
                </CopyToClipboard>
              </HStack>
                <Flex justify='space-between' align='center'>
                  <Text color='#fff' fontSize='lg' fontWeight='bold'>
                      Invited List
                  </Text>
                  <Menu>
                      <MenuButton as={Button}>
                          <Icon as={IoEllipsisHorizontal} color='#7551FF' />
                      </MenuButton>
                      <MenuList>
                          <MenuItem>Change role</MenuItem>
                          <MenuItem>Delete</MenuItem>
                      </MenuList>
                  </Menu>
              </Flex>

              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button onClick={onCloseInvite}>Close</Button>
            </ModalFooter>
            
                          
          </ModalContent>
        </Modal>
        {/* Project Create Model */}
        <Modal isOpen={isOpenProject} onClose={onCloseProject} isCentered>
            <ModalOverlay />
            <ModalContent  bg="rgba(40, 40, 40, 0.9)" as="form" onSubmit={(e: any) => formik.handleSubmit(e)}>
                <ModalHeader>Create New Projects</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {/* Display project create modal here */}
                    <VStack spacing={4} align="start">
                    <FormControl>
                      <FormLabel>Project Name</FormLabel>
                      <Input name="projectName" onChange={formik.handleChange} value={formik.values.projectName} />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Project Info(description)</FormLabel>
                      <Input name="projectDescription" onChange={formik.handleChange} value={formik.values.projectDescription} />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Select Dataset</FormLabel>
                      <Select name="dataset_id" onChange={handleDatasetIdChange} value={formik.values.datasetId.toString()}>
                          {datasets.map((dataset) => (
                            <option key={dataset.dataset_id} value={dataset.dataset_id}>
                              {dataset.dataset_name}
                            </option>
                          ))}
                      </Select>
                    </FormControl>
                    <FormControl>
                    <Flex wrap="wrap">
                      <FormLabel>Apply Preprocessing</FormLabel>
                      <Checkbox name="preprocessing" onChange={formik.handleChange} isChecked={formik.values.preprocessing} />
                    </Flex>
                      {formik.values.preprocessing && (
                        <>
                          <Select
                            // placeholder="Select preprocessing option"
                            onChange={(event) => {
                              const value = event.target.value;
                              if (value && !preprocessTags.includes(value)) {
                                setPreprocessTags([...preprocessTags, value]);
                              }
                            }}
                            value="" // 선택 후 Select를 초기화합니다.
                          >
                            <option value="" disabled hidden>
                              Select preprocessing option
                            </option>                                  
                            {preprocessingOptions.map((option, index) => (
                              <option key={index} value={option}>
                                {option.charAt(0).toUpperCase() + option.slice(1)}
                              </option>
                            ))}
                          </Select>
                          <Flex wrap="wrap">
                            {preprocessTags.map((tag, index) => (
                              <Flex key={index} align="center">
                                <Tag size="md" variant="solid" colorScheme="blue" mt={2}>
                                  <TagLabel>{tag}</TagLabel>
                                  <TagCloseButton onClick={() => handleRemovePreprocessTag(tag)} />
                                </Tag>
                                {index < preprocessTags.length - 1 && <ArrowForwardIcon mt={2}/>}
                              </Flex>
                            ))}
                          </Flex>
                        </>
                      )}
                    </FormControl>
                    <FormControl>
                      <FormLabel>Configure Class</FormLabel>
                      <HStack>
                        <Input value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
                        <Button onClick={handleAddClassTag}>Add</Button>
                      </HStack>
                      <Box mt={2}>
                        {classTags.map((tag) => (
                          <Tag key={tag} size="md" variant="solid" colorScheme="blue" mr={2} mt={2}>
                            <TagLabel>{tag}</TagLabel>
                            <TagCloseButton onClick={() => handleRemoveClassTag(tag)} />
                          </Tag>
                        ))}
                      </Box>
                    </FormControl>
                    <FormControl>
                      <FormLabel>Task Type Select</FormLabel>
                      <Select name="taskType" onChange={formik.handleChange} value={formik.values.taskType || 'classification'}>
                        <option value="classification">Classification</option>
                        <option value="objectDetection">Object Detection</option>
                        <option value="semanticSegmentation">Semantic Segmentation</option>
                        <option value="instanceSegmentation">Instance Segmentation</option>
                      </Select>
                    </FormControl>
                  </VStack>
                </ModalBody>
                <ModalFooter>
                    <Button type="submit" colorScheme="blue">Create</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
      {/* </Grid> */}
      {
        viewMode === 'table' ?
      <Table 
        title = {"Projects"}
        columns={columns}
        data={projectData}
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
          {chunk(projectData, 8).map((pageProjects) => (
            <SimpleGrid columns={4} spacing={6} 
            style={{
              marginBottom: '0.6rem',
              padding : "2rem" // 원하는 간격 값으로 조정
            }}
            >
              {pageProjects.map((project) => (
                <ObjectCard
                  id={project.project_id}
                  objectType = "project"
                  // imageSrc={dataset.imageSrc} // 적절한 이미지 소스
                  title={project.project_name}
                  onClick={handleCardClick}
                />
              ))}
            </SimpleGrid>        
          ))}
        
        </Carousel>
        }

        <Box style={previewContainerStyle}>
          {projectDetailView()}
        </Box>
        </VStack>
      </HStack>
    </Box>
  );
}

export default LabelingWorkspace;