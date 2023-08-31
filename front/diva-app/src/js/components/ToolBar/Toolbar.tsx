import React, { useState, useEffect  } from "react";

// chakra imports
import {
  Box,
  Flex,
  Link,
  Stack,
  Text,
  Button,
  Switch,
  useColorMode,
} from "@chakra-ui/react";
import { Link as RouterLink, useLocation } from 'react-router-dom';
import Separator from "../Separator";
import IconBox from "../IconBox";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKeyboard } from '@fortawesome/free-regular-svg-icons';
import { faMousePointer, faHand, faGlobe, faBullseye, faSquare, faPaintBrush, faDrawPolygon, faCog } from '@fortawesome/free-solid-svg-icons';

interface ToolbarProps {
    selectedTool: string | null;
    onToolClick: (tool: string) => void;
  }
  

const Toolbar: React.FC<ToolbarProps> = ({selectedTool, onToolClick}) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [isActive, setIsActive] = useState(false);

  let variantChange = "0.2s linear";
  const [sidebarBg, setSidebarBg] = useState(
    "linear-gradient(127.09deg, rgba(6, 11, 40, 0.94) 19.41%, rgba(10, 14, 35, 0.49) 76.65%)"
  );

  const handleClick = () => {
    setIsActive(!isActive);
  };

  const title = (
    <Box pt={"25px"} mb='12px'>
        <Box
          bg='linear-gradient(97.89deg, #FFFFFF 70.67%, rgba(117, 122, 140, 0) 108.55%)'
          bgClip='text'>
          <Text align="center" fontSize='xl' letterSpacing='3px' mt='3px' color={colorMode === "dark" ? "transparent" : "black"}>
           TOOLS🛠️
          </Text>
        </Box>
    </Box>
  );

  useEffect(() => {
    if (colorMode === "dark") {
      setSidebarBg(
        "linear-gradient(127.09deg, rgba(6, 11, 40, 0.94) 19.41%, rgba(10, 14, 35, 0.49) 76.65%)"
      );
    } else {
      setSidebarBg(
        "linear-gradient(111.84deg, #d3d3d3 59.3%, rgba(255, 255, 255, 0) 100%)"
      );
    }
  }, [colorMode]);

  return (
      <Box 
      display="flex" 
      position='fixed'
      transition="all 0.5s ease-in-out" 
      >
        <Box
          bg="rgba(50, 50, 50, 1)"
          backdropFilter='blur(10px)'
          transition={variantChange}   
          w='5vw'
          maxW='10vw'
          h='100vh'
          borderWidth= "0.15rem" // 테두리 두께 설정
          justifyContent="center"
          >
          <Box>{title}</Box>
          <Text align="center" fontSize='medium' letterSpacing='3px' mb={4} mt={4} color={colorMode === "dark" ? "white" : "black"}>
          Basic
          </Text>
          <Separator></Separator>
          <Flex mt={4} justify="center" align="center">
          <Stack direction='column' mb={10}>
            <Button 
            onClick={() => onToolClick('shortcuts')}
            backgroundColor="blue.500"
            _hover={{ 
                cursor: "pointer",
                backgroundColor: 'blue.100',
                transition: 'background-color 0.2s',
              }}
              borderColor={selectedTool === 'shortcuts' ? "#00BFFE" : "blue.500"}
              borderWidth="0.2rem"
            >
                <IconBox>
                    <FontAwesomeIcon icon={faKeyboard}/>
                </IconBox>
            </Button>
            <Button 
            onClick={() => onToolClick('defaultPointer')}
            backgroundColor="blue.500"
            _hover={{ 
                cursor: "pointer",
                backgroundColor: 'blue.100',
                transition: 'background-color 0.2s',
              }}
              borderColor={selectedTool === 'defaultPointer' ? "#00BFFE" : "blue.500"}
              borderWidth="0.2rem"
            >
                <IconBox>
                    <FontAwesomeIcon icon={faMousePointer}/>
                </IconBox>
            </Button>
            <Button 
            onClick={() => onToolClick('move')}
            backgroundColor="blue.500"
            _hover={{ 
                cursor: "pointer",
                backgroundColor: 'blue.100',
                transition: 'background-color 0.2s',
              }}
              borderColor={selectedTool === 'move' ? "#00BFFE" : "blue.500"}
              borderWidth="0.2rem"
            >
                <IconBox>
                    <FontAwesomeIcon icon={faHand}/>
                </IconBox>
            </Button>
            </Stack>
         </Flex>
         <Text align="center" fontSize='medium' letterSpacing='3px' mb={4} mt={4} color={colorMode === "dark" ? "white" : "black"}>
          Labeling
          </Text>
          <Separator></Separator>
          <Flex mt={4} justify="center" align="center">
          <Stack direction='column' mb='40px'>
            <Button 
            onClick={() => onToolClick('globalSegment')}
            backgroundColor="blue.500"
            _hover={{ 
                cursor: "pointer",
                backgroundColor: 'blue.100',
                transition: 'background-color 0.2s',
              }}
              borderColor={selectedTool === 'globalSegment' ? "#00BFFE" : "blue.500"}
              borderWidth="0.2rem"
            
            >
                <IconBox>
                    <FontAwesomeIcon icon={faGlobe}/>
                </IconBox>
            </Button>
            <Button 
            
            onClick={() => onToolClick('oneClickSegment')}
            backgroundColor="blue.500"
            _hover={{ 
                cursor: "pointer",
                backgroundColor: 'blue.100',
                transition: 'background-color 0.2s',
              }}
              borderColor={selectedTool === 'oneClickSegment' ? "#00BFFE" : "blue.500"}
              borderWidth="0.2rem"
            >
                <IconBox>
                    <FontAwesomeIcon icon={faBullseye}/>
                </IconBox>
            </Button>
            <Button 
            onClick={() => onToolClick('bbox')}
            backgroundColor="blue.500"
            _hover={{ 
                cursor: "pointer",
                backgroundColor: 'blue.100',
                transition: 'background-color 0.2s',
              }}
              borderColor={selectedTool === 'bbox' ? "#00BFFE" : "blue.500"}
              borderWidth="0.2rem"
            >
                <IconBox>
                    <FontAwesomeIcon icon={faSquare}/>
                </IconBox>
            </Button>
            <Button 
            onClick={() => onToolClick('brush')}
            backgroundColor="blue.500"
            _hover={{ 
                cursor: "pointer",
                backgroundColor: 'blue.100',
                transition: 'background-color 0.2s',
              }}
              borderColor={selectedTool === 'brush' ? "#00BFFE" : "blue.500"}
              borderWidth="0.2rem"
            >
                <IconBox>
                    <FontAwesomeIcon icon={faPaintBrush}/>
                </IconBox>
            </Button>
            <Button 
            onClick={() => onToolClick('lasso')}
            backgroundColor="blue.500"
            _hover={{ 
                cursor: "pointer",
                backgroundColor: 'blue.100',
                transition: 'background-color 0.2s',
              }}
              borderColor={selectedTool === 'lasso' ? "#00BFFE" : "blue.500"}
              borderWidth="0.2rem"
            >
                <IconBox>
                    <FontAwesomeIcon icon={faDrawPolygon}/>
                </IconBox>
            </Button>
            </Stack>
         </Flex>
         <Text align="center" fontSize='medium' letterSpacing='3px' mb={4} mt={4} color={colorMode === "dark" ? "white" : "black"}>
          Manage
          </Text>
          <Separator></Separator>
          <Flex mt={4} justify="center" align="center">
          <Stack direction='column' mb='40px'>
            <Button 
            onClick={() => onToolClick('setting')}
            backgroundColor="blue.500"
            _hover={{ 
                cursor: "pointer",
                backgroundColor: 'blue.100',
                transition: 'background-color 0.2s',
              }}
              borderColor={selectedTool === 'setting' ? "#00BFFE" : "blue.500"}
              borderWidth="0.2rem"
            >
                <IconBox>
                    <FontAwesomeIcon icon={faCog}/>
                </IconBox>
            </Button>
            </Stack>
         </Flex>
        <Flex justify="center" align="center" p="2">
          {/* <Text mr={2}>{colorMode === "light" ? "Light" : "Dark"}</Text> */}
          {/* <Switch colorScheme="teal" size="md" isChecked={colorMode === "dark"} onChange={toggleColorMode} /> */}
        </Flex>
        </Box>
      </Box>
  );
}

export default Toolbar;