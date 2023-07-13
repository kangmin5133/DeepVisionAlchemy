import React from "react";

// Chakra imports
import {
  Flex,
  Table,
  Tbody,
  Button,
  Text,
  Th,
  Thead,
  Tr,
  HStack
} from "@chakra-ui/react";

// Custom components
import Card from "../Card/Card";
import CardHeader from "../Card/CardHeader";
import CardBody from "../Card/CardBody";
import ProjectTableRow from "./ProjectTableRow";

interface ProjectData {
  project_id : number;
  org_id : number | null;
  creator_id : number; 
  project_name : string ;
  project_desc : string | null;
  created : string;
}

interface ProjectTableProps {
  projectData : ProjectData[];
  showUDButtons : boolean;
  setDetailViewActive: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedProjectId : React.Dispatch<React.SetStateAction<number>>;
  selectedProjectId : number;
  setShowUDButtons : React.Dispatch<React.SetStateAction<boolean>>;
}

const ProjectTable: React.FC<ProjectTableProps> = ({
  projectData, 
  setDetailViewActive,
  setSelectedProjectId,
  selectedProjectId,
  setShowUDButtons,
  showUDButtons
}) => { 
  
  return (
      <Card overflowX={{ sm: "scroll", xl: "hidden" }} pb='0px'>
      <CardHeader p='6px 0px 22px 0px'>
        <Text fontSize='lg' color='#fff' fontWeight='bold'>
          Dataset List
        </Text>
      </CardHeader>
      <CardBody>
        <Table variant='simple' color='#fff'>
          <Thead>
            <Tr my='.8rem' ps='0px' color='gray.400'>
              <Th
                ps='0px'
                color='gray.400'
                fontFamily='Plus Jakarta Display'
                borderBottomColor='#56577A'>
                Dataset Name
              </Th>
              <Th
                color='gray.400'
                fontFamily='Plus Jakarta Display'
                borderBottomColor='#56577A'>
                Type
              </Th>
              <Th
                color='gray.400'
                fontFamily='Plus Jakarta Display'
                borderBottomColor='#56577A'>
                Count
              </Th>
              <Th
                color='gray.400'
                fontFamily='Plus Jakarta Display'
                borderBottomColor='#56577A'>
                Created
              </Th>
              <Th borderBottomColor='#56577A'></Th>
            </Tr>
          </Thead>
          <Tbody>
            {projectData.map((row, index, arr) => {
              return (
                <ProjectTableRow
                  showUDButtons = {showUDButtons}
                  setShowUDButtons = {setShowUDButtons}
                  setSelectedProjectId = {setSelectedProjectId}
                  selectedProjectId = {selectedProjectId}
                  setDetailViewActive = {setDetailViewActive}
                  project_id ={row.project_id}
                  project_name={row.project_name}
                  created={row.created}
                  lastItem={index === arr.length - 1 ? true : false}
                />
              );
            })}
          </Tbody>
        </Table>
      </CardBody>
    </Card>
  );
}

export default ProjectTable;