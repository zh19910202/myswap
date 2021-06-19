pragma solidity ^0.5.0;


import "./DappToken.sol";
contract Swap {
    
    string public name = "SWAP";
    address public owner ;
    DappToken public token;
    constructor(DappToken _token)public{
        owner = msg.sender;
        token = _token;
    }
    
    //buy token
    function buyToekn()public payable{
       
        uint giving = msg.value * 100;
        require(token.balanceOf(address(this)) >= giving);
        
        token.transfer(msg.sender,giving);
        
    }
    
    event getinfo(address,address);
    //sell token
    function sellToken(uint256 account)public returns(bool){
        require(token.transferFrom(msg.sender,address(this),account));
        msg.sender.transfer(account/100);
        emit getinfo(msg.sender,address(this));
    }
  

}
