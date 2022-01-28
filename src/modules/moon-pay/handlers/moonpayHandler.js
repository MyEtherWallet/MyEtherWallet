import { sha3 } from 'web3-utils';
import axios from 'axios';
const API = 'https://staging.mewwallet.dev';
const MOONPAY = 'MOONPAY';

export default class MoonPayHandler {
  constructor(address) {
    this.address = address;
    this.id = sha3(address);
  }

  buy(tokenSymbol, fiatCurrency, amount) {
    return new Promise((resolve, reject) => {
      axios
        .get(`${API}/v3/purchase/moonpay/order`, {
          address: this.address,
          id: this.id,
          cryptoCurrency: tokenSymbol,
          fiatCurrency: fiatCurrency,
          requestedAmount: amount
        })
        .then(resolve)
        .catch(reject);
    });
  }

  sell(tokenSymbol, fiatCurrency, amount) {
    return new Promise((resolve, reject) => {
      axios
        .get(`${API}/v3/sell/moonpay/order`, {
          address: this.address,
          id: this.id,
          cryptoCurrency: tokenSymbol,
          fiatCurrency: fiatCurrency,
          amount: amount
        })
        .then(resolve)
        .catch(reject);
    });
  }

  getSupportedFiatToBuy(symbol) {
    return new Promise((resolve, reject) => {
      axios
        .get(`${API}/v3/purchase/providers/web?iso=us&cryptoCurrency=${symbol}`)
        .then(res => {
          const moonpay = res.data.find(item => item.name === MOONPAY);
          resolve(moonpay);
        })
        .catch(reject);
    });
  }

  getSupportedFiatToSell(symbol) {
    return new Promise((resolve, reject) => {
      axios
        .get(`${API}/v3/sell/providers/web?iso=us&cryptoCurrency=${symbol}`)
        .then(res => {
          const moonpay = res.data.find(item => item.name === MOONPAY);
          resolve(moonpay);
        })
        .catch(reject);
    });
  }
  // this won't be used for awhile but is setup here
  getHistory() {}
}
