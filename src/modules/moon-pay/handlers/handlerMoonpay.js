import { sha3 } from 'web3-utils';
import axios from 'axios';
const API = 'https://mainnet.mewwallet.dev';

export default class MoonPayHandler {
  constructor() {}
  /*
   ** MoonPay
   */
  buy(tokenSymbol, fiatCurrency, amount, address) {
    const hash = sha3(address);
    const id = `WEB|${hash.substring(0, 42)}`;
    return new Promise(resolve => {
      let link = `${API}/v3/purchase/moonpay/order?address=${address}&id=${id}&cryptoCurrency=${tokenSymbol}&fiatCurrency=${fiatCurrency}`;
      if (amount) {
        link += `&requestedAmount=${amount}`;
      }
      const parsedUrl = encodeURI(link);
      // eslint-disable-next-line
      window.open(parsedUrl, '_blank');
      resolve();
    });
  }

  sell(tokenSymbol, amount, address) {
    const hash = sha3(address);
    const id = `WEB|${hash.substring(0, 42)}`;
    return new Promise(resolve => {
      const parsedUrl = encodeURI(
        `${API}/v3/sell/moonpay/order?address=${address}&id=${id}&cryptoCurrency=${tokenSymbol}&requestedAmount=${amount}`
      );
      // eslint-disable-next-line
      window.open(parsedUrl, '_blank');
      resolve();
    });
  }

  getSupportedFiatToBuy(symbol) {
    return new Promise((resolve, reject) => {
      axios
        .get(`${API}/v3/purchase/providers/web?iso=us&cryptoCurrency=${symbol}`)
        .then(res => {
          const supportedFiat = res.data;
          resolve(supportedFiat);
        })
        .catch(reject);
    });
  }

  getFiatRatesForBuy() {
    return new Promise((resolve, reject) => {
      axios
        .get(`${API}/v3/purchase/moonpay/quotes`)
        .then(res => {
          resolve(res.data);
        })
        .catch(reject);
    });
  }

  getSupportedFiatToSell(symbol) {
    return new Promise((resolve, reject) => {
      axios
        .get(`${API}/v3/sell/providers/web?iso=us&cryptoCurrency=${symbol}`)
        .then(res => {
          const supportedFiat = res.data;
          resolve(supportedFiat);
        })
        .catch(reject);
    });
  }

  /*
   ** Simplex
   */
  simplexBuy(tokenSymbol, fiatCurrency, amount, address) {
    const hash = sha3(address);
    const id = `WEB|${hash.substring(0, 42)}`;
    return new Promise(resolve => {
      const parsedUrl = encodeURI(
        `${API}/v2/purchase/simplex/order?address=${address}&id=${id}&requestedCurrency=${tokenSymbol}&fiatCurrency=${fiatCurrency}&requestedAmount=${amount}`
      );
      // eslint-disable-next-line
      window.open(parsedUrl, '_blank');
      resolve();
    });
  }

  /* Simplex Quotes
  Parameters: 
    PurchaseOrderReferenceId, 
    FiatCurrency, 
    PurchaseOrderRequestedCurrency, 
    RequestedAmount, // Must be ETH amount ~0.027 - ~9
    PurchaseOrderCryptoCurrency
  Returns:
    payment_id: string,
    crypto_amount: number,
    crypto_currency: string,
    fiat_currency: string,
    fiat_amount: number,
    fiat_base_amount: number
  */
  getSimplexQuote(tokenSymbol, fiatCurrency, amount, address) {
    const hash = sha3(address);
    const id = `WEB|${hash.substring(0, 42)}`;
    return new Promise((resolve, reject) => {
      axios
        .get(
          `${API}/purchase/simplex/quote?id=${id}&requestedCurrency=${tokenSymbol}&fiatCurrency=${fiatCurrency}&requestedAmount=${amount}`
        )
        .then(res => {
          resolve(res.data);
        })
        .catch(reject);
    });
  }

  // this won't be used for awhile but is setup here
  getHistory() {}
}
