import React from "react";
import { NavLink } from "react-router-dom";
import { Box, VStack, Link } from "@chakra-ui/react";
// import "../css/Sidebar.css";

function Sidebar({ isVisible }) {
  return (
    <Box
      as="nav"
      aria-label="Main Navigation"
      pos="fixed"
      left={isVisible ? 0 : '-170px'}
      top={0}
      w="170px"
      h="100%"
      bg="gray.700"
      color="white"
      fontSize="1.5rem"
      zIndex={999}
      boxShadow="xl"
      marginTop ="50px"
      transition="all 0.5s ease-in-out"
    >
      <VStack
        as="ul"
        listStyleType="none"
        px="0"
        py="20px"
        mt="30px"
        spacing={10}
      >
        <Box as="li" textAlign="center">
          <Link
            as={NavLink}
            to="/"
            exact
            activeClassName="active-link"
            fontWeight="bold"
            p={2}
            borderRadius="md"
            _hover={{ bg: 'gray.900' }}
          >
            Home🏠
          </Link>
        </Box>
        <Box as="li" textAlign="center">
          <Link
            as={NavLink}
            to="/predict"
            activeClassName="active-link"
            fontWeight="bold"
            p={2}
            borderRadius="md"
            _hover={{ bg: 'gray.900' }}
          >
            Inference🧠
          </Link>
        </Box>
        {/* 추가하려는 다른 페이지에 대한 링크를 이곳에 추가하세요 */}
      </VStack>
    </Box>
  );
}

export default Sidebar;
