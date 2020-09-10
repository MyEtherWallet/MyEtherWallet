import bityGetCryptoRates from './bityGetCryptoRates';
import bityGetFiatRate from './bityGetFiatRate';
import changellyGetCurrenciesFull from './changellyGetCurrenciesFull.json';
import changellyGetFixRate from './changellyGetFixRate.json';
import dexAgGetPrice from './dexAgGetPrice.json';
import dexAgGetSupportedCurrencies from './dexAgGetSupportedCurrencies.json';
import dexAgSupportedDexes from './dexAgSupportedDexes.json';






export function responseSelector(req){
  console.log(req); // todo remove dev item
  return Promise.resolve(JSON.stringify({ result: bityGetCryptoRates }));
  // if (req.method === 'POST') {
  //
  //   return Promise.resolve(JSON.stringify({ result: bityGetCryptoRates }));
  // }
  // return Promise.resolve(JSON.stringify(bityGetCryptoRates));
}
