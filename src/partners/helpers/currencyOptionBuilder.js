import { BityCurrencies } from '../bity/index';
import { KyberCurrencies } from '../kyber/index';
import { ChangellyCurrencies } from '../changelly/index';
import { SimplexCurrencies } from '../simplex/index';

/*function disabledPairing(currencyList, symbol, invalid, side) {
  if (currencyList[symbol]) {
    if (side === 'from') {
      if (currencyList[symbol].invalidFrom) {
        return !currencyList[symbol].invalidFrom.includes(invalid);
      }
      return true;
    }
    return true;
  }
}

function comparator(a, b) {
  a = a.symbol;
  b = b.symbol;
  return a < b ? -1 : a > b ? 1 : 0;
}*/

// TODO: variable conventions & on moving each part into the respective partner dir
export default class CurrencyOptionBuilder {
  constructor(props = {}) {
    this.network = props.network || 'ETH';
    this.changellyCurrencies = props.changelly || ChangellyCurrencies;
    this.bityCurrencies = props.bity || BityCurrencies;
    this.simplexCurrencies = props.simplex || SimplexCurrencies;
    this.kybernetworkCurrencies = props.kyber || KyberCurrencies;
  }
  /*
  buildInitialCurrencyArrays() {
    const collectMapTo = new Map();
    const collectMapFrom = new Map();
    for (const prop in this.bityCurrencies) {
      if (this.bityCurrencies[prop])
        collectMapTo.set(prop, {
          symbol: prop,
          name: this.bityCurrencies[prop].name
        });
      collectMapFrom.set(prop, {
        symbol: prop,
        name: this.bityCurrencies[prop].name
      });
    }
    for (const prop in this.kybernetworkCurrencies) {
      if (this.kybernetworkCurrencies[prop])
        collectMapTo.set(prop, {
          symbol: prop,
          name: this.kybernetworkCurrencies[prop].name
        });
      collectMapFrom.set(prop, {
        symbol: prop,
        name: this.kybernetworkCurrencies[prop].name
      });
    }
    for (const prop in this.changellyCurrencies) {
      if (this.changellyCurrencies[prop])
        collectMapTo.set(prop, {
          symbol: prop,
          name: this.changellyCurrencies[prop].name
        });
      collectMapFrom.set(prop, {
        symbol: prop,
        name: this.changellyCurrencies[prop].name
      });
    }
    for (const prop in this.simplexCurrencies.fiat) {
      if (this.simplexCurrencies.fiat[prop])
        collectMapFrom.set(prop, {
          symbol: prop,
          name: this.simplexCurrencies.fiat[prop].name
        });
    }
    for (const prop in this.simplexCurrencies.digital) {
      if (this.simplexCurrencies.digital[prop])
        collectMapTo.set(prop, {
          symbol: prop,
          name: this.simplexCurrencies.digital[prop].name
        });
    }
    // collectMapTo.set('ETH', { symbol: 'ETH', name: 'Ether' });
    // collectMapFrom.set('ETH', { symbol: 'ETH', name: 'Ether' });
    if (collectMapTo.has('ETH')) collectMapTo.delete('ETH');
    if (collectMapFrom.has('ETH')) collectMapFrom.delete('ETH');

    const toArray = Array.from(collectMapTo.values()).sort(comparator);
    const fromArray = Array.from(collectMapFrom.values()).sort(comparator);
    toArray.splice(0, 0, { symbol: 'ETH', name: 'Ether' });
    fromArray.splice(0, 0, { symbol: 'ETH', name: 'Ether' });
    // const toArray = this.addBtcAndEthToTop(
    //   Array.from(collectMapTo.values()).sort(comparator),
    //   { symbol: 'BTC', name: 'Bitcoin' }
    // );
    //
    // const fromArray = this.addBtcAndEthToTop(
    //   Array.from(collectMapFrom.values()).sort(comparator),
    //   { symbol: 'ETH', name: 'Ether' }
    // );
    return { toArray, fromArray };
  }

  setFromCurrencyBuilder(value) {
    const collectMap = new Map();
    if (this.bityCurrencies[value.symbol]) {
      for (const prop in this.bityCurrencies) {
        if (
          prop !== value.symbol &&
          disabledPairing(this.bityCurrencies, value.symbol, prop, 'from')
        ) {
          if (this.bityCurrencies[prop])
            collectMap.set(prop, {
              symbol: prop,
              name: this.bityCurrencies[prop].name
            });
        }
      }
    }
    if (this.kybernetworkCurrencies[value.symbol]) {
      for (const prop in this.kybernetworkCurrencies) {
        if (prop !== value.symbol) {
          if (this.kybernetworkCurrencies[prop])
            collectMap.set(prop, {
              symbol: prop,
              name: this.kybernetworkCurrencies[prop].name
            });
        }
      }
    }
    if (this.changellyCurrencies[value.symbol]) {
      for (const prop in this.changellyCurrencies) {
        if (prop !== value.symbol) {
          if (this.changellyCurrencies[prop])
            collectMap.set(prop, {
              symbol: prop,
              name: this.changellyCurrencies[prop].name
            });
        }
      }
    }
    if (this.simplexCurrencies.digital[value.symbol]) {
      for (const prop in this.simplexCurrencies.fiat) {
        if (prop !== value.symbol) {
          if (this.simplexCurrencies.fiat[prop])
            collectMap.set(prop, {
              symbol: prop,
              name: this.simplexCurrencies.fiat[prop].name
            });
        }
      }
    }
    // collectMap.set('ETH', { symbol: 'ETH', name: 'Ether' });
    // return Array.from(collectMap.values()).sort(comparator);
    if (collectMap.has('ETH')) collectMap.delete('ETH');
    const toArray = Array.from(collectMap.values()).sort(comparator);
    return [{ symbol: 'ETH', name: 'Ether' }, ...toArray];
  }

  setToCurrencyBuilder(value) {
    const collectMap = new Map();
    if (this.bityCurrencies[value.symbol]) {
      for (const prop in this.bityCurrencies) {
        if (prop !== value.symbol) {
          if (this.bityCurrencies[prop])
            collectMap.set(prop, {
              symbol: prop,
              name: this.bityCurrencies[prop].name
            });
        }
      }
    }
    if (this.kybernetworkCurrencies[value.symbol]) {
      for (const prop in this.kybernetworkCurrencies) {
        if (prop !== value.symbol) {
          if (this.kybernetworkCurrencies[prop])
            collectMap.set(prop, {
              symbol: prop,
              name: this.kybernetworkCurrencies[prop].name
            });
        }
      }
    }
    if (this.changellyCurrencies[value.symbol]) {
      for (const prop in this.changellyCurrencies) {
        if (prop !== value.symbol) {
          if (this.changellyCurrencies[prop])
            collectMap.set(prop, {
              symbol: prop,
              name: this.changellyCurrencies[prop].name
            });
        }
      }
    }
    if (this.simplexCurrencies.fiat[value.symbol]) {
      for (const prop in this.simplexCurrencies.digital) {
        if (prop !== value.symbol) {
          if (this.simplexCurrencies.digital[prop])
            collectMap.set(prop, {
              symbol: prop,
              name: this.simplexCurrencies.digital[prop].name
            });
        }
      }
    }
    // collectMap.set('ETH', { symbol: 'ETH', name: 'Ether' });
    // return Array.from(collectMap.values()).sort(comparator);
    if (collectMap.has('ETH')) collectMap.delete('ETH');
    const toArray = Array.from(collectMap.values()).sort(comparator);
    return [{ symbol: 'ETH', name: 'Ether' }, ...toArray];
    // if (collectMap.has('ETH')) collectMap.delete('ETH');
    // return Array.from(collectMap.values())
    //   .sort(comparator)
    //   .splice(0, 0, { symbol: 'ETH', name: 'Ether' });
  }*/
}

export { CurrencyOptionBuilder };
