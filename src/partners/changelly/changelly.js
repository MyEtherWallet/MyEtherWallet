import { networkSymbols } from '../config';
import {
  getCurrencies,
  validateAddress,
  createTransaction,
  getRate,
  getMin
} from './call';

import { ChangellyCurrencies } from './config';

export default class Changelly {
  constructor(props = {}) {
    this.name = 'changelly';
    this.network = props.network || networkSymbols.ETH;
    this.hasTokens = false;
    this.currencyDetails = props.currencies || ChangellyCurrencies;
    this.tokenDetails = {};
    this.requireExtraId = ['XRP', 'STEEM', 'SBD', 'XLM', 'DCT', 'XEM'];
    this.getSupportedCurrencies(this.network);
  }

  get currencies() {
    if (this.network === networkSymbols.ETH) {
      return this.currencyDetails;
    }
    return {};
  }

  getSupportedTokens() {
    if (this.hasTokens) {
      return this.tokenDetails;
    }
    return {};
  }

  validSwap(fromCurrency, toCurrency) {
    return this.currencies[fromCurrency] && this.currencies[toCurrency];
  }

  async getSupportedCurrencies() {
    try {
      const currencyList = await getCurrencies(this.network);
      this.currencyDetails = {};
      for (let i = 0; i < currencyList.length; i++) {
        if (!this.requireExtraId.includes(currencyList[i].name.toUpperCase())) {
          const details = {
            symbol: currencyList[i].name.toUpperCase(),
            name: currencyList[i].fullName
          };
          this.currencyDetails[details.symbol] = details;
          this.tokenDetails[details.symbol] = details;
        }
      }
      this.hasTokens = Object.keys(this.tokenDetails).length > 0;
    } catch (e) {
      console.error(e);
    }
  }

  async getRate(fromCurrency, toCurrency, fromValue) {
    return await getRate(
      {
        from: fromCurrency,
        to: toCurrency,
        amount: fromValue
      },
      this.network
    );
  }

  async getMin(fromCurrency, toCurrency, fromValue) {
    return await getMin(
      {
        from: fromCurrency,
        to: toCurrency,
        amount: fromValue
      },
      this.network
    );
  }

  async validateAddress(toCurrency, address) {
    return await validateAddress(
      {
        currency: toCurrency,
        address: address
      },
      this.network
    );
  }

  async createTransaction(fromCurrency, toCurrency, address, fromValue) {
    const swapParams = {
      from: fromCurrency.toLowerCase(),
      to: toCurrency.toLowerCase(),
      address: address,
      extraId: null,
      amount: fromValue,
      refundAddress: address,
      refundExtraId: null
    };
    return await createTransaction(swapParams, this.network);
  }
}
