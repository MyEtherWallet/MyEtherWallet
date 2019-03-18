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
    this.cdpId = cdpId;
    this.cdp = {};
    this.maker = maker;
    this.web3 = sysVars.web3 || {};
    this.priceService = priceService;
    this.cdpService = cdpService;
    this.ready = false;
    this._liquidationRatio = sysVars.liquidationRatio || toBigNumber(0);
    this._liquidationPenalty = sysVars.liquidationPenalty || toBigNumber(0);
    this._stabilityFee = sysVars.stabilityFee || toBigNumber(0);
    this._ethPrice = sysVars.ethPrice || toBigNumber(0);
    this._pethPrice = sysVars.pethPrice || toBigNumber(0);
    this._wethToPethRatio = sysVars.wethToPethRatio || toBigNumber(0);
    this._targetPrice = sysVars.targetPrice || toBigNumber(0);
    this.daiPrice = 0;
    this.priceFloor = 0;
    this.cdps = [];
    this.cdpDetailsLoaded = false;
    this.needsUpdate = false;
    this.closing = false;

    this._liqPrice = toBigNumber(0);
    this.isSafe = false;
    this._debtValue = toBigNumber(0);
    this._collatRatio = 0;
    this._ethCollateral = toBigNumber(0);
    this._pethCollateral = toBigNumber(0);
    this._usdCollateral = toBigNumber(0);
    this._governanceFee = toBigNumber(0);
    // this.maxEthDraw = '0';
    // this.maxPethDraw = '0';
    // this._maxDaiDraw = '0';

    if (toInit) this.init(this.cdpId);
  }

  async init(cdpId = this.cdpId) {
    this.txMgr = this.maker.service('transactionManager');
    this.cdp = await this.maker.getCdp(cdpId);
    this.proxyAddress = await this.maker.service('proxy').currentProxy();
    const liqPrice = await this.cdp.getLiquidationPrice();
    this._liqPrice = liqPrice.toBigNumber().toFixed(2);
    this.isSafe = await this.cdp.isSafe();
    this._debtValue = (await this.cdp.getDebtValue()).toBigNumber();
    this._collatRatio = await this.cdp.getCollateralizationRatio();
    this._ethCollateral = (await this.cdp.getCollateralValue()).toBigNumber();
    this._pethCollateral = (await this.cdp.getCollateralValue(
      Maker.PETH
    )).toBigNumber();
    this._usdCollateral = (await this.cdp.getCollateralValue(
      Maker.USD
    )).toBigNumber();
    this._governanceFee = (await this.cdpService.getGovernanceFee(
      this.cdpId,
      MKR
    )).toBigNumber();

    // this.maxEthDraw = bnOver(
    //   this._liquidationRatio,
    //   this._usdCollateral,
    //   this._ethPrice
    // );
    //
    // this.maxPethDraw = bnOver(
    //   this._pethPrice,
    //   this._pethCollateral,
    //   this._liquidationRatio
    // );

    this._maxDaiDraw = bnOver(
      this._ethPrice,
      this._ethCollateral,
      this._liquidationRatio
    ).minus(this._debtValue);

    this.ready = true;
    return this;
  }

  async update() {
    if (this.needsUpdate) {
      this.needsUpdate = false;
      await this.init(this.cdpId);
    }
  }

  get liquidationPenalty() {
    return this._liquidationPenalty;
  }

  get stabilityFee() {
    return this._stabilityFee;
  }

  get ethPrice() {
    return this._ethPrice;
  }

  get wethToPethRatio() {
    return this._wethToPethRatio;
  }

  get usdCollateral() {
    return this._usdCollateral;
  }

  get ethCollateral() {
    return this._ethCollateral;
  }

  get ethCollateralNum() {
    return this._ethCollateral.toNumber();
  }

  get pethCollateral() {
    return this._pethCollateral;
  }

  get pethCollateralNum() {
    return this._pethCollateral.toNumber();
  }

  get collatRatio() {
    return this._collatRatio;
  }

  get debtValue() {
    return this._debtValue;
  }

  get targetPrice() {
    return this._targetPrice;
  }

  // get maxDaiDraw() {
  //   return this._maxDaiDraw;
  // }

  get maxDai() {
    if (
      this._ethPrice &&
      this._ethCollateral &&
      this._liquidationRatio &&
      this._debtValue
    ) {
      return bnOver(
        this._ethPrice,
        this._ethCollateral,
        this._liquidationRatio
      ).minus(this._debtValue);
    }
    return toBigNumber(0);
  }

  get maxEthDraw() {
    if (this._ethPrice && this._debtValue && this._liquidationRatio) {
      return this._ethCollateral.minus(
        bnOver(this._liquidationRatio, this._debtValue, this._ethPrice)
      );
    }
    return toBigNumber(0);
  }

  get maxPethDraw() {
    if (this._pethPrice && this._pethCollateral && this._liquidationRatio) {
      return this._pethCollateral.minus(
        bnOver(this._liquidationRatio, this._debtValue, this._pethPrice)
      );
    }
    return toBigNumber(0);
  }

  get maxUsdDraw() {
    if (this._pethPrice && this._pethCollateral && this._liquidationRatio) {
      return this.toUSD(
        this._ethCollateral.minus(
          bnOver(this._liquidationRatio, this._debtValue, this._ethPrice)
        )
      );
    }
    return toBigNumber(0);
  }

  get liquidationRatio() {
    return this._liquidationRatio;
  }

  get liquidationPrice() {
    return this._liqPrice;
  }

  get governanceFeeOwed() {
    return this._governanceFee;
  }

  toNumber(val){
    if(BigNumber.isBigNumber(val)){
      return val.toNumber();
    }
    return toBigNumber(val).toNumber();
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
      const details = await proxyService.build();
      console.log(details); // todo remove dev item
      this.proxyAddress = await this.maker.service('proxy').currentProxy();
      return this.proxyAddress;
    }
    this.proxyAddress = proxyService.currentProxy();
    return this.proxyAddress;
  }

  async openCdp(ethQty, daiQty) {
    if (ethQty <= 0) return 0;
    const proxyAddress = await this.buildProxy();
    const newCdp = await this.cdpService.openProxyCdpLockEthAndDrawDai(
      ethQty,
      daiQty,
      proxyAddress
    );
    console.log(newCdp); // todo remove dev item
    return newCdp.id;
  }

  async lockEth(amount) {
    try {
      this.needsUpdate = true;
      await this.cdpService.lockEthProxy(this.proxyAddress, this.cdpId, amount);
    } catch (e) {
      console.log(e);
    }
  }

  drawDai(amount, acknowledgeBypass = false) {
    this.needsUpdate = true;
    if (
      this.calcCollatRatio(this.ethCollateral, this.debtValue.plus(amount)).gt(
        2
      ) ||
      acknowledgeBypass
    ) {
      try {
        this.cdpService.drawDaiProxy(this.proxyAddress, this.cdpId, amount);
      } catch (e) {
        console.log(e);
      }
    }
  }

  async freeEth(amount) {
    this.needsUpdate = true;
    try {
      await this.cdpService.freeEthProxy(this.proxyAddress, this.cdpId, amount);
    } catch (e) {
      console.log(e);
    }
  }

  async wipeDai(amount) {
    this.needsUpdate = true;
    try {
      await this.cdpService.wipeDaiProxy(this.proxyAddress, this.cdpId, amount);
    } catch (e) {
      console.log(e);
    }
  }

  async closeCdp() {
    this.needsUpdate = true;
    this.closing = true;
    // return this.wipeDai(this.debtValue)
    const value = this.debtValue.toNumber()
    console.log(value); // todo remove dev item
    const enoughToWipe = await this.cdp.enoughMkrToWipe(value, DAI.wei);
    if (enoughToWipe) {
      try {
        await this.cdpService.shutProxy(this.proxyAddress, this.cdpId);
      } catch (e) {
        console.error(e);
      }
    }
    // if (await this.enoughMkrToWipe()) {
    //   try {
    //     await this.cdpService.shutProxy(this.proxyAddress, this.cdpId);
    //   } catch (e) {
    //     console.error(e);
    //   }
    // }
  }

  enoughMkrToWipe(amount) {
    return this.cdpService.enoughMkrToWipe(amount, DAI.wei);
  }

  toUSD(eth) {
    return this._ethPrice.times(toBigNumber(eth));
  }

  toPeth(eth) {
    if (!toBigNumber(eth).eq(0)) {
      return toBigNumber(eth).div(this._wethToPethRatio);
    }
    return toBigNumber(0);
  }

  maxDaiDraw() {
    const tl = toBigNumber(this._ethPrice).times(
      toBigNumber(this._ethCollateral)
    );
    const tr = toBigNumber(this._debtValue).times(
      toBigNumber(this._liquidationRatio)
    );
    return tl.minus(tr).div(toBigNumber(this._ethPrice));
  }

  calcMinCollatRatio(priceFloor) {
    return bnOver(this._ethPrice, this._liquidationRatio, priceFloor);
  }

  calcDrawAmt(principal) {
    return Math.floor(
      bnOver(principal, this._ethPrice, this._liquidationRatio)
    );
  }

  calcDaiDraw(
    ethQty,
    ethPrice = this.ethPrice,
    liquidationRatio = this.liquidationRatio
  ) {
    if (ethQty <= 0) return 0;
    console.log(ethPrice.toString(), ethQty, liquidationRatio.toString()); // todo remove dev item
    return bnOver(ethPrice, toBigNumber(ethQty), liquidationRatio);
  }

  calcMinEthDeposit(
    daiQty,
    ethPrice = this.ethPrice,
    liquidationRatio = this.liquidationRatio
  ) {
    if (daiQty <= 0) return 0;
    return bnOver(liquidationRatio, daiQty, ethPrice);
  }

  calcCollatRatio(ethQty, daiQty) {
    if (ethQty <= 0 || daiQty <= 0) return 0;
    return bnOver(this._ethPrice, ethQty, daiQty);
  }

  calcLiquidationPrice(ethQty, daiQty) {
    if (ethQty <= 0 || daiQty <= 0) return 0;
    const getInt = parseInt(this._ethPrice);
    for (let i = getInt; i > 0; i--) {
      const atValue = bnOver(i, ethQty, daiQty).lte(this._liquidationRatio);
      if (atValue) {
        return i;
      }
    }
  }

  calcCollatRatioDaiChg(daiQty) {
    return toBigNumber(this.calcCollatRatio(this.ethCollateral, daiQty));
  }

  calcCollatRatioEthChg(ethQty) {
    return toBigNumber(this.calcCollatRatio(ethQty, this.debtValue));
  }

  calcLiquidationPriceDaiChg(daiQty) {
    return toBigNumber(this.calcLiquidationPrice(this.ethCollateral, daiQty));
  }

  calcLiquidationPriceEthChg(ethQty) {
    return toBigNumber(this.calcLiquidationPrice(ethQty, this.debtValue));
  }
}
