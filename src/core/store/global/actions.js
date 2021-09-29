const setOnlineStatus = function ({ commit, dispatch }, val) {
  if (val) dispatch('wallet/setWeb3Instance', null, { root: true });
  commit('SET_ONLINE_STATUS', val);
};

const setLocale = function ({ commit }, val) {
  commit('SET_LOCALE', val);
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
const addCustomPath = function ({ commit }, val) {
  commit('ADD_CUSTOM_PATH', val);
};

const deleteCustomPath = function ({ commit }, val) {
  commit('DELETE_CUSTOM_PATH', val);
};

const setTrackingConsent = function ({ commit, dispatch }, val) {
  commit('SET_TRACKING_CONSENT', val);
  dispatch('setTracking');
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
  setOnlineStatus,
  setLocale,
  setNetwork,
  setGasPrice,
  setGasPriceType,
  setImportedState,
  addLocalContract,
  addCustomPath,
  deleteCustomPath,
  setTrackingConsent,
  setTracking
};
