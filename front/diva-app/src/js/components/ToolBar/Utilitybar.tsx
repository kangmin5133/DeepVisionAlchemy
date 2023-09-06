import React, { useState,useEffect } from 'react';
import { 
    Box,
    Button,
    HStack,
    Flex,
    Text,
    Table, 
    Thead, 
    Tbody, 
    Tr, 
    Th, 
    Td
} from "@chakra-ui/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';

interface UtilityBarProps {
    imageFiles: ImageFile[];
    onTableRowClick: (index: number) => void;
    selectedRowId : number;
    setSelectedRowId : React.Dispatch<React.SetStateAction<number>>;
}
  
interface ImageFile {
    id: number;
    file_name: string;
}

interface TableComponentProps {
    imageFiles: ImageFile[];
    currentPage: number;
    totalPages: number;
    isTableVisible: boolean;
    selectedRowId: number;
    setSelectedRowId : React.Dispatch<React.SetStateAction<number>>;
    onPageChange: (page: number) => void;
    onTableRowClick: (index: number) => void;
}

const TableComponent: React.FC<TableComponentProps> = ({ 
    imageFiles, 
    currentPage, 
    totalPages, 
    isTableVisible,
    selectedRowId,
    setSelectedRowId,
    onPageChange, 
    onTableRowClick 
    }) => {
    const itemsPerPage = 10;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const maxPageButtons = 5;
    const [pageStart, setPageStart] = useState(1);
    const [pageEnd, setPageEnd] = useState(Math.min(maxPageButtons, totalPages));


    const handleRowClick = (id: any, index: number) => {
        setSelectedRowId(id); // 행을 클릭하면 해당 행의 ID를 state에 저장
        onTableRowClick(startIndex + index);
    };
    const onPageClick = (page: number) => {
        onPageChange(page);
    };

    useEffect(() => {
        
        const indexOfRow = imageFiles.findIndex(file => file.id === selectedRowId);
        if (indexOfRow !== -1) {
            const newPage = Math.floor(indexOfRow / itemsPerPage) + 1;
            if (newPage !== currentPage) {
            onPageChange(newPage);
            }
        }
    }, [selectedRowId]);

    useEffect(() => {
        setPageEnd(Math.min(maxPageButtons, totalPages));
    }, [totalPages]);

    useEffect(() => {
        if (currentPage < 1 || currentPage > totalPages) {
            return;
        }
        if (currentPage > pageEnd) {
            setPageStart(currentPage);
            setPageEnd(Math.min(currentPage + maxPageButtons - 1, totalPages));
        } else if (currentPage < pageStart) {
            setPageStart(Math.max(1, currentPage - maxPageButtons + 1));
            setPageEnd(currentPage);
        }
    }, [currentPage]);
  
    return (
        <Box overflowY="auto">
        <Table mt={isTableVisible ? 0 : 2} variant="simple" size="sm">
            <Thead>
            <Tr borderBottom="2px solid white">
                <Th width="1rem" fontSize="xs" borderRight="1px solid white">Index</Th>
                <Th fontSize="xs" borderRight="1px solid white">Filename</Th>
                <Th fontSize="xs">Status</Th>
            </Tr>
            </Thead>
            <Tbody>
            {imageFiles.slice(startIndex, endIndex).map((file, index) => (
                <Tr 
                key={file.id} 
                onClick={() => handleRowClick(file.id, index)}
                bg={file.id === selectedRowId ? 'blue.700' : 'transparent'}
                _hover={{ 
                    cursor : "pointer",
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    transition: 'background-color 0.2s',
                  }}
                >
                <Td width="1rem" fontSize="xs" borderBottom="1px solid white" borderRight="1px solid white">{startIndex + index + 1}</Td>
                <Td fontSize="xs" borderBottom="1px solid white" borderRight="1px solid white">{file.file_name}</Td>
                <Td fontSize="xs" borderBottom="1px solid white">Not Done</Td>
                </Tr>
            ))}
            </Tbody>
        </Table>
        <Flex justify="center" align="center" mt={4} mb={4}>
            <Button size="xs" disabled={currentPage === 1} onClick={() => onPageClick(currentPage - 1)}>◀</Button>
            {Array.from({ length: pageEnd - pageStart + 1 }, (_, idx) => (
            <Button
                key={idx}
                size="xs"
                onClick={() => onPageClick(pageStart + idx)}
                colorScheme={pageStart + idx === currentPage ? 'blue' : 'gray'}
                variant={pageStart + idx === currentPage ? 'solid' : 'link'}
            >
                {pageStart + idx}
            </Button>
            ))}
            <Button size="xs" disabled={currentPage === totalPages} onClick={() => onPageClick(currentPage + 1)}>▶</Button>
        </Flex>
        </Box>
    );
};

const InstanceComponent: React.FC = () => {

    return (
        <>
        <Box p={100} />
        </>
    );
};

const InfoComponent: React.FC = () => {

    return (
        <>
        <Box p={100} />
        </>
    );
};

const HistoryComponent: React.FC = () => {

    return (
        <>
        <Box p={100} />
        </>
    );
};

