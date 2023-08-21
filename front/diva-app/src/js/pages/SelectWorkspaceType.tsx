import React,{useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { 
  VStack, 
  Flex, 
  Text, 
  Box, 
  Button, 
  Modal, 
  ModalOverlay, 
  ModalContent, 
  ModalHeader, 
  ModalFooter, 
  ModalBody, 
  ModalCloseButton, 
  useDisclosure, 
  Input 
} from "@chakra-ui/react";

import UserAuthState from "../states/userAuthState"
import { User } from '../actions/authActions';
import queryString from 'query-string';
import { useForm } from "react-hook-form";
import bgImage from "../../assets/alchemistic.png";
import axios from "axios";
import config from "../../conf/config";
// import Card from "../components/Card/Card";
import Card from "../components/Card/Card";
import CardHeader from "../components/Card/CardHeader";
import CardBody from "../components/Card/CardBody";
// import CardBgImage from "../../assets/back-ground-image-of-pages.png"

interface Inputs {
  // creator_id: number;
  workspace_type_id: number;
  workspace_name:string;
  workspcae_info?:string;
}

const SelectWorkspaceType: React.FC<{ onHideSidebar: () => void; onShowSidebar: () => void; }> = ({ onHideSidebar, onShowSidebar }) => {
  useEffect(() => {
    onHideSidebar();
    return () => onShowSidebar();
  }, [onHideSidebar, onShowSidebar]);

  const { isLoggedIn, user} = UserAuthState();
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState("");
  const { register, handleSubmit } = useForm<Inputs>();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedWorkspaceType, setSelectedWorkspaceType] = useState('');
  const [workspaceName, setWorkspaceName] = useState('');
  const [workspaceInfo, setWorkspaceInfo] = useState('');

  const handleWorkspaceNameChange = (event: React.ChangeEvent<HTMLInputElement>) => setWorkspaceName(event.target.value);
  const handleWorkspaceInfoChange = (event: React.ChangeEvent<HTMLInputElement>) => setWorkspaceInfo(event.target.value);

  const handleCardClick = (workspaceType: string) => {
    setSelectedWorkspaceType(workspaceType);
    onOpen();
  }

  const onSubmitType = async (data:Inputs) => {
      const jsonData = {
        creator_id : user?.user_id,
        workspace_type_id : data.workspace_type_id,
        workspace_name : data.workspace_name,
        workspcae_info : data.workspcae_info
      };
      console.log("onSubmitData : ",jsonData)
      try {
        await axios.post(`${config.serverUrl}/rest/api/workspace/create`, {jsonData});
        navigate("/dashboard");
      } catch (error) {
        console.error(error);
      }
    };    

  const handleOnSubmit = () => {
    let workspace_type_id: number;
  
    if (selectedWorkspaceType === "Labeling") {
      workspace_type_id = 1;
    } else if (selectedWorkspaceType === "Generation") {
      workspace_type_id = 2;
    } else if (selectedWorkspaceType === "Restoration") {
      workspace_type_id = 3;
    } else if (selectedWorkspaceType === "Editing") {
      workspace_type_id = 4;
    }
    else {
      console.error("Invalid workspace type");
      return; // 혹은 적절한 에러 처리
    }
  
    const data: Inputs = {
      workspace_type_id,
      workspace_name: workspaceName,
      workspcae_info: workspaceInfo,
    };
  
    onSubmitType(data);
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
    <Flex direction="column" align="center" justify="center" height="100vh" mt="80px"> {/* Topbar 때문에 가려진 부분 수정 */}
      <VStack spacing={8} align="stretch">
        <Text fontSize="2xl" borderBottom="0.2rem solid">Image</Text>
        <Flex w='70vw' h='20vh' gap="11vw"> {/* 카드 크기 조정 */}
          {['Labeling', 'Generation', 'Restoration', 'Editing'].map(type => (
            <Card onClick={() => handleCardClick(type)} cursor="pointer" key={type} w="10vw" h="17vh" _hover={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', transition: 'background-color 0.2s' }}>
              <Flex direction='column' justify='center' align='center' w='100%' h='100%'>
                <Text textAlign='center' color='transparent' letterSpacing='2px' fontSize='20px' fontWeight='bold' bgClip='text !important' bg='linear-gradient(94.56deg, #FFFFFF 79.99%, #21242F 102.65%)'>{`Image ${type}`}</Text>
                <Text display="none" fontSize="sm" color="white" fontWeight="bold" _groupHover={{ display: "block" }}>Description</Text> {/* 호버 효과 */}
              </Flex>
            </Card>
          ))}
        </Flex>
        <Text fontSize="2xl" borderBottom="0.2rem solid">Video</Text>
        <Text fontSize="2xl" borderBottom="0.2rem solid">Audio</Text>
        <Text fontSize="2xl" borderBottom="0.2rem solid">Text</Text>
      </VStack>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create a new {selectedWorkspaceType} workspace</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input 
            placeholder="Workspace Name" 
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
            />
            <Input 
            mt={4} 
            placeholder="Workspace Info"
            value={workspaceInfo}
            onChange={(e) => setWorkspaceInfo(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleOnSubmit}>Submit</Button> {/* API 호출 로직 추가 */}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}

export default SelectWorkspaceType;