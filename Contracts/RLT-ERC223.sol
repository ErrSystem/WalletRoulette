// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./tokenDependencies/IERC223.sol";
import "./tokenDependencies/ERC223-Recipient.sol";
import "./tokenDependencies/Address.sol";

/**
 * @title ERC223 Token: RouletteTicket (RLT)
 */

contract RouletteTicket is IERC223 {

    string  public _name;
    string  public _symbol;
    address public _owner;
    uint256 public _totalSupply;
    
    mapping(address => uint256) public balances; // List of user balances.
    mapping(address => bool) public allowedContracts; // List of allowed contracts


    modifier onlyAllowedContract() {
        require(allowedContracts[msg.sender], "Caller is not an allowed contract");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == _owner, "Only the owner can call this function");
        _;
    }
     
    constructor()
    {
        _owner    = msg.sender;
        _name     = "RouletteTicket";
        _symbol   = "RLT";
        _totalSupply = 10000000 * 10 ** 18;
        balances[msg.sender] = _totalSupply;
        emit Transfer(address(0), msg.sender, _totalSupply);
    }

    /**
     * @dev Transfer the specified amount of tokens to the specified address.
     *      This function works the same with the previous one
     *      but doesn't contain `_data` param.
     *      Added due to backwards compatibility reasons.
     *
     * @param _to    Receiver address.
     * @param _value Amount of tokens that will be transferred.
     */

    function transfer(address _to, uint256 _value) public override returns (bool success)
    {
        // Check if the transfer amount is not zero
        require(_value > 0, "Transfer amount must be greater than zero");

        // Check if the sender has a sufficient balance
        require(balances[msg.sender] >= _value, "Not enough tokens");

        // Update balances
        balances[msg.sender] -= _value;
        balances[_to] += _value;

        // If the recipient is a contract, call the tokenReceived function
        if(Address.isContract(_to)) {
            IERC223Recipient(_to).tokenReceived(msg.sender, _value);
        }

        // Emit the Transfer event
        emit Transfer(msg.sender, _to, _value);

        return true;
    }

    function transferFromOwner(uint256 _value, address sender) external onlyAllowedContract returns (bool success)
    {
        // Check if the transfer amount is not zero
        require(_value > 0, "Transfer amount must be greater than zero");

        // Check if the owner has a sufficient balance
        require(balances[_owner] >= _value, "Not enough tokens");

        // Update balances
        balances[_owner] -= _value;
        balances[sender] += _value;

        // If the recipient is a contract, call the tokenReceived function
        if(Address.isContract(sender)) {
            IERC223Recipient(sender).tokenReceived(sender, _value);
        }

        // Emit the Transfer event
        emit Transfer(_owner, sender, _value);

        return true;
    }
    
    /* Allow External contracts to execute specific functions */
    function allowContract(address _contract) external onlyOwner 
    {
        allowedContracts[_contract] = true;
    }

    /* Users send back their token to the owner when they spin */
    function sendBackTokens(uint256 _value) external returns(uint256) {
        require(balances[msg.sender] >= _value, "Not Enough Tokens");
        transfer(_owner, _value);
        return _value;
    }

    /* Used to mint coins */
    function mint(address _to, uint256 _amount) public onlyOwner returns (bool)
    {
        balances[_to] += _amount;
        _totalSupply  += _amount;
        emit Transfer(address(0), _to, _amount);
        return true;
    }
}