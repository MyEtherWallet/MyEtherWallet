import { BitySwap, BityCurrencies, PROVIDER_NAME as bity } from './bity';
import {
  KyberCurrencies,
  KyberSwap,
  PROVIDER_NAME as kybernetwork
} from './kyber';
import {
  ChangellyCurrencies,
  ChangellySwap,
  PROVIDER_NAME as changelly
} from './changelly';
import {
  Simplex,
  SimplexCurrencies,
  PROVIDER_NAME as simplex
} from './simplex';
import Swap from './partners';
import {
  ERC20,
  networkSymbols,
  chainCurrencies,
  fiat,
  EthereumTokens,
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
  qrcodeBuilder
} from './helpers';

// Array of currently supported providers
const providers = [BitySwap, KyberSwap, ChangellySwap, Simplex];

const providerMap = providers.reduce(
  (accumulator, currentValue) =>
    accumulator.set(currentValue.getName(), currentValue),
  new Map()
);

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
  providerMap,
  supportedProviders,
  providerNames,
  BASE_CURRENCY,
  MIN_SWAP_AMOUNT,
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
  ERC20,
  utils,
  bestRateForQuantity,
  bestProviderForQuantity,
  isValidEntry,
  dynamicSortMultiple,
  checkInvalidOrMissingValue,
  qrcodeBuilder
};
