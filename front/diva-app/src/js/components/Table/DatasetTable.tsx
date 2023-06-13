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

//test variable
import {tablesTableData} from "../../states/testval"

const DatasetTableRow: React.FC = () => {
    return (
        <Card overflowX={{ sm: "scroll", xl: "hidden" }} pb='0px' w="50%">
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
              {tablesTableData.map((row, index, arr) => {
                return (
                  <TablesTableRow
                    name={row.name}
                    logo={row.logo}
                    email={row.email}
                    subdomain={row.subdomain}
                    domain={row.domain}
                    status={row.status}
                    date={row.date}
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