import React from "react";
import { Link } from "react-router-dom"; // 추가
import { Box, Button, Flex , Icon} from '@chakra-ui/react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
faBars
} from "@fortawesome/free-solid-svg-icons";
import "../css/Topbar.css";

function Topbar({ onMenuClick }) {
  return (
    <Flex className="topbar" 
    justifyContent="center" 
    alignItems="center">
      <Button
        onClick={onMenuClick}
        bg="#1e1d1d"
        color="white"
        _hover={{ bg: 'gray.700' }}
        _active={{ bg: 'gray.800' }}
        _focus={{ boxShadow: 'none' }}
        pos="absolute"
        left="1rem"
      >
        <FontAwesomeIcon icon={faBars } />
      </Button>
      <Link to="/">MINSU AI Lab 🧪</Link>
    </Flex>
  );
}

export default Topbar;
