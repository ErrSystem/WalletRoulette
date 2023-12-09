// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./RLTERC223.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenSale is Ownable, ReentrancyGuard {
    using SafeMath for uint256;

    RouletteToken public tokenContract; // The contract of the token
    AggregatorV3Interface public priceFeed; // To get the price of BNB/USD
    uint256 public rltAmount; // The amount of rlts thats needs to be sent 

    event TokensPurchased(address indexed buyer, uint256 amountBNB, uint256 amountRLT);
    event BNBReceived(address indexed from, uint256 value);

    constructor(address _tokenContract, address initialOwner)
        Ownable(initialOwner)
    {
        tokenContract = RouletteToken(_tokenContract); // define the address of the token contract
        priceFeed = AggregatorV3Interface(0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE); // the address of the price feed BNB/USD
    } 
 
    receive() external payable nonReentrant { // To receive BNB
        require(msg.value != 0, "Amount must be greater than zero");
        processTransfer(msg.value); // Calculates the number of rlts we want to send and send them
        transferBNB(owner(), msg.value); // Transfer BNB to the owner
    }

    function processTransfer(uint256 bnbAmount) internal { // Calculates the amount of RLTs based on sent BNBs and their current price 
        require(bnbAmount > 0, "Amount must be greater than zero");

        // Get BNB/USD price from Chainlink Price Feed
        (, int256 price, , ,) = priceFeed.latestRoundData();

        require(price > 0, "Invalid price");

        // Calculate the number of RLTs based on sent BNBs and their current price (calculated in Cents because solidity doesnt support float nums)
        uint256 sentBNBCents = bnbAmount.mul(uint256(price)).div(10**24); // BNB are defined in WEI so I need to divise them by 10**18 but I did 10**16 since 1$ = 10**2 cents

        // Prices are just examples
        if (sentBNBCents > 70 && sentBNBCents <= 130) { // around 1$ = 5RLTs
            rltAmount = 5*10**18;
        } else if (sentBNBCents > 270 && sentBNBCents <= 330) { // around 3$ = 25
            rltAmount = 25*10**18;
        } else if (sentBNBCents > 570 && sentBNBCents <= 630) { // around 6$ = 50
            rltAmount = 50*10**18; 
        } else if (sentBNBCents > 970 && sentBNBCents <= 1030) { // around 10$ = 100
            rltAmount = 100*10**18;
        } else if (sentBNBCents > 1470 && sentBNBCents <= 1530) { // around 15$ = 250
            rltAmount = 250*10**18;
        } else {
            revert("Invalid number of tokens to buy");
        }

        // Transfer RLTs to the user
        tokenContract.transferFromOwner(rltAmount, msg.sender); // Transfer Rlts from the owner to the user

        // Emit event
        emit TokensPurchased(msg.sender, bnbAmount, rltAmount);
    }

    function transferBNB(address to, uint256 amount) internal {
        require(to != address(0), "Invalid recipient address");
        require(address(this).balance >= amount, "Insufficient BNB balance");
        (bool success,) = payable(to).call{value: amount}(""); // I am not sure for the GAS amount can you check it please? Thank you for your time :)
        require(success, "BNB transfer failed");
    }
}