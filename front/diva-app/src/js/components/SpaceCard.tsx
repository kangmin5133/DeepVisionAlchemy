import React from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Heading,
    useColorMode,
    Grid,
      Button,
      CircularProgress,
      CircularProgressLabel,
      Flex,
      Icon,
      Progress,
      SimpleGrid,
      Spacer,
      Stack,
      Stat,
      StatHelpText,
      StatLabel,
      StatNumber,
      Table,
      Tbody,
      Text,
      Th,
      Thead,
      Tr
  } from '@chakra-ui/react';
import Card from "../components/Card/Card";
import CardBody from "../components/Card/CardBody";
import CardHeader from "../components/Card/CardHeader"

import bgCardImg from '../../assets/back-ground-image.png';
import { BsArrowRight } from 'react-icons/bs';

interface SpaceCardProps {
    header: string;
    description : string;
    target : string;
  }
  
const SpaceCard: React.FC<SpaceCardProps> = ({ header,description,target }) => {
    const navigate = useNavigate();
    const urlTarget = target
    const parts = urlTarget.split("/");
    const lastPart = parts[parts.length - 1]; // "z"
    return(
        <Card
        p='0px'
        gridArea={{ md: '1 / 1 / 2 / 3', '2xl': 'auto' }}
        bgImage={bgCardImg}
        bgSize='cover'
        bgPosition='50%'
        cursor="pointer"
        onClick={() => navigate(urlTarget)}
        >
        <CardBody w='100%' h='100%'>
            <Flex flexDirection={{ sm: 'column', lg: 'row' }} w='100%' h='100%'>
            <Flex flexDirection='column' h='100%' p='22px' minW='60%' lineHeight='1.6'>
                <Text fontSize='50px' color='#fff' fontWeight='bold'>
                {header}
                </Text>
                <Text fontSize='20px' color='gray.400' fontWeight='normal' mb='auto'>
                {description}
                </Text>
                <Spacer />
                <Flex align='center'>
                <Button
                    p='0px'
                    variant='no-hover'
                    bg='transparent'
                    my={{ sm: '1.5rem', lg: '0px' }}>
                    <Text
                    fontSize='sm'
                    color='#fff'
                    fontWeight='bold'
                    cursor='pointer'
                    transition='all .3s ease'
                    my={{ sm: '1.5rem', lg: '0px' }}
                    _hover={{ me: '4px' }}
                    onClick={() => navigate(urlTarget)}>
                    </Text>
                </Button>
                </Flex>
            </Flex>
            </Flex>
        </CardBody>
        </Card>
    )
};
export default SpaceCard;