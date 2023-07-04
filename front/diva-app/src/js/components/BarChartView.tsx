import React from 'react';
import { Box, Card, CardBody, Flex, Text, Progress, SimpleGrid} from '@chakra-ui/react';
import IconBox from './Icon/IconBox'
import BarChart from './Chart/BarChart'; // Replace with your BarChart path

interface BarChartViewProps {
  header : string;
  barChartData: any;
  barChartOptions: any;
  bg : any;
}

const BarChartView: React.FC<BarChartViewProps> = ({ header, barChartData, barChartOptions, bg, ...rest }) => {
  return (
    <Card p='16px'
    borderRadius="20px"
    bg = {bg}
    >
      <CardBody>
        <Flex direction='column' w='100%'>
          <Box
            bg='linear-gradient(126.97deg, #060C29 28.26%, rgba(4, 12, 48, 0.5) 91.2%)'
            borderRadius='20px'
            display={{ sm: 'flex', md: 'block' }}
            // justify={{ sm: 'center', md: 'flex-start' }}
            // align={{ sm: 'center', md: 'flex-start' }}
            minH={{ sm: '180px', md: '220px' }}
            p={{ sm: '0px', md: '22px' }}>
            <BarChart barChartOptions={barChartOptions} barChartData={barChartData} />
          </Box>
          <Flex direction='column' mt='24px' mb='36px' alignSelf='flex-start'>
            <Text fontSize='lg' color='#fff' fontWeight='bold' mb='6px'>
              {header}
            </Text>
            <Text fontSize='md' fontWeight='medium' color='gray.400'>
              {/* <Text as='span' color='green.400' fontWeight='bold'>(+23%)</Text> than last week */}
            </Text>
          </Flex>
          {/* Other parts */}
          <SimpleGrid gap={{ sm: '12px' }} columns={4}>
            <Flex direction='column'>
                <Flex alignItems='center'>
                    <IconBox as={Box} h={'30px'} w={'30px'} bg='brand.200' me='6px'>
                        
                    </IconBox>
                    <Text fontSize='sm' color='gray.400'>
                        Users
                    </Text>
                </Flex>
                <Text
                    fontSize={{ sm: 'md', lg: 'lg' }}
                    color='#fff'
                    fontWeight='bold'
                    mb='6px'
                    my='6px'>
                    32,984
                </Text>
                <Progress colorScheme='brand' bg='#2D2E5F' borderRadius='30px' h='5px' value={20} />
            </Flex>
            <Flex direction='column'>
                <Flex alignItems='center'>
                    <IconBox as={Box} h={'30px'} w={'30px'} bg='brand.200' me='6px'>
                        
                    </IconBox>
                    <Text fontSize='sm' color='gray.400'>
                        Clicks
                    </Text>
                </Flex>
                <Text
                    fontSize={{ sm: 'md', lg: 'lg' }}
                    color='#fff'
                    fontWeight='bold'
                    mb='6px'
                    my='6px'>
                    2.42m
                </Text>
                <Progress colorScheme='brand' bg='#2D2E5F' borderRadius='30px' h='5px' value={90} />
            </Flex>
            <Flex direction='column'>
                <Flex alignItems='center'>
                    <IconBox as={Box} h={'30px'} w={'30px'} bg='brand.200' me='6px'>
                    </IconBox>
                    <Text fontSize='sm' color='gray.400'>
                        Sales
                    </Text>
                </Flex>
                <Text
                    fontSize={{ sm: 'md', lg: 'lg' }}
                    color='#fff'
                    fontWeight='bold'
                    mb='6px'
                    my='6px'>
                    2,400$
                </Text>
                <Progress colorScheme='brand' bg='#2D2E5F' borderRadius='30px' h='5px' value={30} />
            </Flex>
            <Flex direction='column'>
                <Flex alignItems='center'>
                    <IconBox as={Box} h={'30px'} w={'30px'} bg='brand.200' me='6px'>
                        
                    </IconBox>
                    <Text fontSize='sm' color='gray.400'>
                        Items
                    </Text>
                </Flex>
                <Text
                    fontSize={{ sm: 'md', lg: 'lg' }}
                    color='#fff'
                    fontWeight='bold'
                    mb='6px'
                    my='6px'>
                    320
                </Text>
                <Progress colorScheme='brand' bg='#2D2E5F' borderRadius='30px' h='5px' value={50} />
            </Flex>
        </SimpleGrid>
        </Flex>
      </CardBody>
    </Card>
  );
}

export default BarChartView;