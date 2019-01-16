import BigNumber from 'bignumber.js';

import { networkSymbols } from '../partnersConfig';
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

export default class Changelly {
  constructor(props = {}) {
    this.name = Changelly.getName();
    this.network = props.network || networkSymbols.ETH;
    this.getRateForUnit =
      typeof props.getRateForUnit === 'boolean' ? props.getRateForUnit : false;
    this.hasRates = 0;
    this.currencyDetails = props.currencies || ChangellyCurrencies;
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

  async getRate(fromCurrency, toCurrency, fromValue) {
    if (
      this.rateDetails[`${fromCurrency}/${toCurrency}`] &&
      this.getRateForUnit
    ) {
      return {
        fromCurrency,
        toCurrency,
        provider: this.name,
        minValue: this.rateDetails[`${fromCurrency}/${toCurrency}`].minAmount,
        rate: this.rateDetails[`${fromCurrency}/${toCurrency}`].rate
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
      rate: changellyDetails[1]
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
        // if (prop !== value.symbol) {
        if (this.currencies[prop])
          collectMap.set(prop, {
            symbol: prop,
            name: this.currencies[prop].name
          });
        // }
      }
    }
  }

  getUpdatedToCurrencyEntries(value, collectMap) {
    if (this.currencies[value.symbol]) {
      for (const prop in this.currencies) {
        // if (prop !== value.symbol) {
        if (this.currencies[prop])
          collectMap.set(prop, {
            symbol: prop,
            name: this.currencies[prop].name
          });
        // }
      }
    }
  }

  async startSwap(swapDetails) {
    let details;
    if (+swapDetails.minValue <= +swapDetails.fromValue) {
      details = await await this.createTransaction(swapDetails);
      if (details.message) throw Error(details.message);
      swapDetails.providerReceives = details.amountExpectedFrom;
      swapDetails.providerSends = details.amountExpectedTo;
      swapDetails.parsed = Changelly.parseOrder(details);
      swapDetails.orderId = swapDetails.parsed.orderId;
      swapDetails.providerAddress = details.payinAddress;
      swapDetails.dataForInitialization = details;
      swapDetails.isDex = Changelly.isDex();
      return swapDetails;
    }
    throw Error('From amount below changelly minimun for currency pair');
  }

  async createTransaction({
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
      validFor: TIME_SWAP_VALID // Rates provided are only an estimate, and
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
      // eslint-disable-next-line
      console.error(e);
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
