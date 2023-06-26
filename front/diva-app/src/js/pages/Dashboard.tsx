import React,{useEffect,useState} from "react";
import { useNavigate } from "react-router-dom";
// import {
//   Box,
//   Heading,
//   Stack,
//   useColorMode,
//   Grid,
//   SimpleGrid
// } from "@chakra-ui/react";

// for testing
import {
  Box,
  Heading,
  useColorMode,
  Grid,
	Button,
	CircularProgress,
	CircularProgressLabel,
	Flex,
	Icon,
	SimpleGrid,
	Stack,
	Text,
  useDisclosure,
  Menu, 
  MenuButton, 
  MenuList, 
  MenuItem,
  Input,
  List,
  ListItem, 
  Modal, 
  ModalOverlay, 
  ModalContent, 
  ModalHeader, 
  ModalCloseButton, 
  ModalBody, 
  ModalFooter, 
  Tabs, TabList, TabPanels, Tab, TabPanel
} from '@chakra-ui/react';

import Card from "../components/Card/Card";
import CardHeader from "../components/Card/CardHeader";
import CardBody from "../components/Card/CardBody";
import IconBox from "../components/IconBox";
import { AiFillCheckCircle } from 'react-icons/ai';
import { BiHappy } from 'react-icons/bi';
import { IoCheckmarkDoneCircleSharp, IoEllipsisHorizontal } from 'react-icons/io5';
// for testing

// import { useSelector } from "react-redux"; 
import UserAuthState from "../states/userAuthState"
import { User } from '../actions/authActions';
import axios from "axios"; 
import config from "../../conf/config";

import Breadcrumbs from "../components/Breadcrumbs";
import MiniStaticCard from '../components/MiniStaticCard';
import WorkListView from "../components/WorkListView";
import WorkHistoryView from "../components/WorkHistoryView";
import SpaceCard from "../components/SpaceCard";

import bgImage from "../../assets/alchemistic.png";
import bgCardImg from '../../assets/back-ground-image.png';

interface DashboardProps {
  sideBarVisible : boolean;
}

// interface WorkListViewProps {
//   colorMode : string;
//   cardDarkColor : string;
//   cardLightColor : string;    
// }

interface WorkSpace {
  workspace_id : number;
  org_id? : number;
  creator_id : number; 
  workspace_type_id : number;
  workspace_name : string;
  workspace_info : string;
  invitation_link : string;
  created : string;
}

