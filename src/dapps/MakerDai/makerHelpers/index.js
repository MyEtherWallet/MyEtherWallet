import { locateCdps, locateOldCdps } from './locateCdps';
import addresses from './addressesMAIN';

import {
  setupPriceAndRatios,
  setupServices,
  getDetailsForTokens,
  checkAllowances,
  checkAllowanceFor,
  collateralOptions,
  setupCdpManage,
  updateActiveCdp,
  loadCdpDetail,
  loadCdpDetails,
  buildEmpty,
  getDustValues,
  doUpdate
} from './setups';
import { getMakerCurrencies } from './currencyHelper';
import {
  calcLiquidationPrice,
  maxEthDraw,
  maxPethDraw,
  calcCollatRatio,
  maxDai,
  displayFixedPercent,
  displayFixedValue,
  displayPercentValue,
  CdpNum,
  toBigNumber,
  bnOver
} from './helpers';
import {
  migrateABI,
  ERC20,
  GetCdps,
  ProxyRegistry,
  ProxyContract,
  CdpManager,
  TokenFaucet,
  MigrationProxyActions,
  Vat,
  Spotter
} from './ABIs';

export {
  loadCdpDetail,
  locateCdps,
  locateOldCdps,
  setupPriceAndRatios,
  setupServices,
  getDetailsForTokens,
  checkAllowances,
  checkAllowanceFor,
  collateralOptions,
  setupCdpManage,
  getDustValues,
  updateActiveCdp,
  loadCdpDetails,
  buildEmpty,
  getMakerCurrencies,
  calcLiquidationPrice,
  maxEthDraw,
  maxPethDraw,
  calcCollatRatio,
  maxDai,
  displayFixedPercent,
  displayFixedValue,
  displayPercentValue,
  CdpNum,
  doUpdate,
  toBigNumber,
  bnOver,
  addresses,
  // ABIs
  migrateABI,
  ERC20,
  GetCdps,
  ProxyRegistry,
  ProxyContract,
  CdpManager,
  TokenFaucet,
  MigrationProxyActions,
  Vat,
  Spotter
  // classes/containers
};
