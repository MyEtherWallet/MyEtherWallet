import BigNumber from 'bignumber.js';
import { checkInvalidOrMissingValue, utils } from './helpers';
import {
  BASE_CURRENCY,
  baseCurrencyEntry,
  EthereumTokens
} from './partnersConfig';

function comparator(a, b) {
  a = a.symbol;
  b = b.symbol;
  return a < b ? -1 : a > b ? 1 : 0;
}

export default class SwapProviders {
  constructor(providers, environmentSupplied) {
    this.updateProviderRates = 0;
    this.providers = new Map();
    this.providerRateUpdates = {};

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

  get haveProviderRates() {
    return Object.keys(this.providerRateUpdates).every(providerName => {
      return this.providerRatesRecieved.includes(providerName);
    });
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

  buildInitialCurrencyArrays() {
    const collectMapTo = new Map();
    const collectMapFrom = new Map();
    this.providers.forEach(provider => {
      provider.getInitialCurrencyEntries(collectMapFrom, collectMapTo);
    });
    if (collectMapTo.has(BASE_CURRENCY)) collectMapTo.delete(BASE_CURRENCY);
    if (collectMapFrom.has(BASE_CURRENCY)) collectMapFrom.delete(BASE_CURRENCY);

    const toArray = Array.from(collectMapTo.values()).sort(comparator);
    const fromArray = Array.from(collectMapFrom.values()).sort(comparator);
    toArray.splice(0, 0, baseCurrencyEntry);
    fromArray.splice(0, 0, baseCurrencyEntry);
    return { toArray, fromArray };
  }

  setFromCurrencyBuilder(value) {
    const collectMap = new Map();
    this.providers.forEach(provider => {
      provider.getUpdatedFromCurrencyEntries(value, collectMap);
    });
    if (collectMap.has(BASE_CURRENCY)) collectMap.delete(BASE_CURRENCY);
    const toArray = Array.from(collectMap.values()).sort(comparator);
    return [baseCurrencyEntry, ...toArray];
  }

  setToCurrencyBuilder(value) {
    const collectMap = new Map();
    this.providers.forEach(provider => {
      provider.getUpdatedToCurrencyEntries(value, collectMap);
    });
    if (collectMap.has(BASE_CURRENCY)) collectMap.delete(BASE_CURRENCY);
    const toArray = Array.from(collectMap.values()).sort(comparator);
    return [baseCurrencyEntry, ...toArray];
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
    return { providersFound: [], callsToMake: [] };
  }

  getTokenAddress(currency, noError) {
    if (this.isToken(currency)) {
      return EthereumTokens[currency].contractAddress;
    }
    if (noError) {
      return false;
    }
    throw Error('Not an Ethereum Token');
  }

  calculateFromValue(toValue, bestRate) {
    return checkInvalidOrMissingValue(
      new BigNumber(toValue)
        .div(bestRate)
        .toFixed(6)
        .toString(10),
      false
    );
  }

  calculateToValue(fromValue, bestRate) {
    return checkInvalidOrMissingValue(
      new BigNumber(fromValue)
        .times(bestRate)
        .toFixed(6)
        .toString(10),
      true
    );
  }

  convertToTokenWei(token, value) {
    const decimals = this.getTokenDecimals(token);
    const denominator = new BigNumber(10).pow(decimals);
    return new BigNumber(value)
      .times(denominator)
      .toFixed(0)
      .toString(10);
  }

  convertToTokenBase(token, value) {
    const decimals = this.getTokenDecimals(token);
    const denominator = new BigNumber(10).pow(decimals);
    return new BigNumber(value).div(denominator).toString(10);
  }

  getTokenDecimals(currency) {
    if (this.isToken(currency)) {
      return EthereumTokens[currency].decimals;
    }
    throw Error('Not an Ethereum Token');
  }

  isToken(currency) {
    return !!EthereumTokens[currency];
  }

  hasKnownTokenBalance() {
    return;
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
        swapDetails.maybeToken = this.isToken(swapDetails.fromCurrency);
        return provider.startSwap(swapDetails);
      }
    } catch (e) {
      throw e;
    }
  }
}
