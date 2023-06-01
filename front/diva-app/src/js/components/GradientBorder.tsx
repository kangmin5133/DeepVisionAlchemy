import { Flex, FlexProps } from "@chakra-ui/react";
import React from "react";

interface GradientBorderProps extends FlexProps {
  variant?: string;
  children: React.ReactNode;
}

const GradientBorder: React.FC<GradientBorderProps> = ({ variant, children, ...rest }) => {
  return (
    <Flex
      p='2px'
      justify='center'
      align='center'
      bg='radial-gradient(69.43% 69.43% at 50% 50%, #FFFFFF 0%, rgba(255, 255, 255, 0) 100%),
      radial-gradient(60% 51.57% at 50% 50%, #582CFF 0%, rgba(88, 44, 255, 0) 100%),
      radial-gradient(54.8% 53% at 50% 50%, #151515 0%, rgba(21, 21, 21, 0) 100%)'
      {...rest}
    >
      {children}
    </Flex>
  );
};

export default GradientBorder;