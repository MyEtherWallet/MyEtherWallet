import BigNumber from 'bignumber.js';

import { ERC20, networkSymbols, EthereumTokens } from '../partnersConfig';

import { ChangellyCurrencies, TIME_SWAP_VALID, PROVIDER_NAME } from './config';
import oneInchCalls from './oneInch-calls';
import { Toast } from '@/helpers';

import debug from 'debug';
import { utils } from '@/partners';

const errorLogger = debug('v5:partners-dexag');

export default class OneInch {
  constructor(props = {}) {
    this.name = OneInch.getName();
    this.baseCurrency = 'ETH';
    this.network = props.network || networkSymbols.ETH;
    this.EthereumTokens = EthereumTokens;
    this.getRateForUnit =
      typeof props.getRateForUnit === 'boolean' ? props.getRateForUnit : false;
    this.hasRates = 0;
    this.currencyDetails = props.currencies || ChangellyCurrencies;
    this.useFixed = true;
    this.tokenDetails = {};
    this.web3 = props.web3;
    this.tokenUpdate = props.tokenUpdate;
    this.approvalGasLimit = 100000;
    this.tradeGasLimitBase = 1000000;
    this.getSupportedDexes();
    this.getSupportedCurrencies(this.network);
    this.platformGasPrice = props.gasPrice || -1;
  }

  static getName() {
    return PROVIDER_NAME;
  }

  static isDex() {
    return true;
  }

  updateGasPrice(price) {
    this.platformGasPrice = price;
  }

  async getSupportedDexes() {
    this.EXCLUDED_DEXES = ['DEX_AG'];
  }

