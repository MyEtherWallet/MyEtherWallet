import { EventEmitter } from 'events';
import BigNumber from 'bignumber.js';
import Maker from '@makerdao/dai';
import McdPlugin, {
  ETH,
  REP,
  ZRX,
  OMG,
  BAT,
  GNT,
  DGD,
  MDAI,
  MKR
} from '@makerdao/dai-plugin-mcd';
import configPlugin from '@makerdao/dai-plugin-config';
import MakerCDP from './MakerCDP';
import {
  locateCdps,
  setupPriceAndRatios,
  setupServices,
  getDetailsForTokens,
  setupCdpManage,
  updateActiveCdp
} from './makerHelpers';

import MewPlugin from 'mew-maker-plugin';
import { GetCdps, ProxyRegistry } from './makerHelpers';
import addresses from './makerHelpers/addresses';

const { DAI } = Maker;

const toBigNumber = num => {
  return new BigNumber(num);
};

const bnOver = (one, two, three) => {
  return toBigNumber(one)
    .times(toBigNumber(two))
    .div(toBigNumber(three));
};

export default class ManagerCopy extends EventEmitter {
  constructor(web3, maker) {
    super();
    this.varStore = {};
    this.maker = maker;
    this.web3 = web3;
  }

  async setupMCD() {
    try {
      const setupService = async service => {
        const val = await this.maker.service(service);
        console.log(val); // todo remove dev item
        return val;
      };
      await this.maker.service('proxy').ensureProxy();
      this._typeService = this.maker.service(ServiceRoles.CDP_TYPE);
      console.log(this._typeService); // todo remove dev item
      console.log(this._typeService.cdpTypes[0]); // todo remove dev item

      const defaultCdpTypes = [
        { currency: ETH, ilk: 'ETH-A' },
        { currency: ETH, ilk: 'ETH-B' },
        { currency: REP, ilk: 'REP-A' },
        // { currency: REP, ilk: 'REP-B' },
        { currency: ZRX, ilk: 'ZRX-A' },
        { currency: OMG, ilk: 'OMG-A' },
        { currency: BAT, ilk: 'BAT-A' },
        { currency: DGD, ilk: 'DGD-A', decimals: 9 },
        { currency: GNT, ilk: 'GNT-A' }
      ];
      this.mcdCurrencies = this._typeService.cdpTypes.reduce((acc, entry) => {
        // acc[entry.ilk] = entry;
        acc[entry.currency.symbol] = entry;
        acc[entry.currency.symbol].symbol = entry.currency.symbol;
        return acc;
      }, {});

      console.log(this.mcdCurrencies); // todo remove dev item
      // setupService('mcd:queryApi');
      // setupService('mcd:savings');
      // setupService('mcd:auction');
    } catch (e) {
      console.error(e);
    }
  }

  getType(baseCurrency, ilk) {
    return this._typeService.cdpTypes.find(
      entry => entry.currency.symbol === baseCurrency && entry.ilk === ilk
    );
  }

  addToVarStore(value) {
    this.varStore = { value, ...this.varStore };
  }

  async setup() {
    this.activeCdps = {};
    this.currentCdp = {};

    // this.gotoLoading();
    if (!this.showLoading) {
      this.emit('goto-home');
    } else {
      this.emit('goto-loading');
    }

    await this.maker.service('proxy').ensureProxy();

    this.setupMCD();
    // -------------------------------------------------
    try {
      await this.maker.authenticate();
      await setupServices(this, this.maker);

      await setupPriceAndRatios(this, this._priceService, this._cdpService);

      this.proxyAddress = await this._proxyService.currentProxy();

      await getDetailsForTokens(this, this._typeService.cdpTypes);
      console.log(this.tokens); // todo remove dev item
      console.log(this.balances); // todo remove dev item

      // TODO update usages to use the balances and tokens objects
      // this.daiToken = this.tokens['DAI'];
      // this.daiBalance = this.balances['DAI'];
      // this.mkrToken = this.tokens['MKR'];
      // this.mkrBalance = this.balances['MKR'];

      // const minEth = toBigNumber(this.pethMin).times(this.wethToPethRatio);
      // this.systemValues = {
      //   stabilityFee: this.stabilityFee,
      //   minEth: minEth,
      //   liquidationRatio: this.liquidationRatio,
      //   wethToPethRatio: this.wethToPethRatio,
      //   liquidationPenalty: this.liquidationPenalty,
      //   targetPrice: this._targetPrice,
      //   pethPrice: this.pethPrice
      // };

      this.addToVarStore({
        tokens: this.tokens,
        balances: this.balances,
        stabilityFee: this.stabilityFee,
        liquidationRatio: this.liquidationRatio,
        wethToPethRatio: this.wethToPethRatio,
        liquidationPenalty: this.liquidationPenalty,
        targetPrice: this._targetPrice,
        pethPrice: this.pethPrice
      });

      const proxyReg = new this.web3.eth.Contract(
        ProxyRegistry,
        addresses.PROXY_REGISTRY
      );

      let proxy = await proxyReg.methods.proxies(this.account.address).call();
      if (proxy === '0x0000000000000000000000000000000000000000') {
        proxy = null;
      }
      console.log('proxy', proxy); // todo remove dev item

      // const contract = new this.web3.eth.Contract(
      //   GetCdps,
      //   addresses.GET_CDPS
      // );
      //
      // const results = await contract.methods
      //   .getCdpsAsc(addresses.PROXY_REGISTRY, proxy)
      //   .call();
      // console.log('results', results); // todo remove dev item
      this.checkAllowances();

      const { withProxy, withoutProxy } = await locateCdps(
        this,
        this._cdpService
      );

      this.cdps = withProxy;
      this.cdpsWithoutProxy = withoutProxy;

      this.currentProxy = await this.getProxy();

      if (this.cdps.length > 0 || this.cdpsWithoutProxy.length > 0) {
        await this.loadCdpDetails(this.cdps, this.cdpsWithoutProxy);
      }
    } catch (e) {
      console.error(e);
    }
    if (this.showLoading) {
      if (this.cdps.length > 0 || this.cdpsWithoutProxy.length > 0) {
        this.cdpDetailsLoaded = true;
        this.makerActive = true;
        if (
          this.$route.name !== 'create' &&
          this.$route.path.includes('maker-dai')
        ) {
          this.emit('goto-manage');
          this.goToManage();
        }
      } else {
        this.emit('goto-create');
        this.gotoCreate();
      }
    }
  }

