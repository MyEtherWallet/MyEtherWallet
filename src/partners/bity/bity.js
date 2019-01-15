import { networkSymbols } from '../partnersConfig';
import { getRates, openOrder, getStatus } from './bity-calls';
import {
  bityStatuses,
  BityCurrencies,
  bityFiatCurrencies,
  PROVIDER_NAME,
  TIME_SWAP_VALID,
  BITY_MAX,
  BITY_MIN,
  BITY_DECIMALS
} from './config';

function disabledPairing(currencyList, symbol, invalid, side) {
  if (currencyList[symbol]) {
    if (side === 'from') {
      if (currencyList[symbol].invalidFrom) {
        return !currencyList[symbol].invalidFrom.includes(invalid);
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

    this.retrieveRates();
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

  get currencies() {
    if (this.isValidNetwork) {
      return BityCurrencies;
    }
    return {};
  }

  async retrieveRates() {
    try {
      if (!this.isValidNetwork) return;
      const rates = await getRates();
      const data = rates.objects;
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

  validityCheck(fromCurrency, fromValue, toCurrency, toValue) {
    if (toValue < this.minValue || fromValue < this.minValue)
      return 'lessThanMin';
    else if (
      (toCurrency == 'BTC' && toValue > this.maxValue) ||
      (fromCurrency == 'BTC' && fromValue > this.maxValue)
    )
      return 'greaterThanMax';
    else if (
      (toCurrency == 'ETH' &&
        toValue * this._getRate('ETH', 'BTC') > this.maxValue) ||
      (fromCurrency == 'ETH' &&
        fromValue * this._getRate('ETH', 'BTC') > this.maxValue)
    )
      return 'greaterThanMax';
    else if (
      (toCurrency == 'REP' &&
        toValue * this._getRate('REP', 'BTC') > this.maxValue) ||
      (fromCurrency == 'REP' &&
        fromValue * this._getRate('REP', 'BTC') > this.maxValue)
    )
      return 'greaterThanMax';
    return 'noErrors';
  }

  setNetwork(network) {
    this.network = network;
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
        if (
          /*prop !== value.symbol &&*/
          disabledPairing(this.currencies, value.symbol, prop, 'from')
        ) {
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
    swapDetails.dataForInitialization = await this.buildOrder(swapDetails);
    swapDetails.providerReceives =
      swapDetails.dataForInitialization.input.amount;
    swapDetails.providerSends = swapDetails.dataForInitialization.output.amount;
    swapDetails.parsed = BitySwap.parseOrder(swapDetails.dataForInitialization);
    swapDetails.providerAddress =
      swapDetails.dataForInitialization.payment_address;
    swapDetails.isDex = BitySwap.isDex();
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

  static async getOrderStatus(noticeDetails) {
    const data = await getStatus(noticeDetails.orderId);
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
  }
}
