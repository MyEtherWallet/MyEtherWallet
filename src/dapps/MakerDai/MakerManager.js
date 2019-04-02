import BigNumber from 'bignumber.js';
import Maker from '@makerdao/dai';
import { toChecksumAddress } from '@/helpers/addressUtils';
import MakerCDP from './MakerCDP';
import MewPlugin from './dai-plugin-mew';

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
    this.currentAddress = props.account.address;
    this.maker = props.maker;
    this.activeCdps = {};
  }

  get availableCdps() {
    return this.activeCdps;
  }

  getCdp(cdpId) {
    return this.activeCdps[cdpId];
  }

  async init() {
    // const MewMakerPlugin = MewPlugin(
    //   this.web3,
    //   this.account.address,
    //   async () => {
    //     // eslint-disable-next-line
    //     console.log('do update'); // todo remove dev item
    //     await this.doUpdate();
    //   }
    // );
    // this.maker = await Maker.create('http', {
    //   url: this.network.url,
    //   provider: {
    //     type: 'HTTP', // or 'TEST'
    //     network: 'kovan'
    //   },
    //   plugins: [MewMakerPlugin],
    //   accounts: {
    //     myLedger1: { type: 'mew' }
    //   },
    //   log: true
    // });
    await this.maker.authenticate();
    this.priceService = this.maker.service('price');
    this.cdpService = await this.maker.service('cdp');
    this.proxyService = await this.maker.service('proxy');

    this.ethPrice = toBigNumber(
      (await this.priceService.getEthPrice()).toNumber()
    );
    // this.ethPrice = toBigNumber(132.93);

    this.pethPrice = toBigNumber(
      (await this.priceService.getPethPrice()).toNumber()
    );

    this.targetPrice = toBigNumber(
      (await this.cdpService.getTargetPrice()).toNumber()
    );

    this.liquidationRatio = toBigNumber(
      await this.cdpService.getLiquidationRatio()
    );
    this.liquidationPenalty = toBigNumber(
      await this.cdpService.getLiquidationPenalty()
    );
    this.stabilityFee = toBigNumber(
      await this.cdpService.getAnnualGovernanceFee()
    );

    this.wethToPethRatio = toBigNumber(
      await this.priceService.getWethToPethRatio()
    );

    this.currentProxy = await this.proxyService.currentProxy();
    console.log(this.currentProxy); // todo remove dev item

    const { withProxy, withoutProxy } = await this.locateCdps();
    this.cdps = withProxy;
    this.cdpsWithoutProxy = withoutProxy;

    if (this.cdps.length > 0 || this.cdpsWithoutProxy.length > 0) {
      await this.loadCdpDetails();
    }
  }

  async locateCdpsWithoutProxy() {
    const directCdps = await this.maker.getCdpIds(
      this.currentAddress //proxy
    );
    const directCdpsCheckSum = await this.maker.getCdpIds(
      toChecksumAddress(this.currentAddress)
    );

    return directCdps.concat(directCdpsCheckSum);
  }

  async locateCdpsProxy() {
    const proxy = await this.maker
      .service('proxy')
      .getProxyAddress(this.currentAddress);

    return await this.maker.getCdpIds(proxy);
  }

  async locateCdps() {
    const directCdps = await this.locateCdpsWithoutProxy();
    console.log(directCdps); // todo remove dev item

    const cdps = await this.locateCdpsProxy();

    return { withProxy: cdps, withoutProxy: directCdps };
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

  async refresh() {
    console.log('refresh'); // todo remove dev item
    const { withProxy, withoutProxy } = await this.locateCdps();
    this.cdps = withProxy;
    this.cdpsWithoutProxy = withoutProxy;

    const newCdps = this.cdps.filter(
      item => !Object.keys(this.activeCdps).includes(item)
    );

    const newCdpsWithoutProxy = this.cdpsWithoutProxy.filter(
      item => !Object.keys(this.activeCdps).includes(item)
    );

    for (let i = 0; i < newCdps.length; i++) {
      this.activeCdps[newCdps[i]] = await this.buildCdpObject(newCdps[i]);
    }

    for (let i = 0; i < newCdpsWithoutProxy.length; i++) {
      this.activeCdps[newCdpsWithoutProxy[i]] = await this.buildCdpObject(
        newCdpsWithoutProxy[i],
        { noProxy: true }
      );
    }

    if (withProxy.length > 0 || withoutProxy.length > 0) {
      await this.doUpdate();
      this.goToManage();
    } else {
      this.activeCdps = {};
      this.gotoCreate();
    }
  }
  async doUpdate(withRefresh = false) {
    this.proxyAddress = await this.proxyService.currentProxy();
    console.log('updating'); // todo remove dev item
    let afterClose = false;
    // this.migrationInProgress = false;
    for (let idProp in this.activeCdps) {
      if (this.activeCdps[idProp].needsUpdate) {
        if (this.activeCdps[idProp].closing) {
          afterClose = true;
          delete this.activeCdps[idProp];
          this.cdps = this.cdps.filter(item => item !== idProp);
        } else {
          console.log('UPDATE CDP', idProp); // todo remove dev item
          this.activeCdps[idProp] = await this.activeCdps[idProp].update();
        }
      }
    }

    if (afterClose) {
      console.log('after close or move'); // todo remove dev item
      const { withProxy, withoutProxy } = await this.locateCdps();
      this.cdps = withProxy;
      this.cdpsWithoutProxy = withoutProxy;
      // this.goToManage();
    }
  }
}
