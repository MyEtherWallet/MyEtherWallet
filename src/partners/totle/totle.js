import debugLogger from 'debug';
import BigNumber from 'bignumber.js';
import { utils } from '../helpers';
import { networkSymbols } from '../partnersConfig';
import {
  PROVIDER_NAME,
  TIME_SWAP_VALID,
  TotleCurrencies,
  FEE_RATE
} from './config';
import totleCalls from './totle-calls';

const logger = debugLogger('v5:totle-swap');
const errorLogger = debugLogger('v5-error:totle');

export default class Totle {
  constructor(props = {}) {
    this.name = Totle.getName();
    this.network = props.network || networkSymbols.ETH;
    this.getRateForUnit =
      typeof props.getRateForUnit === 'boolean' ? props.getRateForUnit : false;
    this.hasRates = 0;
    this.tokenDetails = {};
    this.setDefaultCurrencyList();
    this.getSupportedTokenList();
    this.web3 = props.web3;
  }

  // Static Informational
  static getName() {
    return PROVIDER_NAME;
  }

  static isDex() {
    return false;
  }

  // Getters
  get defaultCurrencyList() {
    return TotleCurrencies[this.network];
  }

  get currencies() {
    if (this.isValidNetwork && this.tokenDetails !== undefined) {
      if (Object.keys(this.tokenDetails).length > 5) {
        return this.tokenDetails;
      }
      return this.defaultCurrencyList;
    } else if (this.isValidNetwork) {
      return this.defaultCurrencyList;
    }
    return {};
  }

  get isValidNetwork() {
    return this.network === networkSymbols.ETH;
  }

  setNetwork(network) {
    this.network = network;
  }

  getNetwork() {
    return this.network;
  }

  setDefaultCurrencyList(fromConstructor) {
    if (fromConstructor) {
      this.tokenDetails = fromConstructor;
    } else if (TotleCurrencies[this.network]) {
      this.tokenDetails = this.defaultCurrencyList;
    }
  }

  async getSupportedTokenList() {
    try {
      await this.retrieveSupportedTokenList(this.network);
      this.hasRates =
        Object.keys(this.tokenDetails).length > 0 ? this.hasRates + 1 : 0;
    } catch (e) {
      errorLogger(e);
    }
  }

  // API Call
  async retrieveSupportedTokenList(network) {
    try {
      const { tokens } = await totleCalls.getTokenList(network);
      logger('Tokens', tokens);
      const tradableTokens = tokens.filter(token => token.tradable === true);
      const tokenDetails = {};
      for (let i = 0; i < tradableTokens.length; i++) {
        if (
          tradableTokens[i].symbol &&
          tradableTokens[i].name &&
          tradableTokens[i].decimals &&
          tradableTokens[i].address
        ) {
          // otherwise the entry is invalid
          const symbol = tradableTokens[i].symbol.toUpperCase();
          tokenDetails[symbol] = {
            symbol: tradableTokens[i].symbol,
            name: tradableTokens[i].name,
            decimals: tradableTokens[i].decimals,
            contractAddress: tradableTokens[i].address
          };
          this.tokenDetails[symbol] = {
            symbol: tradableTokens[i].symbol,
            name: tradableTokens[i].name,
            decimals: tradableTokens[i].decimals,
            contractAddress: tradableTokens[i].address
          };
        }
      }
      return tokenDetails;
    } catch (e) {
      utils.handleOrThrow(e);
      errorLogger(e);
    }
  }

  validSwap(fromCurrency, toCurrency) {
    if (this.isValidNetwork) {
      if (!this.currencies) return false;
      return this.currencies[fromCurrency] && this.currencies[toCurrency];
    }
  }

  calculateTrueRate(topRate) {
    return new BigNumber(topRate)
      .minus(new BigNumber(topRate).times(new BigNumber(FEE_RATE)))
      .toNumber();
  }

  async getRate(fromCurrency, toCurrency, fromValue) {
    const rate = await this.getExpectedRateInTokens(
      fromCurrency,
      toCurrency,
      this.getRateForUnit ? 1 : fromValue
    );

    return {
      fromCurrency,
      toCurrency,
      provider: this.name,
      rate: this.calculateTrueRate(rate)
    };
  }