  async buildEmpty() {
    return await this.buildCdpObject(null);
  }

  addCdp() {
    this.creatingCdp = true;
  }

  removeCdp(vals) {
    try {
      delete this.availableCdps[vals.id];
      this.emit('cdp-closed');
    } catch (e) {
      // eslint-disable-next-line
      console.error(e);
    }
  }

  async migrateCdpExternal(cdpId) {
    this.afterUpdate.push(this.goToManage);
    await this.migrateCdp(cdpId);
  }

  async refreshExternal() {
    await this.doUpdate();
  }

  async refresh() {
    await this.doUpdate();
  }

  async doUpdate(route) {
    this.proxyAddress = await this.getProxy();
    let afterClose = false;
    const afterOpen = route ? route.name === 'create' : false;
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
      if (idProp === this.currentCdpId) {
        await this.currentCdp.update();
        await this.setupCdpManage(this.currentCdpId);
      }
    }

    await getDetailsForTokens(this, this._typeService.cdpTypes);
    this.daiBalance = this.balances['DAI'];
    this.mkrBalance = this.balances['MKR'];
    await this.checkProxyAllowances();

    if (!Object.keys(this.activeCdps).includes(this.currentCdpId)) {
      await this.loadCdpDetails();
      await this.setupCdpManage(this.currentCdpId);
    } else {
      await this.setupCdpManage(this.currentCdpId);
    }

