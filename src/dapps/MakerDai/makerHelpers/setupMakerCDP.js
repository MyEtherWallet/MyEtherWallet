import { locateCdps } from '@/dapps/MakerDai/cdpManager/makerHelpers/index';
import MakerCDP from '../MakerCDP';

export async function setupCdpManage(self, cdpId) {
  if (!self.allCdpIds.includes(cdpId) && self.allCdpIds.length > 0) {
    cdpId = self.allCdpIds[0];
  }
  if (self.allCdpIds.length === 0) {
    self.activeValues = self.systemValues;
  } else {
    self.currentCdpId = cdpId;
    self.activeValues = await getValuesForManage.bind(self)(cdpId);
  }
  return self;
}

export async function getValuesForManage(cdpId) {
  if (typeof cdpId !== 'number') cdpId = cdpId.id;
  const currentCdp = this.activeCdps[cdpId];
  this.currentCdp = currentCdp;
  const systemValues = this.systemValues;
  return {
    ...systemValues,
    cdpId: cdpId,
    maxEthDraw: currentCdp.maxEthDraw,
    maxUsdDraw: currentCdp.maxUsdDraw,
    ethCollateral: currentCdp.ethCollateral,
    usdCollateral: currentCdp.usdCollateral,
    debtValue: currentCdp.debtValue,
    maxDai: currentCdp.maxDai,
    collateralRatio: currentCdp.collatRatio,
    liquidationPrice: currentCdp.liquidationPrice,
    minEth: currentCdp.minEth,
    isSafe: false,
    governanceFeeOwed: currentCdp.governanceFeeOwed,
    ethCollateralNum: currentCdp.ethCollateralNum,
    // proxyAllowances: this.proxyAllowances,
    // mcdCurrencies: this.mcdCurrencies,
    zeroDebt: currentCdp.zeroDebt,
    cdpsWithType: this.cdpsWithType
  };
}

export async function loadCdpDetails(
  self,
  cdps = self.cdps,
  cdpsWithoutProxy = self.cdpsWithoutProxy
) {
  for (let i = 0; i < cdps.length; i++) {
    const cdpId = typeof cdps[i] !== 'number' ? cdps[i].id : cdps[i];
    self.activeCdps[cdpId] = await buildCdpObject.bind(self)(cdpId);
  }
  for (let i = 0; i < cdpsWithoutProxy.length; i++) {
    const cdpId =
      typeof cdpsWithoutProxy[i] !== 'number'
        ? cdpsWithoutProxy[i].id
        : cdpsWithoutProxy[i];
    self.activeCdps[cdpId] = await buildCdpObject.bind(self)(cdpId, {
      noProxy: true
    });
  }
}

export async function loadCdpDetail(self, cdpId) {
  return await buildCdpObject.bind(self)(cdpId);
}

export async function updateActiveCdp(self) {
  const currentCdpIds = Object.keys(self.activeCdps);
  await locateCdps(self, self._cdpService);

  const newCdps = self.cdps.filter(
    item => !Object.keys(self.activeCdps).includes(item.toString())
  );

  const newCdpsWithoutProxy = self.cdpsWithoutProxy.filter(
    item => !Object.keys(self.activeCdps).includes(item.toString())
  );

  const removedCdps = currentCdpIds.filter(
    item =>
      !(
        self.cdps.includes(item.toString()) ||
        self.cdpsWithoutProxy.includes(item.toString())
      )
  );

  if (removedCdps.length > 0) {
    removedCdps.forEach(item => delete self.activeCdps[item]);
  }

  if (newCdps.length > 0) {
    for (let i = 0; i < newCdps.length; i++) {
      this.activeCdps[newCdps[i]] = await buildCdpObject.bind(self)(newCdps[i]);
    }
  }

  if (newCdpsWithoutProxy.length > 0) {
    for (let i = 0; i < newCdpsWithoutProxy.length; i++) {
      this.activeCdps[newCdpsWithoutProxy[i]] = await buildCdpObject.bind(self)(
        newCdpsWithoutProxy[i],
        {
          noProxy: true
        }
      );
    }
  }

  // if (this.cdps.length === 0 && this.cdpsWithoutProxy.length === 0) {
  //   this.gotoCreate();
  // }
}

export async function buildEmpty(self) {
  return await buildCdpObject.bind(self)(null);
}

export async function buildCdpObject(cdpId, options = {}, useOld = false) {
  const sysVars = {
    ...options,
    tokens: this.tokens,
    balances: this.balances,
    _proxyAddress: this.proxyAddress,
    liquidationPenalty: this.liquidationPenalty,
    stabilityFee: this.stabilityFee,
    ethPrice: this.ethPrice,
    _targetPrice: this._targetPrice,
    liquidationRatio: this.liquidationRatio,
    proxyAllowances: this.proxyAllowances,
    _daiToken: this._daiToken,
    daiBalance: this.daiBalance,
    _mkrToken: this._mkrToken,
    mkrBalance: this.mkrBalance,
    minEth: this.minEth,
    cdpsWithType: this.cdpsWithType
  };

  // if (this.cdpsWithoutProxy.includes(cdpId)) {
  //   this.cdp = await this.getMakerCdp(cdpId, false);
  // } else if (this.cdps.includes(cdpId)) {
  //   this.cdp = await this.getMakerCdp(cdpId, this.proxyAddress);
  // } else {
  //   this.cdp = await this.getMakerCdp(cdpId, false);
  // }

  const services = {
    _typeService: this._typeService,
    _mcdManager: this._mcdManager,
    _proxyService: this._proxyService,
    priceService: this.priceService,
    _cdpService: this._cdpService,
    doUpdate: this.doUpdate,
    getProxy: this.getProxy,
    hasProxy: this.hasProxy,
    getMakerCdp: this.getMakerCdp,
    toUSD: this.toUSD,
    _proxyAddress: this.proxyAddress,
    liquidationPenalty: this.liquidationPenalty,
    stabilityFee: this.stabilityFee,
    ethPrice: this.ethPrice,
    _targetPrice: this._targetPrice,
    liquidationRatio: this.liquidationRatio,
    _daiToken: this._daiToken,
    daiBalance: this.daiBalance,
    _mkrToken: this._mkrToken,
    mkrBalance: this.mkrBalance,
    minEth: this.minEth,
    tokens: this.tokens,
    balances: this.balances,
    proxyAllowances: this.proxyAllowances,
    mcdCurrencies: this.mcdCurrencies
  };
  let makerCDP;
  try {
    makerCDP = new MakerCDP(cdpId, this.web3, services, sysVars);
    if (cdpId) {
      if (useOld) {
        return await makerCDP.init(cdpId, useOld);
      }
      return await makerCDP.init(cdpId);
    }
    return makerCDP;
  } catch (e) {
    console.log(e); // todo remove dev item
    return makerCDP;
  }
}
