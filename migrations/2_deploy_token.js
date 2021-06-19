const DappToken = artifacts.require('DappToken')
const SwapToken = artifacts.require('Swap')

module.exports = async function(deployer) {
  await deployer.deploy(DappToken);
  const dappTken = await DappToken.deployed()


  await deployer.deploy(SwapToken,dappTken.address)
  const swapToken = await SwapToken.deployed()
  console.log(swapToken.address)
  await dappTken.transfer(swapToken.address,'1000000000000000000000000')
};
