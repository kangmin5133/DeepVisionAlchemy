/*!

=========================================================
* Vision UI Free Chakra - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/vision-ui-free-chakra
* Copyright 2021 Creative Tim (https://www.creative-tim.com/)
* Licensed under MIT (https://github.com/creativetimofficial/vision-ui-free-chakra/blob/master LICENSE.md)

* Design and Coded by Simmmple & Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

import React, { ReactNode } from "react";
import { Flex, FlexProps } from "@chakra-ui/react";

interface IconBoxProps extends FlexProps {
  children: ReactNode;
}

const IconBox: React.FC<IconBoxProps> = ({ children, ...rest }) => {
  return (
    <Flex
      alignItems={"center"}
      justifyContent={"center"}
      borderRadius={"12px"}
      {...rest}>
      {children}
    </Flex>
  );
};

export default IconBox;