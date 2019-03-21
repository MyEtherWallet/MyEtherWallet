import store from 'store';
import BigNumber from 'bignumber.js';
import web3Utils from 'web3-utils';
import {
  networkSymbols,
  BASE_CURRENCY,
  swapNotificationStatuses
} from '../partnersConfig';
import { utils } from '../helpers';
import { Toast } from '@/helpers';
import {
  getRates,
  openOrder,
  getStatus,
  getExitRates,
  loginWithPhone,
  sendReceivedSmsCode,
  buildCyptoToFiatOrderData,
  getCyptoToFiatOrderDetails,
  getStatusFiat
} from './bity-calls';
import {
  bityStatuses,
  BityCurrencies,
  bityFiatCurrencies,
  PROVIDER_NAME,
  TIME_SWAP_VALID,
  BITY_MAX,
  BITY_MIN,
  BITY_DECIMALS,
  LOCAL_STORAGE_KEY,
  BASE_EQUIVALENT_CURRENCY,
  FIAT_EQUIVALENT_CURRENCY,
  FIAT_MIN,
  FIAT_MAX
} from './config';

function disabledPairing(currencyList, symbol, invalid, side) {
  if (currencyList[symbol]) {
    if (side === 'from') {
      if (currencyList[symbol].invalidFrom) {
        return !currencyList[symbol].invalidFrom.includes(invalid);
      }
      return true;
    } else if (side === 'to') {
      if (currencyList[symbol].invalidTo) {
        return currencyList[symbol].invalidTo.includes(invalid);
      }
      return true;
    }
    return true;
  }
}

export default class BitySwap {
  constructor(props = {}) {
    this.name = BitySwap.getName();
    this.network = props.network || networkSymbols.ETH;
    this.decimals = BITY_DECIMALS;
    this.hasRates = 0;
    this.mainPairs = ['REP', 'ETH'];
    this.minValue = BITY_MIN;
    this.maxValue = BITY_MAX;
    this.fiatMinValue = FIAT_MIN;
    this.fiatMaxValue = FIAT_MAX;
    this.fiatCurrencies = Object.keys(bityFiatCurrencies);
    this.rates = new Map();

    this.phoneSha = undefined;
    this.userDetails = this.loadStoredCredentials();
    this.retrieveRates();
  }

  static getName() {
    return PROVIDER_NAME;
  }

  static isDex() {
    return false;
  }

  get phoneToken() {
    return this.userDetails[this.phoneSha].phone_token;
  }

  get isValidNetwork() {
    return this.network === networkSymbols.ETH;
  }

  get currencies() {
    if (this.isValidNetwork) {
      return BityCurrencies;
    }
    return {};
  }

  async retrieveRates() {
    try {
      if (!this.isValidNetwork) return;
      const exitRates = await getExitRates();
      const exitData = exitRates.pairs;
      const rates = await getRates();
      const data = rates.objects;
      exitData.forEach(entry => {
        if (entry.enabled) {
          data.forEach(rateEntry => {
            if (
              rateEntry.pair === entry.input + entry.output &&
              !this.fiatCurrencies.includes(entry.input)
            ) {
              this.rates.set(
                `${entry.input}/${entry.output}`,
                parseFloat(rateEntry.rate_we_buy)
              );
            }
          });
        }
      });

      data.forEach(pair => {
        if (~this.mainPairs.indexOf(pair.pair.substring(3))) {
          if (pair.is_enabled && !this.fiatCurrencies.includes(pair.source)) {
            this.rates.set(
              `${pair.source}/${pair.target}`,
              parseFloat(pair.rate_we_sell)
            );
          }
        } else if (~this.mainPairs.indexOf(pair.pair.substring(0, 3))) {
          if (pair.is_enabled && !this.fiatCurrencies.includes(pair.source)) {
            this.rates.set(
              `${pair.source}/${pair.target}`,
              parseFloat(pair.rate_we_buy)
            );
          }
        }
      });
      this.hasRates = data.length > 0 ? this.hasRates + 1 : 0;
    } catch (e) {
      throw e;
    }
  }

  _getRate(fromToken, toToken) {
    if (this.rates.has(`${fromToken}/${toToken}`)) {
      return this.rates.get(`${fromToken}/${toToken}`);
    }
    return -1;
  }

