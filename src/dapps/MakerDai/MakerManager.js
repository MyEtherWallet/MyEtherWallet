import BigNumber from 'bignumber.js';
import { toChecksumAddress } from '@/helpers/addressUtils';
import MakerCDP from './MakerCDP';

const toBigNumber = num => {
  return new BigNumber(num);
};

const bnOver = (one, two, three) => {
  return toBigNumber(one)
    .times(toBigNumber(two))
    .div(toBigNumber(three));
};

export default class MakerManager /*extends EventEmitter*/ {
  constructor(props) {
    // super();
    this.creatingProxy = false;
    this.currentAddress = props.account.address;
    this.maker = props.maker;
    this._proxyAddress = props.currentProxy || null;
    this.activeCdps = {};
    this.routeHandlers = props.routeHandlers || {
      home: () => {},
      create: () => {},
      manage: () => {}
    };
  }

  get availableCdps() {
    return this.activeCdps;
  }

  get proxy() {
    return this._proxyAddress;
  }

  get isCreatingProxy() {
    if (this._proxyAddress !== null) {
      return false;
    }
    return this.creatingProxy;
  }

  // get needToMigrateCdps(){
  //   if (this._proxyAddress === null && this.creatingProxy) {
  //     return true;
  //   }
  // }

  get cdpsWithProxy() {
    return this.cdps;
  }

  get cdpsNoProxy() {
    return this.cdpsWithoutProxy;
  }

  get proxyAddress() {
    if (!this._proxyAddress) {
      return null;
    }
    return this._proxyAddress;
  }

  get makerActive() {}

  hasCdp(cdpId) {
    return Object.keys(this.activeCdps).includes(toBigNumber(cdpId).toString());
  }

  getCdp(cdpId) {
    return this.activeCdps[cdpId];
  }

  addOpenedCdp(makerCdp, cdpId) {
    this.activeCdps[cdpId] = makerCdp;
  }

  async init() {
    await this.maker.authenticate();
    this.priceService = this.maker.service('price');
    this.cdpService = await this.maker.service('cdp');
    this.proxyService = await this.maker.service('proxy');

    // this.ethPrice = toBigNumber(
    //   (await this.priceService.getEthPrice()).toNumber()
    // );
    this.ethPrice = toBigNumber(166.16);

    const pethPrice = await this.priceService.getPethPrice();
    const targetPrice = await this.priceService.getPethPrice();
    const liquidationRatio = await this.cdpService.getLiquidationRatio();
    const liquidationPenalty = await this.cdpService.getLiquidationPenalty();
    const stabilityFee = await this.cdpService.getAnnualGovernanceFee();
    const wethToPethRatio = await this.priceService.getWethToPethRatio();

    this.pethPrice = toBigNumber(pethPrice.toNumber());

    this.targetPrice = toBigNumber(targetPrice.toNumber());

    this.liquidationRatio = toBigNumber(liquidationRatio);
    this.liquidationPenalty = toBigNumber(liquidationPenalty);
    this.stabilityFee = toBigNumber(stabilityFee);

    this.wethToPethRatio = toBigNumber(wethToPethRatio);
    this._proxyAddress = await this.proxyService.currentProxy();

    const { withProxy, withoutProxy } = await this.locateCdps();
    this.cdps = withProxy;
    this.cdpsWithoutProxy = withoutProxy;

    if (this.cdps.length > 0 || this.cdpsWithoutProxy.length > 0) {
      await this.loadCdpDetails();
    }

    console.log('init complete'); // todo remove dev item
    console.log('proxy address: ', this._proxyAddress); // todo remove dev item
  }

  async buildProxy() {
    this.creatingProxy = true;
    this._proxyAddress = await this.getProxy();
    if (!this._proxyAddress) {
      await this.proxyService.build();
      // eslint-disable-next-line
      this._proxyAddress = await this.proxyService.currentProxy();
      return this._proxyAddress;
    }
    this._proxyAddress = await this.proxyService.currentProxy();
    return this._proxyAddress;
  }

  async migrateCdp(cdpId) {
    const currentProxy = await this.getProxy();
    if (currentProxy) {
      await this.cdpService.give(cdpId, currentProxy);
    }
  }

