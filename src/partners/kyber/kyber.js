import debugLogger from 'debug';
import BigNumber from 'bignumber.js';
import { networkSymbols } from '../partnersConfig';
import kyberApi from './kyber-api';
import {
  mainChainCurrency,
  providerName,
  defaultValues,
  KyberCurrencies,
  kyberAddressFallback,
  kyberNetworkABI,
  ERC20,
  kyberValidNetworks,
  kyberNetworkENS,
  walletDepositeAddress
} from './config';

const logger = debugLogger('v5:kyber-swap');
const errorLogger = debugLogger('v5-error:kyber');
/**
 * Note: Need to implement checks for these:
 *   - Source amount is too small. Minimum amount is 0.001 ETH equivalent.
 *   - Ask about ETH equivalent in relation to User Cap
 */
export default class Kyber {
  constructor(props = {}) {
    this.name = Kyber.getName();
    this.network = props.network || networkSymbols.ETH;
    this.hasRates = 0;
    this.gasLimit = defaultValues.gasLimit;
    this.tokenApprovalGas = defaultValues.tokenApprovalGasLimit;
    this.maxGasPrice = defaultValues.maxGasPrice; // 30 Gwei
    this.gasPrice = defaultValues.gasPrice; // 2 Gwei
    this.tokenDetails = {};
    this.setDefaultCurrencyList();
    this.web3 = props.web3;
    this.ens = props.ens;
    this.kyberNetworkABI = kyberNetworkABI || [];
    this.kyberNetworkAddress =
      props.kyberAddress || kyberAddressFallback[this.network];
    this.rates = new Map();

    // setup actions
    this.retrieveRates();
    this.getSupportedTokenList();
    this.getMainNetAddress(this.kyberNetworkAddress);
  }

