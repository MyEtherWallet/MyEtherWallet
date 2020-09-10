import bityGetCryptoRates from './bityGetCryptoRates';
import bityGetFiatRate from './bityGetFiatRate';
import changellyGetCurrenciesFull from './changellyGetCurrenciesFull.json';
import changellyGetFixRate from './changellyGetFixRate.json';
import dexAgGetPrice from './dexAgGetPrice.json';
import dexAgGetSupportedCurrencies from './dexAgGetSupportedCurrencies.json';
import dexAgSupportedDexes from './dexAgSupportedDexes.json';
import simplexCurrentCurrencies from './simplexCurrentCurrencies.json'
import simplexExchangeRates from './simplexExchangeRates.json'

export function responseSelector(req) {
  if (req.url.includes('bity')) {
    if (req.body) {
      const body = JSON.parse(req.body.toString());
      switch (body.method) {
        case 'getFiatRates':
          console.log('bityGetFiatRate'); // todo remove dev item
          return Promise.resolve(JSON.stringify(bityGetFiatRate));
        case 'getCryptoRates':
          console.log('bityGetCryptoRates'); // todo remove dev item

          return Promise.resolve(JSON.stringify(bityGetCryptoRates));
      }
    }
  } else if (req.url.includes('changelly')) {
    if (req.body) {
      const body = JSON.parse(req.body.toString());
      switch (body.method) {
        case 'getCurrenciesFull':
          console.log('changellyGetCurrenciesFull'); // todo remove dev item

          return Promise.resolve(JSON.stringify(changellyGetCurrenciesFull));
        case 'getFixRate':
          console.log('changellyGetFixRate'); // todo remove dev item

          return Promise.resolve(JSON.stringify(changellyGetFixRate));
      }
    }
  } else if (req.url.includes('dexag')) {
    if (req.body) {
      const body = JSON.parse(req.body.toString());
      switch (body.method) {
        case 'supportedDexes':
          console.log('dexAgSupportedDexes'); // todo remove dev item

          return Promise.resolve(JSON.stringify(dexAgSupportedDexes));
        case 'getSupportedCurrencies':
          console.log('dexAgGetSupportedCurrencies'); // todo remove dev item

          return Promise.resolve(JSON.stringify(dexAgGetSupportedCurrencies));
        case 'getPrice':
          console.log('dexAgGetPrice'); // todo remove dev item

          return Promise.resolve(JSON.stringify(dexAgGetPrice));
      }
    } else if (req.url.includes('apiccswap')) {
      if (req.url.includes('current-currencies')) {
        console.log('simplexCurrentCurrencies'); // todo remove dev item

        return Promise.resolve(JSON.stringify(simplexCurrentCurrencies));
      } else if (req.url.includes('exchange-rates')) {
        console.log('simplexExchangeRates'); // todo remove dev item

        return Promise.resolve(JSON.stringify(simplexExchangeRates));
      }
    }
  }
  console.log(req); // todo remove dev item
}
