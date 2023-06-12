import React,{useState,} from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Center,
  Heading,
  Image,
  Text,
  Flex,
  SimpleGrid,
  Spacer,
  Circle,
  useDisclosure, 
  Button, 
  Modal, 
  ModalOverlay, 
  ModalContent,
  ModalHeader, 
  ModalCloseButton, 
  ModalBody, 
  ModalFooter, 
  FormControl,
  FormLabel, 
  Input,
  VStack
} from "@chakra-ui/react";
import logo from '../../assets/DIVA_logo_white.png';
import Breadcrumbs from "../components/Breadcrumbs";
import bgImage from "../../assets/alchemistic.png";
import SpaceCard from "../components/SpaceCard";
import { FaPlus } from "react-icons/fa";

import Card from "../components/Card/Card";
import CardHeader from "../components/Card/CardHeader";
import CardBody from "../components/Card/CardBody";

import S3logo from "../../assets/Amazon-S3-Logo.png";
import GCSlogo from "../../assets/Google_Storage-Logo.png";
import uploadlogo from "../../assets/Upload-Icon.png";

const Dataset: React.FC = () => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure()

  
  const [selectedBox, setSelectedBox] = useState<string | null>(null);

  const handleClick = (boxName: string) => {
    setSelectedBox(boxName);
  };

  return (
    <Box p={8} pl={["8", "300px"]} pt="60px"  height="100vh"
    backgroundImage={bgImage}
    backgroundPosition="center"
    backgroundSize="cover">
      <Breadcrumbs />
      {/* add dataset */}
      <Card
        backgroundRepeat='no-repeat'
        bgSize='cover'
        bgPosition='10%'
        p='16px'
        w="50%"
        borderStyle="dashed"
        borderWidth="2px"
        borderColor="gray.400"
        onClick={onOpen}
        cursor="pointer"
        >
        <CardBody h='100%' w='100%'>
          <Flex
            direction='column'
            color='white'
            h='100%'
            p='0px 10px 20px 10px'
            w='100%'
            justifyContent="center"
            align="center">
              <Circle size="50px" bg="gray.400" color="white" onClick={onOpen}>
                <FaPlus size="24px" />
              </Circle>
              <Text mt="10px" fontSize="lg" color="white">
                Add Dataset
              </Text>
          </Flex>
            </CardBody>
            <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Add a new dataset</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
              <SimpleGrid columns={3} spacing={10}>
                <VStack>
                <Box
                  w="100%"
                  h="100px"
                  bg="gray.200"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexDirection="column"
                  onClick={() => handleClick("Amazon S3")}
                  cursor="pointer"
                  border={selectedBox === 'Amazon S3' ? "2px solid blue" : "none"}
                  borderRadius="18px"
                >
                  <Image src={S3logo} objectFit="contain" maxWidth="90%" maxHeight="90%" />
                </Box>
                <Text>Amazon S3</Text>
                </VStack>
                <VStack>
                <Box
                  w="100%"
                  h="100px"
                  bg="gray.200"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexDirection="column"
                  onClick={() => handleClick("Google Cloud Storage")}
                  cursor="pointer"
                  border={selectedBox === 'Google Cloud Storage' ? "2px solid blue" : "none"}
                  borderRadius="18px"
                >
                  <Image src={GCSlogo} objectFit="contain" maxWidth="90%" maxHeight="90%" />
                  {/* <Text mt="2">Google Cloud Storage</Text> */}
                </Box>
                <Text>Google Cloud Storage</Text>
                </VStack>
                <VStack>
                <Box
                  w="100%"
                  h="100px"
                  bg="gray.200"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexDirection="column"
                  onClick={() =>  handleClick("Local upload")}
                  cursor="pointer"
                  border={selectedBox === 'Local upload' ? "2px solid blue" : "none"}
                  borderRadius="18px"
                >
                  <Image src={uploadlogo} objectFit="contain" maxWidth="90%" maxHeight="90%"/>
                  {/* <Text mt="2">Local upload</Text> */}
                </Box>
                <Text>Local upload</Text>
                </VStack>
              </SimpleGrid>
                <FormControl >
                  <FormLabel>Name</FormLabel>
                  <Input mb="2px" placeholder="Dataset name" />
                  <FormLabel>Description</FormLabel>
                  <Input mb="2px" placeholder="Dataset Description" />
                </FormControl>
                

                {/* Add more form controls as needed */}
              </ModalBody>

              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={onClose}>
                  Save
                </Button>
                <Button onClick={onClose}>Cancel</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          </Card>
    </Box>
  );
}

export default Dataset;