  async getRate(fromCurrency, toCurrency) {
    const rate = this._getRate(fromCurrency, toCurrency);
    return {
      fromCurrency,
      toCurrency,
      provider: this.name,
      rate: rate,
      minValue: this.fiatCurrencies.includes(toCurrency)
        ? this.getChfEquivalentMaxMin(fromCurrency, false)
        : this.getBtcEquivalentMaxMin(fromCurrency, false),
      maxValue: this.fiatCurrencies.includes(toCurrency)
        ? this.getChfEquivalentMaxMin(fromCurrency, true)
        : this.getBtcEquivalentMaxMin(fromCurrency, true)
    };
  }

  validSwap(fromCurrency, toCurrency) {
    if (this.isValidNetwork) {
      return this.rates.has(`${fromCurrency}/${toCurrency}`);
    }
    return false;
  }

  minCheck(fromCurrency, fromValue, toCurrency, toValue) {
    return (
      this.validityCheck(fromCurrency, fromValue, toCurrency, toValue) !==
      'lessThanMin'
    );
  }

  maxCheck(fromCurrency, fromValue, toCurrency, toValue) {
    return (
      this.validityCheck(fromCurrency, fromValue, toCurrency, toValue) !==
      'greaterThanMax'
    );
  }

  getBtcEquivalentMaxMin(currency, max) {
    if (currency === BASE_EQUIVALENT_CURRENCY) {
      return max ? this.maxValue : this.minValue;
    }
    const btcRate = this._getRate(currency, BASE_EQUIVALENT_CURRENCY);
    return max
      ? new BigNumber(this.maxValue)
          .div(new BigNumber(btcRate))
          .toFixed(6, BigNumber.ROUND_UP)
      : new BigNumber(this.minValue)
          .div(new BigNumber(btcRate))
          .toFixed(6, BigNumber.ROUND_UP);
  }

  getChfEquivalentMaxMin(cryptoCurrency, max) {
    if (cryptoCurrency === FIAT_EQUIVALENT_CURRENCY) {
      return max ? this.fiatMaxValue : this.fiatMinValue;
    }
    const chfRate = this._getRate(cryptoCurrency, FIAT_EQUIVALENT_CURRENCY);
    return max
      ? new BigNumber(this.fiatMaxValue)
          .div(new BigNumber(chfRate))
          .toFixed(6, BigNumber.ROUND_UP)
      : new BigNumber(this.fiatMinValue)
          .div(new BigNumber(chfRate))
          .toFixed(6, BigNumber.ROUND_UP);
  }

  validityCheck(fromCurrency, fromValue, toCurrency, toValue) {
    if (this.fiatCurrencies.includes(toCurrency)) {
      if (
        new BigNumber(fromValue)
          .times(
            new BigNumber(this._getRate(fromCurrency, FIAT_EQUIVALENT_CURRENCY))
          )
          .toFixed(2) < this.fiatMinValue
      )
        return 'lessThanMin';
      else if (
        fromValue * this._getRate(fromCurrency, FIAT_EQUIVALENT_CURRENCY) >
        this.fiatMaxValue
      ) {
        return 'greaterThanMax';
      }
      return 'noErrors';
    }

    if (toValue < this.minValue || fromValue < this.minValue)
      return 'lessThanMin';
    else if (
      (toCurrency === BASE_EQUIVALENT_CURRENCY && toValue > this.maxValue) ||
      (fromCurrency === BASE_EQUIVALENT_CURRENCY && fromValue > this.maxValue)
    ) {
      return 'greaterThanMax';
    } else if (
      this.mainPairs.includes(toCurrency) ||
      this.mainPairs.includes(fromCurrency)
    ) {
      if (
        toValue * this._getRate(toCurrency, BASE_EQUIVALENT_CURRENCY) >
          this.maxValue ||
        fromValue * this._getRate(fromCurrency, BASE_EQUIVALENT_CURRENCY) >
          this.maxValue
      ) {
        return 'greaterThanMax';
      }
    }
    return 'noErrors';
  }

  setNetwork(network) {
    this.network = network;
  }

  getInitialCurrencyEntries(collectMapFrom, collectMapTo) {
    for (const prop in this.currencies) {
      if (this.currencies[prop]) {
        collectMapTo.set(prop, {
          symbol: prop,
          name: this.currencies[prop].name
        });
        if (!this.fiatCurrencies.includes(prop)) {
          collectMapFrom.set(prop, {
            symbol: prop,
            name: this.currencies[prop].name
          });
        }
      }
    }
  }

  getUpdatedFromCurrencyEntries(value, collectMap) {
    if (this.currencies[value.symbol]) {
      for (const prop in this.currencies) {
        if (disabledPairing(this.currencies, value.symbol, prop, 'from')) {
          if (this.currencies[prop] && !this.fiatCurrencies.includes(prop)) {
            collectMap.set(prop, {
              symbol: prop,
              name: this.currencies[prop].name
            });
          }
        }
      }
    }
  }

