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
  Tabs, TabList, TabPanels, Tab, TabPanel,
  Table, Th, Tr, Thead,
  Select, Checkbox, FormControl, FormLabel, VStack, HStack, Tag, TagLabel, TagCloseButton 
} from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { FiCopy, FiCheck } from "react-icons/fi";

import UserAuthState from "../states/userAuthState"
import { useDispatch } from 'react-redux';
import { AnyAction } from 'redux';

import axios from "axios"; 
import config from "../../conf/config";

import logo from '../../assets/DIVA_logo_white.png';
import Breadcrumbs from "../components/Breadcrumbs";
import bgImage from "../../assets/alchemistic.png";

import Card from "../components/Card/Card";
import CardHeader from "../components/Card/CardHeader";
import CardBody from "../components/Card/CardBody";

import SpaceCard from "../components/SpaceCard";
import bgCardImg from '../../assets/back-ground-image-of-card2.png';
import { IoEllipsisHorizontal } from 'react-icons/io5';

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

import ProjectTable from "../components/Table/ProjectTable";

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
  const [showUDButtons, setShowUDButtons] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<number>(0);

  const { colorMode, toggleColorMode } = useColorMode();
  const cardDarkColor = "linear-gradient(127.09deg, rgba(6, 11, 40, 0.94) 19.41%, rgba(10, 14, 35, 0.49) 76.65%)";
  const cardLightColor = "linear-gradient(127.09deg, rgba(140, 140, 140, 0.94) 19.41%, rgba(200, 200, 200, 0.49) 76.65%)";
  
  const paddingLeft = sideBarVisible ? '300px' : '8';
  const navigate = useNavigate();

  const { isOpen: isOpenInvite, onOpen: onOpenInvite, onClose: onCloseInvite } = useDisclosure();
  const { isOpen: isOpenProject, onOpen: onOpenProject, onClose: onCloseProject } = useDisclosure();

  const [classTags, setClassTags] = useState<string[]>([]);
  const [preprocessTags, setPreprocessTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>('');

  const formik = useFormik<FormValues>({
    initialValues: {
      projectName: '',
      projectDescription: '',
      datasetId : 0,
      workspaceId : 0,
      preprocessing: false,
      preprocessTags : [],
      taskType: '',
      classTags : []
    },
    onSubmit: async (values) => {
      // submit your form to server
      values.datasetId = selectedDatasetId | datasets[0].dataset_id;
      values.workspaceId = workspaceId;
      values.preprocessTags = preprocessTags;
      values.classTags = classTags;
      console.log("submit values : ",values)
      try {
        const response = await axios.post(`${config.serverUrl}/rest/api/project/create`, values, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        setProjectData(oldData => [...oldData, response.data]);
      } catch (error) {
        console.error(error);
      }
    },
  });

  const preprocessingOptions = ["resize", "rotate", "grayscale", "sharpening", "contrast"];

  // handlers
  const handleDatasetIdChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
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

  //hooks
  useEffect(() => {
    const fetchDatasets = async () => {
      // if (user){
      // }
      try {
        const response = await axios.get(`${config.serverUrl}/rest/api/dataset/get`, { params: { user_id: user?.user_id} });
        setDatasets(response.data);
        console.log("dataset fetched")
      } catch (error) {
        console.error('Failed to fetch datasets:', error);
      }
    };
    fetchDatasets();
  }, [user, isOpenProject]);

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
    <Box p={8} pl={paddingLeft} 
    transition="all 0.5s ease-in-out" pt="60px"  height="100vh"
    backgroundImage={bgImage}
    backgroundPosition="center"
    backgroundSize="cover"
    >
      <Breadcrumbs />
      <Grid templateColumns={{ sm: '1fr', md: '1fr 1fr', '2xl': '2.5fr 0.8fr' }} my='26px' gap='18px'>
        {/* project create card */}
        <Card 
        p='0px'
        gridArea={{ md: '1 / 1 / 2 / 3', '2xl': 'auto' }}
        bgImage={bgCardImg}
        bgSize='cover'
        bgPosition='50%'
        cursor="pointer"
        onClick={onOpenProject}
        >
          <CardBody w='100%' h='100%'>
            <Flex flexDirection={{ sm: 'column', lg: 'row' }} w='100%' h='100%'>
            <Flex flexDirection='column' h='100%' p='22px' minW='60%' lineHeight='1.6'>
                <Text fontSize='50px' color='#fff' fontWeight='bold'>
                Create Project
                </Text>
                <Text fontSize='20px' color='gray.400' fontWeight='normal' mb='auto'>
                Create your Project here
                </Text>
            </Flex>
            </Flex>
          </CardBody>
        </Card>
        {/* invite list */}
        <Card 
        gridArea={{ md: '2 / 2 / 3 / 3', '2xl': 'auto' }}  
        bg={colorMode === "dark" ? cardDarkColor : cardLightColor}
        >
          <Flex direction='column'>
              <Flex justify='space-between' align='center' mb='8px'>
                  <Text color='#fff' fontSize='lg' fontWeight='bold'>
                      Invited List
                  </Text>
                  <Menu>
                      <MenuButton as={Button}>
                          <Icon as={IoEllipsisHorizontal} color='#7551FF' />
                      </MenuButton>
                      <MenuList>
                          <MenuItem onClick={handleCopyInviteCode}>Add Member</MenuItem>
                          <MenuItem>Delete</MenuItem>
                      </MenuList>
                  </Menu>
              </Flex>
              <Tabs variant="enclosed" colorScheme="blue" isLazy>
                <TabList>
                  <Tab>Members</Tab>
                  <Tab>Waiting</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <Box pt={0}>
                      <Input placeholder="Search..." mb="4px"/>
                      {/* <List mt={0}>
                        {['Member1', 'Member2', 'Member3'].map(member => <ListItem key={member}>{member}</ListItem>)}
                      </List> */}
                        <Table variant='simple' color='#fff'>
                        <Thead>
                          <Tr my='.8rem' ps='0px'>
                            <Th
                              ps='0px'
                              color='gray.400'
                              fontFamily='Plus Jakarta Display'
                              borderBottomColor='#56577A'>
                              Name
                            </Th>
                            <Th color='gray.400' fontFamily='Plus Jakarta Display' borderBottomColor='#56577A'>
                              Profile
                            </Th>
                          </Tr>
                        </Thead>
                      </Table>
                    </Box>
                  </TabPanel>

                  <TabPanel>
                    <Box pt={0}>
                      <Input placeholder="Search..." mb="4px"/>

                      {/* <List mt={0}>
                        {['Waiting1', 'Waiting2', 'Waiting3'].map(waiting => <ListItem key={waiting}>{waiting}</ListItem>)}
                      </List> */}
                      <Table variant='simple' color='#fff'>
                        <Thead>
                          <Tr my='.8rem' ps='0px'>
                            <Th
                              ps='0px'
                              color='gray.400'
                              fontFamily='Plus Jakarta Display'
                              borderBottomColor='#56577A'>
                              Name
                            </Th>
                            <Th color='gray.400' fontFamily='Plus Jakarta Display' borderBottomColor='#56577A'>
                              Profile
                            </Th>
                            
                          </Tr>
                        </Thead>
                      </Table>
                    </Box>
                  </TabPanel>
                </TabPanels>
              </Tabs>
              {/* Invite Code Model */}
              <Modal isOpen={isOpenInvite} onClose={onCloseInvite} isCentered>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Copy Invite Code</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <HStack spacing="24px">
                      <Text>{invitationCode}</Text>
                      <CopyToClipboard text={invitationCode} onCopy={() => setIsCopied(true)}>
                        <Button>{isCopied ? <FiCheck /> : <FiCopy />}</Button>
                      </CopyToClipboard>
                    </HStack>
                  </ModalBody>
                  <ModalFooter>
                    <Button onClick={onCloseInvite}>Close</Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
              {/* Project Create Model */}
              <Modal isOpen={isOpenProject} onClose={onCloseProject} isCentered>
                  <ModalOverlay />
                  <ModalContent as="form" onSubmit={(e: any) => formik.handleSubmit(e)}>
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
                            <Select name="taskType" onChange={formik.handleChange} value={formik.values.taskType}>
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
          </Flex>
        </Card>  
      </Grid>
      <Grid
				templateColumns={{ sm: '1fr', lg: '1.7fr 1.3fr' }}
				maxW={{ sm: '100%', md: '100%' }}
				gap='24px'
				mb='24px'>
          <LineChartView 
          bg={colorMode === "dark" ? cardDarkColor : cardLightColor}
          header = {"test line chart"}
          lineChartData={lineChartDataDashboard}
          lineChartOptions={lineChartOptionsDashboard}
          />
          <BarChartView 
          bg={colorMode === "dark" ? cardDarkColor : cardLightColor}
          header = {"test bar chart"}
          barChartData={barChartDataDashboard}
          barChartOptions={barChartOptionsDashboard}
          />
      </Grid>
      {/* project list view */}
      <ProjectTable 
      projectData = {projectData}
      showUDButtons = {showUDButtons}
      setShowUDButtons = {setShowUDButtons}
      setDetailViewActive = {setDetailViewActive}
      setSelectedProjectId = {setSelectedProjectId}
      selectedProjectId = {selectedProjectId}
      />
    </Box>
  );
}

export default LabelingWorkspace;