const token = artifacts.require("DappToken");

module.exports = function(deployer) {
  deployer.deploy(token);
};
