import localStore from 'store';
import Configs from '../configs';
import Vue from 'vue';

const INIT_STORE = function (state) {
  if (localStore.get(Configs.LOCAL_STORAGE_KEYS.custom)) {
    const savedStore = localStore.get(Configs.LOCAL_STORAGE_KEYS.custom);
    if (savedStore.stateVersion === Configs.VERSION.custom) {
      Object.assign(state, savedStore);
    }
  }
};
const SET_CUSTOM_TOKEN = function (state, { token, rootGetters }) {
  const network = rootGetters['global/network'];
  let customTokensByNetwork = state.tokens[network.type.name];
  if (!state.tokens[network.type.name]) {
    customTokensByNetwork = [];
  }
  customTokensByNetwork.unshift(token);
  Vue.set(state.tokens, network.type.name, customTokensByNetwork);
};

const DELETE_CUSTOM_TOKEN = function (state, { token, rootGetters }) {
  const network = rootGetters['global/network'];
  const currentCustomTokens = state.tokens[network.type.name].filter(
    currentTokens => {
      const found = token.find(item => {
        if (item.address === currentTokens.contract) {
          return item;
        }
      });
      if (!found) {
        return currentTokens;
      }
    }
  );
  Vue.set(state.tokens, network.type.name, currentCustomTokens);
};

const DELETE_ALL_TOKENS = function (state, { rootGetters }) {
  const network = rootGetters['global/network'];
  let customTokensByNetwork = state.tokens[network.type.name];
  customTokensByNetwork = [];
  Vue.set(state.tokens, network.type.name, customTokensByNetwork);
};

const SET_ADDRESS_BOOK = function (state, val) {
  state.addressBook = val;
};

const ADD_CUSTOM_PATH = function (state, path) {
  state.paths.push(path);
};
const DELETE_CUSTOM_PATH = function (state, paths) {
  const idx = state.paths.findIndex(item => {
    if (item.path === paths.path) {
      return item;
    }
  });

  if (idx >= 0) {
    state.paths.splice(idx, 1);
  }
};

export default {
  SET_CUSTOM_TOKEN,
  DELETE_ALL_TOKENS,
  DELETE_CUSTOM_TOKEN,
  INIT_STORE,
  SET_ADDRESS_BOOK,
  ADD_CUSTOM_PATH,
  DELETE_CUSTOM_PATH
};
