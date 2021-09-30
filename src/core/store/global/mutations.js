import localStore from 'store';
import Configs from '../configs';
const INIT_STORE = function (state) {
  if (localStore.get(Configs.LOCAL_STORAGE_KEYS.global)) {
    const savedStore = localStore.get(Configs.LOCAL_STORAGE_KEYS.global);
    if (savedStore.stateVersion === Configs.VERSION.global) {
      Object.assign(state, savedStore);
    }
  }
};
const SET_ONLINE_STATUS = async function (state, status) {
  state.online = status;
};

const SET_LOCALE = function (state, { locale }) {
  state.locale = locale;
};

const SET_GAS_PRICE = function (state, val) {
  state.baseGasPrice = val;
};

const SET_NETWORK = function (state, networkObj) {
  const _netObj = Object.assign({}, networkObj);
  _netObj.type = {
    name: networkObj.type.name
  };
  state.currentNetwork = _netObj;
};
const SET_GAS_PRICE_TYPE = function (state, type) {
  state.gasPriceType = type;
};
const ADD_CUSTOM_PATH = function (state, path) {
  state.customPaths.push(path);
};
const DELETE_CUSTOM_PATH = function (state, customPaths) {
  const idx = state.customPaths.findIndex(item => {
    if (item.path === customPaths.path) {
      return item;
    }
  });

  if (idx) {
    state.customPaths.splice(idx, 1);
  }
};
const SET_IMPORTED_STATE = function (currentState, newState) {
  Object.keys(newState).forEach(item => {
    currentState[item] = newState[item];
  });
};

const ADD_LOCAL_CONTRACT = function (state, contract) {
  if (!state.localContracts[state.currentNetwork.type.name])
    state.localContracts[state.currentNetwork.type.name] = [];
  state.localContracts[state.currentNetwork.type.name].push(contract);
};
const SET_BASE_FEE_PER_GAS = function (state, baseFeePerGasBN) {
  state.eip1559.baseFeePerGas = baseFeePerGasBN.toString();
};
const SET_MAX_PRIORITY_FEE_PER_GAS = function (state, maxPriorityFeePerGasBN) {
  state.eip1559.maxPriorityFeePerGas = maxPriorityFeePerGasBN.toString();
};
const SET_TRACKING_CONSENT = function (state, val) {
  if (this._vm.$matomo) {
    this._vm.$matomo.setConsentGiven();
    this._vm.$matomo.trackEvent('consent', val ? 'true' : 'false');
    if (!val) this._vm.$matomo.forgetConsentGiven();
  }
  state.consentToTrack = val;
};

const NEVER_SHOW_TRACKING = function (state) {
  state.displayedTrackingPopup = true;
};

export default {
  SET_ONLINE_STATUS,
  SET_LOCALE,
  SET_GAS_PRICE,
  SET_NETWORK,
  INIT_STORE,
  SET_GAS_PRICE_TYPE,
  ADD_CUSTOM_PATH,
  DELETE_CUSTOM_PATH,
  SET_IMPORTED_STATE,
  ADD_LOCAL_CONTRACT,
  SET_BASE_FEE_PER_GAS,
  SET_MAX_PRIORITY_FEE_PER_GAS,
  SET_TRACKING_CONSENT,
  NEVER_SHOW_TRACKING
};
