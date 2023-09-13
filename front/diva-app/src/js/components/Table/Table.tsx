import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { 
    Button,Flex,
    Table as ChakraTable,
    Thead, Tbody, Tr, Th, Td, Text,
    Menu, MenuButton, MenuList, MenuItem 
} from '@chakra-ui/react';

import Card from "../Card/Card";
import CardHeader from "../Card/CardHeader";
import CardBody from "../Card/CardBody";
import { Row } from 'antd';

interface Column {
  header: string;
  field: string;
  render?: (value: number) => JSX.Element | number | string; 
}

interface TableProps {
  title: string;
  columns: Column[];
  data: any[];
  handleRowClick: (row: any) => void;
}

const Table: React.FC<TableProps> = ({ 
    title, 
    columns, 
    data,
    handleRowClick 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const navigate = useNavigate();

  const onPageChange = (page: number) => {
    if ((page < 1) || (page > totalPages)) return;
    setCurrentPage(page);
  };

  const handleLaunch = (id: number) => {
    navigate(`/dashboard/workspace-labeling/project`, {
      state: { projectId: id }
    });
  };

  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const currentData = data.slice(startIdx, endIdx);
  return (
    <Card overflowX={{ sm: "scroll", xl: "hidden" }} pb='0px'>
      <CardHeader p='6px 0px 22px 0px'>
        <Text fontSize='lg' color='#fff' fontWeight='bold'>
          {title}
        </Text>
      </CardHeader>
      <CardBody>
        <ChakraTable variant="simple">
        <Thead>
            <Tr>
            {columns.map((col, index) => (
                <Th key={index}>{col.header}</Th>
            ))}
            </Tr>
        </Thead>
        <Tbody>
            {currentData.map((row, rowIndex) => (
            <Tr 
            key={rowIndex}
            _hover={{ 
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                transition: 'background-color 0.2s',
              }}
            onClick={(e) => {
                handleRowClick(row)
            }}
            cursor="pointer"
            >
                {columns.map((col, colIndex) => (
                  <Td key={colIndex}>{col.render ? col.render(row[col.field]) : row[col.field]}</Td>
                ))}
                <Td>
                    <Menu>
                    <MenuButton as={Button} variant="ghost" onClick={(e)=>{e.stopPropagation();}}>
                        •••
                    </MenuButton>
                    <MenuList>
                    {title === 'Projects' && (
                      <>
                        <MenuItem onClick={() => {/* Update 로직 */}}>Update</MenuItem>
                        <MenuItem onClick={() => {/* Update 로직 */}}>Delete</MenuItem>
                        <MenuItem onClick={() => handleLaunch(row.project_id)}>Launch</MenuItem>
                      </>
                    )}
                    {title === 'dataset' && (
                      <>
                        <MenuItem onClick={() => {/* Update 로직 */}}>Update</MenuItem>
                        <MenuItem onClick={() => {/* Update 로직 */}}>Delete</MenuItem>
                        <MenuItem onClick={() => {/* Update 로직 */}}>Go to Validation</MenuItem>
                      </>
                    )}
                    {title  === 'model' && (
                      <>
                        <MenuItem onClick={() => {/* Update 로직 */}}>Delete</MenuItem>
                        <MenuItem onClick={() => {/* Update 로직 */}}>Link project</MenuItem>
                      </>
                    )}
                    </MenuList>
                    </Menu>
                </Td>
            </Tr>
            ))}
        </Tbody>
        </ChakraTable>
        <Flex justify="center" align="center" mt={4}>
          <Button disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>◀</Button>
          {Array.from({ length: totalPages }, (_, idx) => (
            <Button
              key={idx}
              onClick={() => onPageChange(idx + 1)}
              colorScheme={idx + 1 === currentPage ? 'blue' : 'gray'}
            >
              {idx + 1}
            </Button>
          ))}
          <Button disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}>▶</Button>
        </Flex>
      </CardBody>
    </Card>
  );
};

export default Table;