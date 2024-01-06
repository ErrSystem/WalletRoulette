pragma solidity ^0.8.0;

import "https://github.com/Dexaran/ERC223-token-standard/blob/development/token/ERC223/IERC223.sol";
import "https://github.com/Dexaran/ERC223-token-standard/blob/development/token/ERC223/IERC223Recipient.sol";
import "https://github.com/Dexaran/ERC223-token-standard/blob/development/utils/Address.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


/**
 * @title RouletteToken ERC223.
 */
contract RouletteToken is IERC223, Ownable, ReentrancyGuard {
    using SafeMath for uint256;

    string  private _name;
    string  private _symbol;
    uint8   private _decimals;
    uint256 private _totalSupply;
    uint256 private _usedTokens;
    
    mapping(address => uint256) private balances; // List of user balances.
    mapping(address => bool) public allowedContracts; // List of allowed contracts (used to allow the tokenSale.sol contract once its deployed)

    modifier onlyAllowedContract() {
        require(allowedContracts[msg.sender], "Caller is not an allowed contract");
        _;
    }
     
    constructor(address initialOwner, string memory new_name, string memory new_symbol, uint8 new_decimals) Ownable(initialOwner)
    {
        _name     = new_name;
        _symbol   = new_symbol;
        _decimals = new_decimals;
    }

    /**
     * @dev Returns the name of the token.
     */
    function name() public view virtual override returns (string memory)
    {
        return _name;
    }

    /**
     * @dev Returns the symbol of the token.
     */
    function symbol() public view virtual override returns (string memory)
    {
        return _symbol;
    }

    /**
     * @dev Returns the number of decimals used to get its user representation.
     * For example, if `decimals` equals `2`, a balance of `505` tokens should
     * be displayed to a user as `5,05` (`505 / 10 ** 2`).
     *
     * Tokens usually opt for a value of 18, imitating the relationship between
     * Ether and Wei. This is the value {ERC223} uses, unless {_setupDecimals} is
     * called.
     */
    function decimals() public view virtual override returns (uint8)
    {
        return _decimals;
    }

    /**
     * @dev See {IERC223-totalSupply}.
     */
    function totalSupply() public view override returns (uint256)
    {
        return _totalSupply;
    }

    /* Check how many tokens were used */
    function usedRLTs() public view returns (uint256) 
    {
        return _usedTokens;
    }

    /**
     * @dev Returns balance of the `_owner`.
     *
     * @param _owner   The address whose balance will be returned.
     * @return balance Balance of the `_owner`.
     */
    function balanceOf(address _owner) public view override returns (uint256)
    {
        return balances[_owner];
    }
    
    /**
     * @dev Transfer the specified amount of tokens to the specified address.
     *      Invokes the `tokenFallback` function if the recipient is a contract.
     *      The token transfer fails if the recipient is a contract
     *      but does not implement the `tokenFallback` function
     *      or the fallback function to receive funds.
     *
     * @param _to    Receiver address.
     * @param _value Amount of tokens that will be transferred.
     * @param _data  Transaction metadata.
     */
    function transfer(address _to, uint _value, bytes calldata _data) public override returns (bool success)
    {
        // Standard function transfer similar to ERC20 transfer with no _data .
        // Added due to backwards compatibility reasons .
        balances[msg.sender] = balances[msg.sender].sub(_value);
        balances[_to] = balances[_to].add(_value);
        if(Address.isContract(_to)) {
            // It is subjective if the contract call must fail or not
            // when ERC-223 token transfer does not trigger the `tokenReceived` function
            // by the standard if the receiver did not explicitly rejected the call
            // the transfer can be considered valid.
            IERC223Recipient(_to).tokenReceived(msg.sender, _value, _data);
        }
        emit Transfer(msg.sender, _to, _value, _data);
        return true;
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
    function transfer(address _to, uint _value) public override returns (bool success)
    {
        bytes memory _empty = hex"00000000";
        balances[msg.sender] = balances[msg.sender].sub(_value);
        balances[_to] = balances[_to].add(_value);
        if(Address.isContract(_to)) {
            IERC223Recipient(_to).tokenReceived(msg.sender, _value, _empty);
        }
        emit Transfer(msg.sender, _to, _value, _empty);
        return true;
    }

        // the same function as the previous one but the tokens are sent from the owner
    function transferFromOwner(uint256 _value, address sender) external onlyAllowedContract nonReentrant returns (bool success)
    {
        // Check if the transfer amount is not zero
        require(_value > 0, "Transfer amount must be greater than zero");

        // Check if the owner has a sufficient balance
        require(balances[owner()] >= _value, "Not enough tokens");

        bytes memory _empty = hex"00000000";
        // Update balances
        balances[owner()] = balances[owner()].sub(_value);
        balances[sender] = balances[sender].add(_value);
        _usedTokens.add(_value);

        // If the recipient is a contract, call the tokenReceived function
        if(Address.isContract(sender)) {
            IERC223Recipient(sender).tokenReceived(sender, _value, _empty);
        }

        // Emit the Transfer event
        emit Transfer(owner(), sender, _value, _empty);

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

    function mint(address _to, uint256 _amount) public onlyOwner
    {
        _amount = _amount.mul(10**_decimals);
        balances[_to].add(_amount);
        _totalSupply.add(_amount);
        emit Transfer(address(0), _to, _amount, hex"00000000");
    }
}