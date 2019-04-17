import BigNumber from 'bignumber.js';

import { networkSymbols } from '../partnersConfig';
import { Toast } from '@/helpers';

import {
  notificationStatuses,
  FaastCurrencies,
  statuses,
  PROVIDER_NAME,
  TIME_SWAP_VALID,
  FEE_RATE,
  AFFILIATE_ID
} from './config';
import faastApi from './faast-api';

import debug from 'debug';

const errorLogger = debug('v5:partners-faast');

export default class Faast {
  constructor(props = {}) {
    this.name = Faast.getName();
    this.network = props.network || networkSymbols.ETH;
    this.hasRates = 0;
    this.currencyDetails = props.currencies || FaastCurrencies;
    this.tokenDetails = {};
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
      } = await faastApi.getSupportedCurrencies(this.network);
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
      return (
        this.currencies[fromCurrency] &&
        this.currencies[fromCurrency].validFrom &&
        this.currencies[toCurrency] &&
        this.currencies[toCurrency].validTo
      );
    }
    return false;
  }

  async getRate(fromCurrency, toCurrency, fromValue) {
    const faastDetails = await faastApi.getRate(
      fromCurrency,
      toCurrency,
      fromValue,
      this.network
    );

    if (!faastDetails.pair) {
      throw Error(
        `Failed to retrieve faast rate from ${fromCurrency} to ${toCurrency}`
      );
    }

    const rate = new BigNumber(1).div(faastDetails.price);

    return {
      fromCurrency,
      toCurrency,
      provider: this.name,
      minValue: faastDetails.minimum_deposit,
      maxValue: faastDetails.maximum_deposit,
      rate
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
      swapDetails.providerReceives = details.deposit_amount;
      swapDetails.parsed = Faast.parseOrder(details);
      swapDetails.providerSends = swapDetails.parsed.recValue;
      swapDetails.orderId = swapDetails.parsed.orderId;
      swapDetails.providerAddress = swapDetails.parsed.sendToAddress;
      swapDetails.dataForInitialization = details;
      swapDetails.isDex = Faast.isDex();
      swapDetails.validFor = swapDetails.parsed.validFor;
      return swapDetails;
    }
    return Error('From amount below faast minimum for currency pair');
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
      deposit_currency: fromCurrency,
      withdrawal_currency: toCurrency,
      withdrawal_address: toAddress,
      deposit_amount: Number(fromValue),
      refund_address: refundAddress === '' ? fromAddress : refundAddress
    };
    if (FEE_RATE > 0 && FEE_RATE <= 5) {
      swapParams.affiliate_id = AFFILIATE_ID;
      swapParams.affiliate_margin = FEE_RATE;
    }
    return await faastApi.createTransaction(swapParams, this.network);
  }

  static parseOrder(order) {
    let validFor =
      (new Date(order.price_locked_until).getTime() - Date.now()) * 1000;
    if (validFor > TIME_SWAP_VALID) validFor = TIME_SWAP_VALID;
    return {
      orderId: order.swap_id,
      statusId: order.swap_id,
      sendToAddress: order.deposit_address,
      recValue: order.withdrawal_amount,
      sendValue: order.deposit_amount,
      status: 'awaiting deposit',
      timestamp: order.created_at,
      validFor
    };
  }

  static async getOrderStatus(noticeDetails, network) {
    try {
      const order = await faastApi.getOrder(noticeDetails.statusId, network);
      return Faast.parseFaastStatus(order.status);
    } catch (e) {
      Toast.responseHandler(e, false);
    }
  }

  static parseFaastStatus(status) {
    switch (status) {
      case statuses.awaitingDeposit:
        return notificationStatuses.NEW;
      case statuses.awaitingNetworkConfirmation:
        return notificationStatuses.SENT;
      case statuses.received:
      case statuses.withdrawing:
        return notificationStatuses.PENDING;
      case statuses.complete:
        return notificationStatuses.COMPLETE;
      case statuses.cancelled:
      case statuses.refunding:
      case statuses.refunded:
        return notificationStatuses.CANCELLED;
    }
  }

  async validateAddress(toCurrency, address) {
    return await faastApi.validateAddress(
      {
        currency: toCurrency,
        address: address
      },
      this.network
    );
  }
}
