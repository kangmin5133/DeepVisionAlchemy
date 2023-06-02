import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { 
    Box, 
    Flex, 
    FormControl, 
    FormLabel, 
    Input, 
    Stack, 
    Button, 
    Heading, 
    useColorModeValue,
    Icon,
    HStack,
    Link,
    DarkMode,
    Switch,
    Text,
    Image
} from '@chakra-ui/react';
// import { FaApple, FaFacebook, FaGoogle } from "react-icons/fa";
import GoogleIcon from '../../assets/google.png';
import KakaoIcon from '../../assets/kakaotalk.png';
import NaverIcon from '../../assets/naver.ico';

import signUpImage from "../../assets/alchemyLab.png";

import config from "../../conf/config";
import GradientBorder from "../components/GradientBorder"

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [emailLogin, setEmailLogin] = useState(false);

  const titleColor = "white";
  const textColor = "gray.400";

  const handleSocialLogin = (platform: string) => {
    window.location.href = `${config.serverUrl}/rest/api/auth/login/social/${platform}`;
  };
  
  const handleClickSignin = () => {
    navigate("/signin");
  };

  const colorScheme = (color: string) => emailLogin ? 'blue' : color;


  const SocialLoginButtons = [
    {
      icon: GoogleIcon,
      handleLogin: () => handleSocialLogin('google'),
      colorScheme: 'white',
    },
    {
      icon: NaverIcon,
      handleLogin: () => handleSocialLogin('naver'),
      colorScheme: '#2DB400',
    },
    {
      icon: KakaoIcon,
      handleLogin: () => handleSocialLogin('kakao'),
      colorScheme: '#F7E600',
    },
  ].map(({icon, handleLogin,colorScheme }) => (
    <GradientBorder borderRadius='15px'>
      <Flex
        _hover={{ filter: "brightness(120%)" }}
        transition='all .25s ease'
        cursor='pointer'
        justify='center'
        align='center'
        bg={colorScheme}
        w='71px'
        h='71px'
        borderRadius='15px'
        onClick={handleLogin}
      >
      <Image
      src={icon}
      alt="social login icon"
      boxSize="30px"
    />
      </Flex>
    </GradientBorder>
  ));

  return (
    <Box minH="100vh"
    overflow="auto" background="#100206" height="100vh">
      <Flex position='relative' overflow={{ lg: "visible" }} 
      minH='100vh'
      h={{ base: "120vh", lg: "fit-content" }}>
        <Flex
          flexDirection='column'
          h={{ sm: "initial", md: "unset" }}
          w={{ base: "90%" }}
          left = "50%"
          mx='auto'
          justifyContent='space-between'
          pt={{ sm: "100px", md: "0px" }}
          me={{ base: "auto", lg: "50px", xl: "auto" }}>
          <Flex
            alignItems='center'
            justifyContent='start'
            style={{ userSelect: "none" }}
            flexDirection='column'
            mx={{ base: "auto", lg: "unset" }}
            ms={{ base: "auto", lg: "auto" }}
            mb='50px'
            w={{ base: "100%", md: "50%", lg: "42%" }}>
            <Flex
              direction='column'
              textAlign='center'
              justifyContent='center'
              align='center'
              mt={{ base: "60px", md: "140px", lg: "200px" }}
              mb='50px'>
              <Text
                fontSize='4xl'
                lineHeight='39px'
                color='white'
                fontWeight='bold'>
                Welcome!
              </Text>
              <Text
                fontSize='md'
                color='white'
                fontWeight='normal'
                mt='10px'
                w={{ base: "100%", md: "90%", lg: "90%", xl: "80%" }}>
               DVA is multiplex Vision AI playground , it's handling difussion, transformer and other variety of models
              </Text>
            </Flex>
            <GradientBorder p='2px' me={{ base: "none", lg: "30px", xl: "none" }}>
              <Flex
                background='transparent'
                borderRadius='30px'
                direction='column'
                p='40px'
                minW={{ base: "unset", md: "430px", xl: "450px" }}
                w='100%'
                mx={{ base: "0px" }}
                bg={{
                  base: "gray.900",
                }}>
                <Text
                  fontSize='xl'
                  color={textColor}
                  fontWeight='bold'
                  textAlign='center'
                  mb='22px'>
                  Log in With
                </Text>
                <HStack spacing='15px' justify='center' mb='22px'>
                  {SocialLoginButtons}
                </HStack>
                <Text
                  fontSize='lg'
                  color='gray.400'
                  fontWeight='bold'
                  textAlign='center'
                  mb='22px'>
                  or
                </Text>
                <FormControl>
                  <FormLabel
                    color={titleColor}
                    ms='4px'
                    fontSize='sm'
                    fontWeight='normal'>
                    Email
                  </FormLabel>
                  <GradientBorder
                    mb='24px'
                    h='50px'
                    w={{ base: "100%", lg: "fit-content" }}
                    borderRadius='20px'>
                    <Input
                      color={titleColor}
                      bg={{
                        base: "gray.600",
                      }}
                      border='transparent'
                      borderRadius='20px'
                      fontSize='sm'
                      size='lg'
                      w={{ base: "100%", md: "346px" }}
                      maxW='100%'
                      h='46px'
                      type='email'
                      placeholder='Your email address'
                    />
                  </GradientBorder>
                  <FormLabel
                    color={titleColor}
                    ms='4px'
                    fontSize='sm'
                    fontWeight='normal'>
                    Password
                  </FormLabel>
                  <GradientBorder
                    mb='24px'
                    h='50px'
                    w={{ base: "100%", lg: "fit-content" }}
                    borderRadius='20px'>
                    <Input
                      color={titleColor}
                      bg={{
                        base: "gray.600",
                      }}
                      border='transparent'
                      borderRadius='20px'
                      fontSize='sm'
                      size='lg'
                      w={{ base: "100%", md: "346px" }}
                      maxW='100%'
                      h='46px'
                      type='password'
                      placeholder='Your password'
                    />
                  </GradientBorder>
                  <FormControl display='flex' alignItems='center' mb='24px'>
                    <DarkMode>
                      <Switch id='remember-login' colorScheme='brand' me='10px' />
                    </DarkMode>
  
                    <FormLabel
                      color={titleColor}
                      htmlFor='remember-login'
                      mb='0'
                      fontWeight='normal'>
                      Remember me
                    </FormLabel>
                  </FormControl>
                  <Button
                    variant='brand'
                    fontSize='xl'
                    type='submit'
                    w='100%'
                    maxW='350px'
                    h='45'
                    mb='20px'
                    mt='20px'>
                    LOG IN
                  </Button>
                </FormControl>
                <Flex
                  flexDirection='column'
                  justifyContent='center'
                  alignItems='center'
                  maxW='100%'
                  mt='0px'>
                  <Text color={textColor} fontWeight='medium'>
                    Already have an account?
                    <Link
                      color={titleColor}
                      as='span'
                      ms='5px'
                      href='#'
                      fontWeight='bold'
                      onClick={handleClickSignin}>
                      Sign In
                    </Link>
                  </Text>
                </Flex>
              </Flex>
            </GradientBorder>
          </Flex>
          <Box
            w={{ base: "335px", md: "450px" }}
            mx={{ base: "auto", lg: "unset" }}
            ms={{ base: "auto", lg: "auto" }}
            mb='90px'>
          </Box>
          <Box
            display={{ base: "none", lg: "block" }}
            overflowX='hidden'
            h='100%'
            maxW={{ md: "50%", lg: "50%" }}
            w='100%'
            position='absolute'
            left='0px'>
            <Box
              bgImage={signUpImage}
              w='100%'
              h='100%'
              bgSize='cover'
              bgPosition='50%'
              position='absolute'
              display='flex'
              flexDirection='column'
              justifyContent='center'
              alignItems='center'>
              <Text
                textAlign='center'
                color='white'
                letterSpacing='8px'
                fontSize='20px'
                fontWeight='500'>
                DVA:
              </Text>
              <Text
                textAlign='center'
                color='transparent'
                letterSpacing='8px'
                fontSize='36px'
                fontWeight='bold'
                bgClip='text !important'
                bg='linear-gradient(94.56deg, #FFFFFF 79.99%, #21242F 102.65%)'>
                DEEP VISION ALCHEMY
              </Text>
            </Box>
          </Box>
        </Flex>
      </Flex>
      </Box>
    );
  }

export default Login;