  getUpdatedToCurrencyEntries(value, collectMap) {
    if (this.currencies[value.symbol]) {
      for (const prop in this.currencies) {
        if (disabledPairing(this.currencies, value.symbol, prop, 'to')) {
          if (this.currencies[prop])
            collectMap.set(prop, {
              symbol: prop,
              name: this.currencies[prop].name
            });
        }
      }
    }
  }

  checkIfExit(swapDetails) {
    return this.fiatCurrencies.includes(swapDetails.toCurrency);
  }

  async startSwap(swapDetails) {
    if (this.checkIfExit(swapDetails) && !swapDetails.bypass) {
      if (swapDetails.exitFromAddress === '') return {};
      swapDetails.dataForInitialization = false;
      swapDetails.isExitToFiat = true;
      return swapDetails;
    } else if (this.checkIfExit(swapDetails) && swapDetails.bypass) {
      const preOrder = await this.buildExitOrder(swapDetails);
      if (preOrder.created) {
        swapDetails.dataForInitialization = await getCyptoToFiatOrderDetails({
          pair: swapDetails.fromCurrency + swapDetails.toCurrency,
          detailsUrl: preOrder.status_address,
          phoneToken: this.phoneToken
        });
        if (swapDetails.dataForInitialization) {
          swapDetails.providerReceives =
            swapDetails.dataForInitialization.input.amount;
          swapDetails.providerSends =
            swapDetails.dataForInitialization.output.amount;
          swapDetails.parsed = BitySwap.parseExitOrder(
            swapDetails.dataForInitialization
          );
          swapDetails.timestamp = swapDetails.parsed.timestamp.replace(
            'ZZ',
            'Z'
          );
          swapDetails.providerSends = swapDetails.parsed.recValue;
          swapDetails.providerAddress =
            swapDetails.dataForInitialization.payment_address;
          swapDetails.isDex = BitySwap.isDex();
          swapDetails.validFor = swapDetails.parsed.validFor;
        } else {
          throw Error('abort');
        }
      }
    } else if (!this.checkIfExit(swapDetails)) {
      swapDetails.dataForInitialization = await this.buildOrder(swapDetails);
      if (!swapDetails.dataForInitialization) throw Error('abort');
      swapDetails.providerReceives =
        swapDetails.dataForInitialization.input.amount;
      swapDetails.providerSends =
        swapDetails.dataForInitialization.output.amount;
      swapDetails.parsed = BitySwap.parseOrder(
        swapDetails.dataForInitialization
      );
      swapDetails.providerSends = swapDetails.parsed.recValue;
      swapDetails.providerAddress =
        swapDetails.dataForInitialization.payment_address;
      swapDetails.isDex = BitySwap.isDex();
      swapDetails.validFor = swapDetails.parsed.validFor;
    }

    return swapDetails;
  }

  async buildOrder({
    fromCurrency,
    toCurrency,
    fromValue,
    toValue,
    toAddress
  }) {
    if (
      this.minCheck(fromCurrency, fromValue, toCurrency, toValue) &&
      this.maxCheck(fromCurrency, fromValue, toCurrency, toValue)
    ) {
      const order = {
        amount: fromValue,
        mode: 0,
        pair: fromCurrency + toCurrency,
        destAddress: toAddress
      };

      return await openOrder(order);
    }
  }

  loadStoredCredentials() {
    const userDetails = store.get(LOCAL_STORAGE_KEY);
    if (userDetails !== null && userDetails !== undefined) {
      return userDetails;
    }
    return {};
  }

  setStoredCredentials(phoneSha, phoneToken, verified = false) {
    let userDetails = store.get(LOCAL_STORAGE_KEY);
    if (userDetails === null || userDetails === undefined) {
      userDetails = {};
    }
    userDetails[phoneSha] = {
      phone_token: phoneToken,
      verified: verified
    };
    store.set(LOCAL_STORAGE_KEY, userDetails);
    this.userDetails = userDetails;
    return userDetails;
  }

  async registerUser(initData) {
    this.phoneSha = web3Utils.sha3(initData.phoneNumber);
    if (this.userDetails[this.phoneSha] === undefined) {
      await this.getPhoneToken(initData);
      return false;
    } else if (!this.userDetails[this.phoneSha].verified) {
      await this.getPhoneToken(initData);
      return false;
    }
    return true;
  }

