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
    this.hasTokens = 0;
    this.currencyDetails = props.currencies || ChangellyCurrencies;
    this.currencyIconList = [];
    this.erc20List = [];
    this.tokenDetails = {};
    this.requireExtraId = ['XRP', 'STEEM', 'SBD', 'XLM', 'DCT', 'XEM'];
    this.getSupportedCurrencies(this.network);
  }

  get validNetwork() {
    return this.network === networkSymbols.ETH;
  }

  get currencies() {
    if (this.validNetwork) {
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
    if (this.validNetwork) {
      return this.currencies[fromCurrency] && this.currencies[toCurrency];
    }
    return false;
  }

  async createSwap(swapDetails) {
    return await this.createTransaction(
      swapDetails.fromCurrency,
      swapDetails.toCurrency,
      swapDetails.toAddress,
      swapDetails.fromAddress,
      swapDetails.fromValue
    );
  }
  getCurrencyIcon(currency) {
    if (this.currencyIconList[currency]) {
      return this.currencyIconList[currency];
    }
  }

  getCurrencyIconList() {
    return this.currencyIconList;
  }

  async getSupportedCurrencies() {
    try {
      const currencyList = await getCurrencies(this.network);
      this.currencyDetails = {};
      this.tokenDetails = {};
      this.currencyIconList = {};
      for (let i = 0; i < currencyList.length; i++) {
        if (!this.requireExtraId.includes(currencyList[i].name.toUpperCase())) {
          const details = {
            symbol: currencyList[i].name.toUpperCase(),
            name: currencyList[i].fullName
          };
          this.currencyDetails[details.symbol] = details;
          this.tokenDetails[details.symbol] = details;
          this.currencyIconList[details.symbol] = details.image;
        }
      }
      this.hasTokens =
        Object.keys(this.tokenDetails).length > 0 ? this.hasTokens + 1 : 0;
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

  async createTransaction(
    fromCurrency,
    toCurrency,
    toAddress,
    fromAddress,
    fromValue
  ) {
    const swapParams = {
      from: fromCurrency.toLowerCase(),
      to: toCurrency.toLowerCase(),
      address: toAddress,
      extraId: null,
      amount: fromValue,
      refundAddress: fromAddress !== '' ? fromAddress : toAddress,
      refundExtraId: null
    };
    console.log(swapParams); // todo remove dev item
    return await createTransaction(swapParams, this.network);
  }
}
