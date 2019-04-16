import BigNumber from 'bignumber.js';

import { networkSymbols } from '../partnersConfig';
import { Toast } from '@/helpers';

import {
  notificationStatuses,
  ChangellyCurrencies,
  statuses,
  TIME_SWAP_VALID,
  PROVIDER_NAME,
  FEE_RATE
} from './config';
import changellyCalls from './changelly-calls';
import changellyApi from './changelly-api';

import debug from 'debug';

const errorLogger = debug('v5:partners-changelly');

export default class Changelly {
  constructor(props = {}) {
    this.name = Changelly.getName();
    this.network = props.network || networkSymbols.ETH;
    this.getRateForUnit =
      typeof props.getRateForUnit === 'boolean' ? props.getRateForUnit : false;
    this.hasRates = 0;
    this.currencyDetails = props.currencies || ChangellyCurrencies;
    this.useFixed = true;
    this.tokenDetails = {};
    this.rateDetails = {};
    this.getSupportedCurrencies(this.network);
  }

  static getName() {
    return PROVIDER_NAME;
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
    if (this.isValidNetwork) {
      return this.currencies[fromCurrency] && this.currencies[toCurrency];
    }
    return false;
  }

  calculateTrueRate(topRate) {
    return new BigNumber(topRate)
      .minus(new BigNumber(topRate).times(new BigNumber(FEE_RATE)))
      .toNumber();
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

  async getFixedRate(fromCurrency, toCurrency, fromValue) {
    const changellyDetails = await changellyCalls.getFixRate(
      fromCurrency,
      toCurrency,
      fromValue,
      this.network
    );

    if (!Array.isArray(changellyDetails)) {
      throw Error(
        `Failed to retrieve changelly rate from ${fromCurrency} to ${toCurrency}`
      );
    }

    return {
      fromCurrency,
      toCurrency,
      provider: this.name,
      minValue: changellyDetails[0].min,
      maxValue: changellyDetails[0].max,
      rate: changellyDetails[0].result,
      rateId: changellyDetails[0].id
    };
  }

  async getMarketRate(fromCurrency, toCurrency, fromValue) {
    if (
      this.rateDetails[`${fromCurrency}/${toCurrency}`] &&
      this.getRateForUnit
    ) {
      return {
        fromCurrency,
        toCurrency,
        provider: this.name,
        minValue: this.rateDetails[`${fromCurrency}/${toCurrency}`].minAmount,
        rate: this.calculateTrueRate(
          this.rateDetails[`${fromCurrency}/${toCurrency}`].rate
        )
      };
    }

    const changellyDetails = await Promise.all([
      changellyCalls.getMin(fromCurrency, toCurrency, fromValue, this.network),
      changellyCalls.getRate(
        fromCurrency,
        toCurrency,
        this.getRateForUnit ? 1 : fromValue,
        this.network
      )
    ]);

    const minAmount = new BigNumber(changellyDetails[0])
      .times(0.001)
      .plus(new BigNumber(changellyDetails[0]))
      .toFixed();

    this.rateDetails[`${fromCurrency}/${toCurrency}`] = {
      minAmount: minAmount,
      rate: changellyDetails[1]
    };

    return {
      fromCurrency,
      toCurrency,
      provider: this.name,
      minValue: minAmount,
      rate: this.calculateTrueRate(changellyDetails[1])
    };
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
    return Error('From amount below changelly minimun for currency pair');
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
      from: fromCurrency.toLowerCase(),
      to: toCurrency.toLowerCase(),
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
      from: fromCurrency.toLowerCase(),
      to: toCurrency.toLowerCase(),
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
      validFor: TIME_SWAP_VALID // validFor ||  // Rates provided are only an estimate, and
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
