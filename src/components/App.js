import React, { Component } from 'react'
import Web3 from 'web3'
import DappToken from '../abis/DappToken.json'
import Swap from "../abis/Swap.json"
import './App.css'

class App extends Component {

  async componentWillMount() {
    await this.initWeb3()
    await this.loadBlockchainData()
    await this.getCurrentBalanceOf()
    await this.getCurrentBalanceOfToekn()
    await this.getSwapBalanceOfToekn()
  }

  //获取交易所持有代币
  getSwapBalanceOfToekn = async () => {
    const swapData = Swap.networks[this.state.networkId]
    const addr = swapData.address
    let token = await this.state.dappToken.methods.balanceOf(addr).call()
    token = window.web3.utils.fromWei(token, 'ether')
    this.setState({ swapOfTken: token })
  }

  //获取当前账户eth
  getCurrentBalanceOf = async () => {
    let balanceOfEth = await window.web3.eth.getBalance(this.state.account) 
    balanceOfEth = window.web3.utils.fromWei(balanceOfEth, 'ether');
    this.setState({ balanceOfEth })
    
  }

  //获取当前账户代币
  getCurrentBalanceOfToekn = async () => {
    let token = await this.state.dappToken.methods.balanceOf(this.state.account).call()
    //console.log(token)
    token = window.web3.utils.fromWei(token, 'ether')
    await this.setState({ token: token })
  }

  //加载区块链的数据
  async loadBlockchainData() {
    const web3 = window.web3
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    this.setState({ account: accounts[0] })

    const networkId = await web3.eth.net.getId()
    this.setState({ networkId })
    //console.log(accounts[0],networkId)

    // Load DappToken
    const dappTokenData = DappToken.networks[networkId]
    if (dappTokenData) {
      const dappToken = new web3.eth.Contract(DappToken.abi, dappTokenData.address)
      this.setState({ dappToken })
      this.setState({ tokenAddress: dappTokenData.address })
    } else {
      window.alert('DappToken contract not deployed to detected network.')
    }


    //load swap
    const SwapData = Swap.networks[networkId]
    if (SwapData) {
      const swap = new web3.eth.Contract(Swap.abi, SwapData.address)
      this.setState({ swap })
      this.setState({ swapAddress: SwapData.address })
    } else {
      window.alert('DappToken contract not deployed to detected network.')
    }

  }

  //初始化web3
  async initWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }

  }


  async componentDidMount(){
    window.ethereum.on('chainChanged', (chainId) => {
    console.log("chainId:",chainId)

    this.loadBlockchainData()
    });
     window.ethereum.on('accountsChanged', async()=>{
      
      await this.loadBlockchainData()
      await this.getCurrentBalanceOfToekn()
    });
  }

  constructor(props) {
    super(props)
    this.state = {
      dappToken: {},
      networkId: null,
      account: null,
      swap: {},
      balanceOfEth: 0,
      swapOfTken: 0,
      token: 0,
      buytoken: "",
      selltoken: "",
      swapAddress: null,
      tokenAddress: null,
      transfertoken:'',
      transaccount:'',
  
    }
  }
  changed = async (event,type) => {
    let value = event.target.value
    if (type === 'buy'){
      this.setState({ buytoken: value })
    }else if(type === 'sell'){
      this.setState({ selltoken: value })
    }else if(type ==='transfertoken'){
      this.setState({ transfertoken: value })
    }else if (type==='transaccount'){
      this.setState({ transaccount: value })
    }
  }
  // 购买token
  buyDai = async () => {
    let value = this.state.buytoken
    value = window.web3.utils.toWei(value,'ether')
    const res = await this.state.swap.methods.buyToekn().send({ from: this.state.account, value: value })
    if (res.status === true) {
      console.log(res)
      this.setState({buytoken:""})
      this.getCurrentBalanceOfToekn()
    }
  }
  //卖掉token
  sellDai = async () => {
    //授权
    let value = this.state.selltoken
    value = window.web3.utils.toWei(value,'ether')
    let res = await this.state.dappToken.methods.approve(this.state.swapAddress, value).send({ from: this.state.account })
    
    if (res.status === true) {
      //console.log(res)
      res = await this.state.swap.methods.sellToken(value).send({ from: this.state.account })
      if (res.status === true) {
        console.log(res)
        this.setState({selltoken:""})
        this.getCurrentBalanceOfToekn()
      }
    }
   
    
  
  }
  
  //转账token
  transferDai = async () => {
    //console.log(this.state.transaccount,this.state.transfertoken)
    let value = this.state.transfertoken
    value = window.web3.utils.toWei(value,'ether')
    const res = await this.state.dappToken.methods.transfer(this.state.transaccount,value).send({ from: this.state.account})
    if (res.status === true) {
      console.log(res)
      this.getCurrentBalanceOfToekn()
    }
}

  render() {

    return (
      <div>
        <div> 当前账户：{this.state.account} </div>
        <div> 当前账户余额：{this.state.balanceOfEth} ETH </div>
        <div> 当前账户token：{this.state.token} Dai</div>
        <div> swap合约token:{this.state.swapOfTken} Dai</div>
        <div> 当前swap合约地址: {this.state.swapAddress}</div>
        <div> 当前token合约地址: {this.state.tokenAddress}</div>
        买Dai：<input type="text"  value= {this.state.buytoken} onChange={event => this.changed(event,'buy')} ></input><button onClick={() => { this.buyDai() }}>确定</button><br></br>
        卖Dai：<input type="text"  value= {this.state.selltoken} onChange={event => this.changed(event,'sell')}></input><button onClick={() => { this.sellDai() }}>确定</button><br></br>
        账户：  <input type="text"  value= {this.state.transaccount} onChange={event => this.changed(event,'transaccount')}></input>  金额：<input type="text"  value= {this.state.transfertoken} onChange={event => this.changed(event,'transfertoken')}></input><button onClick={()=>{this.transferDai()}}>token转账</button>
      </div>

    );
  }
}

export default App;