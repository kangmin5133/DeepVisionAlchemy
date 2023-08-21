import React from "react";
import Card from "../components/Card/Card";
import CardBody from "../components/Card/CardBody";
import CardHeader from "../components/Card/CardHeader"
import TimelineRow from "../components/Table/TimelineRow"
import {timelineData} from "../states/testval" // will replaced by server API data 
import {
    Box,
    Flex,
    useColorMode,
    Spacer,
    Text,
    Table,
    Thead,
    Tr,
    Th,
    Tbody,
    Icon
  } from "@chakra-ui/react";

interface WorkHistoryViewProps {
    colorMode ?: string;
    cardDarkColor ?: string;
    cardLightColor ?: string;    
}

export const WorkHistoryView : React.FC<WorkHistoryViewProps> = ({colorMode,cardDarkColor,cardLightColor}) => {

    return (
      <Card 
      // bg={colorMode === "dark" ? cardDarkColor : cardLightColor}
      >
        <CardHeader mb='32px'>
          <Flex direction='column'>
            <Text fontSize='lg' color='#fff' fontWeight='bold' mb='6px' align='left'>
              Worknig History Overview
            </Text>
          </Flex>
        </CardHeader>
        <CardBody>
          <Flex direction='column' lineHeight='21px'>
            {timelineData.map((row, index, arr) => {
              return (
                <TimelineRow
                  title={row.title}
                  date={row.date}
                  color={row.color}
                  index={index}
                  arrLength={arr.length}
                />
              );
            })}
          </Flex>
        </CardBody>
      </Card>
    )
};

export default WorkHistoryView;