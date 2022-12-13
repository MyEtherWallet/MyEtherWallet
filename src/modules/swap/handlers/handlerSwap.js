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
    const notDoge = address =>
      address?.toLowerCase() !== DOGE_ADDRESS.toLowerCase();

    return this.providers[0].getSupportedTokens().then(baseList => {
      if (baseList?.tokens && baseList?.tokens.length > 0)
        // Add tokens to TokenList
        baseList?.tokens.forEach(t => {
          if (notDoge(t.contract)) allTokens[t.contract] = t;
        });
      //Get tokens From changelly
      return Promise.all(
        this.providers.slice(3).map(p => {
          if (!p.isSupportedNetwork(this.chain)) return Promise.resolve();
          return p.getSupportedTokens().then(tokens => {
            if (tokens && tokens.length > 0) {
              tokens.forEach(t => {
                // ignore doge and existing tokens
                if (notDoge(t.contract) && !allTokens[t.contract]) {
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
          toTokens: sorted,
          featured: baseList.featured
        };
      });
    });
  }
  // Receive All Quotes and trades for mew,
  // Changelly must be retrieved individually
  getAllQuotes({ fromT, toT, fromAmount, fromAddress }) {
    let allQuotes = [];
    const providers = [this.providers[0], this.providers[3]];

    return Promise.all(
      providers.map((p, i) => {
        if (!p.isSupportedNetwork(this.chain)) return Promise.resolve();
        return i === 0
          ? p.getTrade({ fromT, toT, fromAmount, fromAddress }).then(quotes => {
              allQuotes = allQuotes.concat(quotes);
            })
          : p.getQuote({ fromT, toT, fromAmount }).then(quotes => {
              allQuotes = allQuotes.concat(quotes);
            });
      })
    ).then(() => {
      allQuotes.sort((q1, q2) => {
        // Distinguishes between changelly amount and mew
        const amount1 = q1.amount ? q1.amount : q1.minimum;
        const amount2 = q2.amount ? q2.amount : q2.minimum;
        if (new BigNumber(amount1).gt(new BigNumber(amount2))) return -1;
        return 1;
      });

      // Set Provider information
      return allQuotes.map(q => {
        const provider = q.exchange || q.provider.toLowerCase();
        if (Configs.exchangeInfo[provider]) {
          q.exchangeInfo = Configs.exchangeInfo[provider];
        } else {
          q.exchangeInfo = Configs.exchangeInfo.default;
          q.exchangeInfo.name = provider;
        }
        return q;
      });
    });
  }
  getQuotesForSet(arr) {
    const quotes = [];
    const provider = this.providers[3];
    for (let i = 0; i < arr.length; i++) {
      quotes.push(provider.getTrade(arr[i]));
    }
    return Promise.all(quotes);
  }

  // Get trade only for Changelly
  // Other trades can be received through getAllQuotes
  getTrade(tradeInfo) {
    if (tradeInfo.provider === 'changelly')
      return this.providers[3].getTrade(tradeInfo);
  }
  isValidToAddress(addressInfo) {
    for (const p of this.providers) {
      if (p.provider === addressInfo.provider)
        return p.isValidToAddress(addressInfo);
    }
  }
  executeTrade(tradeInfo, confirmInfo) {
    for (const p of this.providers) {
      if (p.provider === tradeInfo.provider)
        return p.executeTrade(tradeInfo, confirmInfo);
    }
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
