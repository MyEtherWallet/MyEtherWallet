import BigNumber from 'bignumber.js';
import { toChecksumAddress } from '@/helpers/addressUtils';
import MakerCDP from './MakerCDP';
import Maker from '@makerdao/dai';

const { MKR, DAI } = Maker;

const toBigNumber = num => {
  return new BigNumber(num);
};

const bnOver = (one, two, three) => {
  return toBigNumber(one)
    .times(toBigNumber(two))
    .div(toBigNumber(three));
};

export default class MakerManager {
  constructor(props) {
    this.web3 = props.web3 || {};
    this.pethMin = props.pethMin || 0.005;
    this.creatingProxy = false;
    this._currentAddress = props.account.address;
    this.maker = function() {
      return props.maker;
    };

    this._proxyAddress = props.currentProxy || null;
    this.activeCdps = {};
    this.routeHandlers = props.routeHandlers || {
      home: () => {},
      create: () => {},
      manage: () => {}
    };

    this._proxyAllowanceDai = 0;
    this._proxyAllowanceMkr = 0;
  }

  // Getters
  get daiJs() {
    return this.maker();
  }

  get currentAddress() {
    return this._currentAddress;
  }

  get availableCdps() {
    return this.activeCdps;
  }

  get proxy() {
    return this._proxyAddress;
  }

  get proxyAddress() {
    if (!this._proxyAddress) {
      return null;
    }
    return this._proxyAddress;
  }

  get hasProxy() {
    return this._proxyAddress !== null;
  }

  get cdpsWithProxy() {
    return this.cdps;
  }

  get cdpsNoProxy() {
    return this.cdpsWithoutProxy;
  }

  get minEth() {
    if (this.wethToPethRatio) {
      return toBigNumber(this.pethMin).times(this.wethToPethRatio);
    }
    return '--';
  }

  get proxyAllowanceDai() {
    return this._proxyAllowanceDai;
  }

  get proxyAllowanceMkr() {
    return this._proxyAllowanceMkr;
  }
  // General Values
  get liquidationPenalty() {
    return this._liquidationPenalty;
  }

  get liquidationRatio() {
    return this._liquidationRatio;
  }

  get stabilityFee() {
    return this._stabilityFee;
  }

  get ethPrice() {
    return this._ethPrice;
  }

  get pethPrice() {
    return this._pethPrice;
  }

  get targetPrice() {
    return this._targetPrice;
  }

  get wethToPethRatio() {
    return this._wethToPethRatio;
  }

  get priceService() {
    return this._priceService;
  }

  get proxyService() {
    return this._proxyService;
  }

  get tokenService() {
    return this._tokenService;
  }

  get cdpService() {
    return this._cdpService;
  }

  get daiToken() {
    return this._daiToken;
  }

  get mkrToken() {
    return this._mkrToken;
  }

  // Methods
  async init() {
    await this.maker().authenticate();
    this._priceService = this.maker().service('price');
    this._cdpService = await this.maker().service('cdp');
    this._proxyService = await this.maker().service('proxy');
    this._tokenService = await this.maker().service('token');

    this._ethPrice = toBigNumber(
      (await this._priceService.getEthPrice()).toNumber()
    );
    // this.ethPrice = toBigNumber(163.84);

    const pethPrice = await this._priceService.getPethPrice();
    const targetPrice = await this._priceService.getPethPrice();
    const liquidationRatio = await this._cdpService.getLiquidationRatio();
    const liquidationPenalty = await this._cdpService.getLiquidationPenalty();
    const stabilityFee = await this._cdpService.getAnnualGovernanceFee();
    const wethToPethRatio = await this._priceService.getWethToPethRatio();

    this._pethPrice = toBigNumber(pethPrice.toNumber());

    this._targetPrice = toBigNumber(targetPrice.toNumber());

    this._liquidationRatio = toBigNumber(liquidationRatio);
    this._liquidationPenalty = toBigNumber(liquidationPenalty);
    this._stabilityFee = toBigNumber(stabilityFee);

    this._wethToPethRatio = toBigNumber(wethToPethRatio);
    this._proxyAddress = await this._proxyService.currentProxy();

    this._daiToken = this._tokenService.getToken(DAI);
    this.daiBalance = (await this._daiToken.balance()).toBigNumber();
    this._mkrToken = this._tokenService.getToken(MKR);
    this.mkrBalance = (await this._mkrToken.balance()).toBigNumber();

    await this.checkAllowances();

    const { withProxy, withoutProxy } = await this.locateCdps();
    this.cdps = withProxy;
    this.cdpsWithoutProxy = withoutProxy;

    if (this.cdps.length > 0 || this.cdpsWithoutProxy.length > 0) {
      await this.loadCdpDetails();
    }
  }

  async getProxy() {
    this._proxyAddress = await this._proxyService.currentProxy();
    if (!this._proxyAddress) {
      this._proxyAddress = await this._proxyService.getProxyAddress(
        this._currentAddress
      );
      if (this._proxyAddress) this.noProxy = false;
    }
    return this._proxyAddress;
  }

  hasCdp(cdpId) {
    return Object.keys(this.activeCdps).includes(toBigNumber(cdpId).toString());
  }

  getCdp(cdpId) {
    return this.activeCdps[cdpId];
  }

  async refresh() {
    await this.doUpdate();
  }

