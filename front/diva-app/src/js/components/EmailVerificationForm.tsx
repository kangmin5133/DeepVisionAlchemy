import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Box, Button, FormControl, FormLabel, Input, HStack, Flex} from "@chakra-ui/react";
import GradientBorder from "./GradientBorder"

interface Inputs {
  userEmail: string;
  verificationCode: string;
}

interface EmailVerificationFormProps {
  register: (...args: any[]) => any;
  handleSubmit: (...args: any[]) => any;
}

export function EmailVerificationForm({register, handleSubmit}: EmailVerificationFormProps) {

  const titleColor = "white";
  const textColor = "gray.400";

  const [isSubmitted, setSubmitted] = useState(false);

  // todo - send email verification API to server
  const onSubmit = async (data: Inputs) => {
    setSubmitted(true);
    console.log("isSubmitted : ",isSubmitted);
    // try {
    //   await axios.post("/api/email_verification", data);
    //   setSubmitted(true);
    // } catch (error) {
    //   console.error(error);
    // }
  };
  // todo - send email verification validation API to server
  const onVerification = async (data: Inputs) => {
    try {
      await axios.post("/api/verify_code", data);
      alert("Email Verified Successfully!");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box as="form">
      <FormControl>
      <HStack mb='24px'>
          <GradientBorder 
          h='50px'
          w={{ base: "100%", lg: "fit-content" }}
          borderRadius='20px'>
            <Input
              color={titleColor}
              bg={{
                base: "gray.600",
              }}
              border='transparent'
              borderRadius='20px'
              fontSize='sm'
              size='lg'
              w={{ base: "100%", md: "400px" }}
              maxW='100%'
              h='46px'
              type='email'
              placeholder='Your email address'
              {...register("userEmail", { required: true })}
            />
          </GradientBorder>
          <Button type="button" onClick={handleSubmit(onSubmit)}>
          submit
          </Button>
        </HStack> 
      </FormControl>
      {isSubmitted && (
        <Box as="form">
          <FormControl>
            <FormLabel>Verification Code</FormLabel>
            <HStack mb='24px'>
              <GradientBorder h='50px' w={{ base: "100%", lg: "fit-content" }} borderRadius='20px'>
                <Input
                  color={titleColor}
                  bg={{
                    base: "gray.600",
                  }}
                  border='transparent'
                  borderRadius='20px'
                  fontSize='sm'
                  size='lg'
                  w={{ base: "100%", md: "400px" }}
                  maxW='100%'
                  h='46px'
                  type='text'
                  placeholder='Enter your Verification Code'
                />
              </GradientBorder>
            
            <Button type="button" onClick={handleSubmit(onVerification)}>
              verify
            </Button>
            </HStack>
          </FormControl>
        </Box>
      )}
    </Box>
  );
}

export default EmailVerificationForm;