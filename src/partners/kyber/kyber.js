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
  KyberCurrencies,
  kyberAddressFallback,
  kyberNetworkABI,
  kyberValidNetworks,
  kyberNetworkENS,
  walletDepositeAddress,
  FEE_RATE,
  GAS_LIMITS
} from './config';
import kyberCalls from './kyber-calls';

const logger = debugLogger('v5:kyber-swap');
const errorLogger = debugLogger('v5-error:kyber');

const toBigNumber = num => {
  return new BigNumber(num);
};

const DAI = 'DAI';

export default class Kyber {
  constructor(props = {}) {
    this.name = Kyber.getName();
    this.network = props.network || networkSymbols.ETH;
    this.getRateForUnit =
      typeof props.getRateForUnit === 'boolean' ? props.getRateForUnit : false;
    this.hasRates = 0;
    this.GAS_LIMITS = GAS_LIMITS;
    this.gasLimitsLoaded = false;
    this.tokenListLoaded = false;
    this.defaultTradeGasLimit =
      props.tradeGasLimit || defaultValues.tradeGasLimit;
    this.tokenToTokenGasLimit =
      props.tokenToTokenGasLimit || defaultValues.tokenToTokenGasLimit;
    this.defaultTokenApprovalGasLimit =
      props.tokenApprovalGasLimit || defaultValues.tokenApprovalGasLimit;
    this.maxGasPrice = defaultValues.maxGasPrice; // 30 Gwei
    this.gasPrice = defaultValues.gasPrice; // 2 Gwei
    this.tokenDetails = {};
    this.setDefaultCurrencyList();
    this.web3 = props.web3;
    this.ens = new ENS(props.web3.currentProvider);
    this.kyberNetworkABI = kyberNetworkABI || [];
    this.kyberNetworkAddress =
      props.kyberAddress || kyberAddressFallback[this.network];
    this.retrieveGasLimits().then(() => {
      this.gasLimitsLoaded = true;
    });
    this.getSupportedTokenList();
    this.getMainNetAddress(this.kyberNetworkAddress);
  }

  // Static Informational
  static getName() {
    return PROVIDER_NAME;
  }

  static isDex() {
    return true;
  }

  // Getters
  get defaultCurrencyList() {
    return KyberCurrencies[this.network];
  }

  get ratesRetrieved() {
    return this.tokenListLoaded;
  }

