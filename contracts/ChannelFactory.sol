//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./Channel.sol";

contract ChannelFactory {
  address public owner;
  Channel[] public allChannels;

  event ChannelCreated(address newAddress);

  constructor() {
    owner = msg.sender;
  }

  function createChannel(
    string memory _title,
    string memory _author,
    string memory _description,
    string memory _email,
    string memory _arweaveImgID,
    string memory _keywords
  ) public {
    Channel channel = new Channel(
      msg.sender,
      _title,
      _author,
      _description,
      _email,
      _arweaveImgID,
      _keywords
    );

    allChannels.push(channel);

    console.log("Channel Created with address: %s", address(channel));
    emit ChannelCreated(address(channel));
  }

  function getAllChannels() public view returns (Channel[] memory) {
    return allChannels;
  }
}