  async getProxy() {
    this._proxyAddress = await this.proxyService.currentProxy();
    if (!this._proxyAddress) {
      this._proxyAddress = await this.proxyService.getProxyAddress(
        this.currentAddress
      );
      if (this._proxyAddress) this.noProxy = false;
    }
    return this._proxyAddress;
  }

  async refresh() {
    await this.doUpdate();
  }

  async updateActiveCdp() {
    const currentCdpIds = Object.keys(this.activeCdps);
    await this.locateCdps();

    // const dups = this.cdps.filter(item => {
    //   return this.cdpsWithoutProxy.includes(item);
    // });

    // if (dups.length > 0) {
    //   dups.forEach(item => {
    //     console.log(' this.cdpsWithoutProxy', this.cdpsWithoutProxy); // todo remove dev item
    //     const idx = this.cdpsWithoutProxy.findIndex(item);
    //     this.cdpsWithoutProxy.splice(idx, 1);
    //   });
    // }

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

    // // const currentCdpIds = Object.keys(this.activeCdps);
    // if (this.cdpsWithoutProxy.length === 0) {
    //   this.routeHandlers.goToManage();
    // }
  }

  async doUpdate(route) {
    this._proxyAddress = await this.proxyService.currentProxy();
    let afterClose = false;
    const afterOpen = route === 'create';
    // this.migrationInProgress = false;
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

    if (afterClose || afterOpen) {
      // const { withProxy, withoutProxy } = await this.locateCdps();
      // this.cdps = withProxy;
      // this.cdpsWithoutProxy = withoutProxy;
      // await this.updateActiveCdp();
      if (this.cdps.length > 0 || this.cdpsWithoutProxy.length > 0) {
        this.routeHandlers.manage();
      } else {
        this.routeHandlers.create();
      }
    }
    return true;
  }

  calcDrawAmt(principal, collatRatio) {
    return Math.floor(bnOver(principal, this.ethPrice, collatRatio).toNumber());
  }

  calcMinCollatRatio(priceFloor) {
    return bnOver(this.ethPrice, this.liquidationRatio, priceFloor);
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
  }

  getSysVars() {
    return {
      ethPrice: this.ethPrice,
      pethPrice: this.pethPrice,
      liquidationRatio: this.liquidationRatio,
      liquidationPenalty: this.liquidationPenalty,
      stabilityFee: this.stabilityFee,
      wethToPethRatio: this.wethToPethRatio,
      currentAddress: this.currentAddress
    };
  }
  getSysServices() {
    return {
      priceService: this.priceService,
      cdpService: this.cdpService,
      proxyService: this.proxyService
    };
  }

  async locateCdps() {
    this.cdpsWithoutProxy = [];
    this.cdpsWithoutProxy = await this.locateCdpsWithoutProxy();
    this.cdps = [];
    this.cdps = await this.locateCdpsProxy();

    return { withProxy: this.cdps, withoutProxy: this.cdpsWithoutProxy };
  }

  async locateCdpsWithoutProxy() {
    const directCdps = await this.maker.getCdpIds(this.currentAddress);
    const directCdpsCheckSum = await this.maker.getCdpIds(
      toChecksumAddress(this.currentAddress)
    );

    return directCdps.concat(directCdpsCheckSum);
  }

  async locateCdpsProxy() {
    await this.getProxy();
    return await this.maker.getCdpIds(this._proxyAddress);
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

  async buildCdpObject(cdpId, options = {}) {
    const sysVars = {
      ethPrice: this.ethPrice,
      pethPrice: this.pethPrice,
      targetPrice: this.targetPrice,
      liquidationRatio: this.liquidationRatio,
      liquidationPenalty: this.liquidationPenalty,
      stabilityFee: this.stabilityFee,
      wethToPethRatio: this.wethToPethRatio,
      currentAddress: this.currentAddress,
      ...options
    };

    const services = {
      priceService: this.priceService,
      cdpService: this.cdpService,
      proxyService: this.proxyService
    };

    const makerCDP = new MakerCDP(cdpId, this.maker, services, sysVars);
    return await makerCDP.init(cdpId);
  }
}
