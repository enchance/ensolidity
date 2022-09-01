//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/AccessControl.sol";


contract HeimdallCore is AccessControl {
    error InvalidRole();
    error InvalidAdmin();
    error PermissionDenied();

    bytes32 internal constant HEIMDALL_OWNER = keccak256('OWNER');
    bytes32 internal constant HEIMDALL_CONTRACT = keccak256('CONTRACT');
    mapping(string => bytes32) public hdlroles;

    constructor(address project_owner, address project_server, address[] memory admins) {
        // CORE access
        _grantRole(HEIMDALL_OWNER, msg.sender);
        _grantRole(HEIMDALL_CONTRACT, msg.sender);
        _setRoleAdmin(HEIMDALL_OWNER, HEIMDALL_OWNER);        // Only OWNER can create OWNER
        _setRoleAdmin(HEIMDALL_CONTRACT, HEIMDALL_OWNER);     // Only OWNER can create CONTRACT

        // Init as needed
        _initProject(project_owner, project_server, admins);
    }

    /**
     * Assign roles to addersses.
     */
    function _initProject(address project_owner, address project_server, address[] memory admins) internal virtual {
        hdlroles['PROJECT.OWNER'] = keccak256('PROJECT.OWNER');
        hdlroles['PROJECT.SERVER'] = keccak256('PROJECT.SERVER');    // Use on server
        hdlroles['PROJECT.ADMIN'] = keccak256('PROJECT.ADMIN');

        // Give OWNER contral over the project
        _grantRole(hdlroles['PROJECT.OWNER'], msg.sender);

        // PROJECT access
        _grantRole(hdlroles['PROJECT.OWNER'], project_owner);
        _grantRole(hdlroles['PROJECT.SERVER'], project_owner);
        _grantRole(hdlroles['PROJECT.ADMIN'], project_owner);

        // SERVER access
        _grantRole(hdlroles['PROJECT.SERVER'], project_server);

        // PROJECT admins
        _setRoleAdmin(hdlroles['PROJECT.OWNER'], HEIMDALL_OWNER);
        _setRoleAdmin(hdlroles['PROJECT.SERVER'], hdlroles['PROJECT.OWNER']);
        _setRoleAdmin(hdlroles['PROJECT.ADMIN'], hdlroles['PROJECT.OWNER']);

        // ADMINS (optional)
        uint len = admins.length;
        for (uint i; i < len; i++) {
            _grantRole(hdlroles['PROJECT.ADMIN'], admins[i]);
        }
    }

    function _checkRole(bytes32 role, address account) internal view virtual override {
        if (!hasRole(role, account)) revert('You shall not pass!');
    }

    /**
     * Check if a role exists in order to prevent overwrities.
     */
    function _exists(string memory role) private view returns (bool) {
        bytes32 kcrole = keccak256(abi.encodePacked(role));
        return kcrole == keccak256(abi.encodePacked('OWNER')) ||
            kcrole == keccak256(abi.encodePacked('CONTRACT')) ||
            kcrole == keccak256(abi.encodePacked('')) || kcrole == hdlroles[role];
    }

    function addRole(string memory _role, string memory _admin, address[] memory addrs) external onlyRole(HEIMDALL_OWNER) {
        if(_exists(_role)) revert InvalidRole();
        if(!_exists(_admin)) revert InvalidAdmin();

        bytes32 role = keccak256(bytes(_role));
        hdlroles[_role] = role;
        bytes32 admin = keccak256(bytes(_admin)) == HEIMDALL_OWNER ? HEIMDALL_OWNER : hdlroles[_admin];

        _grantRole(role, msg.sender);
        _setRoleAdmin(role, admin);

        uint len = addrs.length;
        for (uint i; i < len; i++) {
            _grantRole(role, addrs[i]);
        }
    }
}