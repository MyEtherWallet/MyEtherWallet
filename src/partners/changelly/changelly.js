import { networkSymbols } from '../config';
import {
  getCurrencies,
  validateAddress,
  createTransaction,
  getRate,
  getMin,
  getStatus
} from './call';

import { ChangellyCurrencies } from './config';

import debug from 'debug';
const errorLogger = debug('v5:partners-changelly');

export default class Changelly {
  constructor(props = {}) {
    this.name = Changelly.getName();
    this.network = props.network || networkSymbols.ETH;
    this.hasTokens = 0;
    this.currencyDetails = props.currencies || ChangellyCurrencies;
    this.currencyIconList = [];
    this.erc20List = [];
    this.tokenDetails = {};
    this.requireExtraId = ['XRP', 'STEEM', 'SBD', 'XLM', 'DCT', 'XEM'];
    this.getSupportedCurrencies(this.network);
  }

  static getName() {
    return 'changelly';
  }

  static parseOrder(order) {
    return {
      orderId: order.id,
      statusId: undefined,
      sendToAddress: order.payinAddress,
      recValue: order.amountExpectedTo,
      sendValue: order.amountExpectedFrom,
      status: order.status,
      timestamp: order.createdAt,
      validFor: 600 // Think it may be valid for longer, but I need to ask
    };
  }

  static async getOrderStatus(swapDetails) {
    const parsed = Changelly.parseOrder(swapDetails.dataForInitialization);
    return await getStatus(parsed.orderId);
  }

  statusUpdater(/*swapDetails*/) {
    return () => {
      // let currentStatus;
      // const calculateTimeRemaining = (validFor, timestamp) => {
      //   return (
      //     validFor -
      //     parseInt(
      //       (new Date().getTime() - new Date(timestamp).getTime()) / 1000
      //     )
      //   );
      // };
      // const parsed = Changelly.parseOrder(swapDetails.dataForInitialization);
      // // let timeRemaining = calculateTimeRemaining(
      // //   parsed.validFor,
      // //   parsed.timestamp
      // // );
      // let checkStatus = setInterval(async () => {
      //   currentStatus = await getStatus({
      //     orderid: parsed.orderId
      //   });
      //   clearInterval(checkStatus);
      // }, 1000);
    };
  }

  static statuses(data) {
    const statuses = {
      new: 1,
      waiting: 2,
      confirming: 3,
      confirmed: 10,
      finished: 0,
      failed: -1
    };
    return statuses[data.status];
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

      if (currencyList) {
        for (let i = 0; i < currencyList.length; i++) {
          if (
            !this.requireExtraId.includes(currencyList[i].name.toUpperCase()) &&
            currencyList[i].enabled
          ) {
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
      } else {
        throw Error(
          'Changelly get supported currencies failed to return a value'
        );
      }
    } catch (e) {
      errorLogger(e);
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
    return await createTransaction(swapParams, this.network);
  }
}
