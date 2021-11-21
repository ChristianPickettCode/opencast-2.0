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
import { useEffect, useState, useRef } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";

import Arweave from "arweave";

import channelFactoryAbi from "../artifacts/contracts/ChannelFactory.sol/ChannelFactory.json";
import channelAbi from "../artifacts/contracts/Channel.sol/Channel.json";

let channelFactoryAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
let arweave;

const Dapp = () => {
  const [tab, setTab] = useState(0);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [connectedWalletAddress, setConnectedWalletAddressState] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [newPodcast, setNewPodcast] = useState({
    title: "",
    author: "",
    description: "",
    email: "",
    arweaveImgID: "",
    keywords: "",
  });

  const [newEpisode, setNewEpisode] = useState({
    channelAddr: "",
    title: "",
    description: "",
    audArweaveID: "",
    keywords: "",
  });
  const [fileName, setFileName] = useState("");
  const [coverImage, setCoverImage] = useState({});
  const [imgUpload, setImgUpload] = useState();
  const [channelFactory, setChannelFactory] = useState();

  useEffect(() => {
    if (!hasEthereum) {
      setConnectedWalletAddressState(`MetaMask unavailable`);
      return;
    }

    /* localhost / Arlocal */
    arweave = Arweave.init({
      host: "127.0.0.1",
      port: 1984,
      protocol: "http",
    });

    /* to use mainnet */
    // arweave = Arweave.init({
    //   host: "arweave.net",
    //   port: 443,
    //   protocol: "https",
    // });
  }, []);

  const connectWallet = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const _channelFactory = new ethers.Contract(
      channelFactoryAddress,
      channelFactoryAbi.abi,
      signer
    );
    setChannelFactory(_channelFactory);
    try {
      const signerAddress = await signer.getAddress();
      setConnectedWalletAddressState(`Connected wallet: ${signerAddress}`);
      console.log(`Connected wallet: ${signerAddress}`);
      setWalletAddress(signerAddress);
      setIsWalletConnected(true);
      setTab(1);
    } catch {
      setConnectedWalletAddressState("No wallet connected");
      return;
    }
  };

  const hasEthereum = () => {
    return (
      typeof window !== "undefined" && typeof window.ethereum !== "undefined"
    );
  };

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

  const hiddenFileInput = useRef(null);

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  async function getAsByteArray(file) {
    return new Uint8Array(await readFile(file));
  }

  function readFile(file) {
    return new Promise((resolve, reject) => {
      // Create file reader
      let reader = new FileReader();
      // Register event listeners
      reader.addEventListener("loadend", (e) => resolve(e.target.result));
      reader.addEventListener("error", reject);
      // Read file
      reader.readAsArrayBuffer(file);
    });
  }

  const uploadFile = async (event) => {
    // setFileName(event.target.files[0].name);
    // const file = event.target.files[0];
    // const byteFile = await getAsByteArray(file);

    // // For audio use audio/mpeg
    // const contentType = ["Content-Type", "image/png"];

    // let transaction = await arweave.createTransaction({ data: byteFile });
    // transaction.addTag(...contentType);

    // await arweave.transactions.sign(transaction);
    // let uploader = await arweave.transactions.getUploader(transaction);

    // while (!uploader.isComplete) {
    //   await uploader.uploadChunk();
    //   console.log(
    //     `${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`
    //   );
    // }

    // console.log(transaction);
    // console.log(`File Uploaded to : https://arweave.net/${transaction.id}`);

    // setNewPodcast({ ...newPodcast, arweaveImgID: transaction.id });
    setNewPodcast({ ...newPodcast, arweaveImgID: "transaction.id" });
    setNewEpisode({ ...newEpisode, audArweaveID: "transaction.id" });
  };

  const uploadPodcast = async () => {
    console.log(newPodcast);
    const info = await channelFactory.createChannel(
      newPodcast.title,
      newPodcast.author,
      newPodcast.description,
      newPodcast.email,
      newPodcast.arweaveImgID,
      newPodcast.keywords
    );
    console.log(info);
  };

  const getPodcastinfo = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);

    const c = await channelFactory.getAllChannels();
    console.log(c);
    c.forEach(async (item, index) => {
      console.log(item);
      let contract = await new ethers.Contract(item, channelAbi.abi, provider);

      const info = await contract.getChannelInfo();
      console.log(info);
    });
  };

  const uploadEpisode = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    console.log(newEpisode);
    /**
     * string memory _title,
    string memory _audArweaveID,
    string memory _description,
    string memory _duration,
    string memory _rating,
    string memory _coverArweaveID,
    string memory _keywords,
    string memory _itunesRating
    */
    let contract = await new ethers.Contract(
      newEpisode.channelAddr,
      channelAbi.abi,
      signer
    );
    const info = await contract.addEpisode(
      newEpisode.title,
      newEpisode.audArweaveID,
      newEpisode.description,
      "",
      "",
      "",
      "",
      ""
    );
    console.log(info);
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

        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          minW={"70vw"}
          p={8}
        >
          {tab == 1 && (
            <HStack spacing={10} textAlign="center">
              <Stack spacing={4} minW={"70vw"}>
                <Heading as="h4" size="md">
                  Create Podcast
                </Heading>
                <FormControl id="title">
                  <FormLabel>Title</FormLabel>
                  <Input
                    type="text"
                    onChange={(e) => {
                      setNewPodcast({ ...newPodcast, title: e.target.value });
                    }}
                  />
                </FormControl>
                <FormControl id="author">
                  <FormLabel>Author</FormLabel>
                  <Input
                    type="text"
                    onChange={(e) => {
                      setNewPodcast({ ...newPodcast, author: e.target.value });
                    }}
                  />
                </FormControl>
                <FormControl id="description">
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    placeholder="Here is a sample placeholder"
                    onChange={(e) => {
                      setNewPodcast({
                        ...newPodcast,
                        description: e.target.value,
                      });
                    }}
                  />
                </FormControl>

                <FormControl id="email">
                  <FormLabel>Email address</FormLabel>
                  <Input
                    type="email"
                    onChange={(e) => {
                      setNewPodcast({ ...newPodcast, email: e.target.value });
                    }}
                  />
                </FormControl>
                <HStack>
                  <Button
                    bg={"blue.400"}
                    color={"white"}
                    _hover={{
                      bg: "blue.500",
                    }}
                    onClick={handleClick}
                  >
                    Upload Cover Image
                  </Button>
                  <Text>{fileName ? fileName : "File-Name.jpg"}</Text>
                  <input
                    type="file"
                    accept=".png"
                    ref={hiddenFileInput}
                    onChange={uploadFile}
                    style={{ display: "none" }}
                  />
                </HStack>

                <FormControl id="keywords">
                  <FormLabel>Keywords</FormLabel>
                  <Input
                    type="text"
                    onChange={(e) => {
                      setNewPodcast({
                        ...newPodcast,
                        keywords: e.target.value,
                      });
                    }}
                  />
                </FormControl>

                <Button
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                  onClick={uploadPodcast}
                >
                  Upload Podcast
                </Button>
                <Button
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                  onClick={getPodcastinfo}
                >
                  Get Podcast Info
                </Button>
              </Stack>
            </HStack>
          )}
          {tab == 2 && (
            <HStack spacing={10} textAlign="center">
              <Stack spacing={4} minW={"70vw"}>
                <Heading as="h4" size="md">
                  Add Episode
                </Heading>

                <FormControl id="channelAddr">
                  <FormLabel>Channel Address</FormLabel>
                  <Input
                    type="text"
                    onChange={(e) => {
                      setNewEpisode({
                        ...newEpisode,
                        channelAddr: e.target.value,
                      });
                    }}
                  />
                </FormControl>

                <FormControl id="title">
                  <FormLabel>Title</FormLabel>
                  <Input
                    type="text"
                    onChange={(e) => {
                      setNewEpisode({
                        ...newEpisode,
                        title: e.target.value,
                      });
                    }}
                  />
                </FormControl>
                <FormControl id="description">
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    placeholder="Here is a sample placeholder"
                    onChange={(e) => {
                      setNewEpisode({
                        ...newEpisode,
                        description: e.target.value,
                      });
                    }}
                  />
                </FormControl>

                <HStack>
                  <Button
                    bg={"blue.400"}
                    color={"white"}
                    _hover={{
                      bg: "blue.500",
                    }}
                    onClick={handleClick}
                  >
                    Upload Audio File
                  </Button>
                  <Text>{fileName ? fileName : "File-Name.mp3"}</Text>
                  <input
                    type="file"
                    accept=".png"
                    ref={hiddenFileInput}
                    onChange={uploadFile}
                    style={{ display: "none" }}
                  />
                </HStack>

                <FormControl id="keywords">
                  <FormLabel>Keywords</FormLabel>
                  <Input
                    type="text"
                    onChange={(e) => {
                      setNewEpisode({
                        ...newEpisode,
                        keywords: e.target.value,
                      });
                    }}
                  />
                </FormControl>

                <Button
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                  onClick={uploadEpisode}
                >
                  Upload Episode
                </Button>
              </Stack>
            </HStack>
          )}
        </Box>

        {isWalletConnected ? (
          <Box
            rounded={"md"}
            bg={"white"}
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
            onClick={() => connectWallet()}
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
