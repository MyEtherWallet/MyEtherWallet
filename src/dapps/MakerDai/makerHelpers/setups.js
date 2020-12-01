import BigNumber from 'bignumber.js';
import { DAI } from '@makerdao/dai-plugin-mcd';
import { locateCdps } from './locateCdps';
import MakerCDP from '../MakerCDP';
import { getDustValue } from '@/dapps/MakerDai/MakerCDP/chainCalls';
const toBigNumber = num => {
  return new BigNumber(num);
};

const ServiceRoles = {
  PRICE: 'price',
  CDP: 'cdp',
  PROXY: 'proxy',
  TOKEN: 'token',
  CDP_MANAGER: 'mcd:cdpManager',
  CDP_TYPE: 'mcd:cdpType',
  AUCTION: 'mcd:auction',
  SYSTEM_DATA: 'mcd:systemData',
  QUERY_API: 'mcd:queryApi',
  SAVINGS: 'mcd:savings'
};

export async function setupServices(self, maker) {
  const result = await Promise.all([
    maker.service(ServiceRoles.SYSTEM_DATA),
    maker.service(ServiceRoles.PROXY),
    maker.service(ServiceRoles.TOKEN)
  ]);
  self._systemData = result[0];
  self._proxyService = result[1];
  self._tokenService = result[2];
  self._mcdManager = maker.service(ServiceRoles.CDP_MANAGER);
  self._mcdSaving = maker.service(ServiceRoles.SAVINGS);
  self._typeService = maker.service(ServiceRoles.CDP_TYPE);
  return self;
}

export async function setupPriceAndRatios(self, _priceService, _typeService) {
  self.pethMin = toBigNumber(0.005);

  const result = await Promise.all([self._systemData.getAnnualBaseRate()]);
  self.ethPrice = toBigNumber(_typeService.getCdpType(null, 'ETH-A'));
  self.liquidationRatio = toBigNumber(
    _typeService.getCdpType(null, 'ETH-A').liquidationRatio
  );
  self.liquidationPenalty = toBigNumber(_typeService.liquidationPenalty);
  self.stabilityFee = toBigNumber(
    _typeService.getCdpType(null, 'ETH-A').annualStabilityFee
  ).plus(result[0]);
  self.baseStabilityFee = toBigNumber(result[0]);
  return self;
}

export async function getDetailsForTokens(self, collateralTokens) {
  self.balances = {};
  self.tokens = {};

  for (let i = 0; i < collateralTokens.length; i++) {
    const token = self._tokenService.getToken(collateralTokens[i].currency);
    self.tokens[collateralTokens[i].currency.symbol] = token;
    token.balance().then(res => {
      self.balances[collateralTokens[i].currency.symbol] = res.toBigNumber();
    });
  }
  const token = self._tokenService.getToken(DAI);
  self.tokens[token.symbol] = token;
  self.balances[token.symbol] = (await token.balance()).toBigNumber();

  await getDustValues(self, collateralTokens);
}

export async function getDustValues(self, collateralTokens) {
  self.dustValues = {};
  for (let i = 0; i < collateralTokens.length; i++) {
    getDustValue(self.web3, collateralTokens[i].ilk).then(res => {
      self.dustValues[collateralTokens[i].currency.symbol] = res;
    });
  }
}

export async function checkAllowances(self, address, proxyAddress) {
  self.proxyAllowances = {};
  if (proxyAddress) {
    const keys = Object.keys(self.tokens);
    keys.push('MKR');
    keys.push('DAI');
    for (let i = 0; i < keys.length; i++) {
      try {
        if (
          typeof self.tokens[keys[i]] !== 'undefined' &&
          typeof self.tokens[keys[i]]._contract !== 'undefined' &&
          typeof self.tokens[keys[i]]._contract.allowance === 'function'
        ) {
          self.tokens[keys[i]]._contract
            .allowance(address, proxyAddress)
            .then(res => {
              self.proxyAllowances[keys[i]] = toBigNumber(res);
            });
        } else {
          self.proxyAllowances[keys[i]] = toBigNumber(0);
        }

        if (self.proxyAllowances[keys[i]].isNaN()) {
          self.proxyAllowances[keys[i]] = toBigNumber(0);
        }
      } catch (e) {
        self.proxyAllowances[keys[i]] = toBigNumber(0);
      }
    }
  }
  return self.proxyAllowances;
}

export async function checkAllowanceFor(
  proxyAllowances,
  tokens,
  address,
  proxyAddress,
  currency
) {
  if (proxyAddress) {
    proxyAllowances[currency] = toBigNumber(
      await tokens[currency].allowance(address, proxyAddress)
    );
  }
  return proxyAllowances;
}

export function collateralOptions(mcdCurrencies) {
  return Object.keys(mcdCurrencies).reduce((acc, entry) => {
    acc.push({
      symbol: entry,
      name: mcdCurrencies[entry].ilk
    });
    return acc;
  }, []);
}