  async getSupportedCurrencies() {
    try {
      const {
        currencyDetails,
        tokenDetails
      } = await oneInchCalls.getSupportedCurrencies(this.network);
      this.currencyDetails = currencyDetails;
      this.tokenDetails = tokenDetails;
      this.tokenUpdate(tokenDetails);
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
    if (this.isValidNetwork) {
      return this.currencies[fromCurrency] && this.currencies[toCurrency];
    }
    return false;
  }

  calculateRate(inVal, outVal) {
    return new BigNumber(outVal).div(inVal);
  }

  async getRate(fromCurrency, toCurrency, fromValue) {
    return new Promise(resolve => {
      const wrapGetRate = async () => {
        try {
          const vals = await oneInchCalls.getPrice(
            this.getTokenAddress(fromCurrency),
            this.getTokenAddress(toCurrency),
            fromValue
          );
          resolve(
            vals.quotes.map(val => {
              const notExcluded = !this.EXCLUDED_DEXES.includes(val.dex);
              const bnRate = new BigNumber(val.amount)
                .div(fromValue)
                .toNumber();
              return {
                fromCurrency,
                toCurrency,
                provider:
                  val.exchange === 'one_inch' ? 'oneInch' : val.exchange,
                rate: notExcluded ? bnRate : 0,
                additional: { source: 'oneInch' }
              };
            })
          );
        } catch (e) {
          resolve({
            fromCurrency,
            toCurrency,
            provider: this.name,
            rate: -1
          });
        }
      };
      wrapGetRate();
    });
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

  async approve(tokenAddress, spender, fromValueWei, higherGasLimit = false) {
    try {
      const methodObject = new this.web3.eth.Contract(
        ERC20,
        tokenAddress
      ).methods.approve(spender, fromValueWei);
      const values = {
        to: tokenAddress,
        value: 0,
        data: methodObject.encodeABI()
      };
      if (higherGasLimit) {
        values.gas = this.approvalGasLimit;
      }
      return values;
    } catch (e) {
      errorLogger(e);
    }
  }

  async prepareApprovals(fromAddress, providerAddress, fromCurrency, metadata) {
    const isTokenApprovalNeeded = async (fromToken, fromAddress) => {
      if (fromToken === this.baseCurrency)
        return { approve: false, reset: false };

      const currentAllowance = await new this.web3.eth.Contract(
        ERC20,
        this.getTokenAddress(fromCurrency)
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
    if (approve && reset) {
      return new Set(
        await Promise.all([
          await this.approve(fromAddress, providerAddress, 0),
          await this.approve(
            fromAddress,
            providerAddress,
            metadata.input.amount,
            true
          )
        ])
      );
    } else if (approve) {
      return new Set([
        await this.approve(fromAddress, providerAddress, metadata.input.amount)
      ]);
    }
    return new Set();
  }

  async generateDataForTransactions(
    providerAddress,
    swapDetails,
    tradeDetails
  ) {
    try {
      const preparedTradeTxs = new Set(tradeDetails.transactions);
      if (preparedTradeTxs.size > 0) {
        const preparedAry = Array.from(preparedTradeTxs);
        const result = await oneInchCalls.estimateGas(
          preparedAry,
          swapDetails.fromAddress
        );

        if (!result) {
          throw Error('abort');
        }
        const swapTransactions = preparedAry.map((entry, index) => {
          entry.gas = result[index];
          return entry;
        });

        return [...swapTransactions];
      }

      const swapTransactions = Array.from(preparedTradeTxs);
      return [...swapTransactions];
    } catch (e) {
      errorLogger(e);
      throw e;
    }
  }

  async startSwap(swapDetails) {
    swapDetails.maybeToken = true;

    const tradeDetails = await this.createTransaction(swapDetails);

    if (!tradeDetails) {
      throw Error('abort');
    } else if (tradeDetails.error) {
      Toast.responseHandler(tradeDetails.error, 1);
      throw Error('abort');
    }

    const providerAddress =
      tradeDetails.transactions.length > 1
        ? tradeDetails.transactions[1].to
        : tradeDetails.transactions[0].to;

    swapDetails.dataForInitialization = await this.generateDataForTransactions(
      providerAddress,
      { ...swapDetails },
      tradeDetails
    );

    swapDetails.isExitToFiat = false;
    swapDetails.providerReceives = swapDetails.fromValue;
    swapDetails.providerSends = tradeDetails.quote.amount;
    swapDetails.providerAddress = providerAddress;

    swapDetails.parsed = {
      sendToAddress: swapDetails.providerAddress,
      status: 'pending',
      validFor: TIME_SWAP_VALID,
      timestamp: new Date(Date.now()).toISOString()
    };
    swapDetails.isDex = OneInch.isDex();
    return swapDetails;
  }

  static async getOrderStatus() {
    return 'pending';
  }

  async createTransaction(swapDetails, dexToUse) {
    (swapDetails.fromTokenAddress = this.getTokenAddress(
      swapDetails.fromCurrency
    )),
      (swapDetails.toTokenAddress = this.getTokenAddress(
        swapDetails.toCurrency
      )),
      (swapDetails.fromAmountBase = this.convertToTokenWei(
        swapDetails.fromCurrency,
        swapDetails.fromValue
      ));
    swapDetails.toAmountBase = this.convertToTokenWei(
      swapDetails.toCurrency,
      swapDetails.toValue
    );
    return oneInchCalls.createTransaction({ dex: dexToUse, ...swapDetails });
  }

  getTokenAddress(token) {
    try {
      if (utils.stringEqual(networkSymbols.ETH, token)) {
        return this.EthereumTokens[token].contractAddress
          ? this.EthereumTokens[token].contractAddress
          : this.tokenDetails[token].address;
      }
      return this.web3.utils.toChecksumAddress(
        this.EthereumTokens[token].contractAddress
      );
    } catch (e) {
      errorLogger(e);
      throw Error(`Token [${token}] not included in dex.ag list of tokens`);
    }
  }

  getTokenDecimals(token) {
    try {
      return new BigNumber(
        this.EthereumTokens[token].decimals
          ? this.EthereumTokens[token].decimals
          : this.tokenDetails[token].decimals
      ).toNumber();
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
