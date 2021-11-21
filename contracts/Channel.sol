//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./Episode.sol";

contract Channel {
  address public owner;
  address public factory;

  struct ChannelInfo {
    string title;
    string author;
    string description;
    string email;
    string arweaveImgID;
    string keywords;
  }

  ChannelInfo public channelInfo;

  Episode[] public episodes;

  constructor(
    address _owner,
    string memory _title,
    string memory _author,
    string memory _description,
    string memory _email,
    string memory _arweaveImgID,
    string memory _keywords
  ) {
    owner = _owner;
    factory = msg.sender;

    console.log("Creating channel by: ", msg.sender);
    ChannelInfo memory info;

    info.title = _title;
    info.author = _author;
    info.description = _description;
    info.email = _email;
    info.arweaveImgID = _arweaveImgID;
    info.keywords = _keywords;

    channelInfo = info;
  }

  function getChannelInfo() public view returns (ChannelInfo memory) {
    return channelInfo;
  }

  function getEpisodes() public view returns (Episode[] memory) {
    return episodes;
  }

  function addEpisode(
    string memory _title,
    string memory _audArweaveID,
    string memory _description,
    string memory _duration,
    string memory _rating,
    string memory _coverArweaveID,
    string memory _keywords,
    string memory _itunesRating
  ) public {
    require(msg.sender == owner, "You are not the owner of this Channel");
    Episode ep = new Episode(
      owner,
      _title,
      _audArweaveID,
      _description,
      _duration,
      _rating,
      _coverArweaveID,
      _keywords,
      _itunesRating
    );

    episodes.push(ep);
  }
}
