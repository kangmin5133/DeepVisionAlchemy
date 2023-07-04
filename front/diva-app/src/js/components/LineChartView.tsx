import React from 'react';
import { Box, Card, CardHeader, Flex, Text } from '@chakra-ui/react';
import LineChart from './Chart/LineChart'; // Replace with your LineChart path

interface LineChartViewProps {
  header : string;
  lineChartData: any;
  lineChartOptions: any;
  bg: any;
}

const LineChartView: React.FC<LineChartViewProps> = ({ header, lineChartData, lineChartOptions, bg, ...rest }) => {
  return (
    <Card p='28px 0px 0px 0px'
    borderRadius="20px"
    bg = {bg}
    >
      <CardHeader mb='20px' ps='22px'>
        <Flex direction='column' alignSelf='flex-start'>
          <Text fontSize='lg' color='#fff' fontWeight='bold' mb='6px'>
            {header}
          </Text>
          <Text fontSize='md' fontWeight='medium' color='gray.400'>
            <Text as='span' color='green.400' fontWeight='bold'>(+5%) more</Text> in 2021
          </Text>
        </Flex>
      </CardHeader>
      <Box w='100%' minH={{ sm: '300px' }}>
        <LineChart lineChartData={lineChartData} lineChartOptions={lineChartOptions} />
      </Box>
    </Card>
  );
}

export default LineChartView;