  async getPhoneToken(initData) {
    const initializeData = {
      pair: initData.fromCurrency + initData.toCurrency,
      phoneNumber: initData.phoneNumber
    };
    const result = await loginWithPhone(initializeData);
    this.setStoredCredentials(this.phoneSha, result.phone_token);
  }

  async verifyUser(verifyData) {
    const verificationData = {
      pair: verifyData.fromCurrency + verifyData.toCurrency,
      phoneToken: this.phoneToken,
      tan: verifyData.tan
    };
    // returns {success: true} if successful
    const result = await sendReceivedSmsCode(verificationData);
    this.setStoredCredentials(this.phoneSha, this.phoneToken, result.success);
    return result;
  }

  async buildExitOrder({ fromCurrency, toCurrency, orderDetails }) {
    try {
      const orderData = {
        pair: fromCurrency + toCurrency,
        phoneToken: this.phoneToken,
        orderDetails: { ...orderDetails }
      };
      return buildCyptoToFiatOrderData(orderData);
    } catch (e) {
      Toast.responseHandler(e, false);
    }
  }

  async getExitOrderDetails(detailsUrl) {
    return getCyptoToFiatOrderDetails(detailsUrl);
  }

  async startSpecial() {}

  static parseOrder(order) {
    return {
      orderId: order.reference,
      statusId: order.id,
      sendToAddress: order.payment_address,
      recValue: order.output.amount,
      sendValue: order.payment_amount,
      status: order.status,
      timestamp: order.timestamp_created,
      validFor: order.validFor || TIME_SWAP_VALID
    };
  }

  static parseExitOrder(order) {
    return {
      orderId: order.reference,
      statusId: order.id,
      sendToAddress: order.payment_address,
      recValue: order.amount,
      sendValue: order.payment_amount,
      status: order.status,
      timestamp: order.timestamp_created,
      validFor: order.validFor || TIME_SWAP_VALID
    };
  }

  static async getOrderStatus(noticeDetails) {
    if (Object.keys(bityFiatCurrencies).includes(noticeDetails.toCurrency)) {
      return BitySwap.getOrderStatusFiat(noticeDetails);
    }
    return BitySwap.getOrderStatusCrypto(noticeDetails);
  }

  static async getOrderStatusCrypto(noticeDetails) {
    try {
      const data = await getStatus(noticeDetails.statusId);
      if (data.status === bityStatuses.EXEC) {
        return swapNotificationStatuses.COMPLETE;
      }
      if (data.input.status !== bityStatuses.FILL) {
        switch (data.input.status) {
          case bityStatuses.OPEN:
            return swapNotificationStatuses.NEW;
          case bityStatuses.RCVE:
          case bityStatuses.CONF:
            return swapNotificationStatuses.PENDING;
          case bityStatuses.CANC:
            return swapNotificationStatuses.CANCELLED;
        }
      } else {
        switch (data.output.status) {
          case bityStatuses.FILL:
            return swapNotificationStatuses.COMPLETE;
          case bityStatuses.CANC:
            return swapNotificationStatuses.CANCELLED;
          default:
            return swapNotificationStatuses.PENDING;
        }
      }
    } catch (e) {
      Toast.responseHandler(e, false);
    }
    return swapNotificationStatuses.PENDING;
  }

  static async getOrderStatusFiat(noticeDetails) {
    try {
      const data = await getStatusFiat(
        noticeDetails.statusId,
        noticeDetails.special
      );
      if (!utils.isJson(data)) return swapNotificationStatuses.PENDING;

      // Since the status cannot be relied upon, we are going to assume the order went through after 10 min, if their was no error with the eth transaction.
      // Cannot make the same assumption with regards to chains other than ethereum.
      const timeSinceOrder =
        (new Date().getTime() - new Date(data.timestamp_created).getTime()) /
        1000;
      if (
        timeSinceOrder > 600 &&
        data.status === bityStatuses.OPEN &&
        data.input.currency === BASE_CURRENCY
      ) {
        return swapNotificationStatuses.COMPLETE;
      }
      switch (data.status) {
        // The endPoint does not seem to be updating the order.
        //case bityStatuses.OPEN:
        // return 'new';
        case bityStatuses.OPEN:
        case bityStatuses.RCVE:
        case bityStatuses.CONF:
          return swapNotificationStatuses.PENDING;
        case bityStatuses.FILL:
          return swapNotificationStatuses.COMPLETE;
        case bityStatuses.CANC:
          return swapNotificationStatuses.CANCELLED;
      }
    } catch (e) {
      Toast.responseHandler(e, false);
    }
    return swapNotificationStatuses.PENDING;
  }
}
