import React, { useEffect, Dispatch } from 'react';
import { useDispatch } from 'react-redux';
import { login, User } from '../actions/authActions';
import queryString from 'query-string';
import { useNavigate } from 'react-router-dom';
import { 
    Spinner,
    Box,
    Text,
    Center,
    VStack,
    Flex
} from '@chakra-ui/react';
import { AnyAction } from 'redux';

// React.FC는 이 컴포넌트가 React 함수형 컴포넌트임을 명시합니다.
const LoginLoading: React.FC = () => {
  const dispatch: Dispatch<AnyAction> = useDispatch();
  const navigate = useNavigate(); 

  useEffect(() => {
    // URL의 쿼리 파라미터를 파싱하여 사용자 데이터를 추출합니다.
    const userData: User = queryString.parse(window.location.search) as unknown as User;

    dispatch(login(userData));

    setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
  }, [dispatch,navigate]);
  
  return (
    <Box minH="100vh" bg="gray.700">
      <Flex alignItems="center" justifyContent="center" h="100%">
        <VStack spacing={4}>
          <Spinner size="xl" speed="0.65s" color="blue.500" />
          <Text fontSize="lg" fontWeight="semibold" color="white">
            Logging you in...
          </Text>
        </VStack>
      </Flex>
    </Box>
  );
}

export default LoginLoading;