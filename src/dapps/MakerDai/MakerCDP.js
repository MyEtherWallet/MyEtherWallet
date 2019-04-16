import Maker from '@makerdao/dai';
import BigNumber from 'bignumber.js';

const { MKR, DAI } = Maker;

const toBigNumber = num => {
  return new BigNumber(num);
};

const bnOver = (one, two, three) => {
  return toBigNumber(one)
    .times(toBigNumber(two))
    .div(toBigNumber(three));
};

export default class MakerCDP {
  constructor(cdpId, maker, services, sysVars, toInit) {
    this.cdpId = cdpId;
    this.cdp = {};
    this.maker = maker;
    this.web3 = sysVars.web3 || {};
    this.priceService = services.priceService || {};
    this.cdpService = services.cdpService || {};
    this.proxyService = services.proxyService || {};
    this.ready = false;
    this.doUpdate = 0;
    this._liquidationRatio = sysVars.liquidationRatio || toBigNumber(0);
    this._liquidationPenalty = sysVars.liquidationPenalty || toBigNumber(0);
    this._stabilityFee = sysVars.stabilityFee || toBigNumber(0);
    this._ethPrice = sysVars.ethPrice || toBigNumber(0);
    this._pethPrice = sysVars.pethPrice || toBigNumber(0);
    this._wethToPethRatio = sysVars.wethToPethRatio || toBigNumber(0);
    this._targetPrice = sysVars.targetPrice || toBigNumber(0);
    this._currentAddress = sysVars.currentAddress || null;
    this.cdps = [];
    this.noProxy = sysVars.noProxy || false;
    this.needsUpdate = false;
    this.closing = false;
    this.opening = false;
    this.migrated = false;
    this.migrateCdpActive = false;
    this.migrateCdpStage = 0;

    this._liqPrice = toBigNumber(0);
    this.isSafe = false;
    this._debtValue = toBigNumber(0);
    this._collatRatio = 0;
    this._ethCollateral = toBigNumber(0);
    this._pethCollateral = toBigNumber(0);
    this._usdCollateral = toBigNumber(0);
    this._governanceFee = toBigNumber(0);

    if (toInit) this.init(this.cdpId);
  }

  async init(cdpId = this.cdpId) {
    this.txMgr = this.maker.service('transactionManager');
    this.priceService = this.maker.service('price');
    this.cdpService = await this.maker.service('cdp');
    this.proxyService = await this.maker.service('proxy');
    await this.updateValues(cdpId);
    this._governanceFee = (await this.cdpService.getGovernanceFee(
      this.cdpId,
      MKR
    )).toBigNumber();

    this.ready = true;
    return this;
  }

  async updateValues(cdpId = this.cdpId) {
    this.cdp = await this.maker.getCdp(cdpId);
    this.proxyAddress = await this.proxyService.currentProxy();
    this.noProxy = this.proxyAddress === null;
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
  }