// setup MakerCDP

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
    ethCollateralNum: currentCdp.ethCollateral,
    zeroDebt: currentCdp.zeroDebt,
    cdpsWithType: this.cdpsWithType,
    // _systemData: this._systemData,
    baseStabilityFee: this.baseStabilityFee
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
  const removeObject = val => {
    return typeof val === 'number'
      ? val
      : typeof val === 'object'
      ? val.hasOwnProperty('id')
        ? val.id
        : 0
      : val;
  };
  const currentCdpIds = Object.keys(self.activeCdps);
  const { withType, withProxy, withoutProxy } = await locateCdps(
    self,
    self._mcdManager
  );

  self.cdpsWithType = withType;
  self.cdps = withProxy.map(removeObject);
  self.cdpsWithoutProxy = withoutProxy;

  const newCdps = self.cdps.filter(item => {
    return !currentCdpIds.includes(item.toString());
  });
  const newCdpsWithoutProxy = self.cdpsWithoutProxy.filter(
    item => !Object.keys(self.activeCdps).includes(item)
  );

  const removedCdps = currentCdpIds.filter(item => {
    return !(
      self.cdps.includes(item.toString()) ||
      self.cdps.includes(parseInt(item)) ||
      self.cdpsWithoutProxy.includes(item.toString()) ||
      self.cdpsWithoutProxy.includes(parseInt(item))
    );
  });

  if (removedCdps.length > 0) {
    removedCdps.forEach(item => delete self.activeCdps[item]);
  }

  if (newCdps.length > 0) {
    for (let i = 0; i < newCdps.length; i++) {
      self.activeCdps[newCdps[i]] = await buildCdpObject.bind(self)(newCdps[i]);
    }
  }

  if (newCdpsWithoutProxy.length > 0) {
    for (let i = 0; i < newCdpsWithoutProxy.length; i++) {
      self.activeCdps[newCdpsWithoutProxy[i]] = await buildCdpObject.bind(self)(
        newCdpsWithoutProxy[i],
        {
          noProxy: true
        }
      );
    }
  }
}

export async function buildEmpty(self) {
  const result = await buildCdpObject.bind(self)(null);
  return result;
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
    cdpsWithType: this.cdpsWithType,
    baseStabilityFee: this.baseStabilityFee
  };

  const services = {
    address: this.account.address,
    _typeService: this._typeService,
    _mcdManager: this._mcdManager,
    _mcdSaving: this._mcdSaving,
    _proxyService: this._proxyService,
    priceService: this.priceService,
    _cdpService: this._cdpService,
    _tokenService: this._tokenService,
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
    mcdCurrencies: this.mcdCurrencies,
    dustValues: this.dustValues,
    _systemData: this._systemData
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
    // eslint-disable-next-line
    console.log(e);
    return makerCDP;
  }
}

export async function doUpdate(self, Toast) {
  self.proxyAddress = await self.getProxy();
  let afterClose = false;
  const afterOpen = self.$route.name === 'create';
  await Promise.all([
    self.updateActiveCdp(),
    self.checkBalances(),
    self.checkAllowances()
  ]);
  for (const idProp in self.activeCdps) {
    if (self.activeCdps[idProp].needsUpdate) {
      if (self.activeCdps[idProp].closing) {
        afterClose = true;
        delete self.activeCdps[idProp];
        self.cdps = self.cdps.filter(item => item !== idProp);
        self.cdpsWithoutProxy = self.cdpsWithoutProxy.filter(
          item => item !== idProp
        );
      } else if (self.activeCdps[idProp].opening) {
        await self.activeCdps[idProp].updateValues();
      } else {
        self.activeCdps[idProp] = await self.activeCdps[idProp].update();
        self.activeCdps[idProp].updateSystemVariables({
          tokens: self.tokens,
          balances: self.balances,
          proxyAllowances: self.proxyAllowances,
          dustValues: self.dustValues
        });
      }
    }
    if (idProp === self.currentCdpId) {
      await self.currentCdp.update();
      await self.setupCdpManage(self.currentCdpId);
    }
  }

  if (
    Object.keys(self.activeCdps).includes(self.currentCdpId.toString()) ||
    Object.keys(self.activeCdps).includes(self.currentCdpId)
  ) {
    await self.setupCdpManageFunc(self.currentCdpId);
  } else {
    await self.loadCdpDetails(); //todo: see if disableing this breaks anything (likely would happen with creation)
    // todo: thie line above is where things were getting erased (new instances are being created)
    await self.setupCdpManageFunc(self.currentCdpId);
  }

  const runAfterUpdate = () => {
    if (self.afterUpdate.length > 0) {
      const fn = self.afterUpdate.pop();
      fn();
      runAfterUpdate();
    }
  };
  runAfterUpdate();
  if (afterClose || afterOpen || self.creatingCdp) {
    if (self.cdps.length > 0 || self.cdpsWithoutProxy.length > 0) {
      self.goToManage();
    } else if (self.$route.name === 'save') {
      self.goToSave();
    } else {
      self.gotoCreate();
    }
  }
  if (self.creatingCdp) {
    self.creatingCdp = false;
    await self.updateActiveCdp();
    Toast.responseHandler(self.$t('dappsMCDMaker.vault-created'), Toast.INFO);
  } else {
    self.valuesUpdated++;
    Toast.responseHandler(self.$t('dappsMCDMaker.vault-updated'), Toast.INFO);
  }
}
