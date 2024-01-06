// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IERC223.sol";
import "./ERC223Recipient.sol";
import "./Address.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title RouletteToken ERC223.
 */
contract RouletteToken is IERC223, Ownable, ReentrancyGuard {
    using SafeMath for uint256;

    string  public _name;
    string  public _symbol;
    uint256 public _totalSupply;
    
    mapping(address => uint256) public balances; // List of user balances.
    mapping(address => bool) public allowedContracts; // List of allowed contracts (used to allow the tokenSale.sol contract once its deployed)

    modifier onlyAllowedContract() {
        require(allowedContracts[msg.sender], "Caller is not an allowed contract");
        _;
    }

    constructor(address initialOwner)
        Ownable(initialOwner)
    {
        _name = "RouletteToken";
        _symbol = "RLT";
        _totalSupply = 10000000 * 10 ** 18; // 10M in total supply
        balances[msg.sender] = _totalSupply; // send it to the owner
        emit Transfer(address(0), msg.sender, _totalSupply);
    }

    /**
     * @dev Transfer the specified amount of tokens to the specified address.
     *     
     * @param _to    Receiver address.
     * @param _value Amount of tokens that will be transferred.
     */
    function transfer(address _to, uint256 _value) public override nonReentrant returns (bool success)
    {
        // Check if the transfer amount is not zero
        require(_value > 0, "Transfer amount must be greater than zero");

        // Check if the sender has a sufficient balance
        require(balances[msg.sender] >= _value, "Not enough tokens");

        // Update balances
        balances[msg.sender] = balances[msg.sender].sub(_value);
        balances[_to] = balances[_to].add(_value);

        // If the recipient is a contract, call the tokenReceived function
        if(Address.isContract(_to)) {
            IERC223Recipient(_to).tokenReceived(msg.sender, _value);
        }

        // Emit the Transfer event
        emit Transfer(msg.sender, _to, _value);

        return true;
    }

    // the same function as the previous one but the tokens are sent from the owner
    function transferFromOwner(uint256 _value, address sender) external onlyAllowedContract nonReentrant returns (bool success)
    {
        // Check if the transfer amount is not zero
        require(_value > 0, "Transfer amount must be greater than zero");

        // Check if the owner has a sufficient balance
        require(balances[owner()] >= _value, "Not enough tokens");

        // Update balances
        balances[owner()] = balances[owner()].sub(_value);
        balances[sender] = balances[sender].add(_value);

        // If the recipient is a contract, call the tokenReceived function
        if(Address.isContract(sender)) {
            IERC223Recipient(sender).tokenReceived(sender, _value);
        }

        // Emit the Transfer event
        emit Transfer(owner(), sender, _value);

        return true;
    }

    // allow smart contracts (used to allow tokenSale.sol)
    function allowContract(address _contract) external onlyOwner 
    {
        allowedContracts[_contract] = true;
    }

    // Used to reduce the number of tokens a user has
    function sendBackTokens(uint256 _value) external returns(uint256) {
        require(balances[msg.sender] >= _value, "Not Enough Tokens");
        transfer(owner(), _value);
        return _value;
    }

    /* Used to mint coins */
    function mint(address _to, uint256 _amount) public onlyOwner returns (bool)
    {
        balances[_to] = balances[_to].add(_amount);
        _totalSupply = _totalSupply.add(_amount);
        emit Transfer(address(0), _to, _amount);
        return true;
    }
}