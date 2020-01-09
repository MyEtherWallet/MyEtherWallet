import BigNumber from 'bignumber.js';
import { maxPethDraw, maxDai, displayFixedValue } from '../makerHelpers';
import { defaultIlk } from './constants';

import * as daiMath from './daiMath';

const toBigNumber = num => {
  return new BigNumber(num);
};

// Basically just to hold the various getters and static methods to somewhat de-clutter the implementation
export default class MakerCdpBase {
  constructor(cdpId, web3, services, sysVars) {
    if (cdpId === null) {
      this.cdpId = cdpId;
    } else {
      this.cdpId = typeof cdpId !== 'number' ? cdpId.id : cdpId;
    }
    this.cdpIdFull = cdpId;
    this.cdp = {};
    this.web3 = web3 || {};
    this.ready = false;
    this.doUpdate = 0;
    this.cdps = [];
    this.noProxy = sysVars.noProxy || false;
    this.sysVars = sysVars; // todo make sure this doesn't bring in the issue with vue walking the tree and breaking things
    this.cdpType = this.cdpId ? sysVars.cdpsWithType[this.cdpId] : defaultIlk;
    this.services = services || null;
    this._proxyAllowances = services.proxyAllowances;
    this._tokens = sysVars.tokens;
    this._balances = sysVars.balances;
    this.needsUpdate = false;
    this.closing = false;
    this.opening = false;
    this.migrated = false;
    this.migrateCdpActive = false;
    this.migrateCdpStage = 0;
    this.goodPercentMargin = 0.5;
    this.warnPercentMargin = 0.25;
    this.cdpTypeObject = services._mcdManager
      ? services._mcdManager.get('mcd:cdpType').getCdpType(null, this.cdpType)
      : services.mcdCurrencies['ETH'];
    this._liqPrice = toBigNumber(0);
    this.isSafe = false;
    this._collatRatio = 0;
    this.pethCollateral = toBigNumber(0);
    this._usdCollateral = toBigNumber(0);
    this._governanceFee = toBigNumber(12345);

    this.tokenMapping = {};
    for (let i = 0; i < services._typeService.cdpTypes.length; i++) {
      this.tokenMapping[services._typeService.cdpTypes[i].currency.symbol] =
        services._typeService.cdpTypes[i];
      this.tokenMapping[services._typeService.cdpTypes[i].currency.name] =
        services._typeService.cdpTypes[i];
    }

    this.override = {};
    this.afterInitialization = false;
  }

  // Getters
  get cdpCollateralType() {
    return this.cdpType.replace(/-[A-Z]/, '');
  }

  get currentAddress() {
    return this.services.address;
  }

  get currentPrice() {
    return this.mcdCurrencies[this.cdpCollateralType].price._amount.toString();
  }

  get collatRatio() {
    return this._collatRatio;
  }

  get collateralAmount() {
    try {
      return this._collateralAmount.toBigNumber();
    } catch (e) {
      return '--';
    }
  }

  get _collateralAmount() {
    if (this.override['collateralAmount']) {
      return this.override['collateralAmount'];
    }
    return this.cdp.collateralAmount;
  }

  get collateralAvailable() {
    try {
      return this._collateralAvailable.toBigNumber();
    } catch (e) {
      return '--';
    }
  }

  get _collateralAvailable() {
    return this.cdp.collateralAvailable;
  }

  get minPercent(){
    return this.liquidationRatio;
  }

  get warnPercent(){
    return this.liquidationRatio.plus(this.goodPercentMargin);
  }

   get goodPercent(){
    return this.liquidationRatio.plus(this.warnPercentMargin);
   }

  get collateralStatus() {
    if (this.collateralizationRatio.gte(this.liquidationRatio.plus(this.warnPercentMargin))) {
      return 'green';
    } else if (
      this.collateralizationRatio.gte(this.liquidationRatio.plus(this.goodPercentMargin)) &&
      this.collateralizationRatio.lte(this.liquidationRatio.plus(this.warnPercentMargin))
    ) {
      return 'orange';
    }
    return 'red';
  }

  get collateralValue() {
    try {
      return this._collateralValue.toBigNumber();
    } catch (e) {
      return '--';
    }
  }

  get _collateralValue() {
    return daiMath.collateralValue(
      this._collateralAmount,
      this.cdpTypeObject.price
    );
  }

  get collateralizationRatio() {
    try {
      return this._collateralizationRatio.toBigNumber();
    } catch (e) {
      return '--';
    }
  }

  get _collateralizationRatio() {
    return daiMath.collateralizationRatio(
      this._collateralValue,
      this._debtValue
    );
  }

  get cdpService() {
    return this.services._cdpService;
  }

  get daiToken() {
    return this.getTokens['DAI'];
  }

  get daiBalance() {
    return this.services.daiBalance;
  }

  get debtValue() {
    if (this.cdp) {
      try {
        if (this.override['debtValue']) {
          return this._debtValue.toBigNumber();
        }
        return toBigNumber(
          toBigNumber(this._debtValue.toBigNumber()).toFixed(18)
        );
      } catch (e) {
        return '--';
      }
    }
    return toBigNumber(0);
  }

  get _debtValue() {
    if (this.cdp) {
      if (this.override['debtValue']) {
        return this.override['debtValue'];
      }
      return this.cdp.debtValue;
    }
    return toBigNumber(0);
  }

