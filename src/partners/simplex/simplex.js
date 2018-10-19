/* eslint-disable no-unused-vars */
import { networkSymbols } from '../config';
import { SimplexMinFiat, SimplexMaxFiat, SimplexCurrencies } from './config.js';
import { getQuote, getOrder } from './simplex-api';

export default class Simplex {
  constructor(props = {}) {
    this.name = 'simplex';
    this.network = props.network || networkSymbols.ETH;
    this.minFiat = props.minFiat || SimplexMinFiat;
    this.maxFiat = props.maxFiat || SimplexMaxFiat;
    this.currencyDetails = props.currencies || SimplexCurrencies;
    this.status = {
      invalidFiatAmount: true,
      invalidDigitalAmount: true,
      invalidAddress: true
    };

    this.currentOrder = {};
  }

  get currencies() {
    if (this.network === networkSymbols.ETH) {
      return this.currencyDetails;
    }
    return { fiat: {}, digital: {} };
  }

  validSwap(fromCurrency, toCurrency) {
    return (
      this.currencies.fiat[fromCurrency] &&
      (toCurrency === 'ETH' || toCurrency === 'BTC')
    );
  }

  isFiat(currency) {
    return !!this.currencies.fiat[currency];
  }

  canQuote(fiatAmount, digitalAmount) {
    return (
      fiatAmount >= this.minFiat &&
      fiatAmount <= this.maxFiat &&
      digitalAmount > 0
    );
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
    });
  }
}
