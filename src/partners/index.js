import { BitySwap, BityCurrencies } from './bity';
import { KyberCurrencies, KyberSwap } from './kyber';
import { ChangellyCurrencies, ChangellySwap } from './changelly';
import { Simplex, SimplexCurrencies } from './simplex';
import Swap from './partners';
import {
  networkSymbols,
  chainCurrencies,
  fiat,
  supportedProviders,
  EthereumTokens,
  OtherChains
} from './partnersConfig';
import {
  utils,
  bestRateForQuantity,
  bestProviderForQuantity,
  isValidEntry,
  checkInvalidOrMissingValue,
  dynamicSortMultiple,
  CurrencyOptionBuilder
} from './helpers';

// Array of currently supported providers
const providers = [BitySwap, KyberSwap, ChangellySwap, Simplex];

export {
  Swap,
  providers,
  supportedProviders,
  BitySwap,
  BityCurrencies,
  KyberSwap,
  KyberCurrencies,
  Simplex,
  SimplexCurrencies,
  ChangellySwap,
  ChangellyCurrencies,
  networkSymbols,
  chainCurrencies,
  fiat,
  EthereumTokens,
  OtherChains,
  // helpers
  utils,
  CurrencyOptionBuilder,
  bestRateForQuantity,
  bestProviderForQuantity,
  isValidEntry,
  dynamicSortMultiple,
  checkInvalidOrMissingValue
};