  get dustValues() {
    return this.services.dustValues;
  }

  get ethPrice() {
    return this.services.ethPrice;
  }

  get ethCollateral() {
    try {
      return this._ethCollateral.toBigNumber();
    } catch (e) {
      return '--';
    }
  }

  get _ethCollateral() {
    return this._collateralAmount;
  }

  getCollateralIlk() {
    return this.cdpType;
  }

  get getTokens() {
    return this.sysVars.tokens;
  }

  get governanceFeeOwed() {
    return this._governanceFee;
  }

  get hasProxy() {
    return this.services.hasProxy;
  }

  get liquidationPenalty() {
    if (this.cdp) {
      if (this.cdp.type) {
        return toBigNumber(this.cdp.type.liquidationPenalty);
      }
    }
    const rawType = this.mcdManager
      .get('mcd:cdpType')
      .getCdpType(null, this.cdpType);

    return toBigNumber(rawType.liquidationPenalty._amount);
  }

  get liquidationRatio() {
    return toBigNumber(this._liquidationRatio._amount);
  }

  get _liquidationRatio() {
    if (Object.keys(this.cdp).length > 0) {
      return this.cdp.type.liquidationRatio;
    }
    const rawType = this.mcdManager
      .get('mcd:cdpType')
      .getCdpType(null, this.cdpType);
    return rawType.liquidationRatio;
  }

  get liquidationPrice() {
    try {
      return this._liquidationPrice.toBigNumber();
    } catch (e) {
      return '--';
    }
  }

  get _liquidationPrice() {
    return daiMath.liquidationPrice(
      this._collateralAmount,
      this._debtValue,
      this._liquidationRatio
    );
  }

  get maxDai() {
    if (
      this.currentPrice &&
      this.collateralAmount &&
      this.liquidationRatio &&
      this.debtValue
    ) {
      return maxDai(
        this.currentPrice,
        this.collateralAmount,
        this.liquidationRatio.plus(0.001),
        this.debtValue
      );
    }
    return toBigNumber(0);
  }

  get maxEthDraw() {
    return this.collateralAmount.minus(this.minSafeCollateralAmount);
  }

  get maxPethDraw() {
    if (this.pethPrice && this.pethCollateral && this.liquidationRatio) {
      if (this.zeroDebt) {
        return maxPethDraw(
          this.pethCollateral,
          this.liquidationRatio,
          this.debtValue,
          this.pethPrice,
          this.pethMin.times(0)
        );
      }
      return maxPethDraw(
        this.pethCollateral,
        this.liquidationRatio,
        this.debtValue,
        this.pethPrice
      );
    }
    return toBigNumber(0);
  }

  get maxDaiDraw() {
    const tl = toBigNumber(this.currentPrice).times(
      toBigNumber(this.collateralAmount)
    );
    const tr = toBigNumber(this.debtValue).times(
      toBigNumber(this.liquidationRatio)
    );
    return tl.minus(tr).div(toBigNumber(this.currentPrice));
  }

  get maxUsdDraw() {
    return this.toUSD(
      this.collateralAmount.minus(this.minSafeCollateralAmount)
    );
  }

  get mcdCurrencies() {
    return this.services.mcdCurrencies;
  }

  get mkrToken() {
    return this.services._mkrToken;
  }

  get mkrBalance() {
    return this.services.mkrBalance;
  }

  get mcdManager() {
    return this.services._mcdManager;
  }

  get minSafeCollateralAmount() {
    const rawType = this.mcdManager
      .get('mcd:cdpType')
      .getCdpType(null, this.cdpType);
    return daiMath
      .minSafeCollateralAmount(
        this._debtValue,
        rawType.liquidationRatio,
        rawType.price
      )
      .toBigNumber();
  }

  get minEth() {
    return this.services.minEth;
  }

  get needToFinishMigrating() {
    return this._proxyAddress && this.noProxy;
  }

  get proxyService() {
    return this.services._proxyService;
  }

  get proxyAddress() {
    return this.services._proxyAddress;
  }

  get proxyAllowanceDai() {
    return this._proxyAllowances['DAI'];
  }

  get proxyAllowanceMkr() {
    return this._proxyAllowances['MKR'];
  }

  get pethMin() {
    return this.services.pethMin;
  }

  get pethPrice() {
    return this.services._pethPrice;
  }

  get stabilityFee() {
    if (this.cdp.type) {
      return toBigNumber(this.cdp.type.annualStabilityFee);
    }
    const rawType = this.mcdManager
      .get('mcd:cdpType')
      .getCdpType(null, this.cdpType);
    if (rawType) {
      return rawType.annualStabilityFee;
    }
    return '--';
  }

  get tokenService() {
    return this.services._tokenService;
  }

  get wethToPethRatio() {
    return this.services.wethToPethRatio;
  }

  get usdCollateral() {
    return this.toUSD(this.ethCollateral);
  }

  get zeroDebt() {
    return toBigNumber(this.debtValue).eq(0);
  }

  // Utility Helpers
  toUSD(amount) {
    const toUsd = toBigNumber(this.currentPrice).times(amount);

    if (toUsd.lt(0)) {
      return toBigNumber(0);
    }
    return toUsd.toFixed(2, BigNumber.ROUND_DOWN);
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
    return displayFixedValue(raw, decimals, round);
  }
}
