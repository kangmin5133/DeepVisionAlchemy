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
          <Grid templateColumns={{ sm: '1fr', md: '1fr 1fr', '2xl': '2fr 1.2fr 1.5fr' }} my='26px' gap='18px'>
              {/* Workspace Card */}
              <SpaceCard header={"Create Workspace"} bgImage={bgCardImg} description={"Create your Workspace here"} target="/select/workspace"/>
              {/* Satisfaction Rate */}
              {/* <Card gridArea={{ md: '2 / 1 / 3 / 2', '2xl': 'auto' }} bg={colorMode === "dark" ? cardDarkColor : cardLightColor}>
                <CardHeader mb='24px'>
                  <Flex direction='column'>
                    <Text color='#fff' fontSize='lg' fontWeight='bold' mb='4px'>
                      Satisfaction Rate
                    </Text>
                    <Text color='gray.400' fontSize='sm'>
                      From all projects
                    </Text>
                  </Flex>
                </CardHeader>
                <Flex direction='column' justify='center' align='center'>
                  <Box zIndex='-1'>
                    <CircularProgress
                      size={200}
                      value={80}
                      thickness={6}
                      color='#582CFF'
                      rounded="full">
                      <CircularProgressLabel>
                        <IconBox mb='20px' mx='auto' bg='brand.200' borderRadius='50%' w='48px' h='48px'>
                          <Icon as={BiHappy} color='#fff' w='30px' h='30px' />
                        </IconBox>
                      </CircularProgressLabel>
                    </CircularProgress>
                  </Box>
                  <Stack
                    direction='row'
                    spacing={{ sm: '42px', md: '68px' }}
                    justify='center'
                    maxW={{ sm: '270px', md: '300px', lg: '100%' }}
                    mx={{ sm: 'auto', md: '0px' }}
                    p='18px 22px'
                    bg='linear-gradient(126.97deg, rgb(6, 11, 40) 28.26%, rgba(10, 14, 35) 91.2%)'
                    borderRadius='20px'
                    position='absolute'
                    bottom='5%'>
                    <Text fontSize='xs' color='gray.400'>
                      0%
                    </Text>
                    <Flex direction='column' align='center' minW='80px'>
                      <Text color='#fff' fontSize='28px' fontWeight='bold'>
                        95%
                      </Text>
                      <Text fontSize='xs' color='gray.400'>
                        Based on likes
                      </Text>
                    </Flex>
                    <Text fontSize='xs' color='gray.400'>
                      100%
                    </Text>
                  </Stack>
                </Flex>
              </Card> */}
              {/* Dataset */}
              <SpaceCard header={"Dataset Management"} bgImage={bgCardImg} description={"regist yout own dataset here"} target="/dataset"/>
              {/* Referral Tracking */}
              <Card gridArea={{ md: '2 / 2 / 3 / 3', '2xl': 'auto' }} bg={colorMode === "dark" ? cardDarkColor : cardLightColor}>
                <Flex direction='column'>
                  <Flex justify='space-between' align='center' mb='40px'>
                    <Text color='#fff' fontSize='lg' fontWeight='bold'>
                      Referral Tracking
                    </Text>
                    <Button borderRadius='12px' w='38px' h='38px' bg='#22234B' _hover={{}} _active={{}}>
                      <Icon as={IoEllipsisHorizontal} color='#7551FF' />
                    </Button>
                  </Flex>
                  <Flex direction={{ sm: 'column', md: 'row' }}>
                    <Flex direction='column' me={{ md: '6px', lg: '52px' }} mb={{ sm: '16px', md: '0px' }}>
                      <Flex
                        direction='column'
                        p='22px'
                        pe={{ sm: '22e', md: '8px', lg: '22px' }}
                        minW={{ sm: '220px', md: '140px', lg: '220px' }}
                        bg='linear-gradient(126.97deg, #060C29 28.26%, rgba(4, 12, 48, 0.5) 91.2%)'
                        borderRadius='20px'
                        mb='20px'>
                        <Text color='gray.400' fontSize='sm' mb='4px'>
                          Invited
                        </Text>
                        <Text color='#fff' fontSize='lg' fontWeight='bold'>
                          145 people
                        </Text>
                      </Flex>
                      <Flex
                        direction='column'
                        p='22px'
                        pe={{ sm: '22px', md: '8px', lg: '22px' }}
                        minW={{ sm: '170px', md: '140px', lg: '170px' }}
                        bg='linear-gradient(126.97deg, #060C29 28.26%, rgba(4, 12, 48, 0.5) 91.2%)'
                        borderRadius='20px'>
                        <Text color='gray.400' fontSize='sm' mb='4px'>
                          Bonus
                        </Text>
                        <Text color='#fff' fontSize='lg' fontWeight='bold'>
                          1,465
                        </Text>
                      </Flex>
                    </Flex>
                    <Box mx={{ sm: 'auto', md: '0px' }}>
                      <CircularProgress
                        size={window.innerWidth >= 1024 ? 200 : window.innerWidth >= 768 ? 170 : 200}
                        value={70}
                        thickness={6}
                        color='#05CD99'>
                        <CircularProgressLabel>
                          <Flex direction='column' justify='center' align='center'>
                            <Text color='gray.400' fontSize='sm'>
                              Safety
                            </Text>
                            <Text
                              color='#fff'
                              fontSize={{ md: '36px', lg: '50px' }}
                              fontWeight='bold'
                              mb='4px'>
                              9.3
                            </Text>
                            <Text color='gray.400' fontSize='sm'>
                              Total Score
                            </Text>
                          </Flex>
                        </CircularProgressLabel>
                      </CircularProgress>
                    </Box>
                  </Flex>
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
