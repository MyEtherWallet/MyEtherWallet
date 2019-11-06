import Maker from '@makerdao/dai';
import BigNumber from 'bignumber.js';
import {
  calcLiquidationPrice,
  calcCollatRatio,
  maxPethDraw,
  maxEthDraw,
  maxDai,
  getMakerCurrencies,
  displayFixedValue
} from './makerHelpers';
import {
  ETH,
  REP,
  ZRX,
  OMG,
  BAT,
  GNT,
  DGD,
  MDAI,
  MKR,
  default as TKNS
} from '@makerdao/dai-plugin-mcd';
import ethUnit from 'ethjs-unit';
import MakerCdpBase from './MakerCdpBase';
const { DAI } = Maker;

const toBigNumber = num => {
  return new BigNumber(num);
};

export default class MakerCDP extends MakerCdpBase {
  constructor(cdpId, web3, services, sysVars) {
    super(cdpId, web3, services, sysVars);
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
    this.services = services || null;
    this.needsUpdate = false;
    this.closing = false;
    this.opening = false;
    this.migrated = false;
    this.migrateCdpActive = false;
    this.migrateCdpStage = 0;
  }

  // Getters
  // See MakerCdpBase

  // Setup Methods =====================================================================================================
  async init(cdpId = this.cdpId) {
    await this.updateValues(cdpId);
    try {
      // TODO why is this returning undefined
      this._governanceFee = (await this.cdpService.getGovernanceFee(
        this.cdpId,
        MKR
      )).toBigNumber();
    } catch (e) {
      this._governanceFee = false;
    }
    this.ready = true;
    return this;
  }

