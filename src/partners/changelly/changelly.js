import BigNumber from 'bignumber.js';

import { networkSymbols } from '../partnersConfig';
import { Toast } from '@/helpers';

import {
  notificationStatuses,
  ChangellyCurrencies,
  statuses,
  TIME_SWAP_VALID,
  PROVIDER_NAME
} from './config';
import changellyCalls from './changelly-calls';
import changellyApi from './changelly-api';

import debug from 'debug';

const errorLogger = debug('v5:partners-changelly');

const disabled = [];

function checkAndChange(value) {
  if (!value) return value;
  if (value === 'USDT Omni') {
    return 'usdt';
  }
  if (value === 'USDT') {
    return 'usdt20';
  }
  if (value.toLowerCase() === 'repv2') {
    return 'rep';
  }
  if (value.toLowerCase() === 'rep') {
    return 'REPV2';
  }
  return value;
}

export default class Changelly {
  constructor(props = {}) {
    this.name = Changelly.getName();
    this.network = props.network || networkSymbols.ETH;
    this.tokenUpdate = props.tokenUpdate;
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
      this.tokenUpdate(tokenDetails);
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

  async getRate(fromCurrency, toCurrency, fromValue) {
    if (this.useFixed && this.currencies[toCurrency]) {
      if (this.fixedEnabled(toCurrency) && this.fixedEnabled(fromCurrency)) {
        return this.getFixedRate(fromCurrency, toCurrency, fromValue);
      }
      return this.getMarketRate(fromCurrency, toCurrency, fromValue);
    }
    return this.getMarketRate(fromCurrency, toCurrency, fromValue);
  }

  async getRateUpdate(fromCurrency, toCurrency, fromValue, toValue, isFiat) {
    return this.getRate(fromCurrency, toCurrency, fromValue, toValue, isFiat);
  }

  getFixedRate(fromCurrency, toCurrency, fromValue) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async resolve => {
      try {
        const timeout = setTimeout(() => {
          resolve({
            fromCurrency,
            toCurrency,
            minValue: -1,
            maxValue: -1,
            provider: this.name,
            rate: 0
          });
        }, 20000);

        const changellyDetails = await changellyCalls.getFixRate(
          checkAndChange(fromCurrency).toLowerCase(),
          checkAndChange(toCurrency).toLowerCase(),
          fromValue,
          this.network
        );
        clearTimeout(timeout);

        if (!Array.isArray(changellyDetails)) {
          return {
            fromCurrency,
            toCurrency,
            provider: this.name,
            rate: 0
          };
        }

        resolve({
          fromCurrency,
          toCurrency,
          provider: this.name,
          minValue: changellyDetails[0].min,
          maxValue: changellyDetails[0].max,
          rate: changellyDetails[0].result,
          rateId: changellyDetails[0].id
        });
      } catch (e) {
        return {
          fromCurrency,
          toCurrency,
          provider: this.name,
          rate: 0
        };
      }
    });
  }

  calculateRate(inVal, outVal) {
    return new BigNumber(outVal).div(inVal);
  }

  async getMarketRate(fromCurrency, toCurrency, fromValue) {
    try {
      const changellyDetails = await Promise.all([
        changellyCalls.getMin(
          checkAndChange(fromCurrency).toLowerCase(),
          checkAndChange(toCurrency).toLowerCase(),
          fromValue,
          this.network
        ),
        changellyCalls.getRate(
          checkAndChange(fromCurrency).toLowerCase(),
          checkAndChange(toCurrency).toLowerCase(),
          fromValue,
          this.network
        )
      ]);

      const minAmount = new BigNumber(changellyDetails[0])
        .times(0.001)
        .plus(new BigNumber(changellyDetails[0]))
        .toFixed();

      const estValueResponse = changellyDetails[1][0];

      return {
        fromCurrency,
        toCurrency,
        provider: this.name,
        minValue: minAmount,
        rate: estValueResponse.rate
      };
    } catch (e) {
      return {
        fromCurrency,
        toCurrency,
        provider: this.name,
        rate: 0
      };
    }
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
      details = await this.createTransaction(swapDetails);
      if (!details) throw Error('abort');
      if (details.message) throw Error(details.message);
      swapDetails.providerReceives = details.amountExpectedFrom;
      swapDetails.providerSends = details.amountExpectedTo;
      swapDetails.parsed = Changelly.parseOrder(details);
      swapDetails.providerSends = swapDetails.parsed.recValue;
      swapDetails.orderId = swapDetails.parsed.orderId;
      swapDetails.providerAddress = details.payinAddress;
      swapDetails.dataForInitialization = details;
      swapDetails.isDex = Changelly.isDex();
      swapDetails.validFor = swapDetails.parsed.validFor;
      return swapDetails;
    }
    return Error('From amount below changelly minimum for currency pair');
  }

  async createTransaction({
    fromCurrency,
    toCurrency,
    toAddress,
    fromAddress,
    fromValue,
    refundAddress
  }) {
    const transactionDetails = {
      fromCurrency,
      toCurrency,
      toAddress,
      fromAddress,
      fromValue,
      refundAddress
    };
    if (this.useFixed && this.currencies[toCurrency]) {
      if (this.fixedEnabled(toCurrency) && this.fixedEnabled(fromCurrency)) {
        return this.createFixedTransaction(transactionDetails);
      }
      return this.createMarketTransaction(transactionDetails);
    }
    return this.createMarketTransaction(transactionDetails);
  }

  async createFixedTransaction({
    fromCurrency,
    toCurrency,
    toAddress,
    fromAddress,
    fromValue,
    refundAddress
  }) {
    const finalDetails = await this.getFixedRate(
      fromCurrency,
      toCurrency,
      fromValue
    );
    const swapParams = {
      from: checkAndChange(fromCurrency).toLowerCase(),
      to: checkAndChange(toCurrency).toLowerCase(),
      address: toAddress,
      extraId: null,
      amount: fromValue,
      refundAddress: refundAddress === '' ? fromAddress : refundAddress,
      refundExtraId: null,
      rateId: finalDetails.rateId
    };
    return await changellyCalls.createFixTransaction(swapParams, this.network);
  }

  async createMarketTransaction({
    fromCurrency,
    toCurrency,
    toAddress,
    fromAddress,
    fromValue,
    refundAddress
  }) {
    const swapParams = {
      from: checkAndChange(fromCurrency).toLowerCase(),
      to: checkAndChange(toCurrency).toLowerCase(),
      address: toAddress,
      extraId: null,
      amount: fromValue,
      refundAddress: refundAddress === '' ? fromAddress : refundAddress,
      refundExtraId: null
    };
    return await changellyCalls.createTransaction(swapParams, this.network);
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
      return Changelly.parseChangellyStatus(status);
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
