import Maker from '@makerdao/dai';
import {
  calcLiquidationPrice,
  calcCollatRatio,
  getMakerCurrencies,
  addresses,
  ERC20,
  toBigNumber,
  bnOver
} from '../makerHelpers';
import { MDAI } from '@makerdao/dai-plugin-mcd';
import ethUnit from 'ethjs-unit';
import MakerCdpBase from './MakerCdpBase';
import { getUrns } from './chainCalls';
import * as daiMath from './daiMath';
import BigNumber from 'bignumber.js';
const { DAI } = Maker;

export default class MakerCDP extends MakerCdpBase {
  constructor(cdpId, web3, services, sysVars) {
    super(cdpId, web3, services, sysVars);
    this.minDai = 20.5;
    this.DAI_NAME = 'MDAI';
  }

  // Getters
  // See MakerCdpBase

  // Setup Methods =====================================================================================================
  async init(cdpId = this.cdpId) {
    await this.updateValues(cdpId);
    try {
      // TODO why is this returning undefined
      this._governanceFee = (await this.cdp.getGovernanceFee()).toBigNumber();
    } catch (e) {
      this._governanceFee = false;
    }
    this.ready = true;
    return this;
  }

  async updateSystemVariables(toUpdate) {
    this.services = { ...this.services, ...toUpdate };
  }

  async updateValues(cdpId = this.cdpId) {
    try {
      this._proxyAddress = await this.services.getProxy();
      this.noProxy = this._proxyAddress === null;
      try {
        if (this._proxyAddress) {
          this.cdp = await this.services.getMakerCdp(cdpId, this._proxyAddress);
        } else {
          this.cdp = await this.services.getMakerCdp(cdpId, false);
        }
        this.isSafe = this.cdp.isSafe;
        await this.getValuesFromChain();
      } catch (e) {
        // eslint-disable-next-line
        console.error(e);
      }
    } catch (e) {
      // eslint-disable-next-line
      console.error(e);
    }
  }

