/* eslint-disable */
import Maker from '@makerdao/dai';
import BigNumber from 'bignumber.js';
import * as unit from 'ethjs-unit';

const { MKR, DAI, ETH, WETH, PETH, USD_ETH, USD_MKR, USD_DAI } = Maker;

const toBigNumber = num => {
  return new BigNumber(num);
};

const bnOver = (one, two, three) => {
  return toBigNumber(one)
    .times(toBigNumber(two))
    .div(toBigNumber(three));
};

export default class MakerCDP {
  constructor(cdpId, maker, priceService, cdpService, sysVars, toInit) {
    this.txMgr = maker.service('transactionManager');
    this.cdpId = cdpId;
    this.cdp = {};
    this.maker = maker;
    this.web3 = sysVars.web3 || {};
    this.priceService = priceService;
    this.cdpService = cdpService;
    this.ready = false;
    this.liquidationRatio = sysVars.liquidationRatio || toBigNumber(0);
    this.liquidationPenalty = sysVars.liquidationPenalty || toBigNumber(0);
    this.stabilityFee = sysVars.stabilityFee || toBigNumber(0);
    this._ethPrice = sysVars.ethPrice || toBigNumber(0);
    this.pethPrice = sysVars.pethPrice || toBigNumber(0);
    this.wethToPethRatio = 0;
    this.daiPrice = 0;
    this.priceFloor = 0;
    this.ethQty = 0;
    this.daiQty = 0;
    this.cdps = [];
    this.cdpDetailsLoaded = false;

    this.liqPrice = toBigNumber(0);
    this.isSafe = false;
    this._debtValue = toBigNumber(0);
    this._collatRatio = 0;
    this._ethCollateral = toBigNumber(0);
    this._pethCollateral = toBigNumber(0);
    this.usdCollateral = toBigNumber(0);
    this.maxEthDraw = '0';
    this.maxPethDraw = '0';
    this._maxDaiDraw = '0';

    if (toInit) this.init(this.cdpId);
  }

  async init(cdpId = this.cdpId) {
    this.cdp = await this.maker.getCdp(cdpId);
    this.proxyAddress = await this.maker.service('proxy').currentProxy();
    const liqPrice = await this.cdp.getLiquidationPrice();
    this.liqPrice = liqPrice.toBigNumber().toFixed(2);
    this.isSafe = await this.cdp.isSafe();
    this._debtValue = (await this.cdp.getDebtValue()).toBigNumber();
    this._collatRatio = await this.cdp.getCollateralizationRatio();
    this._ethCollateral = (await this.cdp.getCollateralValue()).toBigNumber();
    this._pethCollateral = (await this.cdp.getCollateralValue(
      Maker.PETH
    )).toBigNumber();
    this.usdCollateral = (await this.cdp.getCollateralValue(
      Maker.USD
    )).toBigNumber();

    this.maxEthDraw = bnOver(
      this.liquidationRatio,
      this.usdCollateral,
      this._ethPrice
    ).toString();

    this.maxPethDraw = bnOver(
      this.pethPrice,
      this._pethCollateral,
      this.liquidationRatio
    ).toString();

    this._maxDaiDraw = bnOver(
      this._ethPrice,
      this._ethCollateral,
      this.liquidationRatio
    )
      .minus(this._debtValue)
      .toString();

    this.ready = true;
    return this;
  }

  get ethPrice() {
    return this._ethPrice;
  }

  get ethCollateral() {
    return this._ethCollateral;
  }

  get pethCollateral() {
    return this._pethCollateral;
  }

  get collatRatio() {
    return this._collatRatio;
  }

  get debtValue() {
    return this._debtValue;
  }

  get maxDaiDraw(){
    return this._maxDaiDraw;
  }

  get maxDai(){
    return this._maxDaiDraw;
  }

  atRisk() {
    return !!this._collatRatio.lte(2);
  }

  async getProxy() {
    console.log(await this.maker.service('proxy')); // todo remove dev item
    return this.maker.service('proxy').currentProxy();
  }

  async buildProxy() {
    const proxyService = this.maker.service('proxy');
    if (!proxyService.currentProxy()) {
      return await proxyService.build();
    }
  }

  async lockEth(amount) {
    const result = this.cdpService.lockEthProxy(
      this.proxyAddress,
      this.cdpId,
      amount
    );
    try {
      // this.txMgr.listen(result, {
      //   pending: tx => {
      //     console.log('pending', tx); // todo remove dev item
      //     const { contract, method } = tx.metadata;
      //     if (contract === 'WETH' && method === 'deposit') {
      //       console.log(tx.hash); // print hash for WETH.deposit
      //     }
      //     // do something when tx is pending
      //   },
      //   mined: tx => {
      //     console.log('mined', tx); // todo remove dev item
      //     // do something when tx is mined
      //   },
      //   confirmed: tx => {
      //     console.log('confirmed', tx); // todo remove dev item
      //     // do something when tx is confirmed
      //   },
      //   error: tx => {
      //     console.log('ERROR', tx); // todo remove dev item
      //     // do someting when tx fails
      //   }
      // });
    } catch (e) {
      console.log(e)
    }

    return result;
  }


  drawDai(amount, acknowledgeBypass = false) {
    if (this.calcCollatRatio(this.ethCollateral, this.debtValue.plus(amount)).gt(2) || acknowledgeBypass) {
      try {
        const result = this.cdpService.drawDaiProxy(
          this.proxyAddress,
          this.cdpId,
          amount
        );
      } catch (e) {
        console.log(e)
      }
    }
  }

  toUSD(eth) {
    return this._ethPrice.times(toBigNumber(eth));
  }

  maxWithDraw() {
    const tl = this._ethPrice.times(this._ethCollateral);
    const tr = this._debtValue.times(this.liquidationRatio);
    return tl.minus(tr).div(this._ethPrice);
  }

  calcMinCollatRatio(priceFloor) {
    return bnOver(this._ethPrice, this.liquidationRatio, priceFloor);
  }

  calcDrawAmt(principal, collatRatio) {
    return Math.floor(
      bnOver(principal, this._ethPrice, collatRatio).toNumber()
    );
  }

  calcCollatRatio(ethQty, daiQty) {
    if (ethQty <= 0 || daiQty <= 0) return 0;
    return bnOver(this._ethPrice, ethQty, daiQty);
  }

  calcLiquidationPrice(ethQty, daiQty) {
    if (ethQty <= 0 || daiQty <= 0) return 0;
    const getInt = parseInt(this._ethPrice);
    for (let i = getInt; i > 0; i--) {
      const atValue = bnOver(i, ethQty, daiQty).lte(this.liquidationRatio);
      if (atValue) {
        return i;
      }
    }
  }
}
