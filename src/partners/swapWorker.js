/* eslint-disable */
// import {
//   Swap,
//   providers,
//   // bestProviderForQuantity,
//   // bestRateForQuantity,
//   // isValidEntry,
//   // checkInvalidOrMissingValue
// } from '@/partners';
//
//
// const swap = new Swap(providers)

import {
  ChangellyCurrencies,
  changellyCalls,
  changellyApi
} from '@/partners/changelly';

import { KyberCurrencies, kyberCalls, kyberApi } from '@/partners/kyber';

const preCache = self.__precacheManifest;
console.log(preCache); // todo remove dev item
self.addEventListener('sync', async (/*sync_event*/) => {
  const currencies = await changellyCalls.getCurrencies('ETH');
  console.log(currencies); // todo remove dev item
});
