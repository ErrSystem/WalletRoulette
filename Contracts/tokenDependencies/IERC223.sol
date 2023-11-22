pragma solidity ^0.8.0;

/**
 * @dev Interface of the ERC223 standard token as defined in the EIP-223 https://eips.ethereum.org/EIPS/eip-223.
 */

abstract contract IERC223 {
  
    /**
     * @dev Transfers `value` tokens from `msg.sender` to `to` address
     * and returns `true` on success.
     */
    function transfer(address to, uint value) public virtual returns (bool success);

     /**
     * @dev Event that is fired on successful transfer.
     */
    event Transfer(address indexed from, address indexed to, uint value);
}
