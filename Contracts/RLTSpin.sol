// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./RLTERC223.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenSale is Ownable, ReentrancyGuard {
    using SafeMath for uint256;

    RouletteToken public tokenContract;
    AggregatorV3Interface public priceFeed;
    uint256 public rltAmount;

    event TokensPurchased(address indexed buyer, uint256 amountBNB, uint256 amountRLT);
    event BNBReceived(address indexed from, uint256 value);

    constructor(address _tokenContract, address initialOwner)
        Ownable(initialOwner)
    {
        tokenContract = RouletteToken(_tokenContract);
        // priceFeed = AggregatorV3Interface(0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE);
    }

    receive() external payable nonReentrant {
        require(msg.value != 0, "Amount must be greater than zero");
        processTransfer(msg.value);
        transferBNB(owner(), msg.value);
    }

    function processTransfer(uint256 bnbAmount) internal {
        require(bnbAmount > 0, "Amount must be greater than zero");

        // Get BNB/USD price from Chainlink Price Feed
        // (, int256 price, , ,) = priceFeed.latestRoundData();
        int256 price = 1;

        require(price > 0, "Invalid price");

        // Calculate the number of RLTs based on sent BNBs and its current price + I calculate in Cents because solidity doesnt support float nums
        uint256 sentBNBCents = bnbAmount.mul(uint256(price)).mul(100).div(10**18);

        if (sentBNBCents > 70 && sentBNBCents <= 130) {
            rltAmount = 5;
        } else if (sentBNBCents > 270 && sentBNBCents <= 330) {
            rltAmount = 25;
        } else if (sentBNBCents > 570 && sentBNBCents <= 630) {
            rltAmount = 50;
        } else if (sentBNBCents > 970 && sentBNBCents <= 1030) {
            rltAmount = 100;
        } else if (sentBNBCents > 1470 && sentBNBCents <= 1530) {
            rltAmount = 250;
        } else {
            revert("Invalid number of tokens to buy");
        }

        // Transfer RLTs to the buyer
        tokenContract.transferFromOwner(rltAmount, msg.sender);

        // Emit event
        emit TokensPurchased(msg.sender, bnbAmount, rltAmount);
    }

    function transferBNB(address to, uint256 amount) internal {
        require(to != address(0), "Invalid recipient address");
        require(address(this).balance >= amount, "Insufficient BNB balance");
        (bool success,) = payable(to).call{value: amount, gas: 21000}("");
        require(success, "BNB transfer failed");
    }

}