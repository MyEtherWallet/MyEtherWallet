import BigNumber from 'bignumber.js';

import { ERC20, networkSymbols } from '../partnersConfig';
import { Toast } from '@/helpers';
import DEXAG from 'dexag-sdk';

import {
  notificationStatuses,
  ChangellyCurrencies,
  statuses,
  TIME_SWAP_VALID,
  PROVIDER_NAME
} from './config';
import dexAgCalls from './dexAg-calls';
import changellyApi from './dexAg-api';

import debug from 'debug';
import { kyberBaseCurrency } from '@/partners/kyber/config';
import { utils } from '@/partners';

const errorLogger = debug('v5:partners-changelly');

const disabled = ['USDT'];
console.log(DEXAG); // todo remove dev item

export default class DexAg {
  constructor(props = {}) {
    this.name = DexAg.getName();
    this.baseCurrency = 'ETH';
    console.log(DEXAG.fromProvider); // todo remove dev item
    this.sdk = DEXAG.fromProvider(props.web3.currentProvider);
    this.network = props.network || networkSymbols.ETH;
    this.getRateForUnit =
      typeof props.getRateForUnit === 'boolean' ? props.getRateForUnit : false;
    this.hasRates = 0;
    this.currencyDetails = props.currencies || ChangellyCurrencies;
    this.useFixed = true;
    this.tokenDetails = {};
    this.web3 = props.web3;
    this.getSupportedCurrencies(this.network);
  }

  static getName() {
    return PROVIDER_NAME;
  }

  getApiConnector(type) {
    if (type === 'api') {
      return changellyApi;
    }
    return dexAgCalls;
  }

  static isDex() {
    return true;
  }

  async getSupportedCurrencies() {
    try {
      const {
        currencyDetails,
        tokenDetails
      } = await changellyApi.getSupportedCurrencies(this.network);
      this.currencyDetails = currencyDetails;
      this.tokenDetails = tokenDetails;
      this.hasRates =
        Object.keys(this.tokenDetails).length > 0 ? this.hasRates + 1 : 0;
    } catch (e) {
      errorLogger(e);
    }
  }

  get ratesRetrieved() {
    return Object.keys(this.tokenDetails).length > 0 && this.hasRates > 0;
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
    return {};
  }

  validSwap(fromCurrency, toCurrency) {
    if (disabled.includes(fromCurrency) || disabled.includes(toCurrency)) {
      return false;
    }
    if (this.isValidNetwork) {
      return this.currencies[fromCurrency] && this.currencies[toCurrency];
    }
    return false;
  }

  fixedEnabled(currency) {
    return (
      typeof this.currencies[currency].fixRateEnabled === 'boolean' &&
      this.currencies[currency].fixRateEnabled
    );
  }

  calculateRate(inVal, outVal) {
    return new BigNumber(outVal).div(inVal);
  }

  // could make it as a multi-provider that takes a setup param and then uses that
  // should change this to be able to return multiple without changing the structure too much
  async getRate(fromCurrency, toCurrency, fromValue) {
    return new Promise(async resolve => {
      const vals = await this.sdk.getPrice({
        to: toCurrency,
        from: fromCurrency,
        fromAmount: fromValue,
        dex: 'all'
      });

      console.log(vals); // todo remove dev item
      // const rate = this.calculateRate(fromValue, vals.metadata.source.price);

      resolve(
        vals.map(val => {
          return {
            fromCurrency,
            toCurrency,
            provider: val.dex,
            rate: val.price, //this.calculateRate(fromValue, val.price),
            additional: { source: 'dexag' }
          };
        })
      );
    });
    // console.log(vals); // todo remove dev item
    // return vals;
  }

