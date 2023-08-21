import React from "react";
import { Box, useStyleConfig, BoxProps, useColorMode } from "@chakra-ui/react";

interface CardProps extends BoxProps {
  variant?: string;
}

const Card: React.FC<CardProps> = ({ variant, children, ...rest }) => {
  const styles = {
      p: "22px",
      display: "flex",
      flexDirection: "column",
      backdropFilter: "blur(120px)",
      width: "100%",
      borderRadius: "20px",
      backgroundClip: "border-box",
      boxShadow : "xl",
      borderWidth: "0.15rem", // 테두리 두께 설정
      borderColor: "teal", // 테두리 색상 설정
  };
  return (
    <Box __css={styles} {...rest}>
      {children}
    </Box>
  );
}

export default Card;