  static getName() {
    return providerName;
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

  // ============================= Setup Methods  ====================================

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

  // ============================= pair and value selection and update methods  ====================================
  validSwap(fromCurrency, toCurrency) {
    if (this.isValidNetwork) {
      return this.currencies[fromCurrency] && this.currencies[toCurrency];
    }
  }

  async getRate(fromCurrency, toCurrency, fromValue) {
    const rate = await this.getExpactedRateInTokens(
      fromCurrency,
      toCurrency,
      fromValue
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
      return this.convertToTokenBase(mainChainCurrency, inWei);
    }
    return -1;
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

  getUpdatedCurrencyEntries(value, collectMap) {
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

  getUpdatedFromCurrencyEntries(value, collectMap) {
    this.getUpdatedCurrencyEntries(value, collectMap);
  }

  getUpdatedToCurrencyEntries(value, collectMap) {
    this.getUpdatedCurrencyEntries(value, collectMap);
  }

  // ============================= Finalize swap details ====================================

  async callKyberContract(method, ...parameters) {
    return await this.getKyberContractObject()
      .methods[method](...parameters)
      .call();
  }

  approveKyber(fromToken, fromValueWei) {
    const approveAbi = [
      {
        constant: false,
        inputs: [
          {
            name: '_spender',
            type: 'address'
          },
          {
            name: '_value',
            type: 'uint256'
          }
        ],
        name: 'approve',
        outputs: [],
        payable: false,
        type: 'function'
      }
    ];

    const contract = new this.web3.eth.Contract(
      approveAbi,
      this.getTokenAddress(fromToken)
    );

    return {
      to: this.getTokenAddress(fromToken),
      value: 0,
      data: contract.methods
        .approve(this.getKyberNetworkAddress(), fromValueWei)
        .encodeABI()
    };
  }

  async canUserSwap(fromToken, toToken, fromValueWei, toValueWei, userAddress) {
    let userCap = true;

    const isTokenApprovalNeeded = async (
      fromToken,
      toToken,
      fromValueWei,
      userAddress
    ) => {
      if (fromToken === 'ETH') return { approve: false, reset: false };

      const contract = new this.web3.eth.Contract(
        ERC20,
        this.getTokenAddress(fromToken)
      );

      const currentAllowance = await contract.methods
        .allowance(userAddress, this.getKyberNetworkAddress())
        .call();

      if (currentAllowance > 0) {
        if (currentAllowance < fromValueWei) {
          return { approve: true, reset: true };
        }
        return { approve: false, reset: false };
      }
      return { approve: true, reset: false };
    };

    const tokenBalance = await this.callKyberContract(
      'getBalance',
      this.getTokenAddress(fromToken),
      userAddress
    );

    if (fromToken === mainChainCurrency || toToken === mainChainCurrency) {
      const checkValue =
        fromToken === mainChainCurrency ? fromValueWei : toValueWei;

      const kyberUserCap = await this.callKyberContract(
        'getUserCapInWei',
        userAddress
      );

      userCap = new BigNumber(kyberUserCap)
        .times(0.95)
        .gt(new BigNumber(checkValue));
    }

    if (userCap && new BigNumber(tokenBalance).gte(fromValueWei)) {
      const { approve, reset } = await isTokenApprovalNeeded(
        fromToken,
        toToken,
        fromValueWei,
        userAddress
      );
      if (approve && reset) {
        return new Set([
          this.approveKyber(fromToken, 0, userAddress),
          {
            ...this.approveKyber(fromToken, fromValueWei, userAddress),
            gas: this.tokenApprovalGas
          }
        ]);
      } else if (approve) {
        return new Set([
          this.approveKyber(fromToken, fromValueWei, userAddress)
        ]);
      }
      return new Set();
    }
    const reason = !userCap ? 'user cap value' : 'current token balance';
    const errorMessage = `User is not eligible to use kyber network. Current swap value exceeds ${reason}`;
    throw Error(errorMessage);
  }

  async getTradeData(
    fromToken,
    toToken,
    fromValueWei,
    minRateWei,
    userAddress
  ) {
    const walletId = walletDepositeAddress;
    // Cannot use a larger value (which solidity supports due to error from web3/ethers,
    // see: https://github.com/ethereum/web3.js/issues/1920
    const maxDestAmount = Number.MAX_SAFE_INTEGER; // 2 ** 200; // TODO move to config

    const data = this.getKyberContractObject()
      .methods.trade(
        await this.getTokenAddress(fromToken),
        fromValueWei,
        await this.getTokenAddress(toToken),
        userAddress,
        maxDestAmount,
        minRateWei,
        walletId
      )
      .encodeABI();

    return {
      to: this.getKyberNetworkAddress(),
      value: Object.values(networkSymbols).includes(fromToken)
        ? fromValueWei
        : 0,
      gas: this.gasLimit,
      data
    };
  }

  async generateDataForTransactions(
    fromToken,
    toToken,
    fromValue,
    toValue,
    rate,
    userAddress
  ) {
    try {
      const fromValueWei = this.convertToTokenWei(fromToken, fromValue);
      const toValueWei = this.convertToTokenWei(toToken, toValue);
      const finalRate = await this.getExpectedRate(
        fromToken,
        toToken,
        fromValueWei
      );
      const prepareSwapTxData = await this.canUserSwap(
        fromToken,
        toToken,
        fromValueWei,
        toValueWei,
        userAddress
      );
      prepareSwapTxData.add(
        await this.getTradeData(
          fromToken,
          toToken,
          fromValueWei,
          finalRate,
          userAddress
        )
      );
      const swapTransactions = Array.from(prepareSwapTxData);
      return [...swapTransactions];
      // }
    } catch (e) {
      // eslint-disable no-console
      errorLogger(e); // todo remove dev item
      throw e;
    }
  }

  async startSwap(swapDetails) {
    swapDetails.maybeToken = true;
    swapDetails.providerAddress = this.getAddress();
    swapDetails.kyberMaxGas = await this.callKyberContract('maxGasPrice');
    swapDetails.dataForInitialization = await this.generateDataForTransactions(
      swapDetails.fromCurrency,
      swapDetails.toCurrency,
      swapDetails.fromValue,
      swapDetails.toValue,
      this.convertToTokenWei(mainChainCurrency, swapDetails.rate),
      swapDetails.fromAddress
    );
    swapDetails.providerReceives = swapDetails.fromValue;
    swapDetails.providerSends = swapDetails.toValue;
    swapDetails.parsed = {};
    swapDetails.providerAddress = this.getKyberNetworkAddress();
    return swapDetails;
  }

  // ================= Util methods ===================================

  getTokenAddress(token) {
    try {
      if (token === networkSymbols.ETH) {
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

  // TODO: Investigate rate conversion and decimals appearing at the end of the converted value
  convertToTokenWei(token, value) {
    const decimals = this.getTokenDecimals(token);
    const denominator = new BigNumber(10).pow(decimals);
    // getting strange cases where decimals are appearing at the end of the converted value
    logger('convertToTokenWei', denominator.toString(10));
    return new BigNumber(value)
      .times(denominator)
      .integerValue(BigNumber.ROUND_DOWN)
      .toString(10);
  }

  calcSrcQty(dstQty, srcDecimals, dstDecimals, rate) {
    let numerator, denominator;
    const PRECISION = 10 ** 18;
    //source quantity is rounded up. to avoid dest quantity being too low.
    if (srcDecimals >= dstDecimals) {
      numerator = PRECISION * dstQty * 10 ** (srcDecimals - dstDecimals);
      denominator = rate;
    } else {
      numerator = PRECISION * dstQty;
      denominator = rate * 10 ** (dstDecimals - srcDecimals);
    }
    return (numerator + denominator - 1) / denominator; //avoid rounding down errors
  }

  calcDstQty(srcQty, srcDecimals, dstDecimals, rate) {
    const PRECISION = 10 ** 18;
    if (dstDecimals >= srcDecimals) {
      return (srcQty * rate * 10 ** (dstDecimals - srcDecimals)) / PRECISION;
    }
    return (srcQty * rate) / (PRECISION * 10 ** (srcDecimals - dstDecimals));
  }
}
