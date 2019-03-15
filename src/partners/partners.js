import BigNumber from 'bignumber.js';
import WAValidator from 'wallet-address-validator';
import MAValidator from 'multicoin-address-validator';
import { checkInvalidOrMissingValue, utils } from './helpers';
import {
  BASE_CURRENCY,
  TOP_OPTIONS_ORDER,
  EthereumTokens,
  OtherCoins,
  fiat
} from './partnersConfig';

function comparator(arrayForSort) {
  if (!arrayForSort) arrayForSort = TOP_OPTIONS_ORDER;
  return (a, b) => {
    a = a.symbol;
    b = b.symbol;
    if (arrayForSort.includes(a) || arrayForSort.includes(b)) {
      return arrayForSort.indexOf(b) - arrayForSort.indexOf(a);
    }
    return a < b ? -1 : a > b ? 1 : 0;
  };
}

export default class SwapProviders {
  constructor(providers, environmentSupplied, misc = {}) {
    this.updateProviderRates = 0;
    this.providers = new Map();
    this.providerRateUpdates = {};
    this.ownedTokenList = misc.tokensWithBalance || [];

    providers.forEach(entry => {
      this.providerRateUpdates[entry.getName()] = 0;
      this.providers.set(entry.getName(), new entry(environmentSupplied));
    });

    this.providerRatesRecieved = [];

    let checkCount = 0;
    if (environmentSupplied.network !== BASE_CURRENCY) {
      const checkIfAllRatesReceived = setInterval(() => {
        checkCount++;
        this.checkIfRatesPresent();
        if (this.haveProviderRates || checkCount > 20) {
          this.providerRatesRecieved = Object.keys(this.providerRateUpdates);
          clearInterval(checkIfAllRatesReceived);
        }
      }, 150);
    } else {
      const checkIfAllRatesReceived = setInterval(() => {
        checkCount++;
        this.checkIfRatesPresent();
        if (this.haveProviderRates || checkCount > 50) {
          this.providerRatesRecieved = Object.keys(this.providerRateUpdates);
          clearInterval(checkIfAllRatesReceived);
        }
      }, 150);
    }

    this.initialCurrencyArrays = this.buildInitialCurrencyArrays();
  }

  get initialCurrencyLists() {
    return this.initialCurrencyArrays;
  }

  get haveProviderRates() {
    return Object.keys(this.providerRateUpdates).every(providerName => {
      return this.providerRatesRecieved.includes(providerName);
    });
  }

  ownedTokens(tokens) {
    this.ownedTokenList = tokens;
  }

  getProviders() {
    return utils.mapToObject(this.providers);
  }

  getProvider(name) {
    if (!this.isProvider(name))
      throw Error(`${name} is not a supported swap provider`);
    return this.providers.get(name);
  }

  isProvider(name) {
    return this.providers.has(name);
  }

  updateNetwork(network) {
    this.providers.forEach(provider => {
      provider.setNetwork(network);
    });
  }

  checkIfRatesPresent() {
    this.providers.forEach(provider => {
      if (
        !this.providerRatesRecieved.includes(provider.name) &&
        provider.hasRates > 0
      ) {
        this.updateProviderRates++;
        this.providerRatesRecieved.push(provider.name);
      }
    });
  }

  // Note: Seems to not always float user held tokens to the top??
  // Does in general, but have observed some instances where it did not.
  optionSorting(array) {
    const tokens = [...this.ownedTokenList];
    const tokenNameMap = tokens
      .sort((a, b) => {
        if (a.hasOwnProperty('balance') && b.hasOwnProperty('balance')) {
          return b.balance - a.balance;
        }
        return 0;
      })
      .map(item => item.name)
      .reverse();
    const arraysForSort = [...tokenNameMap, ...TOP_OPTIONS_ORDER];
    return array.sort(comparator(arraysForSort));
    // return array.sort(comparator);
  }

  buildInitialCurrencyArrays() {
    const collectMapTo = new Map();
    const collectMapFrom = new Map();
    this.providers.forEach(provider => {
      provider.getInitialCurrencyEntries(collectMapFrom, collectMapTo);
    });

    const toArray = this.optionSorting(Array.from(collectMapTo.values()));
    const fromArray = this.optionSorting(Array.from(collectMapFrom.values()));
    return { toArray, fromArray };
  }

  setFromCurrencyBuilder(value) {
    const collectMap = new Map();
    this.providers.forEach(provider => {
      provider.getUpdatedFromCurrencyEntries(value, collectMap);
    });
    return this.optionSorting(Array.from(collectMap.values()));
  }

  setToCurrencyBuilder(value) {
    const collectMap = new Map();
    this.providers.forEach(provider => {
      provider.getUpdatedToCurrencyEntries(value, collectMap);
    });
    return this.optionSorting(Array.from(collectMap.values()));
  }

