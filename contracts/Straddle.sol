//SPDX-License-Identifier: ISC
pragma solidity 0.8.9;

import { OptionMarket } from "@lyrafinance/protocol/contracts/OptionMarket.sol";
import "openzeppelin-contracts-4.4.1/token/ERC20/IERC20.sol";

contract Straddle {

    address public immutable optionMarket;
    address public immutable quoteAsset;

    constructor(address _optionMarket, address _quoteAsset) {
        optionMarket = _optionMarket;
        quoteAsset = _quoteAsset;
        IERC20(quoteAsset).approve(optionMarket, type(uint256).max);
    }
    /**
     * @dev Function to buy a straddle option, which involves purchasing both a call option and a put option with the same strike price and expiration date.
     * @param size The size of the straddle option to be purchased.
     * @param strikeId The unique identifier of the strike price for the options to be purchased.
     */
    function buyStraddle(uint256 size, uint256 strikeId) external {
        // transfer all quote assets from user as we don't know exact amount needed beforehand
        if (!IERC20(quoteAsset).transferFrom(msg.sender, address(this), IERC20(quoteAsset).balanceOf(msg.sender))) {
            revert QuoteTransferFailed(address(this), msg.sender, address(this), IERC20(quoteAsset).balanceOf(msg.sender));
        }
        
        OptionMarket(optionMarket).openPosition(OptionMarket.TradeInputParameters({
            strikeId: strikeId,
            positionId: 0,
            iterations: 1,
            optionType: OptionMarket.OptionType.LONG_CALL,
            amount: size,
            setCollateralTo: 0,
            minTotalCost: 0,
            maxTotalCost: type(uint256).max
        }));

        OptionMarket(optionMarket).openPosition(OptionMarket.TradeInputParameters({
            strikeId: strikeId,
            positionId: 0,
            iterations: 1,
            optionType: OptionMarket.OptionType.LONG_PUT,
            amount: size,
            setCollateralTo: 0,
            minTotalCost: 0,
            maxTotalCost: type(uint256).max
        }));
        // transfer back remaining quote assets
        IERC20(quoteAsset).transfer(msg.sender, IERC20(quoteAsset).balanceOf(address(this)));
    }

    error QuoteTransferFailed(address thrower, address from, address to, uint amount);
}