  async getRateUpdate(fromCurrency, toCurrency, fromValue, toValue, isFiat) {
    return this.getRate(fromCurrency, toCurrency, fromValue, toValue, isFiat);
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
        if (this.currencies[prop])
          collectMap.set(prop, {
            symbol: prop,
            name: this.currencies[prop].name
          });
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

  // async startSwap(swapDetails) {
  //   let details;
  //   if (+swapDetails.minValue <= +swapDetails.fromValue) {
  //     details = await this.createTransaction(swapDetails);
  //     if (!details) throw Error('abort');
  //     if (details.message) throw Error(details.message);
  //     // swapDetails.providerReceives = details.amountExpectedFrom;
  //     // swapDetails.providerSends = details.amountExpectedTo;
  //     // swapDetails.parsed = DexAg.parseOrder(details);
  //     // swapDetails.providerSends = swapDetails.parsed.recValue;
  //     // swapDetails.orderId = swapDetails.parsed.orderId;
  //     // swapDetails.providerAddress = details.payinAddress;
  //     swapDetails.dataForInitialization = details;
  //     // swapDetails.isDex = DexAg.isDex();
  //     // swapDetails.validFor = swapDetails.parsed.validFor;
  //     return swapDetails;
  //   }
  //   return Error('From amount below changelly minimum for currency pair');
  // }

  async approve(tokenAddress, spender, fromValueWei) {
    console.log('approve', tokenAddress, fromValueWei, spender); // todo remove dev item
    let transferGasEst;
    try {
      const methodObject = new this.web3.eth.Contract(
        ERC20,
        tokenAddress
      ).methods.approve(spender, fromValueWei);
      console.log('methodObject', methodObject); // todo remove dev item
      return {

        to: tokenAddress,
        value: 0,
        data: methodObject.encodeABI()
      };
    } catch (e) {
      console.log(e); // todo remove dev item
      errorLogger(e);
    }
  }

  async prepareApprovals(fromAddress, providerAddress, fromCurrency, metadata) {
    let userCap = true;
    console.log(fromAddress, providerAddress, fromCurrency, metadata); // todo remove dev item
    const isTokenApprovalNeeded = async (
      fromToken,
      fromAddress
    ) => {
      if (fromToken === this.baseCurrency)
        return { approve: false, reset: false };

      const currentAllowance = await new this.web3.eth.Contract(
        ERC20,
        metadata.input.address // this.getTokenAddress(fromToken)
      ).methods
        .allowance(fromAddress, providerAddress)
        .call();

      if (new BigNumber(currentAllowance).gt(new BigNumber(0))) {
        if (
          new BigNumber(currentAllowance)
            .minus(new BigNumber(metadata.input.amount))
            .lt(new BigNumber(0))
        ) {
          return { approve: true, reset: true };
        }
        return { approve: false, reset: false };
      }
      return { approve: true, reset: false };
    };

    const { approve, reset } = await isTokenApprovalNeeded(
      fromCurrency,
      fromAddress
    );
    console.log(approve, reset); // todo remove dev item
    if (approve && reset) {
      /*
      .input.spender
      * */
      return new Set(await Promise.all([
        await this.approve(metadata.input.address, 0, providerAddress),
        await this.approve(
          metadata.input.address,
          metadata.input.amount,
          providerAddress
        )
      ]));
    } else if (approve) {
      return new Set([
        await this.approve(
          metadata.input.address,
          providerAddress,
          metadata.input.amount
        )
      ]);
    }
    return new Set();
    // const reason = !userCap ? 'user cap value' : 'current token balance';
    // const errorMessage = `User is not eligible to use kyber network. Current swap value exceeds ${reason}`;
    // throw Error(errorMessage);
  }

  async generateDataForTransactions(providerAddress, tradeDetails, swapDetails) {
    try {


      // const preparedTradeTxs = await this.prepareApprovals(
      //   swapDetails.fromAddress,
      //   providerAddress,
      //   swapDetails.fromCurrency,
      //   tradeDetails.metadata
      // );

      const preparedTradeTxs = new Set();
      preparedTradeTxs.add({gas: 1000000, ...tradeDetails.trade});
      console.log(tradeDetails, 'gets here'); // todo remove dev item
      console.log(preparedTradeTxs, 'preparedTradeTxs'); // todo remove dev item

      const swapTransactions = Array.from(preparedTradeTxs).reverse();
      console.log(swapTransactions, 'swapTransactions'); // todo remove dev item

      return [...swapTransactions];
    } catch (e) {
      console.log(e); // todo remove dev item
      errorLogger(e);
      throw e;
    }
  }

  async startSwap(swapDetails) {
    swapDetails.maybeToken = true;
    console.log(swapDetails, 'its this right?'); // todo remove dev item
    const supported = [
      'uniswap',
      'bancor',
      'kyber',
      'radar-relay',
      'oasis',
      'synthetix'
    ];
    const dexToUse = supported.includes(swapDetails.provider)
      ? swapDetails.provider
      : 'ag';
    // console.log(await this.createTransaction(swapDetails, dexToUse)); // todo remove dev item
    // const tradeDetails = await this.sdk.getTrade({
    //   to: swapDetails.toCurrency,
    //   from: swapDetails.fromCurrency,
    //   toAmount: swapDetails.toValue,
    //   dex: dexToUse
    // });

    const tradeDetails = await this.createTransaction(swapDetails, dexToUse);
    console.log(tradeDetails, 'tradeDetails'); // todo remove dev item
    const providerAddress = tradeDetails.metadata.input ? tradeDetails.metadata.input.spender ? tradeDetails.metadata.input.spender : tradeDetails.trade.to  : tradeDetails.trade.to;
    console.log('providerAddress, tradeDetails, {...swapDetails}', providerAddress, tradeDetails, {...swapDetails}); // todo remove dev item
    swapDetails.dataForInitialization = await this.generateDataForTransactions(providerAddress, tradeDetails, {...swapDetails});
    console.log(swapDetails, 'swapDetails.dataForInitialization'); // todo remove dev item
    // swapDetails.toValue = new BigNumber(finalRate).times(
    //   new BigNumber(swapDetails.fromValue).toFixed(18).toString()
    // );
    //
    // swapDetails.finalRate = this.calculateNormalizedExchangeRate(
    //   swapDetails.toValue,
    //   swapDetails.fromValue
    // );
    swapDetails.isExitToFiat = false;
    swapDetails.providerReceives = swapDetails.fromValue;
    swapDetails.providerSends = tradeDetails.metadata.query.toAmount;
    swapDetails.providerAddress = providerAddress;

    swapDetails.parsed = {
      sendToAddress: swapDetails.providerAddress,
      status: 'pending',
      validFor: TIME_SWAP_VALID
    };
    swapDetails.isDex = DexAg.isDex();
    console.log(swapDetails, 'return'); // todo remove dev item

    return swapDetails;
  }

  async createTransaction(swapDetails, dexToUse) {
    return dexAgCalls.createTransaction({dex: dexToUse, ...swapDetails})
  }

  static parseOrder(order) {
    return {
      orderId: order.id,
      statusId: order.id,
      sendToAddress: order.payinAddress,
      recValue: order.amountExpectedTo,
      sendValue: order.amountExpectedFrom,
      status: order.status,
      timestamp: order.createdAt,
      validFor: TIME_SWAP_VALID // Rates provided are only an estimate
    };
  }

  static async getOrderStatus(noticeDetails, network) {
    try {
      const status = await dexAgCalls.getStatus(
        noticeDetails.statusId,
        network
      );
      return DexAg.parseChangellyStatus(status);
    } catch (e) {
      Toast.responseHandler(e, false);
    }
  }

  static parseChangellyStatus(status) {
    switch (status) {
      case statuses.new:
        return notificationStatuses.NEW;
      case statuses.waiting:
        return notificationStatuses.SENT;
      case statuses.confirming:
      case statuses.exchanging:
      case statuses.sending:
      case statuses.hold:
        return notificationStatuses.PENDING;
      case statuses.finished:
        return notificationStatuses.COMPLETE;
      case statuses.failed:
        return notificationStatuses.FAILED;
      case statuses.overdue:
      case statuses.refunded:
        return notificationStatuses.CANCELLED;
    }
  }

  async validateAddress(toCurrency, address) {
    return await dexAgCalls.validateAddress(
      {
        currency: toCurrency,
        address: address
      },
      this.network
    );
  }

  getTokenAddress(token) {
    try {
      if (utils.stringEqual(networkSymbols.ETH, token)) {
        return this.currencies[token].contractAddress;
      }
      return this.web3.utils.toChecksumAddress(
        this.currencies[token].contractAddress
      );
    } catch (e) {
      errorLogger(e);
      throw Error(`Token [${token}] not included in dex.ag list of tokens`);
    }
  }

  getTokenDecimals(token) {
    try {
      return new BigNumber(this.currencies[token].decimals).toNumber();
    } catch (e) {
      errorLogger(e);
      throw Error(
        `Token [${token}] not included in dex.ag network list of tokens`
      );
    }
  }

  convertToTokenBase(token, value) {
    const decimals = this.getTokenDecimals(token);
    const denominator = new BigNumber(10).pow(decimals);
    return new BigNumber(value).div(denominator).toString(10);
  }

  convertToTokenWei(token, value) {
    const decimals = this.getTokenDecimals(token);
    const denominator = new BigNumber(10).pow(decimals);
    return new BigNumber(value)
      .times(denominator)
      .integerValue(BigNumber.ROUND_DOWN)
      .toString(10);
  }
}
