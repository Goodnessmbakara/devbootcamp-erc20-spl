// SPDX-License-Identifier: MIT

pragma solidity >= 0.7.0;
pragma abicoder v2;

import './erc20_for_spl.sol';

contract EnhancedERC20ForSpl is ERC20ForSplMintable {
    address private _mintAuthority;

    event MintAuthorityTransferred(address indexed previousAuthority, address indexed newAuthority);
    event AccountClosed(address indexed account);

    constructor(
        string memory _name,
        string memory _symbol,
        uint8 _decimals,
        address _mint_authority
    ) ERC20ForSplMintable(_name, _symbol, _decimals, _mint_authority) {
        _mintAuthority = _mint_authority;
    }

    function mintAuthority() public view returns (address) {
        return _mintAuthority;
    }

    function transferMintAuthority(address newAuthority) public {
        require(msg.sender == _mintAuthority, "EnhancedERC20: only mint authority can transfer");
        require(newAuthority != address(0), "EnhancedERC20: new authority is the zero address");
        
        address oldAuthority = _mintAuthority;
        _mintAuthority = newAuthority;
        
        emit MintAuthorityTransferred(oldAuthority, newAuthority);
    }

    function closeAccount() public {
        address account = msg.sender;
        bytes32 solanaAccount = _solanaAccount(account);
        
        // Check if account has any balance
        require(_splToken.getAccount(solanaAccount).amount == 0, "EnhancedERC20: account has non-zero balance");
        
        // Close the account
        _splToken.closeAccount(solanaAccount);
        
        emit AccountClosed(account);
    }

    // Instead of overriding mint, we'll use the original mint function
    // The mint authority check is handled by the base contract's _admin
    // which is set to _mint_authority in the constructor
} 