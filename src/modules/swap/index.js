import {
  SwapProviders,
  providers, bestProviderForQuantity
  // bestProviderForQuantity
  // bestRateForQuantity,
  // isValidEntry,
  // providerNames,
  // supportedProviders,
  // BASE_CURRENCY,
  // fiat,
  // MIN_SWAP_AMOUNT,
  // ERC20
} from './partners';
import BigNumber from 'bignumber.js';
import EventEmitter from 'events'

export default class Swap extends EventEmitter {
  constructor(environment) {
    super();
    environment.setUpUpdater = this.setupCompleteUpdater.bind(this);
    this.setUpMap = providers.reduce((acc, cur) => {
      acc[cur.getName()] = false;
      return acc;
    }, {});
    this.swap = new SwapProviders(providers, environment);
    this.complete = true;
    this.rateSets = {};
    this.currencyArraySet = { toArray: [], fromArray: [] };
  }

  initialize() {}

  setErrorHandler(name) {
    name = '';
    return name.indexOf('.') > 0;
  }

  setupCompleteUpdater(value, status) {
    console.log(value, status); // todo remove dev item
    // this.setUpMap[value] = status;
    if (typeof status === 'boolean' || typeof status === 'string') {
      console.log(value, status); // todo remove dev item

      this.setUpMap[value] = status;
      if (typeof status === 'boolean' && status) {
        this.currencyArraySet = this.swap.buildInitialCurrencyArrays();
        this.emit('ready');
      }
      const setupProviders = Object.keys(this.setUpMap);
      this.complete = true;
      for (let i = 0; i < setupProviders.length; i++) {
        if (
          typeof this.setUpMap[setupProviders[i]] !== 'boolean' ||
          !this.setUpMap[setupProviders[i]]
        ) {
          this.complete = false;
        }
      }
      if(this.complete){
        this.emit('setup-complete');
      }
    }
    // if (
    //   typeof this.setUpMap[value] === 'boolean' ||
    //   typeof this.setUpMap[value] === 'string'
    // ) {
    //   this.setUpMap[value] = status;
    // }
  }


  availableFromCurrencies(value){
    return this.swap.setFromCurrencyBuilder(value)
  }

  async updateRateEstimate(fromCurrency, toCurrency, fromValue, toValue, to) {
    this.loadingData = true;
    this.recalculating = true;
    this.noProvidersPair = { fromCurrency, toCurrency };
    this.selectedProvider = {}; // Reset the selected provider when new rate pair is choosen
    this.providerData = [];
    const resultObject = {

    }
    const { providersFound, callsToMake } = await this.swap.updateRateEstimate(
      fromCurrency,
      toCurrency,
      fromValue,
      toValue
    );
    console.log('callsToMake', callsToMake); // todo remove dev item
    this.providersFound = providersFound;
    const rawResults = await Promise.all(
      callsToMake.map(func =>
        func(fromCurrency, toCurrency, fromValue, toValue)
      )
    );
    // this.loadingData = false;
    // this.recalculating = false;
    const results = rawResults.reduce((agg, result) => {
      if (Array.isArray(result)) {
        agg = [...agg, ...result];
      } else {
        agg.push(result);
      }
      return agg;
    }, []);

    if (
      results.every(
        entry =>
          entry.fromCurrency === fromCurrency && entry.toCurrency === toCurrency
      )
    ) {
      this.providerData = bestProviderForQuantity(
        results.map(entry => {
          if (+entry.rate > 0) {
            return {
              provider: entry.provider,
              fromCurrency,
              fromValue: fromValue,
              toCurrency,
              rate: +entry.rate,
              minValue: entry.minValue || 0,
              maxValue: entry.maxValue || 0,
              computeConversion: _fromValue => {
                const decimals = this.fiatCurrenciesArray.includes(toCurrency)
                  ? 2
                  : 6;
                return new BigNumber(_fromValue)
                  .times(entry.rate)
                  .toFixed(decimals)
                  .toString(10);
              },
              additional: entry.additional || {}
            };
          }
        }),
        fromValue
      );
      // this.updateEstimate(to);
    }
  }
}
