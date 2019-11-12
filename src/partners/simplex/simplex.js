import BigNumber from 'bignumber.js';
import { networkSymbols } from '../partnersConfig';
import {
  statuses,
  notificationStatuses,
  TIME_SWAP_VALID,
  MIN_FIAT,
  MAX_FIAT,
  SimplexCurrencies,
  PROVIDER_NAME
} from './config.js';
import { getQuote, getOrder, getStatus } from './simplex-api';

export default class Simplex {
  constructor(props = {}) {
    this.name = Simplex.getName();
    this.network = props.network || networkSymbols.ETH;
    this.minFiat = props.minFiat || MIN_FIAT;
    this.maxFiat = props.maxFiat || MAX_FIAT;
    this.currencyDetails = props.currencies || SimplexCurrencies;
    this.hasRates = 1;
    this.status = {
      invalidFiatAmount: true,
      invalidDigitalAmount: true,
      invalidAddress: true
    };
    this.internalEstimateRate = 0;

    this.currentOrder = {};
  }

  static getName() {
    return PROVIDER_NAME;
  }

  static isDex() {
    return false;
  }

  get isValidNetwork() {
    return this.network === networkSymbols.ETH;
  }

  get ratesRetrieved() {
    return this.hasRates > 0;
  }

  get currencies() {
    if (this.isValidNetwork) {
      return this.currencyDetails;
    }
    return { fiat: {}, digital: {} };
  }

  setNetwork(network) {
    this.network = network;
  }

  validSwap(fromCurrency, toCurrency) {
    if (this.isValidNetwork) {
      return (
        this.currencies.fiat[fromCurrency] &&
        this.currencies.digital[toCurrency]
      );
    }
    return false;
  }

  isFiat(currency) {
    return !!this.currencies.fiat[currency];
  }

  canQuote(fiatAmount, cryptoAmount) {
    if (!cryptoAmount) {
      return this.withinBounds(fiatAmount);
    }
    const cryptoEst =
      cryptoAmount *
      (this.internalEstimateRate > 0 ? this.internalEstimateRate : 60);
    return this.withinBounds(cryptoEst) || this.withinBounds(fiatAmount);
  }

  withinBounds(amount) {
    return (
      new BigNumber(amount).gt(new BigNumber(this.minFiat)) &&
      new BigNumber(amount).lt(new BigNumber(this.maxFiat))
    );
  }

  calculateRate(inVal, outVal) {
    return new BigNumber(outVal).div(new BigNumber(inVal));
  }

  async getRate(fromCurrency, toCurrency, fromValue, toValue, isFiat) {
    let simplexRateDetails, updateType;

    if (this.canQuote(fromValue, toValue)) {
      if (this.isFiat(fromCurrency) && isFiat) {
        updateType = 'updateFiat';
      } else {
        updateType = 'updateDigital';
      }

      simplexRateDetails = await this[updateType](
        fromCurrency,
        toCurrency,
        fromValue,
        toValue
      );

      this.internalEstimateRate = simplexRateDetails.rate;

      return {
        fromCurrency: fromCurrency,
        toCurrency: toCurrency,
        provider: this.name,
        rate: simplexRateDetails.rate,
        minValue: this.minFiat,
        maxValue: this.maxFiat
      };
    }

    this.invalidFrom = 'simplexMin';
    simplexRateDetails = await this.updateFiat(fromCurrency, toCurrency, 51);

    this.internalEstimateRate = simplexRateDetails.rate;

    return {
      fromCurrency: fromCurrency,
      toCurrency: toCurrency,
      provider: this.name,
      rate: simplexRateDetails.rate,
      minValue: this.minFiat,
      maxValue: this.maxFiat
    };
  }

  async getRateUpdate(fromCurrency, toCurrency, fromValue, toValue, isFiat) {
    return this.getRate(fromCurrency, toCurrency, fromValue, toValue, isFiat);
  }

  async updateFiat(fromCurrency, toCurrency, fromValue) {
    if (fromValue <= 0) fromValue = 51;
    const result = await getQuote({
      digital_currency: toCurrency,
      fiat_currency: fromCurrency,
      requested_currency: fromCurrency,
      requested_amount: +fromValue
    });

    if (result.error) {
      return { error: result.result, fromValue: fromValue, toValue: 0 };
    }

    this.currentOrder = result.result;

    return {
      fromValue: result.result.fiat_money.total_amount,
      toValue: result.result.digital_money.amount,
      rate: this.calculateRate(
        result.result.fiat_money.total_amount,
        result.result.digital_money.amount
      )
    };
  }

