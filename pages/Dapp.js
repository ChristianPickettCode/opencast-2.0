import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue,
  HStack,
  Textarea,
  Icon,
} from "@chakra-ui/react";

import { ChevronRightIcon, ChevronLeftIcon } from "@chakra-ui/icons";
import { useState } from "react";

const Dapp = () => {
  const [tab, setTab] = useState(0);
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const increaseTab = () => {
    if (tab < 2) {
      setTab((prev) => prev + 1);
    }
  };

  const decreaseTab = () => {
    if (tab > 1) {
      setTab((prev) => prev - 1);
    }
  };

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack align={"center"} spacing={"3"} mb={8} mt={4}>
        <Heading fontSize={"4xl"}>OpenCast</Heading>
        <Text fontSize={"lg"} color={"gray.600"}>
          Upload your podcast to the{" "}
          <Link
            color={"blue.400"}
            href="https://www.ethereum.org/"
            target="_blank"
          >
            blockchain{" "}
          </Link>
          and{" "}
          <Link
            color={"blue.400"}
            href="https://www.arweave.org/"
            target="_blank"
          >
            permaweb
          </Link>{" "}
          ✌️
        </Text>

        {tab == 1 ? (
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            minW={"70vw"}
            p={8}
          >
            <HStack spacing={10} textAlign="center">
              <Stack spacing={4} minW={"70vw"}>
                <Heading as="h4" size="md">
                  Create Podcast
                </Heading>
                <FormControl id="title">
                  <FormLabel>Title</FormLabel>
                  <Input type="text" />
                </FormControl>
                <FormControl id="author">
                  <FormLabel>Author</FormLabel>
                  <Input type="text" />
                </FormControl>
                <FormControl id="description">
                  <FormLabel>Description</FormLabel>
                  <Textarea placeholder="Here is a sample placeholder" />
                </FormControl>

                <FormControl id="email">
                  <FormLabel>Email address</FormLabel>
                  <Input type="email" />
                </FormControl>
                <HStack>
                  <Button
                    bg={"blue.400"}
                    color={"white"}
                    _hover={{
                      bg: "blue.500",
                    }}
                  >
                    Upload Cover Image
                  </Button>
                  <Text>File-Name.jpg</Text>
                </HStack>

                <FormControl id="keywords">
                  <FormLabel>Keywords</FormLabel>
                  <Input type="text" />
                </FormControl>

                <Button
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                >
                  Upload Podcast
                </Button>
              </Stack>
            </HStack>
          </Box>
        ) : (
          ""
        )}

        {tab == 2 ? (
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            minW={"70vw"}
            p={8}
          >
            <HStack spacing={10} textAlign="center">
              <Stack spacing={4} minW={"70vw"}>
                <Heading as="h4" size="md">
                  Add Episode
                </Heading>

                <FormControl id="title">
                  <FormLabel>Title</FormLabel>
                  <Input type="text" />
                </FormControl>
                <FormControl id="description">
                  <FormLabel>Description</FormLabel>
                  <Textarea placeholder="Here is a sample placeholder" />
                </FormControl>

                <HStack>
                  <Button
                    bg={"blue.400"}
                    color={"white"}
                    _hover={{
                      bg: "blue.500",
                    }}
                  >
                    Upload Audio File
                  </Button>
                  <Text>File-Name.mp3</Text>
                </HStack>

                <FormControl id="keywords">
                  <FormLabel>Keywords</FormLabel>
                  <Input type="text" />
                </FormControl>

                <Button
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                >
                  Upload Episode
                </Button>
              </Stack>
            </HStack>
          </Box>
        ) : (
          ""
        )}

        {isWalletConnected ? (
          <Box
            rounded={"md"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={2}
            justify={"between"}
          >
            <HStack spacing={8}>
              <Button variant="ghost" onClick={decreaseTab}>
                {" "}
                <Icon
                  color={"blue.500"}
                  w={5}
                  h={5}
                  as={ChevronLeftIcon}
                />{" "}
              </Button>
              <Button
                variant="ghost"
                textColor={tab == 1 ? "#4299E1" : "black"}
                onClick={() => setTab(1)}
              >
                1
              </Button>
              <Button
                variant="ghost"
                textColor={tab == 2 ? "#4299E1" : "black"}
                onClick={() => setTab(2)}
              >
                2
              </Button>
              <Button variant="ghost" onClick={increaseTab}>
                {" "}
                <Icon
                  color={"blue.500"}
                  w={5}
                  h={5}
                  as={ChevronRightIcon}
                />{" "}
              </Button>
            </HStack>
          </Box>
        ) : (
          <Button
            onClick={() => {
              setIsWalletConnected(true);
              setTab(1);
            }}
            bg={"blue.400"}
            color={"white"}
            _hover={{
              bg: "blue.500",
            }}
          >
            Connect Wallet
          </Button>
        )}
      </Stack>
    </Flex>
  );
};

export default Dapp;