  async updateValues(cdpId = this.cdpId) {
    this._proxyAddress = await this.services.getProxy();
    this.noProxy = this._proxyAddress === null;
    try {
      // console.log('cdpId, this._proxyAddress', cdpId, this._proxyAddress); // todo remove dev item
      // this.cdp = await this.services.getMakerCdp(cdpId);
      if (this._proxyAddress) {
        this.cdp = await this.services.getMakerCdp(cdpId, this._proxyAddress);
      } else {
        this.cdp = await this.services.getMakerCdp(cdpId, false);
      }
      console.log(this.cdp); // todo remove dev item
    } catch (e) {
      console.error(e);
    }
    // const liqPrice = await this.cdp.getLiquidationPrice();
    // this._liqPrice = liqPrice.toBigNumber().toFixed(2);
    this.isSafe = this.cdp.isSafe;
    // this.debtValue = (await this.cdp.getDebtValue()).toBigNumber();
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

  // Gat balances/values ===============================================================================================

  async getCombinedDebtValue(proxyAddress = this._proxyAddress) {
    return this.mcdManager.getCombinedDebtValue(proxyAddress);
  }

  // ====================================================================================================================

  // get (non-getter) methods
  getBalanceOf(currency) {
    console.log(currency, this.services.balances[currency].toString()); // todo remove dev item
    if (this.services.balances[currency]) {
      return this.services.balances[currency];
    }
    return toBigNumber(0);
  }

  getProxyAllowancefor(currency) {
    return this.services.proxyAllowances[currency];
  }

  getTokenObjectFor(currency) {
    return this.services.tokens[currency];
  }

  async checkIfDestAddressHasProxy(address) {
    await this.getProxy();
    const proxy = await this.proxyService.getProxyAddress(address);
    return proxy;
  }

  enoughMkrToWipe(amount) {
    return this.cdpService.enoughMkrToWipe(amount, DAI.wei);
  }

  // Calculations

  toPeth(eth) {
    return this.services.toPeth(eth);
  }

  calcCollatRatio(ethQty, daiQty) {
    if (ethQty <= 0 || daiQty <= 0) return toBigNumber(0);
    const value = this.getPriceOfCurrency(this.cdpCollateralType);
    return calcCollatRatio(value, ethQty, daiQty);
  }

  calcCollatRatioDaiChg(daiQty, changeAmountOnly = false) {
    if (changeAmountOnly) {
      daiQty = toBigNumber(this.debtValue).plus(toBigNumber(daiQty));
    }
    return toBigNumber(this.calcCollatRatio(this.collateralAmount, daiQty));
  }

  calcCollatRatioEthChg(ethQty, changeAmountOnly = false) {
    if (changeAmountOnly) {
      ethQty = toBigNumber(this.debtValue).plus(toBigNumber(ethQty));
    }
    return toBigNumber(this.calcCollatRatio(ethQty, this.debtValue));
  }

  calcLiquidationPrice(ethQty, daiQty) {
    if (ethQty <= 0 || daiQty <= 0) return toBigNumber(0);
    const value = this.getPriceOfCurrency(this.cdpCollateralType);
    return calcLiquidationPrice(ethQty, daiQty, value, this.liquidationRatio);
  }

  calcLiquidationPriceDaiChg(daiQty, changeAmountOnly = false) {
    if (changeAmountOnly) {
      daiQty = toBigNumber(this.debtValue).plus(toBigNumber(daiQty));
      console.log('daiQty', daiQty.toString()); // todo remove dev item
    }
    console.log(
      'calcLiquidationPrice',
      toBigNumber(
        this.calcLiquidationPrice(this.collateralAmount, daiQty)
      ).toString()
    ); // todo remove dev item
    return toBigNumber(
      this.calcLiquidationPrice(this.collateralAmount, daiQty)
    );
  }

  calcLiquidationPriceEthChg(ethQty, changeAmountOnly = false) {
    if (changeAmountOnly) {
      ethQty = toBigNumber(this.debtValue).plus(toBigNumber(ethQty));
    }
    return toBigNumber(this.calcLiquidationPrice(ethQty, this.debtValue));
  }

  // Helpers
  minInSelectedCurrency(symbol) {
    const minEth = toBigNumber(this.pethMin).times(this.wethToPethRatio);

    return toBigNumber(minEth)
      .times(this.getCurrentPriceFor('ETH'))
      .div(this.getCurrentPriceFor(symbol));
  }

  getCurrentPriceFor(symbol) {
    if (!symbol) return 0;
    this.getTokenObjectFor(symbol).price._amount.toString();
    return 0;
  }

  collateralOptions() {
    return Object.keys(this.services.tokens).reduce((acc, entry) => {
      acc.push({
        symbol: entry,
        name: this.services.tokens[entry].ilk
      });
      return acc;
    }, []);
  }

  hasEnough(ethQty, currency = 'ETH', balance = null) {
    // return true;
    console.log(ethQty); // todo remove dev item
    if (toBigNumber(ethQty).isNaN()) return false;
    const _ethQty = toBigNumber(ethQty).toFixed(18);
    if (currency === 'ETH' && balance !== null) {
      return toBigNumber(
        ethUnit.toWei(toBigNumber(_ethQty), 'ether').toString()
      ).lte(balance);
    }
    return toBigNumber(ethUnit.toWei(_ethQty, 'ether').toString()).lte(
      ethUnit.toWei(this.getBalanceOf(currency), 'ether')
    );
  }

  hasEnoughAllowance(ethQty, currency = 'ETH') {
    // return true;
    if (toBigNumber(ethQty).isNaN()) return false;
    if (currency === 'ETH') return true;
    const _ethQty = toBigNumber(ethQty).toFixed(18);
    const currentAllowance = this.getProxyAllowancefor(currency);
    return toBigNumber(ethUnit.toWei(_ethQty, 'ether').toString()).lte(
      currentAllowance
    );
  }

  getPriceOfCurrency(type) {
    const curr = this.mcdCurrencies[type];
    if (curr) {
      return curr.price._amount;
    }
    return 0;
  }
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

  // Interaction / Operation methods ===================================================================================
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

  async openCdp(type, ethQty, daiQty) {
    if (ethQty <= 0) return 0;
    // --------------------------
    this.opening = true;
    this.needsUpdate = true;
    // TODO structure to accept multiple currencies

    const newCdp = await this.mcdManager.openLockAndDraw(
      type.ilk,
      getMakerCurrencies()[type.currency.symbol](ethQty),
      MDAI(daiQty)
    );
    return newCdp.id;
  }

  async lockEth(amount) {
    try {
      if (this.noProxy) {
        return;
      }
      const owner = await this.mcdManager.getOwner(this.cdpId);
      this.needsUpdate = true;
      console.log(this.getProxyAllowancefor(this.cdpType).toString()); // todo remove dev item
      await this.mcdManager.lock(
        this.cdpId,
        this.cdpType,
        this.cdpTypeObject(amount),
        owner
      );
    } catch (e) {
      // eslint-disable-next-line
      console.error(e);
    }
  }

  async drawDai(amount, acknowledgeBypass = false) {
    console.log(
      'draw dai',
      amount.toString(),
      toBigNumber(amount),
      acknowledgeBypass
    ); // todo remove dev item
    if (
      this.calcCollatRatio(
        this.collateralAmount,
        this.debtValue.plus(amount)
      ).gt(2) ||
      acknowledgeBypass
    ) {
      try {
        if (this.noProxy) {
          return;
        }
        this.needsUpdate = true;
        console.log('_mcdManager', this.mcdManager.drawDai); // todo remove dev item
        console.log('cdpService', this.cdpService.drawDaiProxy); // todo remove dev item
        console.log('cdp.drawdai', this.cdp.drawDai); // todo remove dev item
        await this.cdp.drawDai(MDAI(amount));
        // this.cdpService.drawDaiProxy(this._proxyAddress, this.cdpId, amount);
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
}