  async update() {
    if (this.migrated) {
      const currentProxy = await this.proxyService.currentProxy();
      if (currentProxy) {
        this.migrated = false;
        await this.cdpService.give(this.cdpId, this.proxyAddress);
      }
    }
    if (this.needsUpdate) {
      this.opening = false;
      this.needsUpdate = false;
      await this.updateValues(this.cdpId);
      this.doUpdate++;
      return this;
    }
    return this;
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
    return this.toUSD(this._ethCollateral);
    // return this._usdCollateral;
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

  get liquidationRatio() {
    return this._liquidationRatio;
  }

  get liquidationPrice() {
    return this._liqPrice;
  }

  get governanceFeeOwed() {
    return this._governanceFee;
  }

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

  toNumber(val) {
    if (BigNumber.isBigNumber(val)) {
      return val.toNumber();
    }
    return toBigNumber(val).toNumber();
  }

  atRisk() {
    return !!this._collatRatio.lte(2);
  }

  async getProxy() {
    this.proxyAddress = await this.proxyService.currentProxy();
    if (!this.proxyAddress) {
      this.proxyAddress = await this.proxyService.getProxyAddress(
        this._currentAddress
      );
      if (this.proxyAddress) this.noProxy = false;
    }
    return this.proxyAddress;
  }

  async buildProxy() {
    const currentProxy = await this.getProxy();
    if (!currentProxy) {
      this.needsUpdate = true;
      await this.proxyService.build();
      // eslint-disable-next-line
      this.proxyAddress = await this.getProxy();
      return this.proxyAddress;
    }
    this.proxyAddress = await this.getProxy();
    return this.proxyAddress;
  }

  get needToFinishMigrating() {
    return this.proxyAddress && this.noProxy;
  }

  async migrateCdpComplete() {
    this.needsUpdate = true;
    if (!this.migrateCdpActive && !this.proxyAddress) {
      this.migrateCdpActive = true;
      this.migrateCdpStage = 1;
      await this.proxyService.ensureProxy();
    } else {
      if (this.migrateCdpStage === 1) {
        let checking;
        this.migrateCdpStage = 2;
        const currentProxy = await this.proxyService.getProxyAddress(
          this._currentAddress
        );
        if (currentProxy) {
          this.migrateCdpActive = false;
          this.doUpdate++;
          this.migrateCdpStage = 3;
          this.noProxy = false;
          await this.cdpService.give(this.cdpId, currentProxy);
        } else {
          checking = setInterval(async () => {
            const currentProxy = await this.proxyService.getProxyAddress(
              this._currentAddress
            );
            if (currentProxy) {
              clearInterval(checking);
              this.migrateCdpActive = false;
              this.doUpdate++;
              this.migrateCdpStage = 3;
              this.noProxy = false;
              await this.cdpService.give(this.cdpId, currentProxy);
            }
          }, 500);
        }
      }
    }
  }

  async migrateCdp() {
    const currentProxy = await this.getProxy();
    if (!currentProxy) {
      this.needsUpdate = true;
      return await this.proxyService.ensureProxy();
    } else if (this.needToFinishMigrating) {
      this.needsUpdate = true;
      await this.cdpService.give(this.cdpId, this.proxyAddress);
    }
  }

  async openCdp(ethQty, daiQty) {
    if (ethQty <= 0) return 0;
    const proxyAddress = await this.buildProxy();
    this.opening = true;
    this.needsUpdate = true;
    const newCdp = await this.cdpService.openProxyCdpLockEthAndDrawDai(
      ethQty,
      daiQty,
      proxyAddress
    );
    // eslint-disable-next-line
    return newCdp.id;
  }

  async lockEth(amount) {
    try {
      if (this.noProxy) {
        return;
      }
      this.needsUpdate = true;
      await this.cdpService.lockEthProxy(this.proxyAddress, this.cdpId, amount);
    } catch (e) {
      // eslint-disable-next-line
      console.log(e);
    }
  }

  drawDai(amount, acknowledgeBypass = false) {
    if (
      this.calcCollatRatio(this.ethCollateral, this.debtValue.plus(amount)).gt(
        2
      ) ||
      acknowledgeBypass
    ) {
      try {
        if (this.noProxy) {
          return;
        }
        this.needsUpdate = true;
        this.cdpService.drawDaiProxy(this.proxyAddress, this.cdpId, amount);
      } catch (e) {
        // eslint-disable-next-line
        console.log(e);
      }
    }
  }

  async freeEth(amount) {
    try {
      if (this.noProxy) {
        return;
      }
      this.needsUpdate = true;
      await this.cdpService.freeEthProxy(this.proxyAddress, this.cdpId, amount);
    } catch (e) {
      // eslint-disable-next-line
      console.log(e);
    }
  }

  async wipeDai(amount) {
    try {
      if (this.noProxy) {
        return;
      }
      this.needsUpdate = true;
      await this.cdpService.wipeDaiProxy(this.proxyAddress, this.cdpId, amount);
    } catch (e) {
      // eslint-disable-next-line
      console.log(e);
    }
  }

  async canCloseCdp() {
    const value = this.debtValue.toNumber();
    return await this.cdpService.enoughMkrToWipe(this.cdpId, value, DAI.wei);
  }

  async closeCdp() {
    const enoughToWipe = await this.canCloseCdp();
    if (enoughToWipe) {
      try {
        this.needsUpdate = true;
        this.closing = true;
        await this.cdpService.shutProxy(this.proxyAddress, this.cdpId);
      } catch (e) {
        // eslint-disable-next-line
        console.error(e);
      }
    }
  }

  async moveCdp(address) {
    await this.getProxy();
    const proxy = await this.proxyService.getProxyAddress(address);
    if (proxy) {
      this.needsUpdate = true;
      this.closing = true; // for the purpose of displaying to the user closing and moving are the same
      await this.cdpService.giveProxy(this.proxyAddress, this.cdpId, proxy);
    } else if (!this.noProxy) {
      this.needsUpdate = true;
      this.closing = true;
      await this.cdpService.giveProxy(this.proxyAddress, this.cdpId, address);
    } else {
      this.needsUpdate = true;
      this.closing = true;
      await this.cdpService.give(this.cdpId, address);
    }
  }

  enoughMkrToWipe(amount) {
    return this.cdpService.enoughMkrToWipe(amount, DAI.wei);
  }

  toUSD(eth) {
    if (eth === undefined || eth === null) return toBigNumber(0);
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
    for (let i = 100; i > 0; i--) {
      const atValue = bnOver(i / 100, ethQty, daiQty).lte(
        this._liquidationRatio
      );
      if (atValue) {
        return i / 100;
      }
    }
    return 0;
  }

  calcCollatRatioDaiChg(daiQty) {
    return toBigNumber(this.calcCollatRatio(this.pethCollateral, daiQty));
  }

  calcCollatRatioEthChg(ethQty) {
    return toBigNumber(this.calcCollatRatio(ethQty, this._debtValue));
  }

  calcLiquidationPriceDaiChg(daiQty) {
    return toBigNumber(this.calcLiquidationPrice(this.ethCollateral, daiQty));
  }

  calcLiquidationPriceEthChg(ethQty) {
    return toBigNumber(this.calcLiquidationPrice(ethQty, this._debtValue));
  }

  static displayPercentValue(raw) {
    if (!BigNumber.isBigNumber(raw)) raw = new BigNumber(raw);
    return raw.times(100).toString();
  }

  static displayFixedValue(raw, decimals = 3, round = true) {
    if (!BigNumber.isBigNumber(raw)) raw = new BigNumber(raw);
    if (round) return raw.toFixed(decimals, BigNumber.ROUND_DOWN).toString();
    return raw.toFixed(decimals).toString();
  }
}
