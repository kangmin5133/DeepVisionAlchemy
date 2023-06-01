import React, { ReactNode } from "react";
import { Flex, FlexProps } from "@chakra-ui/react";

interface SeparatorProps extends FlexProps {
  variant?: string;
  children?: ReactNode;
}

const Separator: React.FC<SeparatorProps> = ({ variant, children, ...rest }) => {
  return (
    <Flex
      h='1px'
      w='100%'
      bg='linear-gradient(90deg, rgba(224, 225, 226, 0) 0%, #E0E1E2 47.22%, rgba(224, 225, 226, 0.15625) 94.44%)'
      {...rest}>
      {children}
    </Flex>
  );
};

export default Separator;