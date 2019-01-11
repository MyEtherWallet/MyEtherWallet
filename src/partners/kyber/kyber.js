import debugLogger from 'debug';
import BigNumber from 'bignumber.js';
import ENS from 'ethereum-ens';
import { utils } from '../helpers';
import { networkSymbols } from '../partnersConfig';
import kyberApi from './kyber-api';
import {
  ERC20,
  kyberBaseCurrency,
  PROVIDER_NAME,
  TIME_SWAP_VALID,
  MAX_DEST_AMOUNT,
  defaultValues,
  KyberCurrencies,
  kyberAddressFallback,
  kyberNetworkABI,
  kyberValidNetworks,
  kyberNetworkENS,
  walletDepositeAddress
} from './config';
import { statuses } from '../simplex/config';

const logger = debugLogger('v5:kyber-swap');
const errorLogger = debugLogger('v5-error:kyber');

export default class Kyber {
  constructor(props = {}) {
    this.name = Kyber.getName();
    this.network = props.network || networkSymbols.ETH;
    this.getRateForUnit =
      typeof props.getRateForUnit === 'boolean' ? props.getRateForUnit : false;
    this.hasRates = 0;
    this.tradeGasLimit = defaultValues.tradeGasLimit;
    this.tokenToTokenGasLimit = defaultValues.tokenToTokenGasLimit;
    this.tokenApprovalGas = defaultValues.tokenApprovalGasLimit;
    this.maxGasPrice = defaultValues.maxGasPrice; // 30 Gwei
    this.gasPrice = defaultValues.gasPrice; // 2 Gwei
    this.tokenDetails = {};
    this.setDefaultCurrencyList();
    this.web3 = props.web3;
    this.ens = new ENS(props.web3.currentProvider);
    this.kyberNetworkABI = kyberNetworkABI || [];
    this.kyberNetworkAddress =
      props.kyberAddress || kyberAddressFallback[this.network];
    this.rates = new Map();
    this.retrieveRates();
    this.getSupportedTokenList();
    this.getMainNetAddress(this.kyberNetworkAddress);
  }

  static getName() {
    return PROVIDER_NAME;
  }

  static isDex() {
    return true;
  }

  get currencies() {
    if (this.isValidNetwork) {
      return this.tokenDetails;
    }
    return {};
  }

  get isValidNetwork() {
    return kyberValidNetworks.includes(this.network);
  }

  getNetwork() {
    return this.network;
  }

  getAddress() {
    return this.kyberNetworkAddress;
  }

  getKyberNetworkAddress() {
    return this.kyberNetworkAddress;
  }

  async kyberNetworkState() {
    return await this.getKyberContractObject()
      .methods.enabled()
      .call();
  }

  setNetwork(network) {
    this.network = network;
    if (this.isValidNetwork) {
      this.getMainNetAddress(kyberAddressFallback[this.network]);
      this.getSupportedTokenList();
    }
  }

  setDefaultCurrencyList(fromConstructor) {
    if (fromConstructor) {
      this.tokenDetails = fromConstructor;
    } else if (KyberCurrencies[this.network]) {
      this.tokenDetails = KyberCurrencies[this.network];
    }
  }

  async retrieveRates() {
    const { rates, tokenDetails } = await kyberApi.retrieveRatesFromAPI(
      this.network,
      this.rates,
      this.tokenDetails
    );
    this.rates = rates;
    this.tokenDetails = tokenDetails;
    this.hasRates =
      Object.keys(this.tokenDetails).length > 0 ? this.hasRates + 1 : 0;
  }

  getMainNetAddress(initialAddress) {
    if (this.network === networkSymbols.ETH) {
      try {
        this.ens
          .resolver(kyberNetworkENS)
          .addr()
          .then(address => {
            this.kyberNetworkAddress = address;
          })
          .catch(() => {
            errorLogger('failed to resolve kyber network address via ENS');
          });
      } catch (e) {
        errorLogger(e);
      }
    } else {
      this.kyberNetworkAddress = initialAddress;
    }
  }

  async getSupportedTokenList() {
    try {
      this.tokenDetails = await kyberApi.getSupportedTokenList(this.network);
      this.hasRates =
        Object.keys(this.tokenDetails).length > 0 ? this.hasRates + 1 : 0;
    } catch (e) {
      errorLogger(e);
    }
  }

