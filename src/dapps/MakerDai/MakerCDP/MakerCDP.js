import Maker from '@makerdao/dai';
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
import { getDustValue } from './chainCalls';
import * as daiMath from './daiMath'
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
      // TODO why is this returning undefined
      this._governanceFee = (
        await this.cdpService.getGovernanceFee(this.cdpId, MKR)
      ).toBigNumber();
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
        // console.log('cdpId, this._proxyAddress', cdpId, this._proxyAddress); // todo remove dev item
        // this.cdp = await this.services.getMakerCdp(cdpId);
        if (this._proxyAddress) {
          this.cdp = await this.services.getMakerCdp(cdpId, this._proxyAddress);
        } else {
          this.cdp = await this.services.getMakerCdp(cdpId, false);
        }
        console.log('CDP', this.cdp); // todo remove dev item
        console.log(
          'CDP.type.liquidationPenalty',
          this.cdp.type.liquidationPenalty
        ); // todo remove dev item

        // const liqPrice = await this.cdp.getLiquidationPrice();
        // this._liqPrice = liqPrice.toBigNumber().toFixed(2);
        this.isSafe = this.cdp.isSafe;

        this._collatRatio = await this.cdp.getCollateralizationRatio();
        console.log(this._collatRatio); // todo remove dev item
        this.ethCollateral = (
          await this.cdp.getCollateralValue()
        ).toBigNumber();
        this.pethCollateral = (
          await this.cdp.getCollateralValue(Maker.PETH)
        ).toBigNumber();
        this._usdCollateral = (
          await this.cdp.getCollateralValue(Maker.USD)
        ).toBigNumber();
      } catch (e) {
        console.error(e);
      }
    } catch (e) {
      console.error(e);
    }
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
    console.log(
      'getBalanceOf',
      currency,
      this.services.balances[currency].toString()
    ); // todo remove dev item
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
    const result = await contract.methods
      .allowance(this.currentAddress, this.proxyAddress)
      .call();
    console.log(result); // todo remove dev item
    return result;
    // return this.services.proxyAllowances[currency];
  }

  getTokenObjectFor(currency) {
    return this.services.tokens[currency];
  }

  getCurrentPriceFor(symbol) {
    if (!symbol) return 0;
    return this.getPriceOfCurrency(symbol);
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
    // return true;
    if (toBigNumber(ethQty).isNaN()) return false;
    if (currency === 'ETH') return true;
    const _ethQty = toBigNumber(ethQty).toFixed(18);
    const currentAllowance = this.getProxyAllowancefor(currency);
    return toBigNumber(currentAllowance).gte(
      toBigNumber(ethUnit.toWei(_ethQty, 'ether').toString())
    );
  }

  minDeposit(
    daiQty = this.minDai,
    ethPrice = this.currentPrice,
    liquidationRatio = this.liquidationRatio
  ) {
    if (daiQty <= 0) daiQty = this.minDai;
    console.log(liquidationRatio, daiQty, ethPrice); // todo remove dev item
    console.log(
      'calcMinDeposit',
      bnOver(liquidationRatio, daiQty, ethPrice).toString()
    ); // todo remove dev item
    return bnOver(liquidationRatio, daiQty, ethPrice);
  }

  minDepositFor(symbol) {
    // const minDai = toBigNumber(
    //   ethUnit.fromWei(this.vatValues[symbol].dust, 'wei').toString()
    // )
    // console.log('minDai', minDai.toString()); // todo remove dev item
    return this.minDeposit(this.minDai, this.getCurrentPriceFor(symbol))
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
    console.log('this.debtValue', this.debtValue); // todo remove dev item
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
      // await this.cdp.wipeDai(amount);
      console.log(amount); // todo remove dev item
      console.log(MDAI(amount)); // todo remove dev item
      await this.cdp.unsafeWipe(MDAI(amount));
      // await this.cdpService.wipeDaiProxy(
      //   this._proxyAddress,
      //   this.cdpId,
      //   amount
      // );
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