  async updateActiveCdp() {
    const currentCdpIds = Object.keys(this.activeCdps);
    await this.locateCdps();

    const newCdps = this.cdps.filter(
      item => !Object.keys(this.activeCdps).includes(item)
    );

    const newCdpsWithoutProxy = this.cdpsWithoutProxy.filter(
      item => !Object.keys(this.activeCdps).includes(item)
    );

    const removedCdps = currentCdpIds.filter(
      item =>
        !(this.cdps.includes(item) || this.cdpsWithoutProxy.includes(item))
    );

    if (removedCdps.length > 0) {
      removedCdps.forEach(item => delete this.activeCdps[item]);
    }

    for (let i = 0; i < newCdps.length; i++) {
      this.activeCdps[newCdps[i]] = await this.buildCdpObject(newCdps[i]);
    }

    for (let i = 0; i < newCdpsWithoutProxy.length; i++) {
      this.activeCdps[newCdpsWithoutProxy[i]] = await this.buildCdpObject(
        newCdpsWithoutProxy[i],
        { noProxy: true }
      );
    }

    if (this.cdps.length === 0 && this.cdpsWithoutProxy.length === 0) {
      this.routeHandlers.create();
      return;
    }
  }

  async doUpdate(route) {
    this._proxyAddress = await this.getProxy();
    let afterClose = false;
    const afterOpen = route === 'create';
    await this.updateActiveCdp();

    for (const idProp in this.activeCdps) {
      if (this.activeCdps[idProp].needsUpdate) {
        if (this.activeCdps[idProp].closing) {
          afterClose = true;
          delete this.activeCdps[idProp];
          this.cdps = this.cdps.filter(item => item !== idProp);
          this.cdpsWithoutProxy = this.cdpsWithoutProxy.filter(
            item => item !== idProp
          );
        } else if (this.activeCdps[idProp].opening) {
          await this.activeCdps[idProp].updateValues();
        } else {
          this.activeCdps[idProp] = await this.activeCdps[idProp].update();
        }
      }
    }

    this.daiBalance = (await this._daiToken.balance()).toBigNumber();
    this.mkrBalance = (await this._mkrToken.balance()).toBigNumber();
    await this.checkAllowances();

    if (afterClose || afterOpen) {
      // console.log(this.cdps, this.cdpsWithoutProxy); // todo remove dev item
      if (this.cdps.length > 0 || this.cdpsWithoutProxy.length > 0) {
        this.routeHandlers.manage();
      } else {
        this.routeHandlers.create();
      }
    }
    return true;
  }

  async checkAllowances() {
    if (this._proxyAddress) {
      this._proxyAllowanceDai = (await this.daiToken.allowance(
        this._currentAddress,
        this._proxyAddress
      )).toBigNumber();

      this._proxyAllowanceMkr = (await this.mkrToken.allowance(
        this._currentAddress,
        this._proxyAddress
      )).toBigNumber();
    }
  }

  async locateCdps() {
    this.cdpsWithoutProxy = [];
    this.cdpsWithoutProxy = await this.locateCdpsWithoutProxy();
    this.cdps = [];
    this.cdps = await this.locateCdpsProxy();

    return { withProxy: this.cdps, withoutProxy: this.cdpsWithoutProxy };
  }

  async locateCdpsWithoutProxy() {
    // console.log(this.cdpService); // todo remove dev item
    const directCdps = await this.cdpService.getCdpIds(this._currentAddress);
    const directCdpsCheckSum = await this.cdpService.getCdpIds(
      toChecksumAddress(this._currentAddress)
    );
    // console.log(directCdps); // todo remove dev item
    // console.log(directCdpsCheckSum); // todo remove dev item
    return directCdps.concat(directCdpsCheckSum);
  }

  async locateCdpsProxy() {
    this._proxyAddress = await this.getProxy();
    // console.log(this._proxyAddress); // todo remove dev item
    const vals = await this.cdpService.getCdpIds(this._proxyAddress);
    // console.log(vals); // todo remove dev item
    return vals;
  }

  async loadCdpDetails() {
    for (let i = 0; i < this.cdps.length; i++) {
      this.activeCdps[this.cdps[i]] = await this.buildCdpObject(this.cdps[i]);
    }
    for (let i = 0; i < this.cdpsWithoutProxy.length; i++) {
      this.activeCdps[this.cdpsWithoutProxy[i]] = await this.buildCdpObject(
        this.cdpsWithoutProxy[i],
        {
          noProxy: true
        }
      );
    }
  }

  async buildProxy() {
    this.creatingProxy = true;
    this._proxyAddress = await this.getProxy();
    if (!this._proxyAddress) {
      await this._proxyService.build();
      this._proxyAddress = await this._proxyService.currentProxy();
      return this._proxyAddress;
    }
    this._proxyAddress = await this._proxyService.currentProxy();
    return this._proxyAddress;
  }

  async migrateCdp(cdpId) {
    const currentProxy = await this.getProxy();
    if (currentProxy) {
      await this._cdpService.give(cdpId, currentProxy);
    }
  }

  async buildCdpObject(cdpId, options = {}) {
    const sysVars = {
      ...options
    };

    const services = {
      makerManager: this,
      web3: this.web3
    };

    const makerCDP = new MakerCDP(cdpId, this, services, sysVars);
    return await makerCDP.init(cdpId);
  }

  // Calculations
  calcDrawAmt(principal, collatRatio) {
    return Math.floor(
      bnOver(principal, this._ethPrice, collatRatio).toNumber()
    );
  }

  calcMinCollatRatio(priceFloor) {
    return bnOver(this._ethPrice, this._liquidationRatio, priceFloor);
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
}
