import BigNumber from 'bignumber.js';
import {
  formatFloatingPointValue,
  formatIntegerValue
} from '@/core/helpers/numberFormatHelper';
import abi from '@/modules/balance/handlers/abiERC20.js';

const setCustomToken = function ({ rootGetters, commit }, token) {
  commit('SET_CUSTOM_TOKEN', { token, rootGetters });
};

const deleteToken = function ({ rootGetters, commit }, token) {
  commit('DELETE_CUSTOM_TOKEN', { token, rootGetters });
};

const deleteAll = function ({ rootGetters, commit }) {
  commit('DELETE_ALL_TOKENS', { rootGetters });
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
      const newContract = new rootState.wallet.web3.eth.Contract(
        abi,
        item.contract
      );
      newContract.methods
        .balanceOf(rootState.wallet.address)
        .call()
        .then(res => {
          newToken.balancef = _getTokenBalance(res, item.decimals).value;
          newToken.balance = _getTokenBalance(newToken.balancef).value;
          dispatch('setCustomToken', newToken);
        });
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
  updateCustomTokenBalances
};
