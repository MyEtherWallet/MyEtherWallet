import { BitySwap, BityCurrencies, PROVIDER_NAME as bity } from './bity';
import {
  ChangellyCurrencies,
  ChangellySwap,
  PROVIDER_NAME as changelly
} from './changelly';

import { DexAg, PROVIDER_NAME as dexAg } from './dexAg';
import {
  Simplex,
  SimplexCurrencies,
  PROVIDER_NAME as simplex
} from './simplex';
import SwapProviders from './partners';
import {
  ERC20,
  networkSymbols,
  chainCurrencies,
  fiat,
  EthereumTokens,
  OtherCoins,
  BASE_CURRENCY,
  MIN_SWAP_AMOUNT
} from './partnersConfig';
import {
  utils,
  bestRateForQuantity,
  bestProviderForQuantity,
  isValidEntry,
  checkInvalidOrMissingValue,
  dynamicSortMultiple,
  qrcodeBuilder,
  hasIcon
} from './helpers';

// Array of currently supported providers
const providers = [BitySwap, ChangellySwap, Simplex, DexAg];

const providerMap = providers.reduce(
  (accumulator, currentValue) =>
    accumulator.set(currentValue.getName(), currentValue),
  new Map()
);

const providerNames = {
  simplex: simplex,
  changelly: changelly,
  bity: bity,
  dexag: dexAg
};

const offChainProviders = [
  providerNames.simplex,
  providerNames.changelly,
  providerNames.bity
];

const supportedProviders = Object.values(providerNames);

export {
  SwapProviders,
  providers,
  providerMap,
  supportedProviders,
  providerNames,
  offChainProviders,
  BASE_CURRENCY,
  MIN_SWAP_AMOUNT,
  BitySwap,
  BityCurrencies,
  Simplex,
  SimplexCurrencies,
  ChangellySwap,
  ChangellyCurrencies,
  networkSymbols,
  chainCurrencies,
  fiat,
  EthereumTokens,
  OtherCoins,
  ERC20,
  utils,
  bestRateForQuantity,
  bestProviderForQuantity,
  isValidEntry,
  dynamicSortMultiple,
  checkInvalidOrMissingValue,
  qrcodeBuilder,
  hasIcon
};
