import React from "react";

// Chakra imports
import {
  Flex,
  Table,
  Tbody,
  Icon,
  Text,
  Th,
  Thead,
  Tr,
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
  setDetailViewActive: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedDatasetId : React.Dispatch<React.SetStateAction<number>>;
}

const DatasetTableRow: React.FC<DatasetTableRowProps> = ({
  datasetData, 
  setDetailViewActive,
  setSelectedDatasetId
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
                  setSelectedDatasetId = {setSelectedDatasetId}
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