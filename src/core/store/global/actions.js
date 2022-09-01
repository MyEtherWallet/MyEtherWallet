import matchNetwork from '@/core/helpers/matchNetwork';
import { toBNSafe } from '@/core/helpers/numberFormatHelper';

const setOnlineStatus = function ({ commit, dispatch }, val) {
  if (val) dispatch('wallet/setWeb3Instance', null, { root: true });
  commit('SET_ONLINE_STATUS', val);
};

const setLocale = function ({ commit }, val) {
  commit('SET_LOCALE', val);
};
const setPreferredCurrency = function ({ commit }, val) {
  commit('SET_PREFERRED_CURRENCY', val);
};

const updateGasPrice = function ({ rootState, dispatch, getters, state }) {
  const web3 = rootState.wallet.web3;
  const { gasPriceMultiplier } = getters.network.type;
  if (!getters.isEIP1559SupportedNetwork) {
    return web3.eth.getGasPrice().then(res => {
      const modifiedGasPrice = toBNSafe(res).muln(gasPriceMultiplier);
      return dispatch('setGasPrice', modifiedGasPrice.toString());
    });
  }
  return web3.eth.getGasPrice().then(gasPrice => {
    const modGas = toBNSafe(gasPrice).muln(gasPriceMultiplier);
    const priorityFee = toBNSafe(modGas).sub(
      toBNSafe(state.eip1559.baseFeePerGas)
    );
    return dispatch('setMaxPriorityFeePerGas', priorityFee);
  });
};
const setGasPrice = function ({ commit }, gasPrice) {
  commit('SET_GAS_PRICE', gasPrice);
};

const setGasPriceType = function ({ commit }, type) {
  commit('SET_GAS_PRICE_TYPE', type);
};
const setNetwork = async function (
  { commit, dispatch },
  { network, walletType }
) {
  const chainID = network?.type?.chainID;
  const matched = await matchNetwork(chainID, walletType);
  if (matched) commit('SET_NETWORK', network);
  dispatch('swap/resetPrefetch', null, { root: true });
  dispatch('wallet/setAccountBalance', '0', { root: true });
};
const setValidNetwork = function ({ commit }, valid) {
  commit('SET_VALID_NETWORK', valid);
};
const addLocalContract = function ({ commit }, localContract) {
  commit('ADD_LOCAL_CONTRACT', localContract);
};
const setImportedState = function ({ commit }, stateObj) {
  stateObj['localStore'] = true;
  commit('SET_IMPORTED_STATE', stateObj);
};
const setMaxPriorityFeePerGas = function ({ commit }, valBN) {
  commit('SET_MAX_PRIORITY_FEE_PER_GAS', valBN);
};

const setBaseFeePerGas = function ({ commit }, valBN) {
  commit('SET_BASE_FEE_PER_GAS', valBN);
};

export default {
  updateGasPrice,
  setOnlineStatus,
  setLocale,
  setPreferredCurrency,
  setValidNetwork,
  setNetwork,
  setGasPrice,
  setGasPriceType,
  setImportedState,
  addLocalContract,
  setMaxPriorityFeePerGas,
  setBaseFeePerGas
};