const UtilityBar: React.FC<UtilityBarProps> = ({ imageFiles, onTableRowClick, selectedRowId, setSelectedRowId }) => {

    // states
    const [isTableVisible, setTableVisible] = useState(false);
    const [isInstanceVisible, setInstanceVisible] = useState(false);
    const [isInfoVisible, setInfoVisible] = useState(false);
    const [isHistoryVisible, setHistoryVisible] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const totalPages = Math.ceil(imageFiles.length / itemsPerPage);
    const currentDataList = imageFiles.slice(startIndex, endIndex);

    // components
    const renderTableSection = () => {
        return (
            <Box mb="1rem" overflowY="auto">
                <HStack>
                    <Text align="left" fontSize='xl' letterSpacing='3px' mt='3px'>
                        File List
                    </Text>
                    <Button variant="ghost" onClick={toggleTableVisibility}>
                        {isTableVisible ? 
                            <FontAwesomeIcon icon={faChevronUp} /> : 
                            <FontAwesomeIcon icon={faChevronDown} />
                        }
                    </Button>
                </HStack>
                <Box 
                    borderColor="black" 
                    borderWidth="0.1rem"
                    p={isTableVisible ? 0 : 2}
                    maxH={isTableVisible ? "700px" : "0px"}
                    transition="all 0.5s ease-in-out"
                    overflow="hidden"
                >
                    <TableComponent 
                        isTableVisible={isTableVisible}
                        imageFiles={imageFiles}
                        currentPage={currentPage}
                        selectedRowId={selectedRowId}
                        setSelectedRowId={setSelectedRowId}
                        totalPages={totalPages}
                        onPageChange={onPageChange}
                        onTableRowClick={onTableRowClick}
                    />
                </Box>
            </Box>
        );
    };

    const renderInstanceSection = () => {
        return (
            <Box mb="1rem">
                <HStack>
                    <Text align="left" fontSize='xl' letterSpacing='3px' mt='3px'>
                        Instances
                    </Text>
                    <Button variant="ghost" onClick={toggleInstanceVisibility}>
                        {isInstanceVisible ? 
                            <FontAwesomeIcon icon={faChevronUp} /> : 
                            <FontAwesomeIcon icon={faChevronDown} />
                        }
                    </Button>
                </HStack>
                <Box 
                    borderColor="black" 
                    borderWidth="0.1rem"
                    p={isInstanceVisible ? 0 : 2}
                    maxH={isInstanceVisible ? "500px" : "0px"}
                    transition="all 0.5s ease-in-out"
                    overflow="hidden"
                >
                   <InstanceComponent />
                </Box>
            </Box>
        );
    };

    const renderInfoSection = () => {
        return (
            <Box mb="1rem">
                <HStack>
                    <Text align="left" fontSize='xl' letterSpacing='3px' mt='3px'>
                        Info
                    </Text>
                    <Button variant="ghost" onClick={toggleInfoVisibility}>
                        {isInfoVisible ? 
                            <FontAwesomeIcon icon={faChevronUp} /> : 
                            <FontAwesomeIcon icon={faChevronDown} />
                        }
                    </Button>
                </HStack>
                <Box 
                    borderColor="black" 
                    borderWidth="0.1rem"
                    p={isInfoVisible ? 0 : 2}
                    maxH={isInfoVisible ? "500px" : "0px"}
                    transition="all 0.5s ease-in-out"
                    overflow="hidden"
                >
                   <InfoComponent />
                </Box>
            </Box>
        );
    };

    const renderHistorySection = () => {
        return (
            <Box mb="1rem">
                <HStack>
                    <Text align="left" fontSize='xl' letterSpacing='3px' mt='3px'>
                        History
                    </Text>
                    <Button variant="ghost" onClick={toggleHistoryVisibility}>
                        {isHistoryVisible ? 
                            <FontAwesomeIcon icon={faChevronUp} /> : 
                            <FontAwesomeIcon icon={faChevronDown} />
                        }
                    </Button>
                </HStack>
                <Box 
                    borderColor="black" 
                    borderWidth="0.1rem"
                    p={isHistoryVisible ? 0 : 2}
                    maxH={isHistoryVisible ? "500px" : "0px"}
                    transition="all 0.5s ease-in-out"
                    overflow="hidden"
                >
                   <HistoryComponent />
                </Box>
            </Box>
        );
    };

    // handlers
    const handlePageClick = (page: number) => {
        setCurrentPage(page);
    };

    const onPageChange = (page: number) => {
        if ((page < 1) || (page > totalPages)) return;
        setCurrentPage(page);
    };

    const toggleTableVisibility = () => {
        setTableVisible(!isTableVisible);
    };

    const toggleInstanceVisibility = () => {
        setInstanceVisible(!isInstanceVisible);
    };

    const toggleInfoVisibility = () =>{
        setInfoVisible(!isInfoVisible)
    };

    const toggleHistoryVisibility = () =>{
        setHistoryVisible(!isHistoryVisible)
    };

    return (
        <Box
        bg="rgba(50, 50, 50, 1)"
        position="fixed"
        right={0}
        top="60px"
        width="25vw"
        height="100vh"
        zIndex={1}
        overflowY="auto"
        backdropFilter='blur(10px)'
        borderWidth= "0.15rem"
        paddingX="2rem"
        >
        {/* 이미지 파일 목록 또는 다른 유틸리티 컴포넌트 배치 */}
        {renderTableSection()}
        {renderInstanceSection()}
        {renderInfoSection()}
        {renderHistorySection()}
        <Button 
        position="sticky"
        top="85vh"
        bottom="10vh"
        width="100%"
        zIndex={2}
        bgColor="blue.700"
        _hover={{ 
            cursor : "pointer",
            backgroundColor: 'blue.500',
            transition: 'background-color 0.2s',
          }}
        >
        Save
        </Button>
        </Box>
    );
};

export default UtilityBar;
