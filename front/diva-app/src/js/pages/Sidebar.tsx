import React, { ReactNode, useState, useRef, useEffect  } from "react";
import { HamburgerIcon } from "@chakra-ui/icons";
// chakra imports
import {
  Box,
  Flex,
  Link,
  Stack,
  Text,
  Switch,
  Spacer,
  useColorMode,
} from "@chakra-ui/react";
import IconBox from "../components/IconBox";
import { Link as RouterLink, useLocation } from 'react-router-dom';
import Separator from "../components/Separator";
import PropTypes from "prop-types";


interface SidebarProps {
  isVisible : boolean;
}

const Sidebar: React.FC<SidebarProps> =  ({ isVisible }) => {
  const { colorMode, toggleColorMode } = useColorMode();

  let variantChange = "0.2s linear";
  const [sidebarBg, setSidebarBg] = useState(
    "linear-gradient(127.09deg, rgba(6, 11, 40, 0.94) 19.41%, rgba(10, 14, 35, 0.49) 76.65%)"
  );
    // "black";
  let sidebarRadius = "16px";
  let sidebarMargins = "16px 0px 16px 16px";

  const brand = (
    <Box pt={"25px"} mb='12px'>
      <Link
        href={`${process.env.PUBLIC_URL}/#/`}
        target='_blank'
        display='flex'
        lineHeight='100%'
        mb='30px'
        fontWeight='bold'
        justifyContent='center'
        alignItems='center'
        fontSize='24px'
        >
        <Box
          bg='linear-gradient(97.89deg, #FFFFFF 70.67%, rgba(117, 122, 140, 0) 108.55%)'
          bgClip='text'>
          <Text fontSize='xl' letterSpacing='3px' mt='3px' color={colorMode === "dark" ? "transparent" : "black"}>
            {/* {logoText} */}
            Deep Vision Alchemy
          </Text>
        </Box>
      </Link>
      <Separator></Separator>
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

  const LinkItem = ({to, children}: {to: string, children: string}) => {
    const location = useLocation();
    return (
      <Box as="li" textAlign="center">
        <Link 
          as={RouterLink} 
          to={to}
          fontWeight="bold"
          p={2}
          borderRadius="md"
          bg={location.pathname === to ? 'gray.700' : ''}
          _hover={{ bg: 'gray.900' }}
        >
          {children}
        </Link>
      </Box>
    );
  };

  return (
    <Box>
      <Box 
      display="flex" 
      position='fixed'
      marginTop="60px"
      left={isVisible ? 0 : '-280px'}
      transition="all 0.5s ease-in-out" 
      >
        <Box
          bg={sidebarBg}
          backdropFilter='blur(10px)'
          transition={variantChange}   
          w='260px'
          maxW='260px'
          ms={{
            sm: "16px",
          }}
          my={{
            sm: "16px",
          }}
          h='calc(100vh - 100px)'
          ps='20px'
          pe='20px'
          m={sidebarMargins}
          borderRadius={sidebarRadius}>
          <Box>{brand}</Box>
          <Stack direction='column' mb='40px'>
            {/* Links */}
            <LinkItem to="/dashboard" children="Dashboard" />
            <LinkItem to="/dashboard/workspace" children="Workspace" />

          </Stack>
          <Box height="60vh"/> 
        <Flex justify="center" align="center" p="2">
          <Text mr={2}>{colorMode === "light" ? "Light" : "Dark"}</Text>
          <Switch colorScheme="teal" size="md" isChecked={colorMode === "dark"} onChange={toggleColorMode} />
        </Flex>
        </Box>
      </Box>
    </Box>
  );
}

export default Sidebar;