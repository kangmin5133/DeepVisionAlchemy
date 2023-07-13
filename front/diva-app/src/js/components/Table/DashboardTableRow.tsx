import {
    Avatar,
    AvatarGroup,
    Flex,
    Icon,
    Button,
    Progress,
    Td,
    Text,
    Tr,
    useColorModeValue,
  } from "@chakra-ui/react";
  import React from "react";
  import { useNavigate } from "react-router-dom";
  
  interface DashboardTableRowProps {
    workspace_id : number;
    workspace_name: string;
    workspace_type_id: number;
    workspace_info: string;
    created: string;
    lastItem: boolean;
    setShowUDButtons : React.Dispatch<React.SetStateAction<boolean>>;
    showUDButtons : boolean;
    setSelectedWorkspaceId : React.Dispatch<React.SetStateAction<number>>;
    selectedWorkspaceId : number;
  }
  
  const DashboardTableRow: React.FC<DashboardTableRowProps> = ({
    workspace_name, workspace_id,workspace_type_id, workspace_info, created, lastItem,
    setShowUDButtons, showUDButtons, setSelectedWorkspaceId, selectedWorkspaceId
    }) => {
    const textColor = useColorModeValue("gray.700", "white");
    const navigate = useNavigate();

    //handler
    const goToWorkspaceBtnHandler =()=> {
      let pathName;
      if (workspace_type_id === 1){
        pathName = "labeling"
      }
      else if (workspace_type_id === 2){
        pathName = "generation"
      }
      else if (workspace_type_id === 3){
        pathName = "restoration"
      }
      navigate(`/dashboard/workspace-${pathName}?workspace_id=${workspace_id}`)
    }
    

    return (
      <Tr
      _hover={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        transition: 'background-color 0.2s',
      }}
      onClick={() => {
        setSelectedWorkspaceId(workspace_id);
        setShowUDButtons(!showUDButtons);
        }}
      >
        <Td
          minWidth={{ sm: "250px" }}
          ps='0px'
          borderBottomColor='#56577A'
          border={lastItem ? "none" : undefined}
          >
          <Flex align='center' py='.8rem'flexWrap='nowrap'>
            <Text fontSize='sm' color='#fff' fontWeight='normal'>
              {workspace_name}
            </Text>
            {showUDButtons && workspace_id === selectedWorkspaceId && (
              <Flex>
                <Button colorScheme="blue" mr={3}>Update</Button>
                <Button colorScheme="red">Delete</Button>
              </Flex>
            )}
          </Flex>
        </Td>
  
        <Td borderBottomColor='#56577A' border={lastItem ? "none" : undefined}>
          {/* <AvatarGroup size='xs'>
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
          </AvatarGroup> */}
        </Td>
        <Td borderBottomColor='#56577A' border={lastItem ? "none" : undefined}>
          <Text fontSize='sm' color='#fff' fontWeight='bold' pb='.5rem'>
            {workspace_type_id}
          </Text>
        </Td>
        <Td borderBottomColor='#56577A' border={lastItem ? "none" : undefined}>
          {/* <Flex direction='column'>
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
          </Flex> */}
          <Text fontSize='sm' color='#fff' fontWeight='bold' pb='.5rem'>
            {workspace_info}
          </Text>
        </Td>
        <Td borderBottomColor='#56577A' border={lastItem ? "none" : undefined}>
          <Text fontSize='sm' color='#fff' fontWeight='bold' pb='.5rem'>
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
          setSelectedWorkspaceId(workspace_id);
          goToWorkspaceBtnHandler();
          }}>
          <Text
            fontSize='sm'
            color='white'
            fontWeight='bold'
            cursor='pointer'
            >
            Go to workspace
          </Text>
        </Button>
      </Td>
      </Tr>
    );
  }
  
  export default DashboardTableRow;