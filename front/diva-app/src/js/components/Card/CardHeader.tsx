import React from "react";
import { Box, useStyleConfig, BoxProps } from "@chakra-ui/react";

interface CardHeaderProps extends BoxProps {
  variant?: string;
}

const CardHeader: React.FC<CardHeaderProps> = ({ variant, children, ...rest }) => {
  const styles = useStyleConfig("CardHeader", { variant });
  return (
    <Box __css={styles} {...rest}>
      {children}
    </Box>
  );
}

export default CardHeader;