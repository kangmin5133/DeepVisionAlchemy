import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Center,
  Heading,
  Image,
  VStack,
} from "@chakra-ui/react";
import logo from '../../assets/DIVA_logo_white.png';
import Breadcrumbs from "../components/Breadcrumbs";
import bgImage from "../../assets/alchemistic.png";
import SpaceCard from "../components/SpaceCard";

const Project: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Box p={8} pl={["8", "300px"]} pt="60px"  height="100vh"
    backgroundImage={bgImage}
    backgroundPosition="center"
    backgroundSize="cover">
      <Breadcrumbs />
    </Box>
  );
}

export default Project;