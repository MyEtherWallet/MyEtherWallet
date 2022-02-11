import { toBN } from 'web3-utils';

const setOnlineStatus = function ({ commit, dispatch }, val) {
  if (val) dispatch('wallet/setWeb3Instance', null, { root: true });
  commit('SET_ONLINE_STATUS', val);
};

const setLocale = function ({ commit }, val) {
  commit('SET_LOCALE', val);
};

const updateGasPrice = function ({ rootState, dispatch, getters, state }) {
  const web3 = rootState.wallet.web3;
  if (!getters.isEIP1559SupportedNetwork) {
    return web3.eth.getGasPrice().then(res => {
      const modifiedGasPrice = toBN(res).muln(
        getters.network.type.gasPriceMultiplier
      );
      return dispatch('setGasPrice', modifiedGasPrice.toString());
    });
  }
  return web3.eth.getGasPrice().then(gasPrice => {
    const priorityFee = toBN(gasPrice).sub(toBN(state.eip1559.baseFeePerGas));
    return dispatch('setMaxPriorityFeePerGas', priorityFee);
  });
};
const setGasPrice = function ({ commit }, gasPrice) {
  commit('SET_GAS_PRICE', gasPrice);
};

const setGasPriceType = function ({ commit }, type) {
  commit('SET_GAS_PRICE_TYPE', type);
};
const setNetwork = function ({ commit }, networkObj) {
  commit('SET_NETWORK', networkObj);
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
const setTrackingConsent = function ({ commit, dispatch }, val) {
  commit('SET_TRACKING_CONSENT', val);
  dispatch('setTracking');
};

const neverShowPromo = function ({ commit }) {
  commit('NEVER_SHOW_WALLET_PROMO');
};

const setPromoOver = function ({ commit }) {
  commit('SET_PROMO_OVER');
};

const setTracking = function ({ state }) {
  const matomoExists = () => {
    return new Promise(resolve => {
      const checkInterval = 50;
      const timeout = 5000;
      const waitStart = Date.now();
      const interval = setInterval(() => {
        if (this._vm.$matomo) {
          clearInterval(interval);
          return resolve();
        }
        if (Date.now() >= waitStart + timeout) {
          clearInterval(interval);
        }
      }, checkInterval);
    });
  };
  matomoExists().then(() => {
    if (state.consentToTrack) this._vm.$matomo.setConsentGiven();
    else this._vm.$matomo.forgetConsentGiven();
  });
};
export default {
  updateGasPrice,
  setOnlineStatus,
  setLocale,
  setNetwork,
  setGasPrice,
  setGasPriceType,
  setImportedState,
  addLocalContract,
  setMaxPriorityFeePerGas,
  setBaseFeePerGas,
  setTrackingConsent,
  setTracking,
  neverShowPromo,
  setPromoOver
};