  get isReady() {
    return (
      Object.keys(this.tokenDetails).length > 0 &&
      this.gasLimitsLoaded &&
      this.tokenListLoaded
    );
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

  setNetwork(network, web3) {
    this.network = network;
    if (this.isValidNetwork) {
      this.web3 = web3;
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

  async getSupportedTokenList() {
    try {
      this.tokenDetails = await this.retrieveSupportedTokenList(this.network);
      this.hasRates =
        Object.keys(this.tokenDetails).length > 0 ? this.hasRates + 1 : 0;
    } catch (e) {
      errorLogger(e);
    }
  }

  // API Call
  async retrieveSupportedTokenList(network) {
    try {
      const rawTokenList = await kyberCalls.getTokenList(network);
      const tokenList = rawTokenList.data;
      if (tokenList) {
        const tokenDetails = {};
        for (let i = 0; i < tokenList.length; i++) {
          if (
            tokenList[i].symbol &&
            tokenList[i].name &&
            tokenList[i].decimals &&
            tokenList[i].address
          ) {
            // otherwise the entry is invalid
            const symbol = tokenList[i].symbol.toUpperCase();
            tokenList[i].contractAddress = tokenList[i].address;
            tokenDetails[symbol] = tokenList[i];
          }
        }
        this.tokenListLoaded = true;
        return tokenDetails;
      }
      return KyberCurrencies[this.network];
    } catch (e) {
      utils.handleOrThrow(e);
      errorLogger(e);
      return KyberCurrencies[this.network];
    }
  }

  // API Call
  async retrieveGasLimits(network = this.network) {
    try {
      const gasLimitList = await kyberCalls.getGasLimits(network);
      if (gasLimitList && gasLimitList.data) {
        this.GAS_LIMITS = gasLimitList.data;
      }
    } catch (e) {
      utils.handleOrThrow(e);
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

  async ethEquivalentQty(fromCurrency) {
    return await this.getExpactedRateInTokens('ETH', fromCurrency, 0.5);
  }

  async rateDivergence(rate, fromCurrency, toCurrency, fromValue) {
    if (toBigNumber(rate).lte(0)) return toBigNumber(-1);
    const val = await this.ethEquivalentQty(
      fromCurrency,
      toCurrency,
      fromValue
    );

    const equivalentRate = await this.getExpactedRateInTokens(
      fromCurrency,
      toCurrency,
      val || 0.5,
      true
    );

    const difference = toBigNumber(rate).div(equivalentRate);
    const value = toBigNumber(1).minus(difference);
    if (value.gt(0)) {
      return value;
    }
    return toBigNumber(0);
  }

  async getRate(fromCurrency, toCurrency, fromValue) {
    const rate = await this.getExpactedRateInTokens(
      fromCurrency,
      toCurrency,
      this.getRateForUnit ? 1 : fromValue
    );

    const diff = await this.rateDivergence(
      rate,
      fromCurrency,
      toCurrency,
      fromValue
    );
    const additional = {};
    if (diff.gt(0.001)) {
      additional['display'] = {
        txtKey: 'kyber-slippage',
        value: diff.times(100).toFixed(2, BigNumber.ROUND_HALF_UP)
      };
    }
    return {
      fromCurrency,
      toCurrency,
      provider: this.name,
      rate: this.calculateTrueRate(rate),
      additional: additional
    };
  }

  async getRateUpdate(fromCurrency, toCurrency, fromValue, toValue, isFiat) {
    return this.getRate(fromCurrency, toCurrency, fromValue, toValue, isFiat);
  }

  async getExpectedRate(fromToken, toToken, fromValueWei) {
    const rates = await this.callKyberContract(
      'getExpectedRate',
      this.getTokenAddress(fromToken),
      this.getTokenAddress(toToken),
      fromValueWei
    );
    logger(rates);
    if (!rates) {
      return -1;
    }
    if (new BigNumber(rates['expectedRate']).eq(new BigNumber(0))) {
      return -1;
    }
    return rates['expectedRate'];
  }

  async getExpactedRateInTokens(fromToken, toToken, fromValue) {
    const fromWei = this.convertToTokenWei(fromToken, fromValue);
    logger(fromWei);
    const inWei = await this.getExpectedRate(fromToken, toToken, fromWei);
    if (new BigNumber(inWei).gt(-1)) {
      return this.convertToTokenBase(kyberBaseCurrency, inWei);
    }
    return 0;
  }

  getInitialCurrencyEntries(collectMapFrom, collectMapTo) {
    for (const prop in this.currencies) {
      if (prop === 'THISISADUMMYTOKEN') continue;
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
        if (prop === 'THISISADUMMYTOKEN') continue;
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
    try {
      return await this.getKyberContractObject()
        .methods[method](...parameters)
        .call();
    } catch (e) {
      if (method === 'getExpectedRate') {
        // eslint-disable-next-line
        console.error(e);
      } else {
        throw e;
      }
    }
  }

  async approveKyber(fromToken, fromValueWei) {
    let transferGasEst;
    try {
      const methodObject = new this.web3.eth.Contract(
        ERC20,
        this.getTokenAddress(fromToken)
      ).methods.approve(this.getKyberNetworkAddress(), fromValueWei);
      try {
        transferGasEst = this.getTokenApprovalGas(fromToken);
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
            gas: this.getTokenApprovalGas(fromCurrency),
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
        this.MinRateWeiAdjustment(minRateWei),
        walletDepositeAddress
      )
      .encodeABI();
    return {
      to: this.getKyberNetworkAddress(),
      value: Object.values(networkSymbols).includes(fromCurrency)
        ? fromValueWei
        : 0,
      gas: this.getTokenTradeGas(fromCurrency, toCurrency, fromValueWei),
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
          'Received a rate of 0. Invalid quantity.  Try swapping a lower amount.'
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

  // Helpers
  MinRateWeiAdjustment(minRateWei) {
    const minRateWeiBN = new BigNumber(minRateWei);
    return minRateWeiBN
      .minus(minRateWeiBN.times(new BigNumber(MIN_RATE_BUFFER)))
      .toFixed(0)
      .toString();
  }

  isTokenToToken(fromCurrency, toCurrency) {
    return (
      fromCurrency !== kyberBaseCurrency && toCurrency !== kyberBaseCurrency
    );
  }

  getTokenTradeGas(fromCurrency, toCurrency, fromValueWei) {
    if (
      toCurrency === DAI &&
      toBigNumber(fromValueWei).gt(this.convertToTokenWei('ETH', 499))
    ) {
      return toBigNumber(1500000);
    }
    const fromGas = this.getTokenSwapGas(fromCurrency);
    const toGas = this.getTokenSwapGas(toCurrency);
    return toBigNumber(fromGas)
      .plus(toBigNumber(toGas))
      .toFixed(0)
      .toString();
  }

  getTokenApprovalGas(token) {
    const gasLimits = this.getGasLimits(token);
    return gasLimits.approveGasLimit;
  }

  getTokenSwapGas(token) {
    const gasLimits = this.getGasLimits(token);
    return gasLimits.swapGasLimit;
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
      return new BigNumber(this.currencies[token].decimals).toNumber();
    } catch (e) {
      errorLogger(e);
      throw Error(
        `Token [${token}] not included in kyber network list of tokens`
      );
    }
  }

  getGasLimits(token) {
    try {
      const address = this.getTokenAddress(token);
      const gasLimit = this.GAS_LIMITS.find(entry => {
        return (
          entry.address.toLowerCase() === address.toLowerCase() ||
          entry.symbol === token
        );
      });
      if (gasLimit !== null && gasLimit !== undefined) {
        return gasLimit;
      }
      return {
        swapGasLimit: this.defaultTradeGasLimit,
        approveGasLimit: this.defaultTokenApprovalGasLimit
      };
    } catch (e) {
      return {
        swapGasLimit: this.defaultTradeGasLimit,
        approveGasLimit: this.defaultTokenApprovalGasLimit
      };
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
