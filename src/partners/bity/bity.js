import { networkSymbols } from '../partnersConfig';
import { getRates, openOrder, getStatus } from './bity-calls';
import { BityCurrencies, providerName } from './config';

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
    this.decimals = 6;
    this.hasRates = 0;
    this.validStatus = ['RCVE', 'FILL', 'CONF', 'EXEC'];
    this.invalidStatus = ['CANC'];
    this.mainPairs = ['REP', 'ETH'];
    this.minValue = 0.01;
    this.maxValue = 3;
    this.fiatCurrencies = ['CHF', 'USD', 'EUR'];
    this.currentOrderStatus = ''; // temporary placeholder variable
    this.rates = new Map();

    this.retrieveRates();
  }

  static getName() {
    return providerName;
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
      swapDetails.fromCurrency === 'ETH',
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

  getStatus(id) {
    getStatus({
      orderid: id
    }).then(this.updateStatus);
  }

  updateStatus(data) {
    return new Promise(resolve => {
      if (this.validStatus.indexOf(data.status) !== -1) {
        this.currentOrderStatus = 'RCVE';
        resolve({ status: 'RCVE', completed: false }); // order finalized: false
      }
      if (
        this.currentOrderStatus === 'OPEN' &&
        this.validStatus.indexOf(data.input.status) !== -1
      ) {
        this.currentOrderStatus = 'RCVE';
        resolve({ status: 'RCVE', completed: false }); // order finalized: false
      } else if (
        this.currentOrderStatus === 'RCVE' &&
        this.validStatus.indexOf(data.output.status) !== -1
      ) {
        this.currentOrderStatus = 'FILL';
        resolve({ status: 'FILL', completed: true }); // order finalized: true
      } else if (this.invalidStatus.indexOf(data.status) !== -1) {
        this.currentOrderStatus = 'CANC';
        resolve({ status: 'CANC', completed: true }); // order finalized: true
      }
    });
  }

  static parseOrder(order) {
    return {
      orderId: order.id,
      statusId: order.reference,
      sendToAddress: order.payment_address,
      recValue: order.output.amount,
      sendValue: order.input.amount,
      status: order.status,
      timestamp: order.timestamp_created,
      validFor: order.validFor
    };
  }

  static async getOrderStatus(swapDetails, priorStatus) {
    let data = await getStatus(swapDetails.dataForInitialization);
    const validStatus = ['RCVE', 'FILL', 'CONF', 'EXEC'];
    const invalidStatus = ['CANC'];
    const convertStatuses = {
      [1]: 'OPEN',
      [2]: 'RCVE',
      [10]: 'CONF',
      [0]: 'FILL',
      [-1]: 'CANC'
    };
    if (data.status === undefined) data = { input: {}, output: {} };
    if (validStatus.includes(data.status)) {
      return 2;
      // priorStatus = 'RCVE';
    }
    if (data.status === 'OPEN') {
      return 1;
    } else if (
      convertStatuses[priorStatus] === 'OPEN' &&
      validStatus.includes(data.input.status)
    ) {
      return 2;
    } else if (
      convertStatuses[priorStatus] === 'RCVE' &&
      validStatus.includes(data.output.status)
    ) {
      return 0;
    } else if (invalidStatus.includes(data.status)) {
      return -1;
    }
    return 1;
  }
}
