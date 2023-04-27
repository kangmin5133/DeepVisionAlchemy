import React from "react";
// import Sidebar from "/js/Sidebar.js";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  IconButton,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import "../css/Home.css";

function Home() {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/predict");
  };
  return (
    <Box
    className="home" w="100%" h="100vh"
  >
    {/* 화면의 내용 */}
    <Center h="100%">
      <VStack spacing={8}>
        <Heading as="h1" size="3xl" color="white">
          Welcome to Minsu's AI Lab! 
        </Heading>
        <Text fontSize="2xl" color="white">
          This is a prototype application for latest Vision AI Tech. 
          <br />
          <br />
          Use the sidebar or 'Get Started' button to navigate to demo page and upload an image to free trial.
        </Text>
        <Flex>
          <Button colorScheme="blue" size="lg" onClick={handleClick}>
            Get Started✔
          </Button>
        </Flex>
      </VStack>
    </Center>
  </Box>
);
}


export default Home;