const Dashboard: React.FC<DashboardProps> = ({sideBarVisible}) => {
  //states
  const { isLoggedIn, user} = UserAuthState();
  const paddingLeft = sideBarVisible ? '300px' : '8';

  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();

  const cardDarkColor = "linear-gradient(127.09deg, rgba(6, 11, 40, 0.94) 19.41%, rgba(10, 14, 35, 0.49) 76.65%)";
  const cardLightColor = "linear-gradient(127.09deg, rgba(140, 140, 140, 0.94) 19.41%, rgba(200, 200, 200, 0.49) 76.65%)";

  const [workspaceData, setWorkspaceData] = useState<WorkSpace[]>([]);
  const [showUDButtons, setShowUDButtons] = useState(false);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<number>(0);

  const selectedWorkSpace : WorkSpace | undefined = workspaceData.find(dataset => dataset.workspace_id === selectedWorkspaceId);
  
  // const [selectedTab, setSelectedTab] = useState('members');
  const { isOpen, onOpen, onClose } = useDisclosure();

  //funcs
  const handleCopyInviteCode = () => {
    // Here you can implement the copying invite code functionality
    onOpen();
  };

  //hooks
  useEffect(() => {
    if (user) {
        const fetchData = async () => {
            const response = await axios.get(`${config.serverUrl}/rest/api/workspace/get`, {
                params: {
                  creator_id: user.user_id
                }
            });
            console.log("response.data : ",response.data)
            // 데이터를 상태에 저장
            setWorkspaceData(response.data);
        }
      // fetchData 함수를 호출하여 데이터 불러오기 시작
        fetchData();
    }
  }, [user]);

  useEffect(() => {
    console.log("selectedWorkspaceId : ",selectedWorkspaceId)
  }, [selectedWorkspaceId]);

  //handlers


  return (
    <Box p={8} pl={paddingLeft} transition="all 0.5s ease-in-out" pt="60px" bg={colorMode === "dark" ? "gray.700" : "gray.100"} minH="100vh"
    overflow="auto" height="100vh"
    backgroundImage={bgImage}
    backgroundPosition="center"
    backgroundSize="cover">
      <Breadcrumbs />
      <Stack spacing={4} align="stretch">
        <Heading as="h2" size="lg" color={colorMode === "dark" ? "white" : "black"}>
        </Heading>
          {/* mini static */}
          <SimpleGrid columns={{ sm: 1, md: 2, xl: 4 }} spacing='24px'>
            <MiniStaticCard 
              colorMode={colorMode}
              cardDarkColor={cardDarkColor}
              cardLightColor={cardLightColor}
              title={"ToDo"}
              description={" needs to label"}
              value={1524}/>
            <MiniStaticCard 
              colorMode={colorMode}
              cardDarkColor={cardDarkColor}
              cardLightColor={cardLightColor}
              title={"In Progress"}
              description={" labeling task on going"}
              value={241}/>
            <MiniStaticCard 
              colorMode={colorMode}
              cardDarkColor={cardDarkColor}
              cardLightColor={cardLightColor}
              title={"Done"}
              description={" completed work"}
              value={152}/>
            <MiniStaticCard 
              colorMode={colorMode}
              cardDarkColor={cardDarkColor}
              cardLightColor={cardLightColor}
              title={"Issue"}
              description={" problems left in your projects"}
              value={8}/>
          </SimpleGrid>
          {/* graphs & static */}
          <Grid templateColumns={{ sm: '1fr', md: '1fr 1fr', '2xl': '1.2fr 1.2fr 2fr' }} my='26px' gap='18px'>
              {/* Workspace Card */}
              <SpaceCard header={"Create Workspace"} bgImage={bgCardImg} description={"Create your Workspace here"} target="/select/workspace"/>
              {/* Dataset */}
              <SpaceCard header={"Dataset Management"} bgImage={bgCardImg} description={"regist yout own dataset here"} target="/dataset"/>
              {/* invited list */}
              <Card gridArea={{ md: '2 / 2 / 3 / 3', '2xl': 'auto' }} bg={colorMode === "dark" ? cardDarkColor : cardLightColor}>
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

                            <List mt={0}>
                              {['Member1', 'Member2', 'Member3'].map(member => <ListItem key={member}>{member}</ListItem>)}
                            </List>
                          </Box>
                        </TabPanel>

                        <TabPanel>
                          <Box pt={0}>
                            <Input placeholder="Search..." mb="4px"/>

                            <List mt={0}>
                              {['Waiting1', 'Waiting2', 'Waiting3'].map(waiting => <ListItem key={waiting}>{waiting}</ListItem>)}
                            </List>
                          </Box>
                        </TabPanel>
                      </TabPanels>
                    </Tabs>

                    <Modal isOpen={isOpen} onClose={onClose} isCentered>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>Copy Invite Code</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                {/* Display invite code here */}
                            </ModalBody>

                            <ModalFooter>
                                <Button onClick={onClose}>Close</Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                </Flex>
            </Card>
          </Grid>

          <Grid templateColumns={{ sm: '1fr', md: '1fr 1fr', lg: '2fr 1fr' }} gap='24px'>
            {/* workspace list */}
            {/* <WorkListView 
            colorMode={colorMode}
            cardDarkColor={cardDarkColor}
            cardLightColor={cardLightColor} /> */}
            <WorkListView 
            setSelectedWorkspaceId = {setSelectedWorkspaceId}
            selectedWorkspaceId = {selectedWorkspaceId}
            setShowUDButtons ={setShowUDButtons}
            showUDButtons = {showUDButtons}
            WorkListViewProps={{"colorMode":colorMode,"cardDarkColor":cardDarkColor,"cardLightColor":cardLightColor}}
            workspaceData={workspaceData}
            />
            {/* working history overview */}
            <WorkHistoryView 
            colorMode={colorMode}
            cardDarkColor={cardDarkColor}
            cardLightColor={cardLightColor} />
          </Grid>
      </Stack>
    </Box>
  );
}

export default Dashboard;
