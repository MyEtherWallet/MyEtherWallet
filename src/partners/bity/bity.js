import { networkSymbols, BASE_CURRENCY } from '../partnersConfig';
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
    this.currentOrderStatus = ''; // temporary placeholder variable
    this.rates = new Map();

    this.retrieveRates();
  }

  static getName() {
    return PROVIDER_NAME;
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
        if (this.mainPairs.indexOf(pair.pair.substring(3)) !== -1) {
          if (pair.is_enabled && !this.fiatCurrencies.includes(pair.source)) {
            this.rates.set(
              `${pair.source}/${pair.target}`,
              parseFloat(pair.rate_we_sell)
            );
          }
        } else if (this.mainPairs.indexOf(pair.pair.substring(0, 3)) !== -1) {
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
      maxValue: this.maxValue // TODO provide better identification and notice of min/max for user
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
        if (
          prop !== value.symbol &&
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
    swapDetails.dataForInitialization = await this.buildOrder(
      swapDetails.fromCurrency === BASE_CURRENCY,
      swapDetails
    );
    swapDetails.providerReceives =
      swapDetails.dataForInitialization.input.amount;
    swapDetails.providerSends = swapDetails.dataForInitialization.output.amount;
    swapDetails.parsed = BitySwap.parseOrder(swapDetails.dataForInitialization);
    swapDetails.providerAddress =
      swapDetails.dataForInitialization.payment_address;
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

      const bityOrder = await openOrder(order);

      if (!bityOrder.error) {
        return bityOrder.data;
      }
      throw Error('error creating bity order');
    }
  }

  // ================= Check status of order methods ===================================

  static parseOrder(order) {
    return {
      orderId: order.id,
      statusId: order.reference,
      sendToAddress: order.payment_address,
      recValue: order.output.amount,
      sendValue: order.input.amount,
      status: order.status,
      timestamp: order.timestamp_created,
      validFor: order.validFor || TIME_SWAP_VALID
    };
  }

  static async getOrderStatus(noticeDetails) {
    const data = await getStatus({ orderid: noticeDetails.statusId });
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
  }
}
