import Maker from '@makerdao/dai';
import BigNumber from 'bignumber.js';
import {
  calcLiquidationPrice,
  calcCollatRatio,
  maxPethDraw,
  maxEthDraw,
  maxDai
} from './helpers';
const { MKR, DAI } = Maker;

const toBigNumber = num => {
  return new BigNumber(num);
};

export default class MakerCDP {
  constructor(cdpId, web3, services, sysVars) {
    this.cdpId = cdpId;
    this.cdp = {};
    this.web3 = web3 || {};
    this.ready = false;
    this.doUpdate = 0;
    this.cdps = [];
    this.noProxy = sysVars.noProxy || false;
    this.services = services || null;
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
  }

  // Getters
  get currentAddress() {
    return this.services.account.address;
  }

  get liquidationPenalty() {
    return this.services.liquidationPenalty;
  }

  get stabilityFee() {
    return this.services.stabilityFee;
  }

  get ethPrice() {
    return this.services.ethPrice;
  }

  get pethPrice() {
    return this.services._pethPrice;
  }

  get wethToPethRatio() {
    return this.services.wethToPethRatio;
  }

  get liquidationRatio() {
    return this.services.liquidationRatio;
  }

  get proxyAddress() {
    return this.services._proxyAddress;
  }

  get hasProxy() {
    return this.services.hasProxy;
  }

  get proxyAllowanceDai() {
    return this.services.proxyAllowanceDai;
  }

  get proxyAllowanceMkr() {
    return this.services.proxyAllowanceMkr;
  }

  get daiToken() {
    return this.services._daiToken;
  }

  get daiBalance() {
    return this.services.daiBalance;
  }

  get mkrToken() {
    return this.services._mkrToken;
  }

  get mkrBalance() {
    return this.services.mkrBalance;
  }

  get proxyService() {
    return this.services._proxyService;
  }

  get cdpService() {
    return this.services._cdpService;
  }

  get minEth() {
    return this.services.minEth();
  }

  get pethMin() {
    return this.services.pethMin;
  }

  // CDP Instance/item values

  get zeroDebt() {
    return toBigNumber(this.debtValue).eq(0);
  }

  get usdCollateral() {
    return this.toUSD(this.ethCollateral);
  }

  get ethCollateralNum() {
    return this.ethCollateral.toNumber();
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

  get maxDai() {
    if (
      this.ethPrice &&
      this.ethCollateral &&
      this.liquidationRatio &&
      this.debtValue
    ) {
      return maxDai(
        this.ethPrice,
        this.ethCollateral,
        this.liquidationRatio.plus(0.001),
        this.debtValue
      );
    }
    return toBigNumber(0);
  }

  get maxEthDraw() {
    if (this.ethPrice && this.debtValue && this.liquidationRatio) {
      if (this.zeroDebt) {
        return maxEthDraw(
          this.ethCollateral,
          this.liquidationRatio.plus(0.001),
          this.debtValue,
          this.ethPrice,
          this.minEth.times(1.0)
        );
      }
      return maxEthDraw(
        this.ethCollateral,
        this.liquidationRatio.plus(0.001),
        this.debtValue,
        this.ethPrice
      );
    }
    return toBigNumber(0);
  }

  get maxPethDraw() {
    if (this.pethPrice && this.pethCollateral && this.liquidationRatio) {
      if (this.zeroDebt) {
        return maxPethDraw(
          this.pethCollateral,
          this.liquidationRatio.plus(0.001),
          this.debtValue,
          this.pethPrice,
          this.pethMin.times(1.0)
        );
      }
      return maxPethDraw(
        this.pethCollateral,
        this.liquidationRatio.plus(0.001),
        this.debtValue,
        this.pethPrice
      );
    }
    return toBigNumber(0);
  }

  get maxUsdDraw() {
    if (this.pethPrice && this.pethCollateral && this.liquidationRatio) {
      return this.toUSD(this.maxEthDraw);
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
    this._proxyAddress = await this.services.getProxy();
    this.noProxy = this._proxyAddress === null;
    if (this._proxyAddress) {
      this.cdp = await this.services.getCdp(cdpId, this._proxyAddress);
    } else {
      this.cdp = await this.services.getCdp(cdpId, false);
    }
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
    this._proxyAddress = await this.services.getProxy();
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
        console.error(e);
      }
    }
  }

  // This should also have a acknowledgeBypass
  async freeEth(amount, acknowledgeBypass = false) {
    if (
      this.debtValue.eq(0) ||
      this.calcCollatRatio(this.ethCollateral.minus(amount), this.debtValue).gt(
        1.5
      ) ||
      acknowledgeBypass
    ) {
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
        console.error(e);
      }
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
      console.error(e);
    }
  }

  async canCloseCdp() {
    const value = this.debtValue.toNumber();
    return await this.cdpService.enoughMkrToWipe(this.cdpId, value);
  }

  async closeCdp() {
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
    const toUsd = this.services.toUSD(eth);
    if (toUsd.lt(0)) {
      return toBigNumber(0);
    }
    return toUsd;
  }

  toPeth(eth) {
    return this.services.toPeth(eth);
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

  calcCollatRatio(ethQty, daiQty) {
    if (ethQty <= 0 || daiQty <= 0) return toBigNumber(0);
    return calcCollatRatio(this.ethPrice, ethQty, daiQty);
  }

  calcLiquidationPrice(ethQty, daiQty) {
    if (ethQty <= 0 || daiQty <= 0) return toBigNumber(0);
    return calcLiquidationPrice(
      ethQty,
      daiQty,
      this.ethPrice,
      this.liquidationRatio
    );
  }

  // Helpers
  async approveDai() {
    await this.daiToken.approveUnlimited(this.proxyAddress);
  }

  async approveMkr() {
    await this.mkrToken.approveUnlimited(this.proxyAddress);
  }

  async getDaiBalances() {
    this.daiBalance = await this.services.daiToken.balance();
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
