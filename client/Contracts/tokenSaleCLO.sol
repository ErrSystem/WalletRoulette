// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Rlt.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface ISoyPair {
    function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast); 
}

contract RLTSalesCLO is Ownable, ReentrancyGuard {
    using SafeMath for uint256;

    RouletteToken public tokenContract;
    uint256 public rltTransfered = 0;
    uint256 public usdGained = 0;

    event TokensPurchased(address indexed buyer, uint256 amountCLO, uint256 amountRLT);
    event CLOReceived(address indexed from, uint256 value);

    constructor(address _tokenContract, address initialOwner)
        Ownable(initialOwner)
    {
        tokenContract = RouletteToken(_tokenContract);
    }

    ISoyPair constant public CLO_BUSDT = ISoyPair(0xB852AD87329986EaC6e991954fe329231D1E4De1);

    receive() external payable nonReentrant {
        require(msg.value != 0, "Amount must be greater than zero");
        processTransfer(msg.value);
        transferCLO(owner(), msg.value);
    }

    function processTransfer(uint256 CLOAmount) internal {
        require(CLOAmount > 0, "Amount must be greater than zero");

        // Get CLO/USD price using CLO/BUSDT from SoyFinance
        (uint256 reserveBUSDT, uint256 reserveCLO,) = CLO_BUSDT.getReserves();

        uint256 price = reserveCLO.div(reserveBUSDT);

        // Calculate the number of RLTs based on sent CLOs and its current price + I calculate in Cents because solidity doesnt support float nums
        uint256 sentCLOCents = CLOAmount.mul(price).div(10**24);

        require(sentCLOCents > 0, "Invalid amount");

        uint256 rltAmount;

        if (sentCLOCents > 70 && sentCLOCents <= 130) {
            rltAmount = 5;
        } else if (sentCLOCents > 270 && sentCLOCents <= 330) {
            rltAmount = 25;
        } else if (sentCLOCents > 570 && sentCLOCents <= 630) {
            rltAmount = 50;
        } else if (sentCLOCents > 970 && sentCLOCents <= 1030) {
            rltAmount = 100;
        } else if (sentCLOCents > 1470 && sentCLOCents <= 1530) {
            rltAmount = 250;
        } else {
            revert("Invalid number of tokens to buy");
        }

        rltAmount.mul(10**18);

        rltTransfered.add(rltAmount);
        usdGained.add(sentCLOCents.div(10**2));

        // Transfer RLTs to the buyer
        tokenContract.transferFromOwner(rltAmount, msg.sender);

        // Emit event
        emit TokensPurchased(msg.sender, CLOAmount, rltAmount);
    }

    function transferCLO(address to, uint256 amount) internal {
        require(to != address(0), "Invalid recipient address");
        require(address(this).balance >= amount, "Insufficient CLO balance");
        (bool success,) = payable(to).call{value: amount}("");
        require(success, "CLO transfer failed");
    }

}