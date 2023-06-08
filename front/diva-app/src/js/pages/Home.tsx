import React from "react";
import logo from '../../assets/DIVA_logo_white.png';
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import bgImage from "../../assets/alchemistic.png";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/login");
  };
  
  return (
    <Box className="home" w="100%" h="100vh" backgroundColor="gray.700"
    backgroundImage={bgImage}
    backgroundPosition="center"
    backgroundSize="cover">
      <Center h="100%">
        <VStack spacing={8}>
          <Image src={logo} alt="Logo" boxSize="40%" />
          <Heading as="h1" size="3xl" color="white">
            Welcome to DIVA!
          </Heading>
          <Text fontSize="2xl" color="white" align="center">
            This is an application for Data Labeling using the latest Vision AI Tech.
            <br />
            <br />
            Click the 'Get Started' button to log in & sign up.
          </Text>
          <Flex>
            <Button colorScheme="blue" size="lg" onClick={handleClick}>
              Get Started ✔
            </Button>
          </Flex>
        </VStack>
      </Center>
    </Box>
  );
};

export default Home;