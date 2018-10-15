import { networkSymbols } from '../config';
import { getRates, openOrder, getStatus, login } from './call';
import { BityCurrencies } from './config';

// ** NOTE this still needs work
export default class BitySwap {
  constructor(props = {}) {
    this.name = 'bity';
    this.network = props.network || networkSymbols.ETH;
    this.SERVERURL = 'https://bity.myetherapi.com';
    this.BITYRATEAPI = 'https://bity.com/api/v1/rate2/';
    this.decimals = 6;
    this.hasRates = false;
    this.ethExplorer = 'https://etherscan.io/tx/[[txHash]]';
    this.btcExplorer = 'https://blockchain.info/tx/[[txHash]]';
    this.validStatus = ['RCVE', 'FILL', 'CONF', 'EXEC'];
    this.invalidStatus = ['CANC'];
    this.mainPairs = ['REP', 'ETH'];
    this.minValue = 0.01;
    this.maxValue = 3;
    this.currentRates = [];
    this.fiatCurrencies = ['CHF', 'USD', 'EUR'];
    this.allAvailable = [];
    this.currentOrderStatus = ''; // temporary placeholder variable
    this.currentOrder = {}; // temporary placeholder variable
    this.rates = new Map();

    this.retrieveRates();

    // setInterval(()=>{
    //   this.retrieveRates();
    // }, 3000)
  }

  get currencies() {
    if (this.network === networkSymbols.ETH) {
      return BityCurrencies;
    }
    return {};
  }

  validSwap(fromCurrency, toCurrency) {
    return this.rates.has(`${fromCurrency}/${toCurrency}`);
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
        fromValue * this.getRate(fromCurrency, toCurrency) > this.maxValue);
    const overMaxREP =
      (toCurrency === 'REP' && toValue > this.maxValue) ||
      (fromCurrency === 'REP' &&
        fromValue * this.getRate(fromCurrency, toCurrency) > this.maxValue);
    if (overMax) {
      return false;
    } else if (overMaxETH) {
      return false;
    } else if (overMaxREP) {
      return false;
    }
    return true;
  }

  inValidNetwork() {
    return this.network !== networkSymbols.ETH;
  }

  async retrieveRates() {
    if (this.inValidNetwork()) return;
    const rates = await getRates().catch(err => {
      return err;
    });
    const data = rates.objects;
    data.forEach(pair => {
      if (this.mainPairs.indexOf(pair.pair.substring(3)) !== -1) {
        if (pair.is_enabled && !this.fiatCurrencies.includes(pair.source)) {
          this.addRateEntry(
            pair.pair,
            pair.source,
            pair.target,
            parseFloat(pair.rate_we_sell)
          );
        }
      } else if (this.mainPairs.indexOf(pair.pair.substring(0, 3)) !== -1) {
        if (pair.is_enabled && !this.fiatCurrencies.includes(pair.source)) {
          this.addRateEntry(
            pair.pair,
            pair.source,
            pair.target,
            parseFloat(pair.rate_we_buy)
          );
        }
      }
    });
    this.hasRates = true;
  }

  getRate(fromToken, toToken) {
    if (this.rates.has(`${fromToken}/${toToken}`)) {
      return this.rates.get(`${fromToken}/${toToken}`);
    }
    return -1;
  }

  addRateEntry(pair, from, to, rate) {
    this.rates.set(`${from}/${to}`, rate);
  }

  buildOrder() {
    // finalize order, update estimate, etc.
  }

  submitOrder(
    fromToken,
    toToken,
    fromValue,
    toValue,
    rate,
    userAddress,
    isFrom
  ) {
    if (
      this.minCheck(fromToken, fromValue, toToken, toValue) &&
      this.maxCheck(fromToken, fromValue, toToken, toValue)
    ) {
      const order = {
        amount: fromValue,
        mode: isFrom ? 0 : 1, // check how I should handle this now
        pair: fromToken + toToken,
        destAddress: userAddress
      };

      return this.openOrder(order).then(data => {
        this.currentOrder = data;
        this.currentOrder.swapOrder = {
          fromCoin: fromToken,
          toCoin: toToken,
          isFrom: isFrom,
          fromVal: fromValue,
          toVal: toValue,
          toAddress: userAddress,
          swapRate: rate,
          swapPair: fromToken + toToken
        };
        return this.currentOrder;
      });
    }
  }

  processOrder(id) {
    this.getStatus({
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

  openOrder(orderInfo) {
    return openOrder(orderInfo);
  }

  getStatus(orderInfo) {
    return getStatus(orderInfo);
  }

  requireLogin(callback) {
    if (this.token) callback();
    else login(callback);
  }
}
