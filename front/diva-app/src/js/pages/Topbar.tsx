import React,{Dispatch} from "react";
import { Link, useNavigate } from "react-router-dom";
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
  HStack
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { ChevronDownIcon } from "@chakra-ui/icons";
// import { useSelector } from "react-redux";
// import { RootState } from '../store/index'; // Assuming index.tsx is the store file
import UserAuthState from "../states/userAuthState"
import axios from 'axios';
import { useDispatch } from 'react-redux';
import config from "../../conf/config";
import { AnyAction } from 'redux';
import { logout, User } from '../actions/authActions';


interface TopbarProps {
  onMenuClick: () => void;
  // isVisible: boolean; // 추가된 속성
}

const Topbar: React.FC<TopbarProps> = ({ onMenuClick }) => {
  const navigate = useNavigate(); 
  const { isLoggedIn, user} = UserAuthState();
  // const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  // const user = useSelector((state: RootState) => state.auth.user);
  const dispatch: Dispatch<AnyAction> = useDispatch();


  const logoutfunc = async () => {
    try {
      await axios.get(`${config.serverUrl}/rest/api/auth/logout`);
      // If you are using JWT tokens and storing them in local storage
      localStorage.removeItem('access_token'); 
      // Remove user data from local storage
      localStorage.removeItem('user'); 
  
      // Update your global state to reflect that the user is logged out
      dispatch(logout()); // Assuming you have a 'logout' action defined in your Redux setup
      navigate("/");
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
            <HStack>
              <Text
                textAlign='center'
                color='transparent'
                letterSpacing='4px'
                fontSize='36px'
                fontWeight='bold'
                bgClip='text !important'
                bg='linear-gradient(94.56deg, #FFFFFF 19.99%, #21242F 152.65%)'>
                Deep Vision Alchemy Lab 
              </Text>
            <Text>🧪</Text>
            </HStack>
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
                <Avatar src={`data:image/jpeg;base64,${user.profile_image}`} name={user.name} size="sm" /> {/* imageUrl property does not exist in user object */}
                <Text ml="2" display="inline" fontWeight="bold">
                  {user.name}
                </Text>
              </MenuButton>
              <MenuList bg="gray.700" width="auto" minWidth="100%" fontSize={{ base: "sm", md: "md" }}>
                <MenuItem bg="gray.700">프로필 설정</MenuItem>
                <MenuItem bg="gray.700">정보 관리</MenuItem>
                <MenuItem bg="gray.700">멤버십 설정</MenuItem>
                <MenuItem bg="gray.700" onClick={logoutfunc}>로그아웃</MenuItem>
              </MenuList>
            </Menu>
          </Box>
        )}
      </Flex>
    </Box>
  );
}

export default Topbar;