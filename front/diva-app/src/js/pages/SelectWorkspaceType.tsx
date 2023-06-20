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
import UserAuthState from "../states/userAuthState"
import { User } from '../actions/authActions';
import queryString from 'query-string';
import { useForm } from "react-hook-form";
import bgImage from "../../assets/alchemistic.png";
import axios from "axios";
import config from "../../conf/config";
import Card from "../components/Card/Card";
// import CardBgImage from "../../assets/back-ground-image-of-pages.png"

interface Inputs {
  // creator_id: number;
  workspace_type_id: number;
  workspace_name:string;
  workspcae_info?:string;
}

const SelectWorkspaceType: React.FC = () => {
  const { isLoggedIn, user} = UserAuthState();
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState("");
  const { register, handleSubmit } = useForm<Inputs>();
  

  const onSubmitType = async (data:Inputs) => {
    if (isLoggedIn){
      if (selectedType === "Labeling") {
        data.workspace_type_id = 1;
      }
      else if (selectedType === "Generation") {
        data.workspace_type_id = 2;
      }
      else if (selectedType === "Restoration") {
        data.workspace_type_id = 3;
      }
      const jsonData = {
        creator_id : user?.user_id,
        workspace_type_id : data.workspace_type_id,
        workspace_name : data.workspace_name,
        workspcae_info : data.workspcae_info
      };
      console.log("onSubmitData : ",jsonData)
      try {
        await axios.post(`${config.serverUrl}/rest/api/workspace/create`, {jsonData});
        navigate("/dashboard/workspace");
      } catch (error) {
        console.error(error);
      }
    }    
  };
  const inputForm = (type:string) => {
    return (
      <>
      {selectedType === type && (
        <Box as="form" onSubmit={handleSubmit(onSubmitType)}>
          <VStack mb="24px">
            <Text>Workspace Name :</Text> 
            <Input  placeholder="Workspace Name" {...register("workspace_name", { required: true })} />
            <Text>Workspace Info :</Text> 
            <Input  placeholder="Workspace Info" {...register("workspcae_info", { required: true })} />
            <Button type="submit">Submit</Button>
          </VStack>
        </Box>
      )}
      </>
    )
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
        <Card  onClick={() => setSelectedType("Labeling")} cursor="pointer">
          <Flex direction='column' justify='center' align='center' w='100%' h='100%'>
            <Text
            textAlign='center'
            color='transparent'
            letterSpacing='8px'
            fontSize='50px'
            fontWeight='bold'
            bgClip='text !important'
            bg='linear-gradient(94.56deg, #FFFFFF 79.99%, #21242F 102.65%)'
            >Image Labeling</Text>
            {inputForm("Labeling")}
          </Flex>
        </Card>

        <Card  onClick={() => setSelectedType("Generation")} cursor="pointer">
          <Flex direction='column' justify='center' align='center' w='100%' h='100%'>
            <Text 
            textAlign='center'
            color='transparent'
            letterSpacing='8px'
            fontSize='50px'
            fontWeight='bold'
            bgClip='text !important'
            bg='linear-gradient(94.56deg, #FFFFFF 79.99%, #21242F 102.65%)'
            >Image Generation</Text>
            {inputForm("Generation")}
          </Flex>
        </Card>

        <Card  onClick={() => setSelectedType("Restoration")} cursor="pointer">
          <Flex direction='column' justify='center' align='center' w='100%' h='100%'>
            <Text 
            textAlign='center'
            color='transparent'
            letterSpacing='8px'
            fontSize='50px'
            fontWeight='bold'
            bgClip='text !important'
            bg='linear-gradient(94.56deg, #FFFFFF 79.99%, #21242F 102.65%)'
            >Image Restoration</Text>
            {inputForm("Restoration")}
          </Flex>
        </Card>


      </Flex>
    </Flex>
  );
}

export default SelectWorkspaceType;