import Maker from '@makerdao/dai';
import * as makerCurrency from '@makerdao/currency';
import BigNumber from 'bignumber.js';
import {
  calcLiquidationPrice,
  calcCollatRatio,
  maxPethDraw,
  maxEthDraw,
  maxDai,
  getMakerCurrencies,
  displayFixedValue,
  addresses,
  ERC20,
  Spotter,
  toBigNumber,
  bnOver
} from '../makerHelpers';
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
import { getUrns } from './chainCalls';
import * as daiMath from './daiMath';
const { DAI } = Maker;

export default class MakerCDP extends MakerCdpBase {
  constructor(cdpId, web3, services, sysVars) {
    super(cdpId, web3, services, sysVars);
    this.minDai = 20.5;
  }

  // Getters
  // See MakerCdpBase

  // Setup Methods =====================================================================================================
  async init(cdpId = this.cdpId) {
    await this.updateValues(cdpId);
    try {
      const val = await this.cdp.getGovernanceFee();
      console.log('govFee 1', val); // todo remove dev item
      // TODO why is this returning undefined
      this._governanceFee = (await this.cdp.getGovernanceFee()).toBigNumber();
    } catch (e) {
      this._governanceFee = false;
    }
    this.ready = true;
    return this;
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
        console.log('CDP', this.cdp); // todo remove dev item
        this.isSafe = this.cdp.isSafe;
        await this.getValuesFromChain();
        console.log(this.mcdManager.get('mcd:cdpType').getCdpType(null, this.cdpType)); // todo remove dev item

        const val = await this.cdp.getGovernanceFee();
        console.log('govFee 2', val); // todo remove dev item
      } catch (e) {
        console.error(e);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async getValuesFromChain() {
    if(!this.afterInitialization){
      this.afterInitialization = !this.afterInitialization;
      return;
    }
    const urns = await getUrns(this.web3, this.cdpId, this.cdpType);
    const value = this.cdpTypeObject.currency.wei(urns.ink);
    if (!this.cdp.collateralAmount.toBigNumber().eq(value.toBigNumber())) {
      this.override['collateralAmount'] = this.cdpTypeObject.currency
        .wei(urns.ink)
    }
    // todo: think about whether the type of update should be recorded and then used to determine which override to create
    // Mostly about reducing chain calls.  if the value doesn't need a particular call. it can be skipped.
    console.log('this.dustValues.rate', this.dustValues[this.cdpCollateralType].rate); // todo remove dev item
    const calculatedDebt = daiMath.debtValue(urns.art, this.dustValues[this.cdpCollateralType].rate);
    console.log('calculatedDebt', calculatedDebt.toBigNumber().toString()); // todo remove dev item
    this.override['debtValue'] = calculatedDebt;

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

  async approveDai() {
    await this.daiToken.approveUnlimited(this.proxyAddress);
  }

  async approveMkr() {
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
    const proxy = await this.proxyService.getProxyAddress(address);
    return proxy;
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
    return await this.services.daiToken.balance();
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
    // if (toBigNumber(ethQty).isNaN()) return false;
    if (currency === 'ETH') return true;
    // const _ethQty = toBigNumber(ethQty).toFixed(18);
    const currentAllowance = this.getProxyAllowancefor(currency);
    console.log('currentAllowance', currentAllowance); // todo remove dev item
    // return toBigNumber(currentAllowance).gte(
    //   toBigNumber(ethUnit.toWei(_ethQty, 'ether').toString())
    // );
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
    // const minDai = toBigNumber(
    //   ethUnit.fromWei(this.vatValues[symbol].dust).toString()
    // )
    // console.log('minDai', minDai.toString()); // todo remove dev item
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
      this.cdpTypeObject = this.services.mcdCurrencies[type.symbol];
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
        await this.cdp.freeCollateral(amount);
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
      await this.cdp.wipeDai(amount);
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