  getKyberContractObject() {
    return new this.web3.eth.Contract(
      this.kyberNetworkABI,
      this.kyberNetworkAddress
    );
  }

  validSwap(fromCurrency, toCurrency) {
    if (this.isValidNetwork) {
      return this.currencies[fromCurrency] && this.currencies[toCurrency];
    }
  }

  async getRate(fromCurrency, toCurrency, fromValue) {
    const rate = await this.getExpactedRateInTokens(
      fromCurrency,
      toCurrency,
      this.getRateForUnit ? 1 : fromValue
    );

    return {
      fromCurrency,
      toCurrency,
      provider: this.name,
      rate: rate
    };
  }

  async getExpectedRate(fromToken, toToken, fromValueWei) {
    const rates = await this.callKyberContract(
      'getExpectedRate',
      this.getTokenAddress(fromToken),
      this.getTokenAddress(toToken),
      fromValueWei
    );
    logger(rates);
    this.rates.set(`${fromToken}/${toToken}`, rates['expectedRate']);
    if (+rates['expectedRate'] === 0) {
      return -1;
    }
    return rates['expectedRate'];
  }

  async getExpactedRateInTokens(fromToken, toToken, fromValue) {
    const fromWei = this.convertToTokenWei(fromToken, fromValue);
    logger(fromWei);
    const inWei = await this.getExpectedRate(fromToken, toToken, fromWei);
    if (+inWei > -1) {
      return this.convertToTokenBase(kyberBaseCurrency, inWei);
    }
    return -1;
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

  getUpdatedFromCurrencyEntries(value, collectMap) {
    this.getUpdatedCurrencyEntries(value, collectMap);
  }

  getUpdatedToCurrencyEntries(value, collectMap) {
    this.getUpdatedCurrencyEntries(value, collectMap);
  }

  async callKyberContract(method, ...parameters) {
    return await this.getKyberContractObject()
      .methods[method](...parameters)
      .call();
  }

  async approveKyber(fromToken, fromValueWei) {
    let transferGasEst;
    try {
      const methodObject = new this.web3.eth.Contract(
        ERC20,
        this.getTokenAddress(fromToken)
      ).methods.approve(this.getKyberNetworkAddress(), fromValueWei);
      try {
        transferGasEst = await methodObject.estimateGas();
      } catch (e) {
        transferGasEst = undefined;
      }

      if (transferGasEst) {
        return {
          to: this.getTokenAddress(fromToken),
          value: 0,
          gas: transferGasEst,
          data: methodObject.encodeABI()
        };
      }
      return {
        to: this.getTokenAddress(fromToken),
        value: 0,
        data: methodObject.encodeABI()
      };
    } catch (e) {
      errorLogger(e);
    }
  }

  isTokenToToken(fromCurrency, toCurrency) {
    return (
      fromCurrency !== kyberBaseCurrency && toCurrency !== kyberBaseCurrency
    );
  }

  async canUserSwap({
    fromCurrency,
    toCurrency,
    fromValueWei,
    toValueWei,
    fromAddress
  }) {
    let userCap = true;

    const isTokenApprovalNeeded = async (
      fromToken,
      toToken,
      fromValueWei,
      fromAddress
    ) => {
      if (fromToken === kyberBaseCurrency)
        return { approve: false, reset: false };

      const currentAllowance = await new this.web3.eth.Contract(
        ERC20,
        this.getTokenAddress(fromToken)
      ).methods
        .allowance(fromAddress, this.getKyberNetworkAddress())
        .call();

      if (currentAllowance > 0) {
        if (currentAllowance < fromValueWei) {
          return { approve: true, reset: true };
        }
        return { approve: false, reset: false };
      }
      return { approve: true, reset: false };
    };

    if (
      fromCurrency === kyberBaseCurrency ||
      toCurrency === kyberBaseCurrency
    ) {
      userCap = new BigNumber(
        await this.callKyberContract('getUserCapInWei', fromAddress)
      )
        .times(0.95)
        .gt(
          new BigNumber(
            fromCurrency === kyberBaseCurrency ? fromValueWei : toValueWei
          )
        );
    }

    if (
      userCap &&
      new BigNumber(
        await this.callKyberContract(
          'getBalance',
          this.getTokenAddress(fromCurrency),
          fromAddress
        )
      ).gte(fromValueWei)
    ) {
      const { approve, reset } = await isTokenApprovalNeeded(
        fromCurrency,
        toCurrency,
        fromValueWei,
        fromAddress
      );
      if (approve && reset) {
        return new Set([
          await this.approveKyber(fromCurrency, 0, fromAddress),
          {
            gas: this.tokenApprovalGas,
            ...(await this.approveKyber(
              fromCurrency,
              fromValueWei,
              fromAddress
            ))
          }
        ]);
      } else if (approve) {
        return new Set([
          await this.approveKyber(fromCurrency, fromValueWei, fromAddress)
        ]);
      }
      return new Set();
    }
    const reason = !userCap ? 'user cap value' : 'current token balance';
    const errorMessage = `User is not eligible to use kyber network. Current swap value exceeds ${reason}`;
    throw Error(errorMessage);
  }

  async getTradeData(
    { fromCurrency, toCurrency, fromValueWei, toAddress },
    minRateWei
  ) {
    const data = this.getKyberContractObject()
      .methods.trade(
        await this.getTokenAddress(fromCurrency),
        fromValueWei,
        await this.getTokenAddress(toCurrency),
        toAddress,
        MAX_DEST_AMOUNT,
        minRateWei,
        walletDepositeAddress
      )
      .encodeABI();

    return {
      to: this.getKyberNetworkAddress(),
      value: Object.values(networkSymbols).includes(fromCurrency)
        ? fromValueWei
        : 0,
      gas: this.isTokenToToken(fromCurrency, toCurrency)
        ? this.tokenToTokenGasLimit
        : this.tradeGasLimit,
      data
    };
  }

  async generateDataForTransactions({
    fromCurrency,
    toCurrency,
    fromValue,
    toValue,
    fromAddress,
    toAddress
  }) {
    try {
      const fromValueWei = this.convertToTokenWei(fromCurrency, fromValue);
      const toValueWei = this.convertToTokenWei(toCurrency, toValue);
      const kyberSwapDetails = {
        fromCurrency,
        toCurrency,
        fromAddress,
        toAddress,
        fromValueWei,
        toValueWei
      };
      const finalRate = await this.getExpectedRate(
        fromCurrency,
        toCurrency,
        fromValueWei
      );
      if (finalRate === 0)
        throw Error(
          'Recieved a rate of 0. Invalid quantity.  Try swaping a lower amount.'
        );
      const prepareSwapTxData = await this.canUserSwap(kyberSwapDetails);
      prepareSwapTxData.add(
        await this.getTradeData(kyberSwapDetails, finalRate)
      );
      const swapTransactions = Array.from(prepareSwapTxData);
      return [...swapTransactions];
    } catch (e) {
      errorLogger(e);
      throw e;
    }
  }

  async startSwap(swapDetails) {
    swapDetails.maybeToken = true;
    swapDetails.providerAddress = this.getAddress();
    swapDetails.kyberMaxGas = await this.callKyberContract('maxGasPrice');
    swapDetails.dataForInitialization = await this.generateDataForTransactions(
      swapDetails
    );
    swapDetails.providerReceives = swapDetails.fromValue;
    swapDetails.providerSends = swapDetails.toValue;
    swapDetails.parsed = {
      sendToAddress: this.getKyberNetworkAddress(),
      status: 'pending',
      validFor: TIME_SWAP_VALID
    };
    swapDetails.providerAddress = this.getKyberNetworkAddress();
    swapDetails.isDex = Kyber.isDex();
    return swapDetails;
  }

  static async getOrderStatus(/*noticeDetails*/) {
    return 'new';
  }

  static parseKyberStatus(status) {
    switch (status) {
      case statuses.new:
      case statuses.initiated:
      case statuses.sent:
        return 'new';
      case statuses.pending:
        return 'pending';
      case statuses.payment:
        return 'complete';
      case statuses.cancelled:
        return 'cancelled';
    }
  }

  getTokenAddress(token) {
    try {
      if (utils.stringEqual(networkSymbols.ETH, token)) {
        return this.tokenDetails[token].contractAddress;
      }
      return this.web3.utils.toChecksumAddress(
        this.tokenDetails[token].contractAddress
      );
    } catch (e) {
      errorLogger(e);
      throw Error(
        `Token [${token}] not included in kyber network list of tokens`
      );
    }
  }

  getTokenDecimals(token) {
    try {
      return +this.tokenDetails[token].decimals;
    } catch (e) {
      errorLogger(e);
      throw Error(
        `Token [${token}] not included in kyber network list of tokens`
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
