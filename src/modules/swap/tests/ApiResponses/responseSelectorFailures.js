import bityGetCryptoRates from './bityGetCryptoRates';
import bityGetFiatRate from './bityGetFiatRate';
import bityGetEstimateEthEur from './bityGetEstimateEthEur.json';
import bityGetEstimateBtcEth from './bityGetEstimateBtcEth.json';
import changellyGetCurrenciesFull from './changellyGetCurrenciesFull.json';
import changellyGetFixRate from './changellyGetFixRate.json';
import changellyGetFixRateBtcEth from './changellyGetFixRateBtcEth.json';
import changellyGetFixRateEthBtc from './changellyGetFixRateEthBtc.json';
import changellyOneEthToBat from './changellyOneEthToBat.json';
import changellyCreateTransactionEthBat from './changellyCreateTransactionEthBat.json';
import changellyManaToBat from './changellyManaToBat.json';
import dexAgGetPrice from './dexAgGetPrice.json';
import dexAgGetSupportedCurrencies from './dexAgGetSupportedCurrencies.json';
import dexAgSupportedDexes from './dexAgSupportedDexes.json';
import dexAgCreateTransaction from './dexAgCreateTransaction.json';
import simplexCurrentCurrencies from './simplexCurrentCurrencies.json';
import simplexExchangeRates from './simplexExchangeRates.json';
import simplexUpdateDigital from './simplexUpdateDigital.json';
import simplexUpdateFiat from './simplexUpdateFiat.json';
import simplexUpdateFiatMin from './simplexUpdateFiat_Min.json';
import simplexErrors from './simplexErrors.json';

const emptyResponse = {
  jsonrpc: '2.0',
  result: [],
  id: '74cdb5ef-a047-4c0d-b1ad-f3b40e4f6303'
};
export function responseSelector(req, explicitlyNamed) {
  if (explicitlyNamed) {
    switch (explicitlyNamed) {
      case 'changellyOneEthToBat':
        return () => {
          console.log('changellyOneEthToBat'); // todo remove dev item
          return Promise.resolve(JSON.stringify(changellyOneEthToBat));
        };
    }
  }
  if (req.body) {
    const body = JSON.parse(req.body.toString());
    console.log(body); // todo remove dev item
    if (req.url.includes('bity')) {
      if (req.body) {
        switch (body.method) {
          case 'getFiatRates':
            console.log('bityGetFiatRate'); // todo remove dev item
            return Promise.resolve(JSON.stringify(bityGetFiatRate));
          case 'getCryptoRates':
            console.log('bityGetCryptoRates'); // todo remove dev item
            return Promise.resolve(JSON.stringify(bityGetCryptoRates));

          case 'getEstimate':
            switch (body.params.pair) {
              case 'BTCETH':
                return Promise.resolve(JSON.stringify(bityGetEstimateBtcEth));
              case 'ETHEUR':
                return Promise.resolve(JSON.stringify(bityGetEstimateEthEur));
            }
        }
      }
    } else if (req.url.includes('changelly')) {
      switch (body.method) {
        case 'getCurrenciesFull':
          console.log('changellyGetCurrenciesFull'); // todo remove dev item
          return Promise.resolve(JSON.stringify(changellyGetCurrenciesFull));
        case 'getFixRate':
          if (body.params[0].from === 'BTC' && body.params[0].to === 'ETH') {
            return Promise.resolve(JSON.stringify(changellyGetFixRateBtcEth));
          } else if (
            body.params[0].from === 'ETH' &&
            body.params[0].to === 'BTC'
          ) {
            return Promise.resolve(JSON.stringify(changellyGetFixRateEthBtc));
          } else if (
            body.params[0].from === 'ETH' &&
            body.params[0].to === 'BAT' &&
            body.params[0]
          ) {
            console.log('changellyGetFixRate'); // todo remove dev item
            return Promise.resolve(JSON.stringify(changellyOneEthToBat));
          } else if (
            body.params[0].from === 'MANA' &&
            body.params[0].to === 'BAT' &&
            body.params[0]
          ) {
            console.log('changellyGetFixRate'); // todo remove dev item
            return Promise.resolve(JSON.stringify(changellyManaToBat));
          } else if (body.params[0].from === 'ERR') {
            return Promise.reject(JSON.stringify(changellyGetFixRateBtcEth));
          }
          console.log('changellyGetFixRate'); // todo remove dev item
          return Promise.resolve(JSON.stringify(changellyGetFixRate));
        case 'createFixTransaction':
          if (body.params.from === 'eth' && body.params.to === 'bat') {
            return Promise.resolve(
              JSON.stringify(changellyCreateTransactionEthBat)
            );
          }
      }
    } else if (req.url.includes('dexag')) {
      switch (body.method) {
        case 'supportedDexes':
          console.log('dexAgSupportedDexes'); // todo remove dev item

          return Promise.resolve(JSON.stringify(dexAgSupportedDexes));
        case 'getSupportedCurrencies':
          console.log('dexAgGetSupportedCurrencies'); // todo remove dev item

          return Promise.resolve(JSON.stringify(dexAgGetSupportedCurrencies));
        case 'getPrice':
          if (body.params[0].from === 'ERR') {
            return Promise.reject(JSON.stringify(changellyGetFixRateBtcEth));
          }
          console.log('dexAgGetPrice'); // todo remove dev item

          return Promise.resolve(JSON.stringify(dexAgGetPrice));
        case 'createTransaction':
          if (
            body.params.transactionParams.fromCurrency === 'ETH' &&
            body.params.transactionParams.toCurrency === 'BAT'
          ) {
            console.log('dexAgCreateTransaction'); // todo remove dev item
            return Promise.resolve(JSON.stringify(dexAgCreateTransaction));
          }
      }
    } else if (req.url.includes('apiccswap')) {
      // console.log(body); // todo remove dev item
      if (
        req.url.includes('quote') &&
        body.requested_currency === 'USD' &&
        +body.requested_amount === 51
      ) {
        console.log('simplexUpdateFiatMin'); // todo remove dev item
        return Promise.resolve(JSON.stringify(simplexUpdateFiatMin));
      } else if (
        req.url.includes('quote') &&
        body.requested_currency === 'USD' &&
        body.requested_amount <= 50
      ) {
        console.log('simplexErrors.invalidAmount'); // todo remove dev item
        return Promise.resolve(JSON.stringify(simplexErrors.invalidAmount));
      } else if (
        req.url.includes('quote') &&
        body.requested_currency === 'ETH'
      ) {
        console.log('simplexUpdateDigital'); // todo remove dev item
        return Promise.resolve(JSON.stringify(simplexUpdateDigital));
      } else if (
        req.url.includes('quote') &&
        body.requested_currency === 'USD'
      ) {
        console.log('simplexUpdateDigital'); // todo remove dev item
        return Promise.resolve(JSON.stringify(simplexUpdateFiat));
      }
    }
  } else if (req.url.includes('apiccswap')) {
    if (req.url.includes('current-currencies')) {
      console.log('simplexCurrentCurrencies'); // todo remove dev item

      return Promise.resolve(JSON.stringify(simplexCurrentCurrencies));
    } else if (req.url.includes('exchange-rates')) {
      console.log('simplexExchangeRates'); // todo remove dev item

      return Promise.resolve(JSON.stringify(simplexExchangeRates));
    } else if (req.url.includes('quote')) {
      console.log('simplexExchangeRates'); // todo remove dev item

      return Promise.resolve(JSON.stringify(simplexExchangeRates));
    }
  }
  return Promise.resolve(JSON.stringify(emptyResponse));
}
