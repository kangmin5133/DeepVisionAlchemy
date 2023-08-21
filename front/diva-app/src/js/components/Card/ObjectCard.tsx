import React from 'react';
import { Box, Image, Text, Menu, MenuButton, IconButton, MenuList, MenuItem } from '@chakra-ui/react';
import { IoEllipsisHorizontal } from 'react-icons/io5'; // 또는 다른 적절한 아이콘

interface CardProps {
  id: number;
  imageSrc?: string;
  title: string;
  onClick: (id: number) => void;
}

const ObjectCard: React.FC<CardProps> = ({ id,imageSrc, title, onClick }) => (
  <Box 
  borderRadius="10px" 
  p = "16px 5px 0px 5px"
  borderWidth="0.1rem" 
  borderColor="teal" 
  overflow="hidden" 
  cursor="pointer" 
  _hover={{
    borderWidth : '0.3rem',
  }}
  onClick={() => onClick(id)}
  >
    <Image borderRadius={5} src="https://via.placeholder.com/256x128" alt="Placeholder" />
    <Box p={2} display="flex" justifyContent="space-between" alignItems="center" mt={-2}>
      <Text>{title}</Text>
      <Menu>
        <MenuButton as={IconButton} aria-label="Options" icon={<IoEllipsisHorizontal />} variant="ghost" />
        <MenuList>
          <MenuItem>Option 1</MenuItem>
          <MenuItem>Option 2</MenuItem>
          {/* 다른 메뉴 아이템 */}
        </MenuList>
      </Menu>
    </Box>
  </Box>
);
export default ObjectCard;