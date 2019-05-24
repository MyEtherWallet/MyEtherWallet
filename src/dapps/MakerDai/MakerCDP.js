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
  constructor(cdpId, makerManager, services, sysVars, toInit) {
    this.cdpId = cdpId;
    this.cdp = {};
    this.web3 = services.web3 || {};
    this.ready = false;
    this.doUpdate = 0;
    this.cdps = [];
    this.noProxy = sysVars.noProxy || false;
    this.makerManager = services.makerManager || null;
    this.needsUpdate = false;
    this.closing = false;
    this.opening = false;
    this.migrated = false;
    this.migrateCdpActive = false;
    this.migrateCdpStage = 0;

    this._liqPrice = toBigNumber(0);
    this.isSafe = false;
    this.debtValue = toBigNumber(0);
    this._collatRatio = 0;
    this.ethCollateral = toBigNumber(0);
    this.pethCollateral = toBigNumber(0);
    this._usdCollateral = toBigNumber(0);
    this._governanceFee = toBigNumber(0);

    // this.proxyAllowanceDai = sysVars.proxyAllowanceDai || toBigNumber(0);
    // this.proxyAllowanceMkr = sysVars.proxyAllowanceMkr || toBigNumber(0);
    // this.liquidationPenalty = sysVars.liquidationPenalty;
    //
    //
    // console.log(this.makerManager); // todo remove dev item
    //
/*    this.proxyService = services.proxyService || null;
    this.priceService = services.priceService || null;
    this.cdpService = services.cdpService || null;*/

    if (toInit) this.init(this.cdpId);
  }

  // Getters
  get currentAddress() {
    return this.makerManager.account.address;
  }

  get liquidationPenalty() {
    return this.makerManager.liquidationPenalty;
  }

  get stabilityFee() {
    return this.makerManager.stabilityFee;
  }

  get ethPrice() {
    return this.makerManager.ethPrice;
  }

  get pethPrice() {
    return this.makerManager._pethPrice;
  }

  get wethToPethRatio() {
    return this.makerManager.wethToPethRatio;
  }

  get targetPrice() {
    return this.makerManager._targetPrice;
  }

  get liquidationRatio() {
    return this.makerManager.liquidationRatio;
  }

  get proxyAddress() {
    return this.makerManager._proxyAddress;
  }

  get hasProxy() {
    return this.makerManager.hasProxy;
  }

  get proxyAllowanceDai() {
    return this.makerManager.proxyAllowanceDai;
  }

  get proxyAllowanceMkr() {
    return this.makerManager.proxyAllowanceMkr;
  }

  get daiToken() {
    return this.makerManager._daiToken;
  }

  get daiBalance() {
    return this.makerManager.daiBalance;
  }

  get mkrToken() {
    return this.makerManager._mkrToken;
  }

  get mkrBalance() {
    return this.makerManager.mkrBalance;
  }

  get proxyService() {
    return this.makerManager._proxyService;
  }

  get priceService() {
    return this.makerManager._priceService;
  }

  get cdpService() {
    return this.makerManager._cdpService;
  }

  get minEth() {
    return this.makerManager.minEth();
  }

  get pethMin() {
    return this.makerManager.pethMin;
  }

  // CDP Instance/item values

  get zeroDebt() {
    return toBigNumber(this.debtValue).eq(0);
  }

  get usdCollateral() {
    return this.toUSD(this.ethCollateral);
  }

  // get ethCollateral() {
  //   console.log(this.ethCollateral.toString()); // todo remove dev item
  //   return this.ethCollateral;
  // }

  get ethCollateralNum() {
    return this.ethCollateral.toNumber();
  }

  get pethCollateralNum() {
    return this.pethCollateral.toNumber();
  }

  get collatRatio() {
    return this._collatRatio;
  }

  get liquidationPrice() {
    return this._liqPrice;
  }

  get governanceFeeOwed() {
    return this._governanceFee;
  }

  get enoughToWipe() {
    return this._enoughToWipe;
  }

  get maxDai() {
    if (
      this.ethPrice &&
      this.ethCollateral &&
      this.liquidationRatio &&
      this.debtValue
    ) {
      return bnOver(
        this.ethPrice,
        this.ethCollateral,
        this.liquidationRatio
      ).minus(this.debtValue);
    }
    return toBigNumber(0);
  }

  get maxEthDraw() {
    if (this.ethPrice && this.debtValue && this.liquidationRatio) {
      if (this.zeroDebt) {
        return this.ethCollateral
          .minus(bnOver(this.liquidationRatio, this.debtValue, this.ethPrice))
          .minus(this.minEth.times(1.0));
      }
      return this.ethCollateral.minus(
        bnOver(this.liquidationRatio.plus(0.001), this.debtValue, this.ethPrice)
      );
    }
    return toBigNumber(0);
  }

  get maxPethDraw() {
    if (this.pethPrice && this.pethCollateral && this.liquidationRatio) {
      if (this.zeroDebt) {
        return this.pethCollateral
          .minus(
            bnOver(
              this.liquidationRatio.plus(0.001),
              this.debtValue,
              this.pethPrice
            )
          )
          .minus(this.pethMin.times(1.0));
      }
      return this.pethCollateral.minus(
        bnOver(
          this.liquidationRatio.plus(0.001),
          this.debtValue,
          this.pethPrice
        )
      );
    }
    return toBigNumber(0);
  }

  get maxUsdDraw() {
    if (this.pethPrice && this.pethCollateral && this.liquidationRatio) {
      return this.toUSD(
        this.ethCollateral
          .minus(
            bnOver(
              this.liquidationRatio.plus(0.001),
              this.debtValue,
              this.ethPrice
            )
          )
          .minus(this.minEth.times(1.0))
      );
    }
    return toBigNumber(0);
  }

  get needToFinishMigrating() {
    return this._proxyAddress && this.noProxy;
  }

  // Methods
  async init(cdpId = this.cdpId) {
    await this.updateValues(cdpId);
    this._governanceFee = (await this.cdpService.getGovernanceFee(
      this.cdpId,
      MKR
    )).toBigNumber();

    this.ready = true;
    return this;
  }

  async updateValues(cdpId = this.cdpId) {
    this._proxyAddress = await this.makerManager.getProxy();
    this.noProxy = this._proxyAddress === null;
    if (this._proxyAddress) {
      this.cdp = await this.makerManager.getCdp(
        cdpId,
        this._proxyAddress
      );
    } else {
      this.cdp = await this.makerManager.getCdp(cdpId, false);
    }
    console.log(this.cdp); // todo remove dev item
    const liqPrice = await this.cdp.getLiquidationPrice();
    this._liqPrice = liqPrice.toBigNumber().toFixed(2);
    this.isSafe = await this.cdp.isSafe();
    this.debtValue = (await this.cdp.getDebtValue()).toBigNumber();
    this._collatRatio = await this.cdp.getCollateralizationRatio();
    this.ethCollateral = (await this.cdp.getCollateralValue()).toBigNumber();
    this.pethCollateral = (await this.cdp.getCollateralValue(
      Maker.PETH
    )).toBigNumber();
    this._usdCollateral = (await this.cdp.getCollateralValue(
      Maker.USD
    )).toBigNumber();
  }

  async update() {
    console.log('makerCDP update called'); // todo remove dev item
    if (this.migrated) {
      const currentProxy = await this.proxyService.currentProxy();
      if (currentProxy) {
        this.migrated = false;
        await this.cdpService.give(this.cdpId, this._proxyAddress);
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

  async getProxy() {
    this._proxyAddress = await this.makerManager.getProxy();
  }

  async buildProxy() {
    const currentProxy = await this.getProxy();
    if (!currentProxy) {
      this.needsUpdate = true;
      await this.proxyService.build();
      this._proxyAddress = await this.getProxy();
      return this._proxyAddress;
    }
    this._proxyAddress = await this.getProxy();
    return this._proxyAddress;
  }

  async migrateCdpComplete() {
    this.needsUpdate = true;
    if (!this.migrateCdpActive && !this._proxyAddress) {
      this.migrateCdpActive = true;
      this.migrateCdpStage = 1;
      await this.proxyService.ensureProxy();
    } else {
      if (this.migrateCdpStage === 1) {
        let checking;
        this.migrateCdpStage = 2;
        const currentProxy = await this.getProxy();
        if (currentProxy) {
          this.migrateCdpActive = false;
          this.doUpdate++;
          this.migrateCdpStage = 3;
          this.noProxy = false;
          await this.cdpService.give(this.cdpId, currentProxy);
        } else {
          checking = setInterval(async () => {
            const currentProxy = await this.getProxy();
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
      await this.cdpService.give(this.cdpId, this._proxyAddress);
    }
  }

  async openCdp(ethQty, daiQty) {
    if (ethQty <= 0) return 0;
    let newCdp;
    if (!this.hasProxy) {
      this.opening = true;
      this.needsUpdate = true;
      newCdp = await this.cdpService.openProxyCdpLockEthAndDrawDai(
        ethQty,
        daiQty,
        null
      );
    } else {
      this.opening = true;
      this.needsUpdate = true;
      newCdp = await this.cdpService.openProxyCdpLockEthAndDrawDai(
        ethQty,
        daiQty,
        this.proxyAddress
      );
    }

    return newCdp.id;
  }

  async lockEth(amount) {
    try {
      if (this.noProxy) {
        return;
      }
      this.needsUpdate = true;
      await this.cdpService.lockEthProxy(
        this._proxyAddress,
        this.cdpId,
        amount
      );
    } catch (e) {
      // eslint-disable-next-line
      console.log('lockEth Error:');
      // eslint-disable-next-line
      console.error(e);
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
        this.cdpService.drawDaiProxy(this._proxyAddress, this.cdpId, amount);
      } catch (e) {
        // eslint-disable-next-line
        console.log('drawDai Error:');
        // eslint-disable-next-line
        console.error(e);
      }
    }
  }

  async freeEth(amount) {
    try {
      if (this.noProxy) {
        return;
      }
      this.needsUpdate = true;
      await this.cdpService.freeEthProxy(
        this._proxyAddress,
        this.cdpId,
        amount
      );
    } catch (e) {
      // eslint-disable-next-line
      console.log('freeEth Error:');
      // eslint-disable-next-line
      console.error(e);
    }
  }

  async wipeDai(amount) {
    try {
      if (this.noProxy) {
        return;
      }
      this.needsUpdate = true;
      await this.cdpService.wipeDaiProxy(
        this._proxyAddress,
        this.cdpId,
        amount
      );
    } catch (e) {
      // eslint-disable-next-line
      console.log('wipeDai Error:');
      // eslint-disable-next-line
      console.error(e);
    }
  }

  async canCloseCdp() {
    const value = this.debtValue.toNumber();
    return await this.cdpService.enoughMkrToWipe(this.cdpId, value);
  }

  async closeCdp() {
    // will also need to check if there is enough allowance
    // const enoughToWipe = await this.canCloseCdp();
    // if (enoughToWipe) {
    console.log('close'); // todo remove dev item
    try {
      this.needsUpdate = true;
      this.closing = true;

      if (this.hasProxy) {
        await this.cdpService.shutProxy(this._proxyAddress, this.cdpId);
      }
    } catch (e) {
      // eslint-disable-next-line
      console.log('closeCdp Error:');
      // eslint-disable-next-line
      console.error(e);
    }
    // }
  }

  async moveCdp(address) {
    await this.getProxy();
    const proxy = await this.proxyService.getProxyAddress(address);
    if (proxy) {
      this.needsUpdate = true;
      this.closing = true; // for the purpose of displaying to the user closing and moving are the same
      await this.cdpService.giveProxy(this._proxyAddress, this.cdpId, proxy);
    } else if (!this.noProxy) {
      this.needsUpdate = true;
      this.closing = true;
      await this.cdpService.giveProxy(this._proxyAddress, this.cdpId, address);
    } else {
      this.needsUpdate = true;
      this.closing = true;
      await this.cdpService.give(this.cdpId, address);
    }
  }

  enoughMkrToWipe(amount) {
    return this.cdpService.enoughMkrToWipe(amount, DAI.wei);
  }

  // Calculations
  toUSD(eth) {
    const toUsd = this.makerManager.toUSD(eth);
    if (toUsd.lt(0)) {
      return toBigNumber(0);
    }
    return toUsd;
  }

  toPeth(eth) {
    return this.makerManager.toPeth(eth);
  }

  fromPeth(peth) {
    if (!toBigNumber(peth).eq(0)) {
      return toBigNumber(peth).times(this.wethToPethRatio);
      // return toBigNumber(this._wethToPethRatio).div(peth);
    }
    return toBigNumber(0);
  }

  maxDaiDraw() {
    const tl = toBigNumber(this.ethPrice).times(
      toBigNumber(this.ethCollateral)
    );
    const tr = toBigNumber(this.debtValue).times(
      toBigNumber(this.liquidationRatio)
    );
    return tl.minus(tr).div(toBigNumber(this.ethPrice));
  }

  calcMinCollatRatio(priceFloor) {
    return bnOver(this.ethPrice, this.liquidationRatio, priceFloor);
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
    return bnOver(this.ethPrice, ethQty, daiQty);
  }

  calcLiquidationPrice(ethQty, daiQty) {
    if (ethQty <= 0 || daiQty <= 0) return 0;
    const getInt = parseInt(this.ethPrice);
    for (let i = getInt; i > 0; i--) {
      const atValue = bnOver(i, ethQty, daiQty).lte(this.liquidationRatio);
      if (atValue) {
        return i;
      }
    }
    for (let i = 100; i > 0; i--) {
      const atValue = bnOver(i / 100, ethQty, daiQty).lte(
        this.liquidationRatio
      );
      if (atValue) {
        return i / 100;
      }
    }
    return 0;
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

  atRisk() {
    return !!this._collatRatio.lte(2);
  }

  // Helpers
  async approveDai() {
    await this.daiToken.approveUnlimited(this.proxyAddress);
  }

  async approveMkr() {
    await this.mkrToken.approveUnlimited(this.proxyAddress);

  }

  async getDaiBalances() {
    this.daiBalance = await this.makerManager.daiToken.balance();
    return this.daiBalance;
  }

  // Static Helpers
  static toNumber(val) {
    if (BigNumber.isBigNumber(val)) {
      return val.toNumber();
    }
    return toBigNumber(val).toNumber();
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
