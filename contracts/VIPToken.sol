//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import 'hardhat/console.sol';

contract VIPToken {
    mapping(address => mapping(uint32 => uint32)) public holds;

    function hasProject(address addr, uint32 project) public view returns (bool) {
        if(holds[addr][project] >= 1) return true;
        return false;
    }

    function addProject(address addr, uint32 project, uint32 count) public {}
}
