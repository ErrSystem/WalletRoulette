// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./RLTERC223.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract TokenSale {
    using SafeMath for uint256;

    address public _owner;
    RouletteTicket public tokenContract;
    AggregatorV3Interface public priceFeed;
    uint256 public rltAmount;

    event TokensPurchased(address indexed buyer, uint256 amountBNB, uint256 amountRLT);
    event BNBReceived(address indexed from, uint256 value);

    constructor(address _tokenContract) {
        _owner = msg.sender;
        tokenContract = RouletteTicket(_tokenContract);
        priceFeed = AggregatorV3Interface(0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE);
    }

    receive() external payable {
        require(msg.value != 0, "Amount must be greater than zero");
        bool success = processTransfer(msg.value);
        if (success) {
            transferBNB(_owner, msg.value);
        } else {
            transferBNB(msg.sender, msg.value);
        }
    }

    function processTransfer(uint256 bnbAmount) internal returns (bool) {
        bnbAmount = msg.value;
        require(bnbAmount > 0, "Amount must be greater than zero");

        // Get BNB/USD price from Chainlink Price Feed
        (, int256 price, , ,) = priceFeed.latestRoundData();
        require(price > 0, "Invalid price");

        // Calculate the number of RLTs based on the exchange rate
        uint256 sentBNBCents = bnbAmount.mul(uint256(price)).mul(100).div(10**18);

        if (sentBNBCents > 30 && sentBNBCents <= 150) {
            rltAmount = 5;
        } else if (sentBNBCents > 250 && sentBNBCents <= 350) {
            rltAmount = 25;
        } else if (sentBNBCents > 550 && sentBNBCents <= 650) {
            rltAmount = 50;
        } else if (sentBNBCents > 950 && sentBNBCents <= 1050) {
            rltAmount = 100;
        } else if (sentBNBCents > 1450 && sentBNBCents <= 1550) {
            rltAmount = 250;
        } else {
            revert("Invalid number of tokens to buy");
        }

        // Transfer RLTs to the buyer
        tokenContract.transferFromOwner(rltAmount, msg.sender);

        // Emit event
        emit TokensPurchased(msg.sender, bnbAmount, rltAmount);

        return true;
    }

    function transferBNB(address to, uint256 amount) internal  {
        require(to != address(0), "Invalid recipient address");
        require(address(this).balance >= amount, "Insufficient BNB balance");
        (bool success, ) = payable(to).call{value: amount}("");
        require(success, "BNB transfer failed");
    }

}