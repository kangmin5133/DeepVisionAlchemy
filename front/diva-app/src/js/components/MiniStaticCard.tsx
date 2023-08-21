import React from "react";
import {
  Box,
  Flex,
  Spacer,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText
} from "@chakra-ui/react";
import Card from "../components/Card/Card";
import CardBody from "../components/Card/CardBody";
import CardHeader from "../components/Card/CardHeader"

import IconBox from "./IconBox";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faSquare, 
  faHandPointer, 
  faPlus, 
  faMinus, 
  faEraser, 
  faExchangeAlt,
  faRandom,
  faGlobe 
} from "@fortawesome/free-solid-svg-icons";

interface MiniStaticCardProps {
  colorMode ?: string;
  cardDarkColor? : string;
  cardLightColor? : string;
  title: string;
  value: string | number;
  description : string;
}

const MiniStaticCard: React.FC<MiniStaticCardProps> = ({ colorMode,cardDarkColor,cardLightColor,title, value,description }) => {
  return (
    <Card 
    // bg={colorMode === "dark" ? cardDarkColor : cardLightColor}
    >
      <CardBody>
        <Flex flexDirection='row' align='center' justify='center' w='100%'>
          <Stat me='auto'>
            <StatLabel fontSize='xl' color='gray.400' fontWeight='bold' pb='2px'>
              {title}
            </StatLabel>
            <Flex>
              <StatNumber fontSize='lg' color='#fff'>
                {value}
              </StatNumber>
              <Box width="20px" /> 
              <StatHelpText
                alignSelf='flex-end'
                justifySelf='flex-end'
                m='0px'
                color='green.400'
                fontWeight='bold'
                ps='3px'
                fontSize='md'>
                {description}
              </StatHelpText>
            </Flex>
          </Stat>
          <IconBox h={'45px'} w={'45px'} bg='brand.200'>
           <FontAwesomeIcon icon={faSquare} />
					</IconBox>
        </Flex>
      </CardBody>
    </Card>
  );
}

export default MiniStaticCard;