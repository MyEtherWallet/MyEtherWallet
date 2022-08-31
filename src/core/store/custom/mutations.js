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
  const found = customTokensByNetwork.findIndex(
    t => t.contract.toLowerCase() === token.contract.toLowerCase()
  );
  if (found !== -1) {
    customTokensByNetwork[found] = token;
  } else {
    customTokensByNetwork.unshift(token);
  }
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
      // Check if token is in hiddenTokens
      const hiddenTokens = rootGetters['custom/hiddenTokens'];
      if (found && hiddenTokens.length > 0) {
        const newHiddenTokens = hiddenTokens.filter(item => {
          return found.address !== item.address;
        });
        Vue.set(state.hiddenTokens, network.type.name, newHiddenTokens);
      }
      if (!found) {
        return currentTokens;
      }
    }
  );
  Vue.set(state.tokens, network.type.name, currentCustomTokens);
};

const SET_HIDDEN_TOKEN = function (state, { token, rootGetters }) {
  const network = rootGetters['global/network'];
  let hiddenTokensByNetwork = state.hiddenTokens[network.type.name];
  if (!state.hiddenTokens[network.type.name]) {
    hiddenTokensByNetwork = [];
  }
  const found = hiddenTokensByNetwork.findIndex(
    t => t.address.toLowerCase() === token.address.toLowerCase()
  );
  if (found !== -1) {
    hiddenTokensByNetwork[found] = token;
  } else {
    hiddenTokensByNetwork.unshift(token);
  }
  Vue.set(state.hiddenTokens, network.type.name, hiddenTokensByNetwork);
};

const DELETE_HIDDEN_TOKEN = function (state, { token, rootGetters }) {
  const network = rootGetters['global/network'];
  const currentHiddenTokens = state.hiddenTokens[network.type.name].filter(
    currentTokens => {
      const found = token.find(item => {
        if (item.address === currentTokens.address) {
          return item;
        }
      });
      if (!found) {
        return currentTokens;
      }
    }
  );
  Vue.set(state.hiddenTokens, network.type.name, currentHiddenTokens);
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
  DELETE_CUSTOM_PATH,
  SET_HIDDEN_TOKEN,
  DELETE_HIDDEN_TOKEN
};
