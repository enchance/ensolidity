//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";
import './HeimdallCore.sol';


interface IHeimdallCore {
    function hasRole(bytes32 role, address account) external view returns (bool);
}

contract Heimdall is ContextUpgradeable {
    IHeimdallCore public hdl;

    modifier onlyRole(bytes32 role) {
        require(hdl.hasRole(role, _msgSender()), 'You shall not pass!');
        _;
    }

    function _setHeimdall(address addr) internal virtual {
        require(addr != address(0), 'OOPS: Address cannot be empty');
        hdl = IHeimdallCore(addr);
    }
}
