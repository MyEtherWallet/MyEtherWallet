import BigNumber from 'bignumber.js';

import { networkSymbols } from '../partnersConfig';
import {
  ChangellyCurrencies,
  changellyStatuses,
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
    this.hasRates = 0;
    this.currencyDetails = props.currencies || ChangellyCurrencies;
    this.tokenDetails = {};
    this.rateDetails = {};
    this.getSupportedCurrencies(this.network);
  }

  static getName() {
    return PROVIDER_NAME;
  }

  // ============================= Setup Methods  ====================================
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

  // ============================= State Methods  ====================================

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

  // ============================= pair and value selection and update methods  ====================================
  validSwap(fromCurrency, toCurrency) {
    if (this.isValidNetwork) {
      return this.currencies[fromCurrency] && this.currencies[toCurrency];
    }
    return false;
  }

  async getRate(fromCurrency, toCurrency, fromValue) {
    if (this.rateDetails[`${fromCurrency}/${toCurrency}`]) {
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
      changellyCalls.getRate(fromCurrency, toCurrency, fromValue, this.network)
    ]);

    this.rateDetails[`${fromCurrency}/${toCurrency}`] = {
      minAmount: new BigNumber(changellyDetails[0]).times(0.001).plus(new BigNumber(changellyDetails[0])).toFixed(),
      rate: changellyDetails[1]
    };
    console.log(changellyDetails[0]); // todo remove dev item
    return {
      fromCurrency,
      toCurrency,
      provider: this.name,
      minValue: new BigNumber(changellyDetails[0]).times(0.001).plus(new BigNumber(changellyDetails[0])).toFixed(),
      rate: changellyDetails[1]
    };
  }

  // ============================= Determine inclusion in currency options ====================================
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
        if (prop !== value.symbol) {
          if (this.currencies[prop])
            collectMap.set(prop, {
              symbol: prop,
              name: this.currencies[prop].name
            });
        }
      }
    }
  }

  getUpdatedToCurrencyEntries(value, collectMap) {
    if (this.currencies[value.symbol]) {
      for (const prop in this.currencies) {
        if (prop !== value.symbol) {
          if (this.currencies[prop])
            collectMap.set(prop, {
              symbol: prop,
              name: this.currencies[prop].name
            });
        }
      }
    }
  }

  // ============================= Finalize swap details ====================================

  async startSwap(swapDetails) {
    console.log(swapDetails); // todo remove dev item
    let details;
    if (+swapDetails.minValue <= +swapDetails.fromValue) {
      details = await await this.createTransaction(swapDetails);
      console.log(details); // todo remove dev item
      if (details.message) throw Error(details.message);
      swapDetails.providerReceives = details.amountExpectedFrom;
      swapDetails.providerSends = details.amountExpectedTo;
      swapDetails.parsed = Changelly.parseOrder(details);
      swapDetails.orderId = swapDetails.parsed.orderId;
      swapDetails.providerAddress = details.payinAddress;
      swapDetails.dataForInitialization = details;
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

  // ================= Check status of order methods ===================================
  static parseOrder(order) {
    return {
      orderId: order.id,
      statusId: undefined,
      sendToAddress: order.payinAddress,
      recValue: order.amountExpectedTo,
      sendValue: order.amountExpectedFrom,
      status: order.status,
      timestamp: order.createdAt,
      validFor: 600 // Rates provided are only an estimate, and
    };
  }

  static async getOrderStatus(swapDetails, network) {
    try {
      const status = await changellyCalls.getStatus(
        swapDetails.orderId,
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
      case changellyStatuses.new:
      case changellyStatuses.waiting:
        return 'new';
      case changellyStatuses.confirming:
      case changellyStatuses.exchanging:
      case changellyStatuses.sending:
      case changellyStatuses.hold:
        return 'pending';
      case changellyStatuses.finished:
        return 'complete';
      case changellyStatuses.failed:
        return 'failed';
      case changellyStatuses.overdue:
      case changellyStatuses.refunded:
        return 'cancelled';
    }
  }

  statusUpdater(/*swapDetails*/) {
    return () => {};
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
    const status = statuses[data.status];
    if (typeof status === 'undefined') {
      return 2;
    }
    return status;
  }

  // ================= Util methods ===================================
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