  async updateRateEstimate(fromCurrency, toCurrency, fromValue) {
    if (this.haveProviderRates) {
      const providersFound = [];
      const callsToMake = [];
      if (
        +fromValue > 0 &&
        fromCurrency !== toCurrency &&
        !Number.isNaN(+fromValue)
      ) {
        this.providers.forEach(provider => {
          if (provider.validSwap(fromCurrency, toCurrency)) {
            callsToMake.push(provider.getRate.bind(provider));
            providersFound.push(provider.name);
          }
        });
        return { providersFound, callsToMake };
      }
    }
    return {
      providersFound: [],
      callsToMake: []
    };
  }

  getTokenAddress(currency, noError) {
    if (SwapProviders.isToken(currency)) {
      return EthereumTokens[currency].contractAddress;
    }
    if (noError) {
      return false;
    }
    throw Error('Not an Ethereum Token');
  }

  calculateFromValue(toValue, bestRate, currency) {
    const decimals = this.decimalForCalculation(currency);
    return checkInvalidOrMissingValue(
      new BigNumber(toValue)
        .div(new BigNumber(bestRate))
        .toFixed(decimals)
        .toString(10),
      false
    );
  }

  calculateToValue(fromValue, bestRate, currency) {
    const decimals = this.decimalForCalculation(currency);
    return checkInvalidOrMissingValue(
      new BigNumber(fromValue)
        .times(new BigNumber(bestRate))
        .toFixed(decimals)
        .toString(10),
      true
    );
  }

  decimalForCalculation(currency) {
    if (!currency) return 6;
    if (fiat.find(entry => entry.symbol === currency)) {
      return 2;
    } else if (SwapProviders.isToken(currency)) {
      const decimal = SwapProviders.getTokenDecimals(currency);
      if (decimal < 6) return decimal;
      return 6;
    }
    return 6;
  }

  convertToTokenWei(token, value) {
    const decimals = SwapProviders.getTokenDecimals(token);
    const denominator = new BigNumber(10).pow(decimals);
    return new BigNumber(value)
      .times(denominator)
      .toFixed(0)
      .toString(10);
  }

  convertToTokenBase(token, value) {
    const decimals = SwapProviders.getTokenDecimals(token);
    const denominator = new BigNumber(10).pow(decimals);
    return new BigNumber(value).div(denominator).toString(10);
  }

  async startSwap({
    providerDetails,
    fromValue,
    toValue,
    toAddress,
    fromAddress,
    refundAddress
  }) {
    try {
      const swapDetails = {
        provider: providerDetails.provider,
        fromCurrency: providerDetails.fromCurrency,
        fromValue: fromValue,
        toValue: toValue,
        toCurrency: providerDetails.toCurrency,
        rate: providerDetails.rate,
        minValue: providerDetails.minValue,
        maxValue: providerDetails.maxValue,
        toAddress: toAddress,
        fromAddress: fromAddress,
        timestamp: new Date().toISOString(),
        refundAddress: refundAddress
      };
      if (this.providers.has(swapDetails.provider)) {
        const provider = this.providers.get(swapDetails.provider);
        swapDetails.maybeToken = SwapProviders.isToken(
          swapDetails.fromCurrency
        );
        return provider.startSwap(swapDetails);
      }
    } catch (e) {
      throw e;
    }
  }

  // Static Methods

  static isToken(currency) {
    return !!EthereumTokens[currency];
  }

  static isNotToken(currency) {
    return !EthereumTokens[currency];
  }

  static getTokenDecimals(currency) {
    if (SwapProviders.isToken(currency)) {
      return EthereumTokens[currency].decimals;
    } else if (currency === 'ETH') {
      return 18;
    }
    throw Error('Not an Ethereum Token');
  }

  // Get address explorer base url for non-ethereum blockchain
  static getAddressLookupUrl(coin, address) {
    if (OtherCoins[coin] && OtherCoins[coin].addressLookup) {
      if (address) {
        return OtherCoins[coin].addressLookup.replace('[[address]]', address);
      }
      return OtherCoins[coin].addressLookup;
    }
    return '';
  }
  // Get transaction explorer base url for non-ethereum blockchain
  static getBlockChainExplorerUrl(coin, hash) {
    if (OtherCoins[coin] && OtherCoins[coin].explorer) {
      if (hash) {
        return OtherCoins[coin].explorer.replace('[[txHash]]', hash);
      }
      return OtherCoins[coin].explorer;
    }
    return '';
  }

  static checkAddress(address, currency) {
    let validAddress = false;
    try {
      validAddress = WAValidator.validate(address, currency);
    } catch (e) {
      try {
        validAddress = MAValidator.validate(address, currency);
      } catch (e) {
        validAddress = false;
      }
    }
    return validAddress;
  }
}
