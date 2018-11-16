import BigNumber from 'bignumber.js';
import { networkSymbols } from '../partnersConfig';
import {
  SimplexMinFiat,
  SimplexMaxFiat,
  SimplexCurrencies,
  providerName
} from './config.js';
import { getQuote, getOrder /*, getStatus*/ } from './simplex-api';

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
    return providerName;
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
    return { fiat: {}, digital: {} };
  }

  validSwap(fromCurrency, toCurrency) {
    if (this.isValidNetwork) {
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

  // ============================= pair and value selection and update methods  ====================================

  canQuote(fiatAmount) {
    return fiatAmount >= this.minFiat && fiatAmount <= this.maxFiat;
  }

  async getRate(fromCurrency, toCurrency, fromValue, toValue, isFiat) {
    if (this.canQuote(fromValue, toValue)) {
      let simplexRateDetails /*, _fromValue, _toValue*/;
      if (this.isFiat(fromCurrency) && isFiat) {
        // TODO restructure to remove redundancy
        simplexRateDetails = await this.updateFiat(
          this.fromCurrency,
          this.toCurrency,
          fromValue
        );
      } else {
        simplexRateDetails = await this.updateDigital(
          this.fromCurrency,
          this.toCurrency,
          toValue
        );
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

  // ============================= Determine inclusion in currency options ====================================

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

  getUpdatedToCurrencyEntries(value, collectMap) {
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

  // ============================= Finalize swap details ====================================
  canOrder(fiatAmount, digitalAmount) {
    return (
      fiatAmount >= this.minFiat &&
      fiatAmount <= this.maxFiat &&
      digitalAmount > 0
    );
  }

  async startSwap(swapDetails) {
    await this.updateFiat(
      swapDetails.fromCurrency,
      swapDetails.toCurrency,
      swapDetails.fromValue
    );
    swapDetails.dataForInitialization = await this.createSwap(swapDetails);
    swapDetails.timestamp = new Date().toISOString();
    swapDetails.providerReceives = this.currentOrder.fiat_money.total_amount;
    swapDetails.providerSends = this.currentOrder.digital_money.amount;
    swapDetails.parsed = Simplex.parseOrder(swapDetails.dataForInitialization);
    swapDetails.providerAddress = undefined;
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

  static parseOrder(order) {
    return {
      orderId: order.quote_id,
      statusId: order.user_id,
      sendToAddress: 'None',
      recValue: order.digital_total_amount_amount,
      sendValue: order.fiat_total_amount_amount,
      status: 'new',
      timestamp: order.timestamp,
      userAddress: order.destination_wallet_address,
      validFor: 600
    };
  }

  // statusUpdater(swapDetails) {
  //   return () => {
  //     let currentStatus;
  //     const calculateTimeRemaining = (validFor, timestamp) => {
  //       return (
  //         validFor -
  //         parseInt(
  //           (new Date().getTime() - new Date(timestamp).getTime()) / 1000
  //         )
  //       );
  //     };
  //     const parsed = this.parseOrder(swapDetails.dataForInitialization);
  //     const timeRemaining = calculateTimeRemaining(
  //       parsed.validFor,
  //       parsed.timestamp
  //     );
  //     const checkStatus = setInterval(async () => {
  //       currentStatus = await getStatus({
  //         orderid: parsed.orderId
  //       });
  //       clearInterval(checkStatus);
  //     }, 1000);
  //   };
  // }
}
