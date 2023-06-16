import React from "react";
import {
    HStack,
    Button,
    Flex,
    Td,
    Text,
    Tr,
    useColorModeValue,
  } from "@chakra-ui/react";


  // Define a type for props
  interface TablesTableRowProps {
    setShowUDButtons : React.Dispatch<React.SetStateAction<boolean>>;
    showUDButtons : boolean;
    setSelectedDatasetId : React.Dispatch<React.SetStateAction<number>>;
    selectedDatasetId : number;
    setDetailViewActive: React.Dispatch<React.SetStateAction<boolean>>;
    dataset_id:number;
    dataset_name: string;
    dataset_type: number;
    dataset_count: number;
    created : string;
    lastItem: boolean;
  }
  
  const TablesTableRow: React.FC<TablesTableRowProps> = ({
    dataset_id,
    dataset_name,
    dataset_type,
    dataset_count,
    created,
    lastItem,
    setDetailViewActive,
    setSelectedDatasetId,
    selectedDatasetId,
    setShowUDButtons,
    showUDButtons
  }) => {
    const textColor = useColorModeValue("gray.700", "white");
    const bgStatus = useColorModeValue("gray.400", "#1a202c");
    const colorStatus = useColorModeValue("white", "gray.400");

    return (
    <Tr 
    _hover={{ 
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      transition: 'background-color 0.2s',
    }}
    onClick={() => {
      setSelectedDatasetId(dataset_id);
      setShowUDButtons(!showUDButtons);
      }}
    >
      <Td
        minWidth={{ sm: "250px" }}
        ps='0px'
        border={lastItem ? "none" : undefined}
        borderBottomColor='#56577A'>
        <Flex align='center' py='.8rem' minWidth='100%' flexWrap='nowrap'>
          <Flex direction='column'>
            <HStack>
            <Text
              fontSize='sm'
              color='#fff'
              fontWeight='normal'
              >
              {dataset_name}
            </Text>
            {showUDButtons && dataset_id === selectedDatasetId && (
              <Flex>
                <Button colorScheme="blue" mr={3}>Update</Button>
                <Button colorScheme="red">Delete</Button>
              </Flex>
            )}
            </HStack>
          </Flex>
        </Flex>
      </Td>

      <Td
        border={lastItem ? "none" : undefined}
        borderBottomColor='#56577A'
        minW='150px'>
        <Flex direction='column'>
          <Text fontSize='sm' color='#fff' fontWeight='normal'>
            {dataset_type}
          </Text>
          {/* <Text fontSize='sm' color='gray.400' fontWeight='normal'>
            {subdomain}
          </Text> */}
        </Flex>
      </Td>
      <Td border={lastItem ? "none" : undefined} borderBottomColor='#56577A'>
        <Text fontSize='sm' color='#fff' fontWeight='normal'>
            {dataset_count}
        </Text>
      </Td>
      <Td border={lastItem ? "none" : undefined} borderBottomColor='#56577A'>
        <Text fontSize='sm' color='#fff' fontWeight='normal'>
          {created}
        </Text>
      </Td>
      <Td border={lastItem ? "none" : undefined} borderBottomColor='#56577A'>
        <Button p='0px' backgroundColor='blue.700' 
        _hover={{ 
          backgroundColor: 'rgba(0, 0, 255, 0.3)',
          transition: 'background-color 0.2s',
        }}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedDatasetId(dataset_id);
          setDetailViewActive(true);
          }}>
          <Text
            fontSize='sm'
            color='white'
            fontWeight='bold'
            cursor='pointer'>
            Show More
          </Text>
        </Button>
      </Td>
    </Tr>
    );
  }

  export default TablesTableRow;