import BigNumber from 'bignumber.js';
import { MDAI, MKR } from '@makerdao/dai-plugin-mcd';
import Maker from '@makerdao/dai';
import { locateCdps } from './locateCdps';
import MakerCDP from '../MakerCDP';
import { getDustValue } from '@/dapps/MakerDai/MakerCDP/chainCalls';
const { DAI } = Maker;
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
  self._priceService = maker.service(ServiceRoles.PRICE);
  self._cdpService = await maker.service(ServiceRoles.CDP);
  self._proxyService = await maker.service(ServiceRoles.PROXY);
  self._tokenService = await maker.service(ServiceRoles.TOKEN);
  self._mcdManager = maker.service(ServiceRoles.CDP_MANAGER);
  self._mcdSaving = maker.service(ServiceRoles.SAVINGS);
  self._typeService = maker.service(ServiceRoles.CDP_TYPE);
  return self;
}

export async function setupPriceAndRatios(self, _priceService, _cdpService) {
  self.pethMin = toBigNumber(0.005);

  self.ethPrice = toBigNumber((await _priceService.getEthPrice()).toNumber());

  self.pethPrice = toBigNumber((await _priceService.getPethPrice()).toNumber());

  self._targetPrice = toBigNumber(
    (await _priceService.getPethPrice()).toNumber()
  );

  self.liquidationRatio = toBigNumber(await _cdpService.getLiquidationRatio());
  self.liquidationPenalty = toBigNumber(
    await _cdpService.getLiquidationPenalty()
  );
  self.stabilityFee = toBigNumber(await _cdpService.getAnnualGovernanceFee());

  self.wethToPethRatio = toBigNumber(await _priceService.getWethToPethRatio());
  // self.par = await getParValue(self.web3)
  return self;
}

export async function getDetailsForTokens(self, collateralTokens) {
  self.balances = {};
  self.tokens = {};
  self.dustValues = {};
  self.daiToken = self._tokenService.getToken(DAI);
  self.daiBalance = (await self.daiToken.balance()).toBigNumber();
  self.mkrToken = self._tokenService.getToken(MKR);
  self.mkrBalance = (await self.mkrToken.balance()).toBigNumber();
  const MdaiToken = self.maker.getToken(MDAI);

  for (let i = 0; i < collateralTokens.length; i++) {
    const token = self._tokenService.getToken(collateralTokens[i].currency);
    self.tokens[collateralTokens[i].currency.symbol] = token;
    self.balances[collateralTokens[i].currency.symbol] = (
      await token.balance()
    ).toBigNumber();
    self.dustValues[collateralTokens[i].currency.symbol] = await getDustValue(
      self.web3,
      collateralTokens[i].ilk
    );
  }
  const token = self._tokenService.getToken(MDAI);
  self.tokens[MdaiToken.symbol] = token;
  self.balances[MdaiToken.symbol] = (await token.balance()).toBigNumber();

  self.tokens['MKR'] = self.mkrToken;
  self.tokens['DAI'] = self.daiToken;
  self.balances['DAI'] = self.daiBalance;
  self.balances['MKR'] = self.mkrBalance;
}

export async function checkAllowances(self, address, proxyAddress) {
  self.proxyAllowances = {};
  if (proxyAddress) {
    const keys = Object.keys(self.tokens);
    keys.push('MKR');
    keys.push('DAI');
    keys.push('MDAI');
    for (let i = 0; i < keys.length; i++) {
      try {
        if (
          typeof self.tokens[keys[i]] !== 'undefined' &&
          typeof self.tokens[keys[i]]._contract !== 'undefined' &&
          typeof self.tokens[keys[i]]._contract.allowance === 'function'
        ) {
          self.proxyAllowances[keys[i]] = toBigNumber(
            await self.tokens[keys[i]]._contract.allowance(
              address,
              proxyAddress
            ) // TODO likely not part of the public (stable) API
            // await self.tokens[keys[i]].allowance(address, proxyAddress) // TODO return to this to see if they fixed it
          );
        } else {
          self.proxyAllowances[keys[i]] = toBigNumber(0);
        }

        if (self.proxyAllowances[keys[i]].isNaN()) {
          self.proxyAllowances[keys[i]] = toBigNumber(0);
        }
      } catch (e) {
        console.error(e);
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
  // console.log(cdpId); // todo remove dev item
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
    cdpsWithType: this.cdpsWithType
  };
}

// todo: this is where things are getting erased (because new instances are being created)
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
  // console.log(
  //   'withType, withProxy, withoutProxy',
  //   withType,
  //   withProxy,
  //   withoutProxy
  // ); // todo remove dev item
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
}

export async function buildEmpty(self) {
  const result = await buildCdpObject.bind(self)(null);
  // console.log(result); // todo remove dev item
  return result;
  // return await buildCdpObject.bind(self)(null);
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

  const services = {
    address: this.account.address,
    _typeService: this._typeService,
    _mcdManager: this._mcdManager,
    _mcdSaving: this._mcdSaving,
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
    mcdCurrencies: this.mcdCurrencies,
    dustValues: this.dustValues
    // par: this.par
  };
  let makerCDP;
  try {
    // console.log(cdpId); // todo remove dev item
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
    console.log(e); // todo remove dev item
    return makerCDP;
  }
}

export async function doUpdate(self, Toast) {
  self.proxyAddress = await self.getProxy();
  let afterClose = false;
  const afterOpen = self.$route.name === 'create';
  await self.updateActiveCdp();
  for (const idProp in self.activeCdps) {
    // console.log('self.activeCdps[idProp] 1', self.activeCdps[idProp]); // todo remove dev item
    if (self.activeCdps[idProp].needsUpdate) {
      // console.log('self.activeCdps[idProp] 2', self.activeCdps[idProp]); // todo remove dev item

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
      }
    }
    if (idProp === self.currentCdpId) {
      await self.currentCdp.update();
      await self.setupCdpManage(self.currentCdpId);
    }
  }

  await self.checkBalances();
  await self.checkAllowances();

  if (!Object.keys(self.activeCdps).includes(self.currentCdpId)) {
    await self.loadCdpDetails();
    await self.setupCdpManageFunc(self.currentCdpId);
  } else {
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
    } else {
      self.gotoCreate();
    }
  }
  if (self.creatingCdp) {
    self.creatingCdp = false;
    await self.updateActiveCdp();
    Toast.responseHandler('CDP Created', Toast.INFO);
  } else {
    self.valuesUpdated++;
    Toast.responseHandler('CDP Updated', Toast.INFO);
  }
}
