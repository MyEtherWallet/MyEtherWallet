import {
  bestProviderForQuantity,
  bestRateForQuantity,
  providerNames,
  providers,
  SwapProviders
} from './partners';
import BigNumber from 'bignumber.js';
import EventEmitter from 'events';
import uuid from 'uuid/v4';

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
    this.providerData = [];

    this.fromValue = 0;
    this.toValue = 0;
    this.fromCurrency = 'ETH';
  }

  getProviderData() {
    return this.providerData;
  }

  setSelectedProvider(provider) {
    this.selectedProvider = provider;
  }

  initialize() {}

  setErrorHandler(name) {
    name = '';
    return name.indexOf('.') > 0;
  }

  setupCompleteUpdater(value, status) {
    // this.setUpMap[value] = status;
    if (typeof status === 'boolean' || typeof status === 'string') {

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
      if (this.complete) {
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

  availableFromCurrencies(value) {
    return this.swap.setFromCurrencyBuilder(value);
  }

  providerList() {
    if (this.providerData.length > 0) {
      return bestProviderForQuantity([...this.providerData], this.fromValue);
    }
    return [];
  }

  bestRate(selectedProvider) {
    try {
      if (this.providerData.length > 0) {
        if (this.selectedProvider.provider && this.providerList().length > 0) {
          return this.providerList().find(entry => {
            if (selectedProvider) {
              return entry.provider === selectedProvider;
            }
            return entry.provider === this.selectedProvider.provider;
          }).rate;
        }
        return bestRateForQuantity([...this.providerList()], this.fromValue);
      }
      return this.lastBestRate;
    } catch (e) {
      console.error(e);
    }
    return null;
  }

  async updateRateEstimate(
    fromCurrency,
    toCurrency,
    fromValue,
    toValue,
    to,
    selectedProvider
  ) {
    return new Promise((resolve, reject) => {
      this.loadingData = true;
      this.recalculating = true;
      this.noProvidersPair = { fromCurrency, toCurrency };
      this.selectedProvider = {}; // Reset the selected provider when new rate pair is choosen
      this.providerData = [];
      const resultObject = {};
      const callId = uuid();
      this.swap
        .updateRateEstimate(fromCurrency, toCurrency, fromValue, toValue)
        .then(({ providersFound, callsToMake }) => {
          this.providersFound = providersFound;
          Promise.all(
            callsToMake.map(func =>
              func(fromCurrency, toCurrency, fromValue, toValue)
            )
          ).then(rawResults => {
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
                  entry.fromCurrency === fromCurrency &&
                  entry.toCurrency === toCurrency
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
                        const decimals = this.fiatCurrenciesArray.includes(
                          toCurrency
                        )
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
              this.emit('rates-updated', this.providerData);
              resolve(this.providerData);
              this.updateEstimate(
                to,
                fromCurrency,
                toCurrency,
                fromValue,
                toValue
              );
            } else {
              resolve([]);
            }
          });
        });
    });
  }

  getProvider(name){
    return this.swap.getProvider(name);
  }

  intermediateGasCheck() {}

  updateEstimateHelper(input, obj) {
    return this.updateEstimate(
      input,
      obj.fromCurrency,
      obj.toCurrency,
      obj.fromValue,
      obj.toValue
    );
  }

  async updateEstimate(
    input,
    fromCurrency,
    toCurrency,
    fromValue,
    toValue,
    selectedProvider
  ) {
    if (this.simplexUpdate) {
      this.simplexUpdate = false;
      return;
    }

    let /*fromValue, toValue,*/ simplexProvider, simplexRateDetails;
    switch (input) {
      case 'to':
        fromValue = this.swap.calculateFromValue(
          toValue,
          this.bestRate(selectedProvider),
          fromCurrency
        );
        this.intermediateGasCheck();
        break;
      case 'from':
        toValue = this.swap.calculateToValue(
          fromValue,
          this.bestRate(selectedProvider),
          toCurrency
        );
        this.intermediateGasCheck();
        break;
      case `${providerNames.simplex}to`:
        this.simplexUpdate = true;
        simplexProvider = this.swap.getProvider(this.providerNames.simplex);

        if (simplexProvider.canQuote(fromValue, toValue, fromCurrency)) {
          simplexRateDetails = await simplexProvider.updateDigital(
            fromCurrency,
            toCurrency,
            toValue
          );

          fromValue = simplexRateDetails.fromValue;
          toValue = simplexRateDetails.toValue;
        } else {
          simplexRateDetails = await simplexProvider.updateFiat(
            fromCurrency,
            toCurrency,
            -1
          );

          const rate = new BigNumber(simplexRateDetails.toValue)
            .div(simplexRateDetails.fromValue)
            .toString(10);

          fromValue = this.swap.calculateFromValue(toValue, rate, fromCurrency);
        }

        break;
      case `${providerNames.simplex}from`:
        this.simplexUpdate = true;
        simplexProvider = this.swap.getProvider(providerNames.simplex);
        if (simplexProvider.canQuote(fromValue, toValue, fromCurrency)) {
          simplexRateDetails = await simplexProvider.updateFiat(
            fromCurrency,
            toCurrency,
            fromValue
          );

          fromValue = simplexRateDetails.fromValue;
          toValue = simplexRateDetails.toValue;
        } else {
          simplexRateDetails = await simplexProvider.updateFiat(
            fromCurrency,
            toCurrency,
            -1
          );

          const rate = new BigNumber(simplexRateDetails.toValue)
            .div(simplexRateDetails.fromValue)
            .toString(10);

          toValue = this.swap.calculateToValue(fromValue, rate);
        }

        break;
      default:
        toValue = this.swap.calculateToValue(fromValue, this.bestRate);
        fromValue = this.swap.calculateFromValue(toValue, this.bestRate);
        // this.toValue = toValue;
        // this.fromValue = fromValue;
        this.intermediateGasCheck();
        break;
    }
    return {
      fromCurrency,
      toCurrency,
      fromValue,
      toValue
    };
  }
}
