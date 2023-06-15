import React from "react";
import {
    Avatar,
    Badge,
    Button,
    Flex,
    Td,
    Text,
    Tr,
    useColorModeValue,
  } from "@chakra-ui/react";


  // Define a type for props
  interface TablesTableRowProps {
    setSelectedDatasetId : React.Dispatch<React.SetStateAction<number>>;
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
    setSelectedDatasetId
  }) => {
    const textColor = useColorModeValue("gray.700", "white");
    const bgStatus = useColorModeValue("gray.400", "#1a202c");
    const colorStatus = useColorModeValue("white", "gray.400");

    return (
    <Tr>
      <Td
        minWidth={{ sm: "250px" }}
        ps='0px'
        border={lastItem ? "none" : undefined}
        borderBottomColor='#56577A'>
        <Flex align='center' py='.8rem' minWidth='100%' flexWrap='nowrap'>
          <Flex direction='column'>
            <Text
              fontSize='sm'
              color='#fff'
              fontWeight='normal'
              minWidth='100%'>
              {dataset_name}
            </Text>
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
        <Button p='0px' bg='transparent' variant='no-hover' 
        onClick={() => {
          setSelectedDatasetId(dataset_id);
          setDetailViewActive(true);
          }}>
          <Text
            fontSize='sm'
            color='gray.400'
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