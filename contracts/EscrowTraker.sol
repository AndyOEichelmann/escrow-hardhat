// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// keeps a trak of escrow contract addresses
contract EscrowTraker {
    mapping(address => address[]) public escrowTraker;

    // wen called registers the contact addres to the asociated direction of each acount invoved
    function newEscrow(
        address _depositor,
        address _benificiary,
        address _arbiter,
        address _escrow
    ) external {
        escrowTraker[_depositor].push(_escrow);
        escrowTraker[_benificiary].push(_escrow);
        escrowTraker[_arbiter].push(_escrow);
    }

    // send bak the address list of the account that is indicated
    function viewEscrow(
        address _address
    ) external view returns (address[] memory) {
        return escrowTraker[_address];
    }
}
