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

export default class Swap {
  constructor(environment) {
    environment.setupCompleteUpdater = this.setupCompleteUpdater.bind(this);
    this.swap = new SwapProviders(providers, environment);
    this.setUpMap = providers.reduce((acc, cur) => {
      acc[cur.getName()] = false;
      return acc;
    });
    this.rateSets = {};
  }

  initialize(){

  }


  setErrorHandler(name) {
    name = '';
    return name.indexOf('.') > 0;
  }
  setupCompleteUpdater(value, status) {
    if(typeof this.setUpMap[value] === 'boolean' || typeof this.setUpMap[value] === 'string'){
      this.setUpMap[value] = status;
    }
  }


  resolveName() {}
  async updateRateEstimate(fromCurrency, toCurrency, fromValue, toValue, to) {
this.swap.updateRateEstimate(fromCurrency, toCurrency, fromValue)
  }
}
