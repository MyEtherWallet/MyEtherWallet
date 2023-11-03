import { fromWei, toBN } from 'web3-utils';
const balanceInETH = function (state) {
  if (!state.balance) state.balance = '0';
  return fromWei(state.balance);
};

const balanceInWei = function (state) {
  if (!state.balance) state.balance = '0';
  return state.balance.toString();
};

const totalOwnedDomains = function (state) {
  return state.ensDomains ? state.ensDomains.length : 0;
};

const tokensList = function (state, getters, rootState, rootGetters) {
  const tokens = state.tokens;
  return tokens.length > 0
    ? tokens.map(item => {
        if (!item.hasOwnProperty('balance')) {
          item.balance = toBN(0);
        } else {
          item.balance = toBN(item.balance);
        }
        // Check if token is in hiddenTokens
        let isHidden = false;
        const hiddenTokens = rootGetters['custom/hiddenTokens'];
        if (hiddenTokens.length > 0) {
          isHidden =
            hiddenTokens.find(token => {
              return item.contract == token.address;
            }) !== undefined;
        }
        item.isHidden = isHidden;
        return item;
      })
    : [];
};

const initialLoad = function (state) {
  return state.loadingWalletInfo;
};
const getLedgerApp = function (state) {
  return state.ledgerApp;
};

export default {
  balanceInETH,
  balanceInWei,
  totalOwnedDomains,
  tokensList,
  initialLoad,
  getLedgerApp
};
