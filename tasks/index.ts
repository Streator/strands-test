const { task } = require("hardhat/config");

task(
  "deploy:Straddle",
  "Deploy Straddle contract",
  require("./straddle.deploy")
)
.addParam("optionMarketAddress", "The address of OptionMarket contract", "")
.addParam("quoteAsset", "The address of quoteAsset", "");


