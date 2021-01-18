import { OneInch, DexAg } from './providers';
import BigNumber from 'bignumber.js';
import Configs from './configs';
const getUniqueTokens = tokens => {
  const uniqueContracts = [];
  const uniqueTokens = [];
  tokens.forEach(t => {
    if (uniqueContracts.indexOf(t.contract_address) === -1) {
      uniqueTokens.push(t);
      uniqueContracts.push(t.contract_address);
    }
  });
  return uniqueTokens;
};
class Swap {
  constructor(web3) {
    this.providers = [new OneInch(web3), new DexAg(web3)];
  }
  getAllTokens() {
    let allTokens = [];
    return Promise.all(
      this.providers.map(p => {
        return p.getSupportedTokens().then(tokens => {
          allTokens = allTokens.concat(tokens);
        });
      })
    ).then(() => getUniqueTokens(allTokens));
  }
  getAllQuotes({ fromT, toT, fromAmount }) {
    let allQuotes = [];
    return Promise.all(
      this.providers.map(p => {
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
        q.dexInfo = Configs.dexInfo[q.dex];
        return q;
      });
    });
  }
}

export default Swap;
