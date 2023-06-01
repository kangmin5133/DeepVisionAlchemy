import {
    Avatar,
    AvatarGroup,
    Flex,
    Icon,
    Progress,
    Td,
    Text,
    Tr,
    useColorModeValue,
  } from "@chakra-ui/react";
  import React from "react";
  
  interface DashboardTableRowProps {
    name: string;
    members: string[];
    budget: string;
    progression: number;
    lastItem: boolean;
  }
  
  const DashboardTableRow: React.FC<DashboardTableRowProps> = ({ name, members, budget, progression, lastItem }) => {
    const textColor = useColorModeValue("gray.700", "white");
    return (
      <Tr>
        <Td
          minWidth={{ sm: "250px" }}
          ps='0px'
          borderBottomColor='#56577A'
          border={lastItem ? "none" : "0px"}>
          <Flex align='center' py='.8rem' minWidth='100%' flexWrap='nowrap'>
            <Text fontSize='sm' color='#fff' fontWeight='normal' minWidth='100%'>
              {name}
            </Text>
          </Flex>
        </Td>
  
        <Td borderBottomColor='#56577A' border={lastItem ? "none" : "0px"}>
          <AvatarGroup size='xs'>
            {members.map((member) => {
              return (
                <Avatar
                  name='Ryan Florence'
                  src={member}
                  showBorder={false}
                  border='none'
                  _hover={{ zIndex: "3", cursor: "pointer" }}
                />
              );
            })}
          </AvatarGroup>
        </Td>
        <Td borderBottomColor='#56577A' border={lastItem ? "none" : "0px"}>
          <Text fontSize='sm' color='#fff' fontWeight='bold' pb='.5rem'>
            {budget}
          </Text>
        </Td>
        <Td borderBottomColor='#56577A' border={lastItem ? "none" : "0px"}>
          <Flex direction='column'>
            <Text
              fontSize='sm'
              color='#fff'
              fontWeight='bold'
              pb='.2rem'>{`${progression}%`}</Text>
            <Progress
              colorScheme='brand'
              h='3px'
              bg='#2D2E5F'
              value={progression}
              borderRadius='30px'
            />
          </Flex>
        </Td>
      </Tr>
    );
  }
  
  export default DashboardTableRow;