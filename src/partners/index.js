import { BitySwap, BityCurrencies } from './bity';
import { KyberCurrencies, KyberSwap } from './kyber';
import { ChangellyCurrencies, ChangellySwap } from './changelly';
import { Simplex, SimplexCurrencies } from './simplex';
import Swap from './partners'
import {
  networkSymbols,
  chainCurrencies,
  fiat,
  supportedProviders,
  Tokens,
  OtherChains,
} from './config';
import {
  bestRateForQuantity,
  bestProviderForQuantity,
  isValidEntry,
  checkInvalidOrMissingValue,
  dynamicSortMultiple
} from './helpers/sortAndIdentify';
import { CurrencyOptionBuilder } from './helpers/currencyOptionBuilder';
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
  Tokens,
  OtherChains,
  CurrencyOptionBuilder,
  bestRateForQuantity,
  bestProviderForQuantity,
  isValidEntry,
  dynamicSortMultiple,
  checkInvalidOrMissingValue
};
