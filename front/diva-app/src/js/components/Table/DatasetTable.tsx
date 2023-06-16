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
import TablesTableRow from "./TablesTableRow";

interface DatasetData {
  dataset_id : number;
  org_id : number | null;
  creator_id : number; 
  dataset_name : string ;
  dataset_desc : string | null;
  dataset_type : number;
  dataset_count : number;
  dataset_prefix : string | null;
  created : string;
}

interface DatasetTableRowProps {
  datasetData : DatasetData[];
  showUDButtons : boolean;
  setDetailViewActive: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedDatasetId : React.Dispatch<React.SetStateAction<number>>;
  selectedDatasetId : number;
  setShowUDButtons : React.Dispatch<React.SetStateAction<boolean>>;
}

const DatasetTableRow: React.FC<DatasetTableRowProps> = ({
  datasetData, 
  setDetailViewActive,
  setSelectedDatasetId,
  selectedDatasetId,
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
            {datasetData.map((row, index, arr) => {
              return (
                <TablesTableRow
                  showUDButtons = {showUDButtons}
                  setShowUDButtons = {setShowUDButtons}
                  setSelectedDatasetId = {setSelectedDatasetId}
                  selectedDatasetId = {selectedDatasetId}
                  setDetailViewActive = {setDetailViewActive}
                  dataset_id ={row.dataset_id}
                  dataset_name={row.dataset_name}
                  dataset_type={row.dataset_type}
                  dataset_count={row.dataset_count}
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

export default DatasetTableRow;