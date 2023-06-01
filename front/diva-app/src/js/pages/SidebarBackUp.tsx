// import React from 'react';
// import { 
//   Box, 
//   VStack, 
//   Link, 
//   Switch,
//   useColorMode } from '@chakra-ui/react';
// import { Link as RouterLink, useLocation } from 'react-router-dom';

// interface SidebarProps {
//   isVisible: boolean;
// }

// const Sidebar: React.FC<SidebarProps> = ({ isVisible }) => {
//   const location = useLocation();
//   const { colorMode, toggleColorMode } = useColorMode();

//   return (
//     <Box
//       as="nav"
//       aria-label="Main Navigation"
//       pos="fixed"
//       left={isVisible ? 0 : '-170px'}
//       top={0}
//       w="170px"
//       h="100%"
//       bg={colorMode === "dark" ? "gray.800" : "gray.100"}
//       color="white"
//       fontSize="1.5rem"
//       zIndex={999}
//       boxShadow="xl"
//       marginTop ="50px"
//       transition="all 0.5s ease-in-out"
//     >
//       <VStack
//         as="ul"
//         listStyleType="none"
//         px="0"
//         py="20px"
//         mt="30px"
//         spacing={10}
//       >
//         <Box as="li" textAlign="center">
//           <Link 
//             as={RouterLink} 
//             to="/main"
//             fontWeight="bold"
//             p={2}
//             borderRadius="md"
//             bg={location.pathname === '/main' ? 'gray.900' : ''}
//             _hover={{ bg: 'gray.900' }}
//           >
//             Main
//           </Link>
//         </Box>
//         <Box as="li" textAlign="center">
//           <Link
//             as={RouterLink}
//             to="/workspace"
//             fontWeight="bold"
//             p={2}
//             borderRadius="md"
//             bg={location.pathname === '/workspace' ? 'gray.900' : ''}
//             _hover={{ bg: 'gray.900' }}
//           >
//             Workspace
//           </Link>
//         </Box>
//         {/* 추가하려는 다른 페이지에 대한 링크를 이곳에 추가하세요 */}

//         <Switch colorScheme="teal" size="md" isChecked={colorMode === "dark"} onChange={toggleColorMode} />
//       </VStack>
//     </Box>
//   );
// }

// export default Sidebar;
import React from 'react';
import { 
  Box, 
  VStack, 
  Link, 
  Switch,
  Spacer,
  Flex,
  Text,
  useColorMode } from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';

interface SidebarProps {
  isVisible: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isVisible }) => {
  const location = useLocation();
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box
      as="nav"
      aria-label="Main Navigation"
      pos="fixed"
      left={isVisible ? 0 : '-170px'}
      top={0}
      w="170px"
      h="100vh" // 100vh 는 화면의 높이와 같습니다.
      bg="gray.800"
      color="white"
      fontSize="1.5rem"
      zIndex={10}
      boxShadow="xl"
      marginTop ="50px"
      transition="all 0.5s ease-in-out"
      borderRadius="0 40px 40px 0"
    >
      <Flex direction="column" h="100vh">
        <VStack
          as="ul"
          listStyleType="none"
          px="0"
          py="20px"
          mt="30px"
          spacing={10}
          alignItems="center" // 중앙 정렬
        >
          <Box as="li" textAlign="center">
            <Link 
              as={RouterLink} 
              to="/main"
              fontWeight="bold"
              p={2}
              borderRadius="md"
              bg={location.pathname === '/main' ? 'gray.900' : ''}
              _hover={{ bg: 'gray.900' }}
            >
              Main
            </Link>
          </Box>
          <Box as="li" textAlign="center">
            <Link
              as={RouterLink}
              to="/workspace"
              fontWeight="bold"
              p={2}
              borderRadius="md"
              bg={location.pathname === '/workspace' ? 'gray.900' : ''}
              _hover={{ bg: 'gray.900' }}
            >
              Workspace
            </Link>
          </Box>
          {/* 추가하려는 다른 페이지에 대한 링크를 이곳에 추가하세요 */}
        </VStack>
        <Box height="70vh"/> 
        <Flex justify="center" align="center" p="2">
          <Text mr={2}>{colorMode === "light" ? "Light" : "Dark"}</Text>
          <Switch colorScheme="teal" size="md" isChecked={colorMode === "dark"} onChange={toggleColorMode} />
        </Flex>
      </Flex>
    </Box>
  );
}

export default Sidebar;
