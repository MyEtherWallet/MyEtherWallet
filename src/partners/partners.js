/* eslint-disable */
import BigNumber from 'bignumber.js';
import {
  // bestRateForQuantity,
  // bestProviderForQuantity,
  // isValidEntry,
  checkInvalidOrMissingValue,
  // dynamicSortMultiple
} from './helpers/sortAndIdentify';
import {
  Tokens
  // otherChains,
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
      this.providers.set(
        entry.getName(),
        new entry({
          web3: environmentSupplied.web3,
          ens: environmentSupplied.ens,
          network: environmentSupplied.network
        })
      );
    });

    this.providerRatesRecieved = [];
    this.providerListPair = {};
    this.providerList = [];

    let checkCount = 0;
    const checkIfAllRatesReceived = setInterval(() => {
      checkCount++;
      this.checkIfRatesPresent();
      console.log('haveProviderRates', this.haveProviderRates); // todo remove dev item
      if (this.haveProviderRates || checkCount > 400) {
        clearInterval(checkIfAllRatesReceived);
      }
    }, 50);
  }

  getProviders() {
    return this.providers;
  }

  getProvider(name) {
    return this.providers[name];
  }

  get haveProviderRates() {
    return Object.keys(this.providerRateUpdates).every(providerName => {
      return this.providerRatesRecieved.includes(providerName);
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

  checkForProviderRateUpdates() {
    this.providers.forEach(provider => {
      if (this.providerRateUpdates[provider.name] < provider.hasRates) {
        this.providerRateUpdates[provider.name] = provider.hasRates;
      }
    });
  }

  buildInitialCurrencyArrays() {
    const collectMapTo = new Map();
    const collectMapFrom = new Map();
    this.providers.forEach(provider => {
      provider.getInitialCurrencyEntries(collectMapFrom, collectMapTo);
    });
    if (collectMapTo.has('ETH')) collectMapTo.delete('ETH');
    if (collectMapFrom.has('ETH')) collectMapFrom.delete('ETH');

    const toArray = Array.from(collectMapTo.values()).sort(comparator);
    const fromArray = Array.from(collectMapFrom.values()).sort(comparator);
    toArray.splice(0, 0, { symbol: 'ETH', name: 'Ether' });
    fromArray.splice(0, 0, { symbol: 'ETH', name: 'Ether' });
    return { toArray, fromArray };
  }

  setFromCurrencyBuilder(value) {
    const collectMap = new Map();
    this.providers.forEach(provider => {
      provider.getUpdatedFromCurrencyEntries(value, collectMap);
    });
    if (collectMap.has('ETH')) collectMap.delete('ETH');
    const toArray = Array.from(collectMap.values()).sort(comparator);
    return [{ symbol: 'ETH', name: 'Ether' }, ...toArray];
  }

  setToCurrencyBuilder(value) {
    const collectMap = new Map();
    this.providers.forEach(provider => {
      provider.getUpdatedToCurrencyEntries(value, collectMap);
    });
    if (collectMap.has('ETH')) collectMap.delete('ETH');
    const toArray = Array.from(collectMap.values()).sort(comparator);
    return [{ symbol: 'ETH', name: 'Ether' }, ...toArray];
  }

  async updateRateEstimate(fromCurrency, toCurrency, fromValue, toValue) {
    if (this.haveProviderRates) {
      const providersFound = [];
      const callsToMake = [];
      this.providerData = [];
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

      } else {
        return { providersFound: [], callsToMake: [] };
        // throw Error('No Providers Found');
      }
    }
    return { providersFound: [], callsToMake: [] };
  }

  getTokenAddress(currency){
    if(this.isToken(currency)){
      return Tokens[currency].contractAddress;
    }
    throw Error('Not an Ethereum Token');
  }

  calculateFromValue(toValue, bestRate){
    return checkInvalidOrMissingValue(
      new BigNumber(toValue)
        .div(bestRate)
        .toFixed()
        .toString(10),
      false
    )
  }

  calculateToValue(fromValue, bestRate){
    return checkInvalidOrMissingValue(
      new BigNumber(fromValue)
        .times(bestRate)
        .toFixed()
        .toString(10),
      true
    );
  }

  getTokenDecimals(currency){
    if(this.isToken(currency)){
      return Tokens[currency].decimals;
    }
    throw Error('Not an Ethereum Token');
  }

  isToken(currency) {
    return !!Tokens[currency];
  }

  async startSwap(swapDetails) {
    try {
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
