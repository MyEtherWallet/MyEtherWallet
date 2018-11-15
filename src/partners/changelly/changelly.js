import { networkSymbols } from '../partnersConfig';
import { ChangellyCurrencies, changellyStatuses } from './config';
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
    return 'changelly';
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
      minAmount: changellyDetails[0],
      rate: changellyDetails[1]
    };

    return {
      fromCurrency,
      toCurrency,
      provider: this.name,
      minValue: changellyDetails[0],
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
    if (+swapDetails.minValue <= +swapDetails.fromValue) {
      swapDetails.dataForInitialization = await await this.createTransaction(
        swapDetails
      );
      swapDetails.providerReceives =
        swapDetails.dataForInitialization.amountExpectedFrom;
      swapDetails.providerSends =
        swapDetails.dataForInitialization.amountExpectedTo;
      swapDetails.parsed = Changelly.parseOrder(
        swapDetails.dataForInitialization
      );
      swapDetails.orderId = swapDetails.parsed.orderId;
      swapDetails.providerAddress =
        swapDetails.dataForInitialization.payinAddress;
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
      validFor: 6000 // Rates provided are only an estimate, and
    };
  }

  static async getOrderStatus(swapDetails, network) {
    try {
      const parsed = Changelly.parseOrder(swapDetails.dataForInitialization);
      const status = await changellyCalls.getStatus(parsed.orderId, network);
      return Changelly.parseChangellyStatus(status);
    } catch (e) {
      // eslint-disable-next-line
      console.error(e);
    }
  }

  static parseChangellyStatus(status) {
    switch (status) {
      case changellyStatuses.new:
        return 0;
      case changellyStatuses.waiting:
        return 10;
      case changellyStatuses.confirming:
        return 30;
      case changellyStatuses.exchanging:
        return 50;
      case changellyStatuses.sending:
        return 60;
      case changellyStatuses.finished:
        return 100;
      case changellyStatuses.failed:
        return -100;
      case changellyStatuses.hold:
        return -50;
      case changellyStatuses.overdue:
        return 500;
      case changellyStatuses.refunded:
        return -10;
    }
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
