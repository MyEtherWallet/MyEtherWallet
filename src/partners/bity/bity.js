import store from 'store';
import web3Utils from 'web3-utils';
import { networkSymbols, BASE_CURRENCY } from '../partnersConfig';
import { utils } from '../helpers';
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
  LOCAL_STORAGE_KEY
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
    this.validStatus = ['RCVE', 'FILL', 'CONF', 'EXEC'];
    this.invalidStatus = ['CANC'];
    this.mainPairs = ['REP', 'ETH'];
    this.minValue = BITY_MIN;
    this.maxValue = BITY_MAX;
    this.fiatCurrencies = Object.keys(bityFiatCurrencies);
    this.rates = new Map();

    this.phoneSha = undefined;
    this.userDetails = this.loadStoredCredentials();
    // this.phoneToken =
    //   'OPWip5M2mbpidCtoYZZPJ1zxrDnOinWHok9TLyVfE1mQDOIp0dU6orrP+Gxm3Qrm';
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
            if (rateEntry.pair === entry.input + entry.output) {
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
      minValue: this.minValue,
      maxValue: this.maxValue
    };
  }

  validSwap(fromCurrency, toCurrency) {
    if (this.isValidNetwork) {
      return this.rates.has(`${fromCurrency}/${toCurrency}`);
    }
    return false;
  }

  minCheck(fromCurrency, fromValue, toCurrency, toValue) {
    return toValue > this.minValue || fromValue > this.minValue;
  }

  maxCheck(fromCurrency, fromValue, toCurrency, toValue) {
    const overMax =
      (toCurrency === 'BTC' && toValue > this.maxValue) ||
      (fromCurrency === 'BTC' && fromValue > this.maxValue);
    const overMaxETH =
      (toCurrency === 'ETH' && toValue > this.maxValue) ||
      (fromCurrency === 'ETH' &&
        fromValue * this._getRate(toCurrency, fromCurrency) > this.maxValue);
    const overMaxREP =
      (toCurrency === 'REP' && toValue > this.maxValue) ||
      (fromCurrency === 'REP' &&
        fromValue * this._getRate(fromCurrency, toCurrency) > this.maxValue);
    if (toCurrency === 'BTC' && overMax) {
      return false;
    } else if (toCurrency === 'ETH' && overMaxETH) {
      return false;
    } else if (toCurrency === 'REP' && overMaxREP) {
      return false;
    }
    return true;
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
        if (this.currencies[prop])
          collectMap.set(prop, {
            symbol: prop,
            name: this.currencies[prop].name
          });
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
      // throw Error('Exit to Fiat not yet implemented');
    } else if (this.checkIfExit(swapDetails) && swapDetails.bypass) {
      const preOrder = await this.buildExitOrder(swapDetails);
      console.log(preOrder); // todo remove dev item
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
          swapDetails.providerAddress =
            swapDetails.dataForInitialization.payment_address;
          swapDetails.isDex = BitySwap.isDex();
        }
      }
    } else if (!this.checkIfExit(swapDetails)) {
      swapDetails.dataForInitialization = await this.buildOrder(
        swapDetails.fromCurrency === BASE_CURRENCY,
        swapDetails
      );
      swapDetails.providerReceives =
        swapDetails.dataForInitialization.input.amount;
      swapDetails.providerSends =
        swapDetails.dataForInitialization.output.amount;
      swapDetails.parsed = BitySwap.parseOrder(
        swapDetails.dataForInitialization
      );
      swapDetails.providerAddress =
        swapDetails.dataForInitialization.payment_address;
      swapDetails.isDex = BitySwap.isDex();
    }

    return swapDetails;
  }

  async buildOrder(
    isFrom,
    { fromCurrency, toCurrency, fromValue, toValue, toAddress }
  ) {
    if (
      this.minCheck(fromCurrency, fromValue, toCurrency, toValue) &&
      this.maxCheck(fromCurrency, fromValue, toCurrency, toValue)
    ) {
      const order = {
        amount: fromValue,
        mode: isFrom ? 0 : 1, // check how I should handle this now
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
        orderDetails: { ...orderDetails } // details //{ ...orderDetails }
      };
      console.log(orderDetails); // todo remove dev item
      return buildCyptoToFiatOrderData(orderData);
    } catch (e) {
      console.error(e);
    }
  }

  async getExitOrderDetails(detailsUrl) {
    return getCyptoToFiatOrderDetails(detailsUrl);
  }

  async startSpecial() {}

  static parseOrder(order) {
    return {
      orderId: order.id,
      statusId: order.reference,
      sendToAddress: order.payment_address,
      recValue: order.output.amount,
      sendValue: order.payment_amount,
      status: order.status,
      timestamp: order.timestamp_created,
      validFor: order.validFor || TIME_SWAP_VALID
    };
  }
  /*
*   return {
    id: encryptor.encrypt(
      detailsUrl.replace('/api/v2/orders/', '')
    ),
    amount: orderJson.output.amount,
    payment_address: orderJson.payment_details.crypto_address,
    payment_amount: orderJson.input.amount,
    // reference: orderJson.reference,
    status: orderJson.legacy_status,
    validFor: 600,
    timestamp_created: orderJson.timestamp_created + "Z",
    input: {
      amount: orderJson.input.amount,
      currency: orderJson.input.currency
    },
    output: {
      amount: orderJson.output.amount,
      currency: orderJson.output.currency
    }
  };
*
* */
  static parseExitOrder(order) {
    console.log('parseExitOrder', order); // todo remove dev item
    return {
      orderId: order.id,
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
        return 'complete';
      }
      if (data.input.status !== bityStatuses.FILL) {
        switch (data.input.status) {
          case bityStatuses.OPEN:
            return 'new';
          case bityStatuses.RCVE:
          case bityStatuses.CONF:
            return 'pending';
          case bityStatuses.CANC:
            return 'cancelled';
        }
      } else {
        switch (data.output.status) {
          case bityStatuses.FILL:
            return 'complete';
          case bityStatuses.CANC:
            return 'cancelled';
          default:
            return 'pending';
        }
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      return 'pending';
    }
  }

  static async getOrderStatusFiat(noticeDetails) {
    try {
      const data = await getStatusFiat(
        noticeDetails.statusId,
        noticeDetails.special
      );
      if (!utils.isJson(data)) return 'pending';
      switch (data.status) {
        case bityStatuses.OPEN:
          return 'new';
        case bityStatuses.RCVE:
        case bityStatuses.CONF:
          return 'pending';
        case bityStatuses.FILL:
          return 'complete';
        case bityStatuses.CANC:
          return 'cancelled';
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      return 'pending';
    }
  }
}
