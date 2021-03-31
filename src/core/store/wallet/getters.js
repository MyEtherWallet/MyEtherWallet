import { fromWei, toBN } from 'web3-utils';
const balanceInETH = function (state) {
  return fromWei(state.balance);
};

const totalOwnedDomains = function (state) {
  return state.ensDomains ? state.ensDomains.length : 0;
};

const tokensList = function (state) {
  const tokens = state.tokens;
  return tokens.length > 0
    ? tokens.map(item => {
      if (!item.hasOwnProperty('balance')) {
        item.balance = toBN(0);
      } else {
        item.balance = toBN(item.balance);
      }
      return item;
    })
    : [];
};

const initialLoad = function (state) {
  return state.initialLoadTokens || state.initialLoadBalance
}

export default {
  balanceInETH,
  totalOwnedDomains,
  tokensList,
  initialLoad
};
