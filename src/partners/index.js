import { BitySwap, BityCurrencies, providerName as bity } from './bity';
import {
  KyberCurrencies,
  KyberSwap,
  providerName as kybernetwork
} from './kyber';
import {
  ChangellyCurrencies,
  ChangellySwap,
  providerName as changelly
} from './changelly';
import { Simplex, SimplexCurrencies, providerName as simplex } from './simplex';
import Swap from './partners';
import {
  networkSymbols,
  chainCurrencies,
  fiat,
  EthereumTokens,
  OtherChains,
  baseCurrency
} from './partnersConfig';
import {
  utils,
  bestRateForQuantity,
  bestProviderForQuantity,
  isValidEntry,
  checkInvalidOrMissingValue,
  dynamicSortMultiple
} from './helpers';

// Array of currently supported providers
const providers = [BitySwap, KyberSwap, ChangellySwap, Simplex];

const providerNames = {
  simplex: simplex,
  kyber: kybernetwork,
  changelly: changelly,
  bity: bity
};

const supportedProviders = Object.values(providerNames);

export {
  Swap,
  providers,
  supportedProviders,
  providerNames,
  baseCurrency,
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
  bestRateForQuantity,
  bestProviderForQuantity,
  isValidEntry,
  dynamicSortMultiple,
  checkInvalidOrMissingValue
};
