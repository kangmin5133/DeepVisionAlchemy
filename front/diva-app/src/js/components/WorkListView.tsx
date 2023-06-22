import React from "react";
import Card from "../components/Card/Card";
import CardBody from "../components/Card/CardBody";
import CardHeader from "../components/Card/CardHeader"
import DashboardTableRow from "../components/Table/DashboardTableRow"
import {dashboardTableData} from "../states/testval" // will replaced by server API data 
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

interface WorkListViewProps {
    colorMode : string;
    cardDarkColor : string;
    cardLightColor : string;    
}

interface WorkSpace {
  workspace_id : number;
  org_id? : number;
  creator_id : number; 
  workspace_type_id : number;
  workspace_name : string;
  workspace_info : string;
  invitation_link : string;
  created : string;
}

interface WorkListProps {
  WorkListViewProps : WorkListViewProps;
  workspaceData : WorkSpace[];
  setShowUDButtons : React.Dispatch<React.SetStateAction<boolean>>;
  showUDButtons : boolean;
  setSelectedWorkspaceId : React.Dispatch<React.SetStateAction<number>>;
  selectedWorkspaceId : number;
}

export const WorkListView : React.FC<WorkListProps> = ({
  WorkListViewProps,
   workspaceData,
   setShowUDButtons,
   showUDButtons,
   setSelectedWorkspaceId,
   selectedWorkspaceId   
  }) => {

    return (
        <Card 
            p='16px' 
            overflowX={{ sm: 'scroll', xl: 'hidden' }} 
            bg={WorkListViewProps.colorMode === "dark" ? WorkListViewProps.cardDarkColor : WorkListViewProps.cardLightColor}>
              <CardHeader p='12px 0px 28px 0px'>
                <Flex direction='column'>
                  <Text fontSize='lg' color='#fff' fontWeight='bold' pb='8px' align='left'>
                    Workspace List
                  </Text>
                </Flex>
              </CardHeader>
              <Table variant='simple' color='#fff'>
                <Thead>
                  <Tr my='.8rem' ps='0px'>
                    <Th
                      ps='0px'
                      color='gray.400'
                      fontFamily='Plus Jakarta Display'
                      borderBottomColor='#56577A'>
                      Name
                    </Th>
                    <Th color='gray.400' fontFamily='Plus Jakarta Display' borderBottomColor='#56577A'>
                      Members
                    </Th>
                    <Th color='gray.400' fontFamily='Plus Jakarta Display' borderBottomColor='#56577A'>
                      Type
                    </Th>
                    <Th color='gray.400' fontFamily='Plus Jakarta Display' borderBottomColor='#56577A'>
                      Info
                    </Th>
                    <Th color='gray.400' fontFamily='Plus Jakarta Display' borderBottomColor='#56577A'>
                      Created
                    </Th>
                    <Th color='gray.400' fontFamily='Plus Jakarta Display' borderBottomColor='#56577A'>
                      Detail
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {/* dashboardTableData -> workspaceData 로 바꿔야함 */}
                  {workspaceData.map((row, index, arr) => {
                    return (
                      <DashboardTableRow
                        selectedWorkspaceId = {selectedWorkspaceId}
                        setSelectedWorkspaceId = {setSelectedWorkspaceId}
                        setShowUDButtons = {setShowUDButtons}
                        showUDButtons = {showUDButtons}
                        workspace_id = {row.workspace_id}
                        workspace_name={row.workspace_name}
                        workspace_type_id={row.workspace_type_id}
                        workspace_info={row.workspace_info}
                        created={row.created}
                        lastItem={index === arr.length - 1 ? true : false}
                      />
                    );
                  })}
                </Tbody>
              </Table>
            </Card>
    )
};

export default WorkListView;