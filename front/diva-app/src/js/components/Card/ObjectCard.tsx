import React,{useState,useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import { Box, Image, Text, Menu, MenuButton, IconButton, MenuList, MenuItem } from '@chakra-ui/react';
import { IoEllipsisHorizontal } from 'react-icons/io5'; // 또는 다른 적절한 아이콘

interface CardProps {
  id: number;
  objectType: 'project' | 'dataset' | 'model';
  imageSrc?: string;
  title: string;
  onClick: (id: number) => void;
}

const ObjectCard: React.FC<CardProps> = ({ id,objectType,imageSrc, title, onClick }) => {
  
  // useEffect(() => {
  //   console.log("imageSrc : ",imageSrc)
  // }, [id]);
  const navigate = useNavigate();

  return(
    <Box 
  borderRadius="10px" 
  p = "16px 5px 0px 5px"
  borderWidth="0.1rem" 
  borderColor="teal" 
  overflow="hidden" 
  cursor="pointer" 
  _hover={{
    borderWidth : '0.3rem ',
  }}
  onClick={() => onClick(id)}
  >
    {/* <Image borderRadius={5} src="https://via.placeholder.com/256x128" alt="Placeholder" /> */}
    <Image borderRadius={5} src={imageSrc || "https://via.placeholder.com/256x128"} alt="Placeholder" />
    <Box p={2} display="flex" justifyContent="space-between" alignItems="center" mt={-2}>
      <Text>{title}</Text>
      <Menu>
        <MenuButton 
        as={IconButton} 
        aria-label="Options" 
        icon={<IoEllipsisHorizontal />} 
        variant="ghost" 
        onClick={(e) => e.stopPropagation()}
        />
        <MenuList onClick={(e) => e.stopPropagation()}>
          {objectType === 'project' && (
              <>
                <MenuItem>Update</MenuItem>
                <MenuItem>Delete</MenuItem>
                <MenuItem onClick={() => navigate('/dashboard/workspace-labeling/project')}>Launch</MenuItem>
              </>
            )}
            {objectType === 'dataset' && (
              <>
                <MenuItem>Update</MenuItem>
                <MenuItem>Delete</MenuItem>
                <MenuItem>Go to Validation</MenuItem>
              </>
            )}
            {objectType === 'model' && (
              <>
                <MenuItem>Delete</MenuItem>
                <MenuItem>Link project</MenuItem>
              </>
            )}
        </MenuList>
      </Menu>
    </Box>
  </Box>
  )
};
export default ObjectCard;