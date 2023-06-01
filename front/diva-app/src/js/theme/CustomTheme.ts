import { extendTheme } from "@chakra-ui/react";

const CustomTheme = extendTheme({
  colors: {
    brand: {
      900: "#1a365d",
      800: "#153e75",
      700: "#2a69ac",
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: "bold",
      },
      variants: {
        "with-shadow": {
          bg: "red.400",
          boxShadow: "0 0 2px 2px #efdfde",
        },
        solid: (props:Record<string, any>) => ({
          bg: props.colorMode === "dark" ? "red.300" : "red.500",
        }),
      },
    },
  },
});

export default CustomTheme;