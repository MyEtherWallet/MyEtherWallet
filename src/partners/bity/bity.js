import { networkSymbols } from '../config';
import { getRates, openOrder, getStatus, login } from './call';
import { BityCurrencies } from './config';

// ** NOTE this still needs work
export default class BitySwap {
  constructor(props = {}) {
    this.name = BitySwap.getName();
    this.network = props.network || networkSymbols.ETH;
    this.SERVERURL = 'https://bity.myetherapi.com';
    this.BITYRATEAPI = 'https://bity.com/api/v1/rate2/';
    this.decimals = 6;
    this.hasRates = 0;
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

  static getName() {
    return 'bity';
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

  static async getOrderStatus(swapDetails) {
    return await getStatus(swapDetails.dataForInitialization);
  }

  statusUpdater(/*swapDetails*/) {
    return () => {
      // let currentStatus;
      // // const calculateTimeRemaining = (validFor, timestamp) => {
      // //   return (
      // //     validFor -
      // //     parseInt(
      // //       (new Date().getTime() - new Date(timestamp).getTime()) / 1000
      // //     )
      // //   );
      // // };
      // const parsed = BitySwap.parseOrder(swapDetails.dataForInitialization);
      // // let timeRemaining = calculateTimeRemaining(
      // //   parsed.validFor,
      // //   parsed.timestamp
      // // );
      // let checkStatus = setInterval(async () => {
      //   currentStatus = await getStatus({
      //     orderid: parsed.orderId
      //   });
      //   clearInterval(checkStatus);
      // }, 1000);
    };
  }

  // TODO: just use the numbers instead of an intermediate conversion key
  static statuses(data, priorStatus) {
    const validStatus = ['RCVE', 'FILL', 'CONF', 'EXEC'];
    const invalidStatus = ['CANC'];
    const convertStatuses = {
      [1]: 'OPEN',
      [2]: 'RCVE',
      [10]: 'CONF',
      [0]: 'FILL',
      [-1]: 'CANC'
    };
    if (validStatus.includes(data.status)) {
      priorStatus = 'RCVE';
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
  }

  get validNetwork() {
    return this.network === networkSymbols.ETH;
  }

  get currencies() {
    if (this.validNetworkH) {
      return BityCurrencies;
    }
    return {};
  }

  validSwap(fromCurrency, toCurrency) {
    if (this.validNetwork) {
      return this.rates.has(`${fromCurrency}/${toCurrency}`);
    }
    return false;
  }

  async createSwap(swapDetails) {
    return await this.buildOrder(
      swapDetails.fromCurrency,
      swapDetails.toCurrency,
      swapDetails.fromValue,
      swapDetails.toValue,
      swapDetails.rate,
      swapDetails.toAddress,
      swapDetails.fromCurrency === 'ETH'
    );
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
        fromValue * this.getRate(toCurrency, fromCurrency) > this.maxValue);
    const overMaxREP =
      (toCurrency === 'REP' && toValue > this.maxValue) ||
      (fromCurrency === 'REP' &&
        fromValue * this.getRate(fromCurrency, toCurrency) > this.maxValue);
    if (toCurrency === 'BTC' && overMax) {
      // return true;
      return false;
    } else if (toCurrency === 'ETH' && overMaxETH) {
      return false;
      // return true;
    } else if (toCurrency === 'REP' && overMaxREP) {
      return false;
      // return true;
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
    this.hasRates = data.length > 0 ? this.hasRates + 1 : 0;
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

  async buildOrder(
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

      const bityOrder = await this.openOrder(order);
      /*
        amount: 1
        amount_mode: 0
        id: "6d46713d03446f7b8b4262bf98961960514927bf0fa6ec6a71fb5c8a5fac8bdadbe4c0c36d3ae9a0d767715e55b45898tuHefEaeNklK1GVmeEw/FQ=="
        input: {
          amount: "1.00000000"
          currency: "ETH"
          reference: "bity.com 4BV8-ACNT"
          status: "OPEN"
        },
        output: {
          amount: "0.03100900"
          currency: "BTC"
          reference: ""
          status: "OPEN"
        },
        pair: "ETHBTC"
        payment_address: "0x243e980b527d9d1c60d0d162dc53730c88ee587b"
        payment_amount: "1"
        reference: "bity.com 4BV8-ACNT"
        status: "OPEN"
        timestamp_created: "2018-10-17T20:36:49.934971Z"
        validFor: 600
      * */
      if (!bityOrder.error) {
        return bityOrder.data;
      }
      throw Error('error creating bity order');
    }
  }
  /*
*       $scope.bity.openOrder(order, function (data) {
        if (!data.error) {
          $scope.orderResult = data.data;
          $scope.orderResult.swapOrder = $scope.swapOrder;
          var orderResult = $scope.orderResult;
          saveOrderToStorage(orderResult);
          processOrder();
        } else $scope.notifier.danger(data.msg);
        if (!$scope.$$phase) $scope.$apply();
      });
      */
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

  openOrder(orderInfo) {
    return openOrder(orderInfo);
  }

  // getStatus(orderInfo) {
  //   return getStatus(orderInfo);
  // }

  requireLogin(callback) {
    if (this.token) callback();
    else login(callback);
  }
}
