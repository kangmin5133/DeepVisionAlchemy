import React from "react";
import { Flex, FlexProps } from "@chakra-ui/react";

interface IconBoxProps extends FlexProps {
  children: React.ReactNode;
}

const IconBox: React.FC<IconBoxProps> = (props) => {
  const { children, ...rest } = props;

  return (
    <Flex
      alignItems={"center"}
      justifyContent={"center"}
      borderRadius={"12px"}
      {...rest}>
      {children}
    </Flex>
  );
}

export default IconBox;