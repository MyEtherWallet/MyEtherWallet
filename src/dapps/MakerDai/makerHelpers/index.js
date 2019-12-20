import { locateCdps, locateOldCdps } from './locateCdps';
import addresses from './addressesMAIN';
// import addresses from './addressesKOV';
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
  doUpdate,
  ServiceRoles
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
  bnOver,
  nameConvert,
  reverseNameConvert
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
  nameConvert,
  reverseNameConvert,
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
  ServiceRoles,
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