    const runAfterUpdate = () => {
      if (this.afterUpdate.length > 0) {
        const fn = this.afterUpdate.pop();
        fn();
        runAfterUpdate();
      }
    };
    runAfterUpdate();
    // if (afterClose || afterOpen || this.creatingCdp) {
    //   if (this.cdps.length > 0 || this.cdpsWithoutProxy.length > 0) {
    //     this.goToManage();
    //   } else {
    //     this.gotoCreate();
    //   }
    // }
    if (this.creatingCdp) {
      this.creatingCdp = false;
      await this.updateActiveCdp();
      this.emit('cdp-created');
    } else {
      // this.valuesUpdated++;
      this.emit('cdp-updated');
    }
    return afterClose || afterOpen || this.creatingCdp;
  }

  async checkProxyAllowances() {
    if (this.proxyAddress) {
      this._proxyAllowanceDai = (await this.daiToken.allowance(
        this.account.address,
        this.proxyAddress
      )).toBigNumber();

      this._proxyAllowanceMkr = (await this.mkrToken.allowance(
        this.account.address,
        this.proxyAddress
      )).toBigNumber();
    }
  }

  async setupCdpManage(cdpId) {
    if (!this.allCdpIds.includes(cdpId) && this.allCdpIds.length > 0) {
      cdpId = this.allCdpIds[0];
    }
    if (this.allCdpIds.length === 0) {
      this.activeValues = this.systemValues;
    } else {
      this.currentCdpId = cdpId;
      this.activeValues = await this.getValuesForManage(cdpId);
    }
  }

  async getValuesForManage(cdpId) {
    console.log(this.activeCdps); // todo remove dev item
    const currentCdp = this.activeCdps[cdpId];
    this.currentCdp = currentCdp;
    const _proxyAllowanceDai = this._proxyAllowanceDai;
    const _proxyAllowanceMkr = this._proxyAllowanceMkr;
    const toPeth = this.toPeth;
    const systemValues = this.systemValues;
    return {
      ...systemValues,
      cdpId: cdpId,
      maxPethDraw: currentCdp.maxPethDraw,
      maxEthDraw: currentCdp.maxEthDraw,
      maxUsdDraw: currentCdp.maxUsdDraw,
      ethCollateral: currentCdp.ethCollateral,
      pethCollateral: currentCdp.pethCollateral,
      usdCollateral: currentCdp.usdCollateral,
      debtValue: currentCdp.debtValue,
      maxDai: currentCdp.maxDai,
      collateralRatio: currentCdp.collatRatio,
      liquidationPrice: currentCdp.liquidationPrice,
      minEth: currentCdp.minEth,
      isSafe: false,
      governanceFeeOwed: currentCdp.governanceFeeOwed,
      ethCollateralNum: currentCdp.ethCollateralNum,
      toPeth: toPeth,
      proxyAllowanceDai: _proxyAllowanceDai,
      proxyAllowanceMkr: _proxyAllowanceMkr,
      zeroDebt: currentCdp.zeroDebt
    };
  }

  async updateActiveCdp() {
    const currentCdpIds = Object.keys(this.activeCdps);
    await locateCdps(this, this._cdpService);

    const newCdps = this.cdps.filter(
      item => !Object.keys(this.activeCdps).includes(item.toString())
    );

    const newCdpsWithoutProxy = this.cdpsWithoutProxy.filter(
      item => !Object.keys(this.activeCdps).includes(item.toString())
    );

    const removedCdps = currentCdpIds.filter(
      item =>
        !(
          this.cdps.includes(item.toString()) ||
          this.cdpsWithoutProxy.includes(item.toString())
        )
    );

    if (removedCdps.length > 0) {
      removedCdps.forEach(item => delete this.activeCdps[item]);
    }

    if (newCdps.length > 0) {
      for (let i = 0; i < newCdps.length; i++) {
        this.activeCdps[newCdps[i]] = await this.buildCdpObject(newCdps[i]);
      }
    }

    if (newCdpsWithoutProxy.length > 0) {
      for (let i = 0; i < newCdpsWithoutProxy.length; i++) {
        this.activeCdps[newCdpsWithoutProxy[i]] = await this.buildCdpObject(
          newCdpsWithoutProxy[i],
          {
            noProxy: true
          }
        );
      }
    }

    if (this.cdps.length === 0 && this.cdpsWithoutProxy.length === 0) {
      this.gotoCreate();
    }
  }

  async loadCdpDetails(
    cdps = this.cdps,
    cdpsWithoutProxy = this.cdpsWithoutProxy
  ) {
    for (let i = 0; i < cdps.length; i++) {
      this.activeCdps[cdps[i]] = await this.buildCdpObject(cdps[i]);
    }
    for (let i = 0; i < cdpsWithoutProxy.length; i++) {
      this.activeCdps[cdpsWithoutProxy[i]] = await this.buildCdpObject(
        cdpsWithoutProxy[i],
        {
          noProxy: true
        }
      );
    }
    console.log(this.activeCdps); // todo remove dev item
  }

  async buildCdpObject(cdpId, options = {}) {
    const sysVars = {
      ...options,
      tokens: this.tokens,
      balances: this.balances,
      _proxyAddress: this.proxyAddress,
      liquidationPenalty: this.liquidationPenalty,
      stabilityFee: this.stabilityFee,
      ethPrice: this.ethPrice,
      _pethPrice: this.pethPrice,
      wethToPethRatio: this.wethToPethRatio,
      _targetPrice: this._targetPrice,
      liquidationRatio: this.liquidationRatio,
      proxyAllowanceDai: this.proxyAllowanceDai,
      proxyAllowanceMkr: this.proxyAllowanceMkr,
      _daiToken: this._daiToken,
      daiBalance: this.daiBalance,
      _mkrToken: this._mkrToken,
      mkrBalance: this.mkrBalance,
      minEth: this.minEth,
      pethMin: this.pethMin
    };

    // if (this.cdpsWithoutProxy.includes(cdpId)) {
    //   this.cdp = await this.getMakerCdp(cdpId, false);
    // } else if (this.cdps.includes(cdpId)) {
    //   this.cdp = await this.getMakerCdp(cdpId, this.proxyAddress);
    // } else {
    //   this.cdp = await this.getMakerCdp(cdpId, false);
    // }

    const services = {
      _mcdManager: this._mcdManager,
      _proxyService: this._proxyService,
      priceService: this.priceService,
      _cdpService: this._cdpService,
      doUpdate: this.doUpdate,
      getProxy: this.getProxy,
      hasProxy: this.hasProxy,
      getCdp: this.getMakerCdp,
      toPeth: this.toPeth,
      toUSD: this.toUSD,
      _proxyAddress: this.proxyAddress,
      liquidationPenalty: this.liquidationPenalty,
      stabilityFee: this.stabilityFee,
      ethPrice: this.ethPrice,
      _pethPrice: this.pethPrice,
      wethToPethRatio: this.wethToPethRatio,
      _targetPrice: this._targetPrice,
      liquidationRatio: this.liquidationRatio,
      proxyAllowanceDai: this.proxyAllowanceDai,
      proxyAllowanceMkr: this.proxyAllowanceMkr,
      _daiToken: this._daiToken,
      daiBalance: this.daiBalance,
      _mkrToken: this._mkrToken,
      mkrBalance: this.mkrBalance,
      minEth: this.minEth,
      pethMin: this.pethMin
    };

    const makerCDP = new MakerCDP(cdpId, this.web3, services, sysVars);
    console.log(makerCDP); // todo remove dev item
    if (cdpId) {
      return await makerCDP.init(cdpId);
    }
    return makerCDP;
  }

  async getProxy() {
    this.proxyAddress = await this._proxyService.currentProxy();
    if (!this.proxyAddress) {
      this.proxyAddress = await this._proxyService.getProxyAddress(
        this.account.address
      );
      if (this.proxyAddress) this.noProxy = false;
    }
    return this.proxyAddress;
  }

  async approveDai() {
    await this._tokenService.getToken(DAI).approveUnlimited(this.proxyAddress);
  }

  async approveMkr() {
    this._tokenService.getToken(MKR).approveUnlimited(this.proxyAddress);
  }

  hasCdp(cdpId) {
    return Object.keys(this.activeCdps).includes(toBigNumber(cdpId).toString());
  }

  getCdp(cdpId) {
    return this.activeCdps[cdpId];
  }

  async getMakerCdp(cdpId) {
    if (cdpId === null) return;
    if (this.cdpsWithoutProxy.includes(cdpId)) {
      return await this.maker.getCdp(cdpId, false);
    } else if (this.cdps.includes(cdpId) && this.proxyAddress) {
      return await this.maker.getCdp(cdpId, this.proxyAddress);
    } else if (this.proxyAddress) {
      return await this.maker.getCdp(cdpId, this.proxyAddress);
    }
    return await this.maker.getCdp(cdpId, false);
  }

  async buildProxy() {
    this.proxyAddress = await this.getProxy();
    if (!this.proxyAddress) {
      await this._proxyService.build();
      this.proxyAddress = await this._proxyService.currentProxy();
      return this.proxyAddress;
    }
    this.proxyAddress = await this._proxyService.currentProxy();
    return this.proxyAddress;
  }

  async migrateCdp(cdpId) {
    const currentProxy = await this.getProxy();
    if (currentProxy) {
      await this._cdpService.give(cdpId, currentProxy);
    }
  }

  // CURRENT CDP

  lockEth(val) {
    this.currentCdp.lockEth(val);
  }

  wipeDai(val) {
    this.currentCdp.wipeDai(val);
  }

  freeEth(val) {
    if (val[1] === null) {
      this.currentCdp.freeEth(val[0]);
    } else {
      this.currentCdp.freeEth(val[0], val[1]);
    }
  }

  drawDai(val) {
    if (val[1] === null) {
      this.currentCdp.drawDai(val[0]);
    } else {
      this.currentCdp.drawDai(val[0], val[1]);
    }
  }

  closeCdp() {
    this.currentCdp.closeCdp();
  }

  checkIfDestAddressHasProxy(val) {
    this.currentCdp
      .checkIfDestAddressHasProxy(val)
      .then(result => {
        this.destAddressProxy = result;
        this.destAddressHasProxy = result !== null;
      })
      .catch(err => {
        throw err;
      });
  }

  moveCdp(val) {
    this.currentCdp.moveCdp(val);
  }

  calcCollatRatioDaiChg(daiQty) {
    return toBigNumber(
      this.currentCdp.calcCollatRatio(this.currentCdp.ethCollateral, daiQty)
    );
  }

  calcCollatRatioEthChg(ethQty) {
    return toBigNumber(
      this.currentCdp.calcCollatRatio(ethQty, this.currentCdp.debtValue)
    );
  }

  calcLiquidationPriceDaiChg(daiQty) {
    return toBigNumber(
      this.currentCdp.calcLiquidationPrice(
        this.currentCdp.ethCollateral,
        daiQty
      )
    );
  }

  calcLiquidationPriceEthChg(ethQty) {
    return toBigNumber(
      this.currentCdp.calcLiquidationPrice(ethQty, this.currentCdp.debtValue)
    );
  }
}
