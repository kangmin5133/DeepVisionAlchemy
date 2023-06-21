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
  workspace_info? : string;
  invitation_link : string;
  created : string;
}

interface WorkSpaceData {
  WorkListViewProps : WorkListViewProps;
  workspaceData : WorkSpace[];

}

export const WorkListView : React.FC<WorkSpaceData> = ({WorkListViewProps, workspaceData}) => {

    return (
        <Card 
            p='16px' 
            overflowX={{ sm: 'scroll', xl: 'hidden' }} 
            bg={WorkListViewProps.colorMode === "dark" ? WorkListViewProps.cardDarkColor : WorkListViewProps.cardLightColor}>
              <CardHeader p='12px 0px 28px 0px'>
                <Flex direction='column'>
                  <Text fontSize='lg' color='#fff' fontWeight='bold' pb='8px' align='left'>
                    Workspace
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
                      Project Num 
                    </Th>
                    <Th color='gray.400' fontFamily='Plus Jakarta Display' borderBottomColor='#56577A'>
                      Completion
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {/* dashboardTableData -> workspaceData 로 바꿔야함 */}
                  {dashboardTableData.map((row, index, arr) => {
                    return (
                      <DashboardTableRow
                        name={row.name}
                        members={row.members}
                        budget={row.budget}
                        progression={row.progression}
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