import { sha3 } from 'web3-utils';
import axios from 'axios';
const API = 'https://staging.mewwallet.dev';

export default class OrderHandler {
  constructor() {}
  /*
   ** MoonPay
   */
  buy(tokenSymbol, fiatCurrency, amount, address) {
    const hash = sha3(address);
    const id = `WEB|${hash.substring(0, 42)}`;
    return new Promise(resolve => {
      let link = `${API}/v3/purchase/moonpay/order?address=${address}&id=${id}&cryptoCurrency=${tokenSymbol}&fiatCurrency=${fiatCurrency}&platform=web`;
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
        `${API}/v3/sell/moonpay/order?address=${address}&id=${id}&cryptoCurrency=${tokenSymbol}&requestedAmount=${amount}&platform=web`
      );
      // eslint-disable-next-line
      window.open(parsedUrl, '_blank');
      resolve();
    });
  }

  /**
   *
   * @param {String} symbol - Crypto Symbol ex. ETH
   * @returns
   */
  getSupportedFiatToBuy(symbol) {
    return axios
      .get(`${API}/v3/purchase/providers/web?iso=us&cryptoCurrency=${symbol}`, {
        headers: {
          'Accept-Language': 'en-US'
        }
      })
      .then(res => res.data);
  }

  getFiatRatesForBuy() {
    return axios
      .get(`${API}/v3/purchase/moonpay/quotes`, {
        headers: {
          'Accept-Language': 'en-US'
        }
      })
      .then(res => res.data);
  }

  getSupportedFiatToSell(symbol) {
    return axios
      .get(`${API}/v3/sell/providers/web?iso=us&cryptoCurrency=${symbol}`, {
        headers: {
          'Accept-Language': 'en-US'
        }
      })
      .then(res => res.data);
  }

  /*
   ** Simplex
   */
  simplexBuy(tokenSymbol, fiatCurrency, amount, address) {
    const hash = sha3(address);
    const id = `WEB|${hash.substring(0, 42)}`;
    return new Promise(resolve => {
      const parsedUrl = encodeURI(
        `${API}/v2/purchase/simplex/order?address=${address}&id=${id}&requestedCurrency=${fiatCurrency}&fiatCurrency=${fiatCurrency}&requestedAmount=${amount}&cryptoCurrency=${tokenSymbol}`
      );
      // eslint-disable-next-line
      window.open(parsedUrl, '_blank');
      resolve();
    });
  }

  getSimplexQuote(tokenSymbol, fiatCurrency, amount, address) {
    const hash = sha3(address);
    const id = `WEB|${hash.substring(0, 42)}`;
    return new Promise((resolve, reject) => {
      axios
        .get(
          encodeURI(
            `${API}/purchase/simplex/quote?id=${id}&requestedCurrency=${fiatCurrency}&fiatCurrency=${fiatCurrency}&requestedAmount=${amount}&cryptoCurrency=${tokenSymbol}`
          ),
          {
            headers: {
              'Accept-Language': 'en-US'
            }
          }
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
