import debugLogger from 'debug';
import BigNumber from 'bignumber.js';
import ENS from 'ethereum-ens';
import { utils } from '../helpers';
import { networkSymbols } from '../partnersConfig';
import {
  ERC20,
  kyberBaseCurrency,
  PROVIDER_NAME,
  TIME_SWAP_VALID,
  MAX_DEST_AMOUNT,
  MIN_RATE_BUFFER,
  defaultValues,
  specialGasLimits,
  KyberCurrencies,
  kyberAddressFallback,
  kyberNetworkABI,
  kyberValidNetworks,
  kyberNetworkENS,
  walletDepositeAddress,
  FEE_RATE
} from './config';
import kyberCalls from './kyber-calls';

const logger = debugLogger('v5:kyber-swap');
const errorLogger = debugLogger('v5-error:kyber');

export default class Kyber {
  constructor(props = {}) {
    this.name = Kyber.getName();
    this.network = props.network || networkSymbols.ETH;
    this.getRateForUnit =
      typeof props.getRateForUnit === 'boolean' ? props.getRateForUnit : false;
    this.hasRates = 0;
    this.specialGasLimits = specialGasLimits;
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
    this.getSupportedTokenList();
    this.getMainNetAddress(this.kyberNetworkAddress);
  }

  static getName() {
    return PROVIDER_NAME;
  }

  static isDex() {
    return true;
  }

  get defaultCurrencyList() {
    return KyberCurrencies[this.network];
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
      this.tokenDetails = this.defaultCurrencyList;
    }
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

  async retrieveSupportedTokenList(network) {
    try {
      const tokenList = await kyberCalls.getTokenList(network);
      const tokenDetails = {};
      for (let i = 0; i < tokenList.length; i++) {
        if (
          tokenList[i].symbol &&
          tokenList[i].name &&
          tokenList[i].decimals &&
          tokenList[i].contractAddress
        ) {
          // otherwise the entry is invalid
          const symbol = tokenList[i].symbol.toUpperCase();
          tokenDetails[symbol] = tokenList[i];
        }
      }
      return tokenDetails;
    } catch (e) {
      utils.handleOrThrow(e);
      errorLogger(e);
    }
  }

  async getSupportedTokenList() {
    try {
      this.tokenDetails = await this.retrieveSupportedTokenList(this.network);
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
    const rate = await this.getExpactedRateInTokens(
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

  async getExpectedRate(fromToken, toToken, fromValueWei) {
    const rates = await this.callKyberContract(
      'getExpectedRate',
      this.getTokenAddress(fromToken),
      this.getTokenAddress(toToken),
      fromValueWei
    );
    logger(rates);
    if (new BigNumber(rates['expectedRate']).eq(new BigNumber(0))) {
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

      if (new BigNumber(currentAllowance).gt(new BigNumber(0))) {
        if (
          new BigNumber(currentAllowance)
            .minus(new BigNumber(fromValueWei))
            .lt(new BigNumber(0))
        ) {
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

  MinRateWeiAdjustment(minRateWei) {
    const minRateWeiBN = new BigNumber(minRateWei);
    return minRateWeiBN
      .minus(minRateWeiBN.times(new BigNumber(MIN_RATE_BUFFER)))
      .toFixed(0)
      .toString();
  }

  getGeneralGasLimits(fromCurrency, toCurrency) {
    if (this.specialGasLimits[toCurrency]) {
      return this.specialGasLimits[toCurrency];
    } else if (this.isTokenToToken(fromCurrency, toCurrency)) {
      return this.tokenToTokenGasLimit;
    }
    return this.tradeGasLimit;
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
        this.MinRateWeiAdjustment(minRateWei),
        walletDepositeAddress
      )
      .encodeABI();

    return {
      to: this.getKyberNetworkAddress(),
      value: Object.values(networkSymbols).includes(fromCurrency)
        ? fromValueWei
        : 0,
      gas: this.getGeneralGasLimits(fromCurrency, toCurrency),
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
          'Received a rate of 0. Invalid quantity.  Try swaping a lower amount.'
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
    const finalRateWei = await this.getExpectedRate(
      swapDetails.fromCurrency,
      swapDetails.toCurrency,
      this.convertToTokenWei(swapDetails.fromCurrency, swapDetails.fromValue)
    );
    const finalRate = this.convertToTokenBase('ETH', finalRateWei);
    swapDetails.dataForInitialization = await this.generateDataForTransactions(
      swapDetails
    );
    swapDetails.toValue = new BigNumber(finalRate).times(
      new BigNumber(swapDetails.fromValue).toFixed(18).toString()
    );

    swapDetails.finalRate = this.calculateNormalizedExchangeRate(
      swapDetails.toValue,
      swapDetails.fromValue
    );
    swapDetails.providerReceives = swapDetails.fromValue;
    swapDetails.providerSends = new BigNumber(finalRate).times(
      new BigNumber(swapDetails.fromValue)
    );
    swapDetails.parsed = {
      sendToAddress: this.getKyberNetworkAddress(),
      status: 'pending',
      validFor: TIME_SWAP_VALID
    };
    swapDetails.providerAddress = this.getKyberNetworkAddress();
    swapDetails.isDex = Kyber.isDex();
    return swapDetails;
  }

  static async getOrderStatus() {
    return 'new';
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
      throw Error(
        `Token [${token}] not included in kyber network list of tokens`
      );
    }
  }

  getTokenDecimals(token) {
    try {
      return +this.currencies[token].decimals;
    } catch (e) {
      errorLogger(e);
      throw Error(
        `Token [${token}] not included in kyber network list of tokens`
      );
    }
  }

  calculateNormalizedExchangeRate(toValue, fromValue) {
    return new BigNumber(toValue).div(fromValue).toString(10);
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