  async getExpectedRateInTokens(fromToken, toToken, fromValue) {
    const fromWei = this.convertToTokenWei(fromToken, fromValue);
    logger(fromWei);
    const baseRate = await this.getExpectedRate(fromToken, toToken, fromWei);
    if (+baseRate > -1) {
      return baseRate;
    }
    return -1;
  }

  async getExpectedRate(fromToken, toToken, fromValueWei) {
    const { response } = await totleCalls.createOrder(
      {
        config: {
          skipBalanceChecks: true,
          transactions: false
        },
        swaps: [
          {
            sourceAsset: this.getTokenAddress(fromToken),
            destinationAsset: this.getTokenAddress(toToken),
            sourceAmount: fromValueWei
          }
        ]
      },
      this.network
    );

    if (
      !response.summary ||
      new BigNumber(response.summary[0].rate).eq(new BigNumber(0))
    ) {
      return -1;
    }
    return response.summary[0].rate;
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

  getUpdatedCurrencyEntries(value, collectMap) {
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

  getUpdatedFromCurrencyEntries(value, collectMap) {
    this.getUpdatedCurrencyEntries(value, collectMap);
  }

  getUpdatedToCurrencyEntries(value, collectMap) {
    this.getUpdatedCurrencyEntries(value, collectMap);
  }

  async startSwap(swapDetails) {
    try {
      const { response } = await totleCalls.createOrder(
        {
          address: swapDetails.fromAddress,
          swaps: [
            {
              sourceAsset: this.getTokenAddress(swapDetails.fromCurrency),
              destinationAsset: this.getTokenAddress(swapDetails.toCurrency),
              sourceAmount: this.convertToTokenWei(
                swapDetails.fromCurrency,
                swapDetails.fromValue
              ),
              destinationAddress: swapDetails.toAddress
            }
          ]
        },
        this.network
      );

      swapDetails.maybeToken = true;
      swapDetails.isDex = Totle.isDex();

      // TODO: Would be nice thing to remove the line or
      // change the name everywhere
      swapDetails.kyberMaxGas = undefined;

      if (
        !response.summary ||
        new BigNumber(response.summary[0].rate).eq(
          new BigNumber(0) || !response.transactions
        )
      ) {
        return -1;
      }
      const swapTx = response.transactions.filter(
        transaction => transaction.type === 'swap'
      );
      swapDetails.providerAddress = swapTx[0].to;

      const finalRate = response.summary[0].rate;

      swapDetails.toValue = new BigNumber(finalRate).times(
        new BigNumber(swapDetails.fromValue).toFixed(18).toString()
      );
      swapDetails.finalRate = this.calculateNormalizedExchangeRate(
        swapDetails.toValue,
        swapDetails.fromValue
      );

      swapDetails.dataForInitialization = response.transactions.map(
        ({ tx }) => {
          return {
            chainId: 1,
            data: tx.data,
            to: tx.to,
            from: tx.from,
            value: tx.value,
            gasPrice: tx.gasPrice,
            gas: tx.gas,
            nonce: tx.nonce
          };
        }
      );

      swapDetails.providerReceives = swapDetails.fromValue;
      swapDetails.providerSends = new BigNumber(finalRate).times(
        new BigNumber(swapDetails.fromValue)
      );
      swapDetails.parsed = {
        sendToAddress: swapTx.to,
        status: 'pending',
        validFor: TIME_SWAP_VALID
      };

      return swapDetails;
    } catch (e) {
      errorLogger(e);
      throw e;
    }
  }

  static async getOrderStatus() {
    return 'new';
  }

  // Helpers
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
      throw Error(`Token [${token}] not included in totle list of tokens`);
    }
  }

  getTokenDecimals(token) {
    try {
      return +this.currencies[token].decimals;
    } catch (e) {
      errorLogger(e);
      throw Error(`Token [${token}] not included in totle list of tokens`);
    }
  }

  calculateNormalizedExchangeRate(toValue, fromValue) {
    return new BigNumber(toValue).div(fromValue).toString(10);
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
