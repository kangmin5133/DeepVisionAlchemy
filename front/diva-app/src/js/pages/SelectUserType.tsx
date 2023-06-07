import React,{useState} from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  VStack,
  Input,
  Flex,
  Text,
  HStack
} from "@chakra-ui/react";
import { login, User } from '../actions/authActions';
import queryString from 'query-string';
import { useForm } from "react-hook-form";
import bgImage from "../../assets/alchemistic.png";
import axios from "axios";
import config from "../../conf/config";
import Card from "../components/Card/Card";


interface Inputs {
  orgName: string;
  orgEmail: string;
}

const SelectUserType: React.FC = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState("");
  const { register, handleSubmit } = useForm<Inputs>();

  const onSubmitOrg = async (data: Inputs) => {
    
    const userData: User = queryString.parse(window.location.search) as unknown as User;
    const newUserdata = {
      userEmail: userData.email,
      userName: userData.name,
      ...userData,
    };
    console.log("userData : ",newUserdata)
    const jsonData = {
      ...newUserdata,
      ...data
    };
    console.log("onSubmitOrg : ",jsonData)
    try {
      await axios.post(`${config.serverUrl}/rest/api/auth/register`, {jsonData});
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmitPer = async () => {
    const userData: User = queryString.parse(window.location.search) as unknown as User;
    const jsonData = {
      userEmail: userData.email,
      userName: userData.name,
      ...userData,
    };
    console.log("onSubmitOrg : ",jsonData)
    try {
      await axios.post(`${config.serverUrl}/rest/api/auth/register`, { ...jsonData});
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelection = (type: string) => {
    setSelectedType(type);
    if (type === "Personal") {
      onSubmitPer();
    }
  };

  return (
    <Flex 
    height="100vh"
    backgroundImage={bgImage}
    backgroundPosition="center"
    backgroundSize="cover" 
    justifyContent='center' 
    alignItems='center' 
    align="center" 
    justify="center"
    >
     <Flex w='70vw' h='70vh'>
        <Card  onClick={() => handleSelection("Personal")} cursor="pointer">
          <Flex direction='column' justify='center' align='center' w='100%' h='100%'>
            <Text
            textAlign='center'
            color='transparent'
            letterSpacing='8px'
            fontSize='50px'
            fontWeight='bold'
            bgClip='text !important'
            bg='linear-gradient(94.56deg, #FFFFFF 79.99%, #21242F 102.65%)'
            >Personal</Text>
          </Flex>
        </Card>

        <Card  onClick={() => handleSelection("Organization")} cursor="pointer">
          <Flex direction='column' justify='center' align='center' w='100%' h='100%'>
            <Text 
            textAlign='center'
            color='transparent'
            letterSpacing='8px'
            fontSize='50px'
            fontWeight='bold'
            bgClip='text !important'
            bg='linear-gradient(94.56deg, #FFFFFF 79.99%, #21242F 102.65%)'
            >Organization</Text>
            {selectedType === "Organization" && (
              <Box as="form" onSubmit={handleSubmit(onSubmitOrg)}>
                <VStack mb="24px">
                  <Text>Organization Name :</Text> 
                  <Input  placeholder="Organization Name" {...register("orgName", { required: true })} />
                  <Text> Organization Email :</Text> 
                  <Input  placeholder="Organization Email" {...register("orgEmail", { required: true })} />
                  <Button type="submit">Submit</Button>
                </VStack>
              </Box>
            )}
          </Flex>
        </Card>
      </Flex>
    </Flex>
  );
}

export default SelectUserType;