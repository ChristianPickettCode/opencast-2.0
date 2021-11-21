//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Episode {
  address private owner;
  address private channel;

  struct EpisodeInfo {
    string title;
    string audArweaveID;
    string description;
    string duration;
    string rating;
    string coverArweaveID;
    string keywords;
    string itunesRating;
  }

  EpisodeInfo public episodeInfo;

  constructor(
    address _owner,
    string memory _title,
    string memory _audArweaveID,
    string memory _description,
    string memory _duration,
    string memory _rating,
    string memory _coverArweaveID,
    string memory _keywords,
    string memory _itunesRating
  ) {
    channel = msg.sender;
    owner = _owner;

    console.log(
      "Creating episode by: %s from channel: %%s",
      _owner,
      msg.sender
    );
    console.log("msg.sender: ", msg.sender);
    EpisodeInfo memory info;

    info.title = _title;
    info.audArweaveID = _audArweaveID;
    info.description = _description;
    info.duration = _duration;
    info.rating = _rating;
    info.coverArweaveID = _coverArweaveID;
    info.keywords = _keywords;
    info.itunesRating = _itunesRating;

    episodeInfo = info;
  }

  function getEpisodeInfo() public view returns (EpisodeInfo memory) {
    return episodeInfo;
  }
}
