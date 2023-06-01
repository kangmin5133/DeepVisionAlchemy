import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink,Text,useColorMode } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronRightIcon } from "@chakra-ui/icons";
import React from "react";

const Breadcrumbs: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const location = useLocation();
  const navigate = useNavigate();

  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <Breadcrumb spacing="8px" separator={<ChevronRightIcon color="gray.500" />}
    fontWeight="medium" // 여기에 원하는 폰트 스타일을 추가하세요.
      fontSize="lg" // 폰트 크기를 조절하려면 이 값을 변경하세요.
      color="white" // 텍스트 색상 변경
      >
      {pathnames.map((value, index) => {
        const url = `/${pathnames.slice(0, index + 1).join("/")}`;

        return (
          <BreadcrumbItem p={2} key={url} marginTop={2}>
            <BreadcrumbLink onClick={() => navigate(url)}>
            <Text color={colorMode === "dark" ? "white" : "black"} textTransform="capitalize" > 
              {value}
            </Text>
            </BreadcrumbLink>
          </BreadcrumbItem>
        );
      })}
    </Breadcrumb>
  );
};

export default Breadcrumbs;