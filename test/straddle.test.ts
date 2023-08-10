import { MaxUint256 } from '@ethersproject/constants';
import { Event } from '@ethersproject/providers/lib/base-provider';
import { lyraConstants, lyraEvm, lyraUtils, TestSystem, TestSystemContractsType } from '@lyrafinance/protocol';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import chai, { expect } from 'chai';
import { solidity } from 'ethereum-waffle';
import { BigNumber } from 'ethers';
import { ethers, run } from 'hardhat';
chai.use(solidity);

describe('Straddle integration test', () => {
  let account: SignerWithAddress;
  let testSystem: TestSystemContractsType;

  let boardIds: BigNumber[];
  let strikeIds: BigNumber[];

  let snap: number;

  before(async () => {
    [account] = await ethers.getSigners();
    const enableTracer = true;
    testSystem = await TestSystem.deploy(account, enableTracer);
    await TestSystem.seed(account, testSystem);
    await run("deploy:Straddle", {optionMarketAddress: testSystem.optionMarket.address, quoteAsset: testSystem.snx.quoteAsset.address})
  });

  beforeEach(async () => {
    snap = await lyraEvm.takeSnapshot();
  });

  afterEach(async () => {
    await lyraEvm.restoreSnapshot(snap);
  });

  it('should create long straddle', async () => {
    boardIds = await testSystem.optionMarket.getLiveBoards();
    strikeIds = await testSystem.optionMarket.getBoardStrikes(boardIds[0]);
    const Straddle = await ethers.getContract("Straddle");

    const susd = testSystem.snx.quoteAsset;
    await susd.connect(account).approve(Straddle.address, MaxUint256);
    const tx = await Straddle.connect(account).buyStraddle(lyraUtils.toBN('1'), strikeIds[0]);
    await tx.wait();

    const userPositions = await testSystem.optionToken.getOwnerPositions(Straddle.address);
    expect(userPositions).to.have.length(2);
  });
});