  async getValuesFromChain() {
    if (!this.afterInitialization) {
      this.afterInitialization = !this.afterInitialization;
      return;
    }

    const urns = await getUrns(this.web3, this.cdpId, this.cdpType);
    const value = this.cdpTypeObject.currency.wei(urns.ink);
    if (!this.cdp.collateralAmount.toBigNumber().eq(value.toBigNumber())) {
      this.override['collateralAmount'] = this.cdpTypeObject.currency.wei(
        urns.ink
      );
    }

    // todo: think about whether the type of update should be recorded and then used to determine which override to create
    // Mostly about reducing chain calls.  if the value doesn't need a particular call. it can be skipped.
    this.override['debtValue'] = daiMath.debtValue(
      urns.art,
      this.dustValues[this.cdpCollateralType].rate
    );
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

  // ====================== alphabetical (roughly) ============================

  async approveProxyFor(symbol) {
    await this.getTokens[symbol].approveUnlimited(this.proxyAddress);
  }

  async approveDai() {
    await this.daiToken.approveUnlimited(this.proxyAddress);
  }

  async approveMkr() {
    if (!this.proxyAddress) return;
    await this.mkrToken.approveUnlimited(this.proxyAddress);
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
    }
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

  async checkIfDestAddressHasProxy(address) {
    await this.getProxy();
    return await this.proxyService.getProxyAddress(address);
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

  convertToTokenWei(value, decimals) {
    const denominator = new BigNumber(10).pow(decimals);
    return new BigNumber(value).times(denominator).toFixed(0).toString(10);
  }

  convertToTokenBase(value, decimals) {
    const denominator = new BigNumber(10).pow(decimals);
    return new BigNumber(value).div(denominator).toString(10);
  }

  enoughMkrToWipe(amount) {
    return this.cdpService.enoughMkrToWipe(amount, DAI.wei);
  }

  async getProxy() {
    this._proxyAddress = await this.services.getProxy();
  }

  async getCombinedDebtValue(proxyAddress = this._proxyAddress) {
    return this.mcdManager.getCombinedDebtValue(proxyAddress);
  }

  getBalanceOf(currency) {
    if (this.services.balances[currency]) {
      return this.services.balances[currency];
    }
    return toBigNumber(0);
  }

  getProxyAllowancefor(currency) {
    return this.services.proxyAllowances[currency];
  }

  async getRawProxyAllowanceforMkr() {
    const contract = new this.web3.eth.Contract(ERC20, addresses.MCD_GOV);
    return await contract.methods
      .allowance(this.currentAddress, this.proxyAddress)
      .call();
  }

  getTokenObjectFor(currency) {
    return this.services.tokens[currency];
  }

  getCurrentPriceFor(symbol) {
    if (!symbol) return 0;
    return this.getPriceOfCurrency(symbol);
  }

  getEventHistory() {
    return this.mcdManager.getEventHistory(this.cdp);
  }

  getPriceOfCurrency(type) {
    const curr = this.mcdCurrencies[type];
    if (curr) {
      return curr.price._amount;
    }
    return 0;
  }

  async getDaiBalances() {
    return await this.getTokens[this.DAI_NAME].balance();
  }

  hasEnough(ethQty, currency = 'ETH', balance = null) {
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
    if (currency === 'ETH') return true;
    const currentAllowance = this.getProxyAllowancefor(currency);
    try {
      const _ethQty = toBigNumber(ethQty).toFixed(18);
      return toBigNumber(currentAllowance.toString()).gte(
        toBigNumber(this.convertToTokenWei(_ethQty, 18).toString())
      );
    } catch (e) {
      // eslint-disable-next-line
      console.error(e);
    }
    // todo This is a temp solution
    return toBigNumber(currentAllowance).gte(toBigNumber(10));
  }

  minDeposit(
    daiQty = this.minDai,
    ethPrice = this.currentPrice,
    liquidationRatio = this.liquidationRatio
  ) {
    if (daiQty <= 0) daiQty = this.minDai;
    return bnOver(liquidationRatio, daiQty, ethPrice);
  }

  minDepositFor(symbol) {
    return this.minDeposit(this.minDai, this.getCurrentPriceFor(symbol));
  }

  minInSelectedCurrency(symbol) {
    const minEth = toBigNumber(this.pethMin).times(this.wethToPethRatio);
    return toBigNumber(minEth)
      .times(this.getCurrentPriceFor('ETH'))
      .div(this.getCurrentPriceFor(symbol));
  }

  setType(type) {
    if (this.cdpId === null) {
      this.cdpTypeObject = this.mcdManager
        .get('mcd:cdpType')
        .getCdpType(null, type.name);
    }
  }

  toPeth(eth) {
    return this.services.toPeth(eth);
  }

  // ***********************************************************************************************
  // Interaction / Operation methods
  // ***********************************************************************************************
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
      await this.mcdManager.lock(
        this.cdpId,
        this.cdpType,
        this.mcdCurrencies[this.cdpCollateralType].currency(amount),
        owner
      );
    } catch (e) {
      // eslint-disable-next-line
      console.error(e);
    }
  }

  async drawDai(amount, acknowledgeBypass = false) {
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
        await this.cdp.drawDai(MDAI(amount));
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
        await this.cdp.freeCollateral(amount.toString());
      } catch (e) {
        // eslint-disable-next-line
        console.error(e);
      }
    }
  }

  async wipeDai(amount, max = false) {
    try {
      if (this.noProxy) {
        return;
      }
      this.needsUpdate = true;
      if (max) {
        await this.cdp.wipeAll();
      } else {
        await this.cdp.wipeDai(amount.toString());
      }
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
      await this.cdp.giveToProxy(address);
    } else if (!this.noProxy && proxy) {
      this.needsUpdate = true;
      this.closing = true;
      await this.cdp.giveToProxy(address);
    } else if (!this.noProxy) {
      this.needsUpdate = true;
      this.closing = true;
      await this.cdp.give(address);
    } else {
      this.needsUpdate = true;
      this.closing = true;
      await this.cdp.give(address);
    }
  }
}
