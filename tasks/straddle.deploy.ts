// SPDX-License-Identifier: BUSL-1.1
module.exports = async function (
  { optionMarketAddress, quoteAsset },
  { getNamedAccounts, deployments: { deploy } }
) {
  
const { deployer } = await getNamedAccounts();

  const StrandsTest = await deploy("Straddle", {
    from: deployer,
    args: [optionMarketAddress, quoteAsset],
    log: true,
  });


  return StrandsTest;
};
