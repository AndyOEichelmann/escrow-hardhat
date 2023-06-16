// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface EscroTraker {
    function newEscrow(address, address, address, address) external;
}

contract Escrow {
    address public arbiter;
    address payable public beneficiary;
    address public depositor;

    bool public isApproved = false;

    uint public depsited;

    struct Value {
        address depositor;
        address arbiter;
        address beneficiary;
        bool isApproved;
        uint balance;
    }

    constructor(
        address _arbiter,
        address payable _beneficiary,
        address _escroTraker
    ) payable {
        arbiter = _arbiter;
        beneficiary = _beneficiary;
        depositor = msg.sender;
        depsited = address(this).balance;
        // calls the escrow traker contract to register tis contract
        EscroTraker(_escroTraker).newEscrow(
            depositor,
            beneficiary,
            arbiter,
            address(this)
        );
    }

    event Approved(uint _balance);

    function approve() external {
        require(
            msg.sender == arbiter,
            "Only the arbiter can call this function"
        );
        require(!isApproved, "The transaction hass alredy bean aproved");
        uint balance = address(this).balance;
        (bool sent, ) = beneficiary.call{value: balance}("");
        require(sent, "Failed to send Ether");
        emit Approved(balance);
        isApproved = true;
    }

    // vew the contract data information when asked
    function viewContract() external view returns (Value memory) {
        Value memory _value = Value(
            depositor,
            arbiter,
            beneficiary,
            isApproved,
            depsited
        );
        return _value;
    }
}
