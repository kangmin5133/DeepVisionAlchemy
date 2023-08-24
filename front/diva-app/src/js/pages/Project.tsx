import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Center,
  Heading,
  Image,
  VStack,
  useColorMode
} from "@chakra-ui/react";
import logo from '../../assets/DIVA_logo_white.png';
import Breadcrumbs from "../components/Breadcrumbs";
import bgImage from "../../assets/alchemistic.png";
import SpaceCard from "../components/SpaceCard";

interface ProjectProps {
  sideBarVisible : boolean;
}

const Project: React.FC<ProjectProps> = ({sideBarVisible}) => {
  const paddingLeft = sideBarVisible ? '300px' : '8';
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = "linear-gradient(127.09deg, rgba(5, 20, 40, 0.94) 19.41%, rgba(10, 25, 45, 0.49) 76.65%)";
  const cardDarkColor = "linear-gradient(127.09deg, rgba(6, 11, 40, 0.94) 19.41%, rgba(10, 14, 35, 0.49) 76.65%)";
  const cardLightColor = "linear-gradient(127.09deg, rgba(140, 140, 140, 0.94) 19.41%, rgba(200, 200, 200, 0.49) 76.65%)";

  return (
    <Box p={8} pl={paddingLeft} bg={colorMode === "dark" ? bgColor : "gray.100"} 
    transition="all 0.5s ease-in-out" pt="60px" overflow="hidden" height="100vh" minH="100vh"
    backgroundPosition="center"
    backgroundSize="cover"
    >
      
    </Box>
  );
}

export default Project;