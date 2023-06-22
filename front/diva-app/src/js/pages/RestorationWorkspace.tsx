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
import bgCardImg from '../../assets/back-ground-image.png';

interface WorkspaceProps {
  sideBarVisible : boolean;
}

const RestorationWorkspace: React.FC<WorkspaceProps> = ({sideBarVisible}) => {
  const paddingLeft = sideBarVisible ? '300px' : '8';
  const navigate = useNavigate();

  return (
    <Box p={8} pl={paddingLeft} transition="all 0.5s ease-in-out" pt="60px"  height="100vh"
    backgroundImage={bgImage}
    backgroundPosition="center"
    backgroundSize="cover">
      <Breadcrumbs />
      <SpaceCard header={"Project"} bgImage={bgCardImg} description={"create your new project!"} target="/dashboard/workspace/project"/>
    </Box>
  );
}

export default RestorationWorkspace;