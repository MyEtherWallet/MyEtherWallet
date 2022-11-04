import { OneInch, ZEROX, ParaSwap, Changelly } from './providers';
import BigNumber from 'bignumber.js';
import Configs from './configs/providersConfigs';
import hasValidDecimals from '@/core/helpers/hasValidDecimals.js';
import { isObject } from 'lodash';

class Swap {
  constructor(web3, chain) {
    this.providers = [
      new OneInch(web3, chain),
      new ZEROX(web3, chain),
      new ParaSwap(web3, chain),
      new Changelly(web3, chain)
    ];
    this.chain = chain;
  }
  getAllTokens() {
    const allTokens = {};
    const DOGE_ADDRESS = '0x4206931337dc273a630d328dA6441786BfaD668f';
    return this.providers[0].getSupportedTokens().then(baseList => {
      if (baseList && baseList.length > 0)
        baseList.forEach(t => {
          if (t.contract?.toLowerCase() !== DOGE_ADDRESS.toLowerCase())
            allTokens[t.contract] = t;
        });
      return Promise.all(
        this.providers.slice(3).map(p => {
          if (!p.isSupportedNetwork(this.chain)) return Promise.resolve();
          return p.getSupportedTokens().then(tokens => {
            if (tokens && tokens.length > 0) {
              tokens.forEach(t => {
                if (
                  t.contract?.toLowerCase() !== DOGE_ADDRESS.toLowerCase() &&
                  !allTokens[t.contract]
                ) {
                  allTokens[t.contract] = t;
                }
              });
            }
          });
        })
      ).then(() => {
        const sorted = Object.values(allTokens)
          .filter(t => isObject(t))
          .sort((a, b) => {
            if (a.name > b.name) return 1;
            return -1;
          });
        return {
          fromTokens: sorted?.filter(t => {
            if (!t || !t.contract) return false;
            return t;
          }),
          toTokens: sorted
        };
      });
    });
  }
  getAllQuotes({ fromT, toT, fromAmount }) {
    let allQuotes = [];
    return Promise.all(
      this.providers.map(p => {
        if (!p.isSupportedNetwork(this.chain)) return Promise.resolve();
        return p.getQuote({ fromT, toT, fromAmount }).then(quotes => {
          allQuotes = allQuotes.concat(quotes);
        });
      })
    ).then(() => {
      allQuotes.sort((q1, q2) => {
        if (new BigNumber(q1.amount).gt(new BigNumber(q2.amount))) return -1;
        return 1;
      });
      return allQuotes.map(q => {
        if (Configs.exchangeInfo[q.exchange]) {
          q.exchangeInfo = Configs.exchangeInfo[q.exchange];
        } else {
          q.exchangeInfo = Configs.exchangeInfo.default;
          q.exchangeInfo.name = q.exchange;
        }
        return q;
      });
    });
  }
  getQuotesForSet(arr) {
    const quotes = [];
    const provider = this.providers[3];
    for (let i = 0; i < arr.length; i++) {
      quotes.push(provider.getQuote(arr[i]));
    }
    return Promise.all(quotes);
  }
  getTrade(tradeInfo) {
    for (const p of this.providers) {
      if (p.provider === tradeInfo.provider) return p.getTrade(tradeInfo);
    }
  }
  isValidToAddress(addressInfo) {
    for (const p of this.providers) {
      if (p.provider === addressInfo.provider)
        return p.isValidToAddress(addressInfo);
    }
  }
  executeTrade(tradeInfo, confirmInfo) {
    for (const p of this.providers)
      if (p.provider === tradeInfo.provider)
        return p.executeTrade(tradeInfo, confirmInfo);
  }
  getMinMaxAmount(tradeInfo) {
    for (const p of this.providers) {
      if (p.provider === tradeInfo.provider)
        return p.getMinMaxAmount(tradeInfo);
    }
  }
  getStatus(statusObj) {
    for (const p of this.providers) {
      if (p.provider === statusObj.provider) return p.getStatus(statusObj);
    }
  }
}

Swap.helpers = {
  hasValidDecimals
};

export default Swap;
