import React, { useState, useEffect  } from "react";

// chakra imports
import {
  Box,
  Flex,
  Link,
  HStack,
  VStack,
  Stack,
  Text,
  Button,
  Switch
} from "@chakra-ui/react";
import { Link as RouterLink, useLocation } from 'react-router-dom';
import Separator from "../Separator";
import IconBox from "../IconBox";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKeyboard } from '@fortawesome/free-regular-svg-icons';
import { faMousePointer, faHand, faGlobe, faBullseye, faSquare, faPaintBrush, faDrawPolygon, faCog, faArrowsAltH, faCircle } from '@fortawesome/free-solid-svg-icons';

interface ToolbarProps {
    selectedTool: string | null;
    onToolClick: (tool: string) => void;
  }
  

const Toolbar: React.FC<ToolbarProps> = ({selectedTool, onToolClick}) => {
  const [isActive, setIsActive] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  let variantChange = "0.2s linear";
  const [sidebarBg, setSidebarBg] = useState(
    "linear-gradient(127.09deg, rgba(6, 11, 40, 0.94) 19.41%, rgba(10, 14, 35, 0.49) 76.65%)"
  );

  const FIX_BALL_SIZES = ['S', 'M', 'L', 'X'];
  const [selectedFixBallSize, setSelectedFixBallSize] = useState('s');
  const [fixBallDropdownVisible, setFixBallDropdownVisible] = useState(false); 

  const iconSizeMapping: Record<string,  "xs" | "sm" | "lg" | "2x"> = {
    S: "xs",
    M: "sm",
    L: "lg",
    X: "2x",
  };

  const handleClick = () => {
    setIsActive(!isActive);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded); 
  };

  const title = (
    <Box pt={"25px"} mb='12px'>
        <Box
          bg='linear-gradient(97.89deg, #FFFFFF 70.67%, rgba(117, 122, 140, 0) 108.55%)'
          bgClip='text'>
          <Text align="center" fontSize='xl' letterSpacing='3px' mt='3px'>
           TOOLS🛠️
          </Text>
        </Box>
    </Box>
  );

  return (
      <Box 
      display="flex" 
      // position='fixed'
      transition="all 0.5s ease-in-out" 
      zIndex={10}
      >
        <Box
          bg="rgba(50, 50, 50, 1)"
          backdropFilter='blur(10px)'
          transition={variantChange}   
          w={isExpanded ? '15vw' : '5vw'}
        //   maxW='10vw'
          h='100vh'
          borderWidth= "0.15rem" // 테두리 두께 설정
          justifyContent="center"
          >
          <Button onClick={toggleExpand} position="absolute" right={0}>
            <FontAwesomeIcon icon={faArrowsAltH} />
          </Button>
          <Box mt="1rem">{title}</Box>
          <Text align="center" fontSize='medium' letterSpacing='3px' mb={2} mt={2}>
          Basic
          </Text>
          <Separator></Separator>
          <Flex mt={2} justify="center" align="center">
          <Stack direction='column' mb={5}>
          <HStack spacing={6}>
                <Button 
                w="3rem" h="3rem"
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
                {isExpanded && <Text ml={2}>Shortcuts</Text>}
            </HStack>
            <HStack spacing={6}>
            <Button 
            w="3rem" h="3rem"
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
            {isExpanded && <Text ml={2}>Basic Cursor</Text>}
            </HStack>
            <HStack spacing={6}>
            <Button 
            w="3rem" h="3rem"
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
            {isExpanded && <Text ml={2}>Move Cursor</Text>}
            </HStack>
        </Stack>
         </Flex>
         <Text align="center" fontSize='medium' letterSpacing='3px' mb={2} mt={2}>
          Labeling
          </Text>
          <Separator></Separator>
          <Flex mt={4} justify="center" align="center">
          <Stack direction='column' mb='40px'>
          <HStack spacing={6}>
            <Button 
            w="3rem" h="3rem"
            onClick={() => onToolClick('globalSegment')}
            backgroundColor="blue.500"
            _hover={{ 
                cursor: "pointer",
                backgroundColor: 'blue.100',
                transition: 'background-color 0.2s',
              }}
              // borderColor={selectedTool === 'globalSegment' ? "#00BFFE" : "blue.500"}
              borderColor={"blue.500"}
              borderWidth="0.2rem"
            
            >
                <IconBox>
                    <FontAwesomeIcon icon={faGlobe}/>
                </IconBox>
            </Button>
            {isExpanded && <Text ml={2}>Global Tool</Text>}
            </HStack>
            <HStack spacing={6}>
            <Button 
            w="3rem" h="3rem"
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
            {isExpanded && <Text ml={2}>OneClick Tool</Text>}
            </HStack>
            <HStack spacing={6}>
            <Button 
            w="3rem" h="3rem"
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
            {isExpanded && <Text ml={2}>Bbox Tool</Text>}
            </HStack>
            <HStack spacing={6}>
            <Button 
            w="3rem" h="3rem"
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
            {isExpanded && <Text ml={2}>Brush Tool</Text>}
            </HStack>
            <HStack spacing={6}>
            <Button 
            w="3rem" h="3rem"
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
            {isExpanded && <Text ml={2}>Lasso Tool</Text>}
            </HStack>

            {/* fix ball */}
            <HStack spacing={6}>
            <Button 
            w="3rem" h="3rem"
            onClick={() => {
              // onToolClick('fixBall');
              setFixBallDropdownVisible(!fixBallDropdownVisible);
            }}
            backgroundColor="blue.500"
            _hover={{ 
                cursor: "pointer",
                backgroundColor: 'blue.100',
                transition: 'background-color 0.2s',
              }}
              borderColor={selectedTool && ['fixBallS', 'fixBallM', 'fixBallL', 'fixBallX'].includes(selectedTool) ? "#00BFFE" : "blue.500"}
              borderWidth="0.2rem"
            >
                <IconBox>
                    <FontAwesomeIcon icon={faCircle}/>
                </IconBox>
            </Button>
            {isExpanded && <Text ml={2}>Fix Ball</Text>}
            {fixBallDropdownVisible && (
              <HStack
                position="absolute"
                left={isExpanded ? '95%' : '85%'} // 이 부분은 툴바의 너비에 따라 조정이 필요할 수 있습니다.
                spacing={2}
                align="center"
                bg="rgba(50, 50, 50, 1)"
                boxShadow="xl"
                p={2}
                borderRadius="0.5rem"
                _before={{
                  content: '""',
                  position: 'absolute',
                  top: '50%',
                  left: 0,
                  transform: 'translate(-100%, -50%)',
                  width: 0,
                  height: 0,
                  borderStyle: 'solid',
                  borderWidth: '10px 10px 10px 0',
                  borderColor: 'transparent rgba(50, 50, 50, 1) transparent transparent',
                }}
              >
                {FIX_BALL_SIZES.map((size) => (
                  <Button
                    key={size}
                    variant={selectedFixBallSize === size ? 'solid' : 'outline'}
                    onClick={() => {
                      onToolClick('fixBall'+size);
                      setSelectedFixBallSize(size);
                      setFixBallDropdownVisible(!fixBallDropdownVisible);
                    }}
                    backgroundColor="blue.500"
                    _hover={{ 
                        cursor: "pointer",
                        backgroundColor: 'blue.100',
                        transition: 'background-color 0.2s',
                      }}
                      borderColor={selectedTool === 'fixBall'+size ? "#00BFFE" : "blue.500"}
                      borderWidth="0.2rem"
                  >
                    <IconBox>
                        <FontAwesomeIcon icon={faCircle} size={iconSizeMapping[size] as any}/>
                    </IconBox>
                    {/* size에 따라 다른 크기의 faCircle 아이콘을 넣어줘야 합니다. */}
                    {/* {size.toUpperCase()} */}
                  </Button>
                ))}
              </HStack>
            )}
            </HStack>
            </Stack>
         </Flex>
         
         <Text align="center" fontSize='medium' letterSpacing='3px' mb={4} mt={4}>
          Manage
          </Text>
          <Separator></Separator>
          <Flex mt={4} justify="center" align="center">
          <Stack direction='column' mb='40px'>
          <HStack spacing={6}>
            <Button 
            w="3rem" h="3rem"
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
            {isExpanded && <Text ml={2}>Project Detail</Text>}
            </HStack>
            </Stack>
         </Flex>
        <Flex justify="center" align="center" p="2">
        </Flex>
        </Box>
      </Box>
  );
}

export default Toolbar;