  async updateDigital(fromCurrency, toCurrency, fromValue, toValue) {
    if (toValue <= 0) toValue = 1;
    const result = await getQuote({
      digital_currency: toCurrency,
      fiat_currency: fromCurrency,
      requested_currency: toCurrency,
      requested_amount: +toValue
    });
    if (result.error) {
      return { error: result.result, fromValue: 0, toValue: toValue };
    }
    this.currentOrder = result.result;

    return {
      fromValue: result.result.fiat_money.total_amount,
      toValue: toValue,
      rate: this.calculateRate(
        result.result.fiat_money.total_amount,
        result.result.digital_money.amount
      )
    };
  }

  getInitialCurrencyEntries(collectMapFrom, collectMapTo) {
    for (const prop in this.currencies.fiat) {
      if (this.currencies.fiat[prop])
        collectMapFrom.set(prop, {
          symbol: prop,
          name: this.currencies.fiat[prop].name
        });
    }
    for (const prop in this.currencies.digital) {
      if (this.currencies.digital[prop])
        collectMapTo.set(prop, {
          symbol: prop,
          name: this.currencies.digital[prop].name
        });
    }
  }

  getUpdatedFromCurrencyEntries(value, collectMap) {
    if (this.currencies.digital[value.symbol]) {
      for (const prop in this.currencies.fiat) {
        if (this.currencies.fiat[prop])
          collectMap.set(prop, {
            symbol: prop,
            name: this.currencies.fiat[prop].name
          });
      }
    }
  }

  getUpdatedToCurrencyEntries(value, collectMap) {
    if (this.currencies.fiat[value.symbol]) {
      for (const prop in this.currencies.digital) {
        if (this.currencies.digital[prop])
          collectMap.set(prop, {
            symbol: prop,
            name: this.currencies.digital[prop].name
          });
      }
    }
  }

  canOrder(fiatAmount, digitalAmount) {
    return (
      new BigNumber(fiatAmount).gte(new BigNumber(this.minFiat)) &&
      new BigNumber(new BigNumber(fiatAmount)).lte(
        new BigNumber(this.maxFiat)
      ) &&
      new BigNumber(digitalAmount).gt(0)
    );
  }

  static parseOrder(order) {
    return {
      orderId: order.quote_id,
      statusId: order.user_id,
      sendToAddress: 'None',
      recValue: order.digital_total_amount_amount,
      sendValue: order.fiat_total_amount_amount,
      status: 'new',
      timestamp: order.timestamp || new Date().toISOString(),
      userAddress: order.destination_wallet_address,
      validFor: TIME_SWAP_VALID
    };
  }

  async startSwap(swapDetails) {
    await this.updateFiat(
      swapDetails.fromCurrency,
      swapDetails.toCurrency,
      swapDetails.fromValue
    );
    swapDetails.dataForInitialization = await this.createSwap(swapDetails);
    if (!swapDetails.dataForInitialization) throw Error('abort');
    swapDetails.timestamp = new Date().toISOString();
    swapDetails.providerReceives = this.currentOrder.fiat_money.total_amount;
    swapDetails.providerSends = this.currentOrder.digital_money.amount;
    swapDetails.parsed = Simplex.parseOrder(swapDetails.dataForInitialization);
    swapDetails.providerAddress = undefined;
    swapDetails.isDex = Simplex.isDex();
    return swapDetails;
  }

  createSwap(swapDetails) {
    if (this.canOrder(swapDetails.fromValue, swapDetails.toValue)) {
      return getOrder({
        'g-recaptcha-response': '',
        account_details: {
          app_end_user_id: this.currentOrder.user_id
        },
        transaction_details: {
          payment_details: {
            fiat_total_amount: {
              currency: this.currentOrder.fiat_money.currency,
              amount: this.currentOrder.fiat_money.total_amount
            },
            requested_digital_amount: {
              currency: this.currentOrder.digital_money.currency,
              amount: this.currentOrder.digital_money.amount
            },
            destination_wallet: {
              currency: this.currentOrder.digital_money.currency,
              address: swapDetails.toAddress
            }
          }
        }
      }).then(_result => {
        return _result.result;
      });
    }
  }

  static async getOrderStatus(noticeDetails) {
    const result = await getStatus(noticeDetails.statusId);
    if (result.error) {
      return 'error';
    }
    return Simplex.parseSimplexStatus(result.result.status);
  }

  static parseSimplexStatus(status) {
    switch (status) {
      case statuses.new:
      case statuses.initiated:
      case statuses.sent:
        return notificationStatuses.NEW;
      case statuses.pending:
        return notificationStatuses.PENDING;
      case statuses.payment:
        return notificationStatuses.COMPLETE;
      case statuses.declined:
      case statuses.cancelled:
        return notificationStatuses.CANCELLED;
    }
  }
}
