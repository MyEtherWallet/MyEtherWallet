import BigNumber from 'bignumber.js';
import {
  formatFloatingPointValue,
  formatIntegerValue
} from '@/core/helpers/numberFormatHelper';
import abi from '@/modules/balance/handlers/abiERC20.js';
import { ERROR, Toast } from '@/modules/toast/handler/handlerToast';
import { isValidAddress } from 'ethereumjs-util';

const setCustomToken = function ({ rootGetters, commit }, token) {
  commit('SET_CUSTOM_TOKEN', { token, rootGetters });
};

const deleteToken = function ({ rootGetters, commit }, token) {
  commit('DELETE_CUSTOM_TOKEN', { token, rootGetters });
};

const deleteAll = function ({ rootGetters, commit }) {
  commit('DELETE_ALL_TOKENS', { rootGetters });
};

const setHiddenToken = function ({ rootGetters, commit }, token) {
  commit('SET_HIDDEN_TOKEN', { token, rootGetters });
};

const deleteHiddenToken = function ({ rootGetters, commit }, token) {
  commit('DELETE_HIDDEN_TOKEN', { token, rootGetters });
};

const setAddressBook = function ({ commit }, addressBook) {
  commit('SET_ADDRESS_BOOK', addressBook);
};

const addCustomPath = function ({ commit }, val) {
  commit('ADD_CUSTOM_PATH', val);
};

const deleteCustomPath = function ({ commit }, val) {
  commit('DELETE_CUSTOM_PATH', val);
};
const deleteAllCustomPaths = function ({ commit }) {
  commit('DELETE_ALL_CUSTOM_PATHS');
};

const updateCustomTokenBalances = function ({ dispatch, getters, rootState }) {
  const _getTokenBalance = (balance, decimals) => {
    let n = new BigNumber(balance);
    if (decimals) {
      n = n.div(new BigNumber(10).pow(decimals));
      n = formatFloatingPointValue(n);
    } else {
      n = formatIntegerValue(n);
    }
    return n;
  };
  if (getters.hasCustom) {
    getters.customTokens.forEach(item => {
      const newToken = Object.assign({}, item);
      if (!isValidAddress(item.contract)) return;
      const newContract = new rootState.wallet.web3.eth.Contract(
        abi,
        item.contract
      );
      newContract.methods
        .balanceOf(rootState.wallet.address)
        .call()
        .then(res => {
          newToken.balancef = _getTokenBalance(res, item.decimals).value;
          newToken.balance = res;
          dispatch('setCustomToken', newToken);
        })
        .catch(e => Toast(e.message, {}, ERROR));
    });
  }
};

export default {
  setAddressBook,
  setCustomToken,
  deleteAll,
  deleteToken,
  addCustomPath,
  deleteCustomPath,
  deleteAllCustomPaths,
  updateCustomTokenBalances,
  setHiddenToken,
  deleteHiddenToken
};
