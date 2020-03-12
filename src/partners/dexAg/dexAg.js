import BigNumber from 'bignumber.js';

import { networkSymbols } from '../partnersConfig';
import { Toast } from '@/helpers';
import DEXAG from 'dexag-sdk';

import {
  notificationStatuses,
  ChangellyCurrencies,
  statuses,
  TIME_SWAP_VALID,
  PROVIDER_NAME
} from './config';
import changellyCalls from './dexAg-calls';
import changellyApi from './dexAg-api';

import debug from 'debug';

const errorLogger = debug('v5:partners-changelly');

const disabled = ['USDT'];
console.log(DEXAG); // todo remove dev item

export default class DexAg {
  constructor(props = {}) {
    this.name = DexAg.getName();
    console.log(DEXAG.fromProvider); // todo remove dev item
    this.sdk = DEXAG.fromProvider(props.web3.currentProvider);
    this.network = props.network || networkSymbols.ETH;
    this.getRateForUnit =
      typeof props.getRateForUnit === 'boolean' ? props.getRateForUnit : false;
    this.hasRates = 0;
    this.currencyDetails = props.currencies || ChangellyCurrencies;
    this.useFixed = true;
    this.tokenDetails = {};
    this.getSupportedCurrencies(this.network);
  }

  static getName() {
    return PROVIDER_NAME;
  }

  getApiConnector(type) {
    if (type === 'api') {
      return changellyApi;
    }
    return changellyCalls;
  }

  static isDex() {
    return false;
  }

  async getSupportedCurrencies() {
    try {
      const {
        currencyDetails,
        tokenDetails
      } = await changellyApi.getSupportedCurrencies(this.network);
      this.currencyDetails = currencyDetails;
      this.tokenDetails = tokenDetails;
      this.hasRates =
        Object.keys(this.tokenDetails).length > 0 ? this.hasRates + 1 : 0;
    } catch (e) {
      errorLogger(e);
    }
  }

  get ratesRetrieved() {
    return Object.keys(this.tokenDetails).length > 0 && this.hasRates > 0;
  }

  get isValidNetwork() {
    return this.network === networkSymbols.ETH;
  }

  setNetwork(network) {
    this.network = network;
  }

  get currencies() {
    if (this.isValidNetwork) {
      return this.currencyDetails;
    }
    return {};
  }

  validSwap(fromCurrency, toCurrency) {
    if (disabled.includes(fromCurrency) || disabled.includes(toCurrency)) {
      return false;
    }
    if (this.isValidNetwork) {
      return this.currencies[fromCurrency] && this.currencies[toCurrency];
    }
    return false;
  }

  fixedEnabled(currency) {
    return (
      typeof this.currencies[currency].fixRateEnabled === 'boolean' &&
      this.currencies[currency].fixRateEnabled
    );
  }

  // could make it as a multi-provider that takes a setup param and then uses that
  // should change this to be able to return multiple without changing the structure too much
  async getRate(fromCurrency, toCurrency, fromValue) {
    return new Promise(async resolve => {
      const vals = await this.sdk.getPrice({
        to: toCurrency,
        from: fromCurrency,
        fromAmount: fromValue,
        dex: 'all'
      });
      // const vals = await this.sdk.getTrade({
      //   to: toCurrency,
      //   from: fromCurrency,
      //   fromAmount: fromValue,
      //   dex: 'ag'
      // });

      console.log(vals); // todo remove dev item
      // const rate = this.calculateRate(fromValue, vals.metadata.source.price);

      resolve(
        vals.map(val => {
          return {
            fromCurrency,
            toCurrency,
            provider: this.name,
            rate: this.calculateRate(fromValue, val.price),
            additional: { source: val.dex }
          };
        })
      );
    });
    // console.log(vals); // todo remove dev item
    // return vals;
  }

  async getRateUpdate(fromCurrency, toCurrency, fromValue, toValue, isFiat) {
    return this.getRate(fromCurrency, toCurrency, fromValue, toValue, isFiat);
  }

  calculateRate(inVal, outVal) {
    return new BigNumber(outVal).div(inVal);
  }

  getInitialCurrencyEntries(collectMapFrom, collectMapTo) {
    for (const prop in this.currencies) {
      if (this.currencies[prop])
        collectMapTo.set(prop, {
          symbol: prop,
          name: this.currencies[prop].name
        });
      collectMapFrom.set(prop, {
        symbol: prop,
        name: this.currencies[prop].name
      });
    }
  }

  getUpdatedFromCurrencyEntries(value, collectMap) {
    if (this.currencies[value.symbol]) {
      for (const prop in this.currencies) {
        if (this.currencies[prop])
          collectMap.set(prop, {
            symbol: prop,
            name: this.currencies[prop].name
          });
      }
    }
  }

  getUpdatedToCurrencyEntries(value, collectMap) {
    if (this.currencies[value.symbol]) {
      for (const prop in this.currencies) {
        if (this.currencies[prop])
          collectMap.set(prop, {
            symbol: prop,
            name: this.currencies[prop].name
          });
      }
    }
  }

  async startSwap(swapDetails) {
    let details;
    if (+swapDetails.minValue <= +swapDetails.fromValue) {
      // details = await this.createTransaction(swapDetails);
      // if (!details) throw Error('abort');
      // if (details.message) throw Error(details.message);
      // swapDetails.providerReceives = details.amountExpectedFrom;
      // swapDetails.providerSends = details.amountExpectedTo;
      // swapDetails.parsed = DexAg.parseOrder(details);
      // swapDetails.providerSends = swapDetails.parsed.recValue;
      // swapDetails.orderId = swapDetails.parsed.orderId;
      // swapDetails.providerAddress = details.payinAddress;
      // swapDetails.dataForInitialization = details;
      // swapDetails.isDex = DexAg.isDex();
      // swapDetails.validFor = swapDetails.parsed.validFor;
      return swapDetails;
    }
    return Error('From amount below changelly minimum for currency pair');
  }

  static parseOrder(order) {
    return {
      orderId: order.id,
      statusId: order.id,
      sendToAddress: order.payinAddress,
      recValue: order.amountExpectedTo,
      sendValue: order.amountExpectedFrom,
      status: order.status,
      timestamp: order.createdAt,
      validFor: TIME_SWAP_VALID // Rates provided are only an estimate
    };
  }

  static async getOrderStatus(noticeDetails, network) {
    try {
      const status = await changellyCalls.getStatus(
        noticeDetails.statusId,
        network
      );
      return DexAg.parseChangellyStatus(status);
    } catch (e) {
      Toast.responseHandler(e, false);
    }
  }

  static parseChangellyStatus(status) {
    switch (status) {
      case statuses.new:
        return notificationStatuses.NEW;
      case statuses.waiting:
        return notificationStatuses.SENT;
      case statuses.confirming:
      case statuses.exchanging:
      case statuses.sending:
      case statuses.hold:
        return notificationStatuses.PENDING;
      case statuses.finished:
        return notificationStatuses.COMPLETE;
      case statuses.failed:
        return notificationStatuses.FAILED;
      case statuses.overdue:
      case statuses.refunded:
        return notificationStatuses.CANCELLED;
    }
  }

  async validateAddress(toCurrency, address) {
    return await changellyCalls.validateAddress(
      {
        currency: toCurrency,
        address: address
      },
      this.network
    );
  }
}
