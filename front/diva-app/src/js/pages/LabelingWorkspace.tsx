import React from "react";
import { useNavigate } from "react-router-dom";
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
  Table, Th, Tr, Thead
} from "@chakra-ui/react";

import UserAuthState from "../states/userAuthState"
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

interface WorkspaceProps {
  sideBarVisible : boolean;
}

const LabelingWorkspace: React.FC<WorkspaceProps> = ({sideBarVisible}) => {

  const { isLoggedIn, user} = UserAuthState();

  const { colorMode, toggleColorMode } = useColorMode();
  const cardDarkColor = "linear-gradient(127.09deg, rgba(6, 11, 40, 0.94) 19.41%, rgba(10, 14, 35, 0.49) 76.65%)";
  const cardLightColor = "linear-gradient(127.09deg, rgba(140, 140, 140, 0.94) 19.41%, rgba(200, 200, 200, 0.49) 76.65%)";
  
  const paddingLeft = sideBarVisible ? '300px' : '8';
  const navigate = useNavigate();

  
  // const [selectedTab, setSelectedTab] = useState('members');
  const { isOpen: isOpenInvite, onOpen: onOpenInvite, onClose: onCloseInvite } = useDisclosure();
  const { isOpen: isOpenProject, onOpen: onOpenProject, onClose: onCloseProject } = useDisclosure();


  //funcs
  const handleCopyInviteCode = () => {
    // Here you can implement the copying invite code functionality
    onOpenInvite();
  };

  return (
    <Box p={8} pl={paddingLeft} 
    transition="all 0.5s ease-in-out" pt="60px"  height="100vh"
    backgroundImage={bgImage}
    backgroundPosition="center"
    backgroundSize="cover"
    >
      <Breadcrumbs />
      <Grid templateColumns={{ sm: '1fr', md: '1fr 1fr', '2xl': '2.5fr 0.8fr' }} my='26px' gap='18px'>
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

              <Modal isOpen={isOpenInvite} onClose={onCloseInvite} isCentered>
                  <ModalOverlay />
                  <ModalContent>
                      <ModalHeader>Copy Invite Code</ModalHeader>
                      <ModalCloseButton />
                      <ModalBody>
                          {/* Display invite code here */}
                      </ModalBody>

                      <ModalFooter>
                          <Button onClick={onCloseInvite}>Close</Button>
                      </ModalFooter>
                  </ModalContent>
              </Modal>
              <Modal isOpen={isOpenProject} onClose={onCloseProject} isCentered>
                  <ModalOverlay />
                  <ModalContent>
                      <ModalHeader>Create New Projects</ModalHeader>
                      <ModalCloseButton />
                      <ModalBody>
                          {/* Display project create modal here */}
                      </ModalBody>

                      <ModalFooter>
                          <Button onClick={onCloseProject}>Close</Button>
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
    </Box>
  );
}

export default LabelingWorkspace;