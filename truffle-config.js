require('babel-register');
require('babel-polyfill');


var HDWalletProvider = require("truffle-hdwallet-provider");  // 导入模块
var mnemonic = "position apart sketch elder mountain end guitar feel cliff alert slush duck";  //MetaMask的助记词。

module.exports = {
  networks: {
    // development: {
    //   host: "127.0.0.1",
    //   port: 8545,
    //   network_id: "*" // Match any network id
    // },
    ropsten: {
      provider: function() {
          // mnemonic表示MetaMask的助记词。 "ropsten.infura.io/v3/33..."表示Infura上的项目id
          return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/v3/4db46ccfcd3247c89a0eb5b962016374", 0);   // 0表示第二个账户(从0开始)
      },
      network_id: "*",  // match any network
      gas: 3012388,
      gasPrice: 20000000000,
      confirmations: 2,    // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
  },
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      optimizer: {
        enabled: true,
        runs: 200
      },
      evmVersion: "petersburg"
    }
  }
}
