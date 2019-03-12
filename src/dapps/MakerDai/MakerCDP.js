/* eslint-disable */
import Maker from '@makerdao/dai';
import BigNumber from 'bignumber.js';
import * as unit from 'ethjs-unit';

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
    this.debtValue = toBigNumber(0);
    this._collatRatio = 0;
    this._ethCollateral = toBigNumber(0);
    this._pethCollateral = toBigNumber(0);
    this.usdCollateral = toBigNumber(0);
    this.maxEthDraw = '0';
    this.maxPethDraw = '0';
    this.maxDaiDraw = '0';

    if (toInit) this.init(this.cdpId);
  }

  async init(cdpId = this.cdpId) {
    this.cdp = await this.maker.getCdp(cdpId);
    const liqPrice = await this.cdp.getLiquidationPrice();
    this.liqPrice = liqPrice.toBigNumber().toFixed(2);
    this.isSafe = await this.cdp.isSafe();
    this.debtValue = (await this.cdp.getDebtValue()).toBigNumber();
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

    this.maxDaiDraw = bnOver(
      this._ethPrice,
      this._ethCollateral,
      this.liquidationRatio
    )
      .minus(this.debtValue)
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

  atRisk() {
    return !!this._collatRatio.lte(2);
  }

  lockEth(amount){
    const inWei = unit.toWei(amount, 'ether');
    return this.cdp.lockEth(inWei, ETH.wei);
  }

  toUSD(eth){
    return this._ethPrice.times(toBigNumber(eth));
  }

  maxWithDraw() {
    const tl = this._ethPrice.times(this._ethCollateral);
    const tr = this.debtValue.times(this.liquidationRatio);
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
