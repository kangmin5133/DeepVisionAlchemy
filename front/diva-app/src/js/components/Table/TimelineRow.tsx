import { Box, Flex, Icon, Text, useColorModeValue } from "@chakra-ui/react";
import IconType from "@chakra-ui/icon";
import React from "react";

interface TimelineRowProps {
  title: string;
  date: string;
  color?: string;
  index: number;
  arrLength: number;
}

const TimelineRow: React.FC<TimelineRowProps> = ({ title, date, color, index, arrLength }) => {
  const textColor = useColorModeValue("gray.700", "white.300");
  const bgIconColor = useColorModeValue("white.300", "gray.700");

  const dir = typeof document !== 'undefined' ? document.documentElement.dir : '';

  return (
    <Flex alignItems='center' minH='78px' justifyContent='start' mb='5px'>
      <Flex direction='column' h='100%' align='center'>
        <Icon
          bg={bgIconColor}
          color={color}
          h={"20px"}
          w={"20px"}
          me='16px'
          right={dir === "rtl" ? "-8px" : ""}
          left={dir === "rtl" ? "" : "-8px"}
        />
      </Flex>
      <Flex direction='column' justifyContent='flex-start' h='100%'>
        <Text fontSize='sm' color='#fff' fontWeight='normal' mb='3px'>
          {title}
        </Text>
        <Text fontSize='sm' color='gray.400' fontWeight='normal'>
          {date}
        </Text>
      </Flex>
    </Flex>
  );
}

export default TimelineRow;