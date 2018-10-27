/* eslint-disable no-unused-vars */
import BigNumber from 'bignumber.js';
import { networkSymbols } from '../partnersConfig';
import { SimplexMinFiat, SimplexMaxFiat, SimplexCurrencies } from './config.js';
import { getQuote, getOrder, getStatus } from './simplex-api';

export default class Simplex {
  constructor(props = {}) {
    this.name = Simplex.getName();
    this.network = props.network || networkSymbols.ETH;
    this.minFiat = props.minFiat || SimplexMinFiat;
    this.maxFiat = props.maxFiat || SimplexMaxFiat;
    this.currencyDetails = props.currencies || SimplexCurrencies;
    this.hasRates = 1;
    this.status = {
      invalidFiatAmount: true,
      invalidDigitalAmount: true,
      invalidAddress: true
    };

    this.currentOrder = {};
  }

  static getName() {
    return 'simplex';
  }

  get validNetwork() {
    return this.network === networkSymbols.ETH;
  }

  get currencies() {
    if (this.validNetwork) {
      return this.currencyDetails;
    }
    return { fiat: {}, digital: {} };
  }

  getInitialCurrencyEntries(collectMapFrom, collectMapTo){
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

  getUpdatedFromCurrencyEntries(value, collectMap){
    if (this.currencies.digital[value.symbol]) {
      for (const prop in this.currencies.fiat) {
        if (prop !== value.symbol) {
          if (this.currencies.fiat[prop])
            collectMap.set(prop, {
              symbol: prop,
              name: this.currencies.fiat[prop].name
            });
        }
      }
    }
  }

  getUpdatedToCurrencyEntries(value, collectMap){
    if (this.currencies.fiat[value.symbol]) {
      for (const prop in this.currencies.digital) {
        if (prop !== value.symbol) {
          if (this.currencies.digital[prop])
            collectMap.set(prop, {
              symbol: prop,
              name: this.currencies.digital[prop].name
            });
        }
      }
    }
  }

  async startSwap(swapDetails) {
    swapDetails.dataForInitialization = await this.createSwap(swapDetails);
    return swapDetails;
  }

  validSwap(fromCurrency, toCurrency) {
    if (this.validNetwork) {
      return (
        this.currencies.fiat[fromCurrency] &&
        (toCurrency === 'ETH' || toCurrency === 'BTC')
      );
    }
    return false;
  }

  isFiat(currency) {
    return !!this.currencies.fiat[currency];
  }

  canQuote(fiatAmount) {
    return fiatAmount >= this.minFiat && fiatAmount <= this.maxFiat;
  }

  canOrder(fiatAmount, digitalAmount) {
    return (
      fiatAmount >= this.minFiat &&
      fiatAmount <= this.maxFiat &&
      digitalAmount > 0
    );
  }

  parseOrder(order) {
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

  statusUpdater(swapDetails) {
    return () => {
      let currentStatus;
      const calculateTimeRemaining = (validFor, timestamp) => {
        return (
          validFor -
          parseInt(
            (new Date().getTime() - new Date(timestamp).getTime()) / 1000
          )
        );
      };
      const parsed = this.parseOrder(swapDetails.dataForInitialization);
      const timeRemaining = calculateTimeRemaining(
        parsed.validFor,
        parsed.timestamp
      );
      const checkStatus = setInterval(async () => {
        currentStatus = await getStatus({
          orderid: parsed.orderId
        });
        clearInterval(checkStatus);
      }, 1000);
    };
  }

  async getRate(fromCurrency, toCurrency, fromValue, toValue, isFiat) {
    if (this.canQuote(fromValue, toValue)) {
      let simplexRateDetails/*, _fromValue, _toValue*/;
      if (this.isFiat(fromCurrency) && isFiat) {
        // TODO restructure to remove redundancy
        simplexRateDetails = await this.updateFiat(
          this.fromCurrency,
          this.toCurrency,
          fromValue
        );
/*        _fromValue = simplexRateDetails.fromValue;
        _toValue = simplexRateDetails.toValue;*/
      } else {
        simplexRateDetails = await this.updateDigital(
          this.fromCurrency,
          this.toCurrency,
          toValue
        );
/*        _fromValue = simplexRateDetails.fromValue;
        _toValue = simplexRateDetails.toValue;*/
      }

      const rate = new BigNumber(simplexRateDetails.fromValue)
        .div(simplexRateDetails.toValue)
        .toString(10);
      return {
        fromCurrency,
        toCurrency,
        provider: this.name,
        rate: rate,
        minValue: this.minFiat,
        maxValue: this.maxFiat
      };
    }
    this.invalidFrom = 'simplexMin';
    // eslint-disable no-console
    // errorLogger('indicate invalid simplex'); // TODO: provide ui indication(s)
    const simplexRateDetails = await this.updateFiat(
      fromCurrency,
      toCurrency,
      51
    );
    const rate = new BigNumber(simplexRateDetails.toValue)
      .div(simplexRateDetails.fromValue)
      .toString(10);
    return {
      fromCurrency,
      toCurrency,
      provider: this.name,
      rate: rate,
      minValue: this.minFiat,
      maxValue: this.maxFiat
    };
  }

  async updateFiat(fiatCurrency, digitalCurrency, fiatAmount) {
    const rate = await getQuote({
      digital_currency: digitalCurrency,
      fiat_currency: fiatCurrency,
      requested_currency: fiatCurrency,
      requested_amount: +fiatAmount
    });
    if (rate.error) {
      return {
        error: rate.result,
        fromValue: fiatAmount,
        toValue: -1
      };
    }
    this.currentOrder = rate.result;
    return {
      fromValue: rate.result.fiat_money.base_amount,
      toValue: rate.result.digital_money.amount
    };
  }

  async updateDigital(fiatCurrency, digitalCurrency, digitalAmount) {
    const rate = await getQuote({
      digital_currency: digitalCurrency,
      fiat_currency: fiatCurrency,
      requested_currency: digitalCurrency,
      requested_amount: +digitalAmount
    });
    if (rate.error) {
      return {
        error: rate.result,
        fromValue: -1,
        toValue: digitalAmount
      };
    }
    this.currentOrder = rate.result;
    return {
      fromValue: rate.result.fiat_money.base_amount,
      toValue: rate.result.digital_money.amount
    };
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
}
