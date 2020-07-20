import {
  SwapProviders,
  providers,
  bestProviderForQuantity
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

export default class SWAP {
  constructor(environment) {
    this.swap = new SwapProviders(providers, environment);
  }
  setErrorHandler(name) {
    name = '';
    return name.indexOf('.') > 0;
  }
  resolveName() {}
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
      this.updateEstimate(to);
    }
  }
}
