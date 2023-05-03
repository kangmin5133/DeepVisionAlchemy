import React, { useState } from "react";
import {
    Box,
    VStack,
    Image,
    Heading,
    Text,
    Flex,
    Input,
    Textarea,
    SimpleGrid,
    FormLabel,
    Button,
    Alert,
    Stack
  } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useSampleImages } from "../hooks/useSampleImages";

const MotionBox = motion(Box);

const ImageSidebar = ({ 
    isOpen, 
    generateActive,
    sampleActive,
    onImageSelect }) => {
  const { sampleImages, selectedImage,handleImageSelect } = useSampleImages(sampleActive,onImageSelect);
  const [textPrompt, setTextPrompt] = useState("");
  const [manualSeed, setManualSeed] = useState("");
  const [inputError, setInputError] = useState(false);

  return (
      <MotionBox
        initial={{ x: "100%", opacity: 0 }}
        animate={isOpen ? { x: 0, opacity: 1 } : { x: "100%", opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        position="fixed"
        top={10}
        right={0}
        height="100%"
        width="500px"
        bg="gray.700"
        zIndex={10}
        overflow={isOpen ? "auto" : "hidden"}
      >
        <VStack spacing={4} overflowY="auto" p={4} alignItems="start">
        {sampleActive && (
          <Box>
            <Flex position="absolute" justifyContent="center" width="100%">
                <VStack>
                <Heading as="h1" size="xl" color="white" marginTop="5">
                    <Text>Select image you want</Text>
                </Heading>
                <Box height="5vh" />
                <SimpleGrid columns={3} spacing={4}>
                {sampleImages.map((image, index) => (
                 <Box
                    key={index}
                    borderWidth={selectedImage === image ? "2px" : "0px"}
                    borderColor="#3182ce"
                    cursor="pointer"
                    borderRadius="20px"
                    _hover={{
                    transform: "scale(1.1)",
                    transition: "transform 0.3s ease-in-out",
                    }}
                    onClick={() => handleImageSelect(image)}
                >
                    <Image
                    src={image.url}
                    alt={image.name}
                    boxSize="95px" // 이미지 크기를 조절
                    objectFit="cover" // 이미지를 적절하게 조절
                    borderRadius="20px"
                    />
                </Box>
                ))}
                </SimpleGrid>
                </VStack>
            </Flex>
          </Box>
        )}

        {generateActive && (
          <Box color="white">
            <Heading as="h1" size="xl" color="white" marginTop="5">
            <Flex position="absolute" justifyContent="center" width="100%">
            <Text>Generate image</Text>
            </Flex>
            </Heading>
            <Heading as="h1" size="xl" color="white" marginTop="5"></Heading>
            
            <Flex mb={4} alignItems="start" marginTop="30%">
                <FormLabel mr={2} height="100%">
                Prompt:
                </FormLabel>
                <Textarea
                placeholder="Text prompt input"
                value={textPrompt}
                onChange={(e) => setTextPrompt(e.target.value)}
                width="calc(500px * 0.8)"
                height="calc(500px * 0.3)"
                resize="none"
                />
            </Flex>
            <Flex mb={4} alignItems="start">
                <FormLabel mr={2} height="100%">
                Seed:
                </FormLabel>
                <Stack direction="column">
                <Input
                placeholder="Manual seed input"
                value={manualSeed}
                onChange={(e) => {
                    if (!/^[0-9]*$/.test(e.target.value)) {
                      setInputError(true);
                      return;
                    }
                    setInputError(false);
                    setManualSeed(e.target.value);
                  }}
                width="calc(500px * 0.8)"
                height="100%"
                left="5"
                />
                {inputError && (
                    <Alert status="error" left="5" bg="none" color="red.500" fontWeight="bold">
                      Please enter numbers only
                    </Alert>
                  )}
                  </Stack>
            </Flex>
            <Button
                mt={0}
                colorScheme="blue"
                onClick={() => {
                // 여기에 실행 버튼 클릭시 실행할 함수를 작성하세요
                console.log("Text Prompt:", textPrompt);
                console.log("Manual Seed:", manualSeed);
                }}
            >
                Generate!🚀
            </Button>
            </Box>
        )}
        </VStack>
      </MotionBox>

  );
};

export default ImageSidebar;