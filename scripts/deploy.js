const hre = require("hardhat");

async function main() {
  const ChannelFactory = await hre.ethers.getContractFactory("ChannelFactory");
  const channelFactory = await ChannelFactory.deploy();

  await channelFactory.deployed();

  console.log("ChannelFactory deployed to:", channelFactory.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
