import React from "react";
import { Link } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useSelector } from "react-redux";
import { RootState } from '../store/index'; // Assuming index.tsx is the store file
import axios from 'axios';
import config from "../../conf/config";

interface TopbarProps {
  onMenuClick: () => void;
  // isVisible: boolean; // 추가된 속성
}

const Topbar: React.FC<TopbarProps> = ({ onMenuClick }) => {
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const user = useSelector((state: RootState) => state.auth.user);
  const logout = async () => {
    try {
      await axios.get(`${config.serverUrl}/rest/api/auth/logout`);
      localStorage.removeItem('access_token'); // If you are using JWT tokens and storing them in local storage
      // Update your global state to reflect that the user is logged out
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      zIndex="1000"
      width="100%"
      height="60px"
      bg="#1e1d1d"
      color="white"
      fontSize="2rem"
      px="1rem"
    >
      <Flex
        alignItems="center"
        justifyContent="space-between"
        width="100%"
        height="100%"
      >
        <Button
          onClick={onMenuClick}
          bg="#1e1d1d"
          color="white"
          _hover={{ bg: "gray.700" }}
          _active={{ bg: "gray.800" }}
          _focus={{ boxShadow: "none" }}
          position="absolute"
          left="1rem"
        >
          <FontAwesomeIcon icon={faBars} />
        </Button>
        <Box position="absolute" left="50%" transform="translateX(-50%)" textAlign="center">
          <Link to="/dashboard">
            <Text>Deep Vision Alchemy Lab 🧪</Text>
          </Link>
        </Box>
        {isLoggedIn && user && (
          <Box position="absolute" right="1rem">
            <Menu autoSelect={false}>
              <MenuButton
                as={Button}
                bg="transparent"
                _hover={{ bg: "transparent" }}
                _active={{ bg: "transparent" }}
                _focus={{ boxShadow: "none" }}
                rightIcon={<ChevronDownIcon />}
              >
                <Avatar name={user.name} size="sm" /> {/* imageUrl property does not exist in user object */}
                <Text ml="2" display="inline" fontWeight="bold">
                  {user.name}
                </Text>
              </MenuButton>
              <MenuList bg="gray.700" width="auto" minWidth="100%" fontSize={{ base: "sm", md: "md" }}>
                <MenuItem bg="gray.700">프로필 설정</MenuItem>
                <MenuItem bg="gray.700">정보 관리</MenuItem>
                <MenuItem bg="gray.700">멤버십 설정</MenuItem>
                <MenuItem bg="gray.700" onClick={logout}>로그아웃</MenuItem>
              </MenuList>
            </Menu>
          </Box>
        )}
      </Flex>
    </Box>
  );
}

export default Topbar;