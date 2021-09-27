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
  let customTokensByNetwork = state.customTokens[network.type.name];
  if (!state.customTokens[network.type.name]) {
    customTokensByNetwork = [];
  }
  customTokensByNetwork.unshift(token);
  Vue.set(state.customTokens, network.type.name, customTokensByNetwork);
};

const DELETE_CUSTOM_TOKEN = function (state, { token, rootGetters }) {
  const network = rootGetters['global/network'];
  const currentCustomTokens = state.customTokens[network.type.name].filter(
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
  Vue.set(state.customTokens, network.type.name, currentCustomTokens);
};

const DELETE_ALL_TOKENS = function (state, { rootGetters }) {
  const network = rootGetters['global/network'];
  let customTokensByNetwork = state.customContracts[network.type.name];
  customTokensByNetwork = [];
  Vue.set(state.customTokens, network.type.name, customTokensByNetwork);
};

const SET_CUSTOM_CONTRACT = function (state, { token, rootGetters }) {
  const network = rootGetters['global/network'];
  let customContractsByNetwork = state.customContracts[network.type.name];
  if (!state.customContracts[network.type.name]) {
    customContractsByNetwork = [];
  }
  customContractsByNetwork.unshift(token);
  Vue.set(state.customContracts, network.type.name, customContractsByNetwork);
};

const DELETE_CUSTOM_CONTRACT = function (state, { token, rootGetters }) {
  const network = rootGetters['global/network'];
  const currentcustomContracts = state.customContracts[
    network.type.name
  ].filter(currentTokens => {
    const found = token.find(item => {
      if (item.address === currentTokens.contract) {
        return item;
      }
    });
    if (!found) {
      return currentTokens;
    }
  });
  Vue.set(state.customContracts, network.type.name, currentcustomContracts);
};

const DELETE_ALL_CONTRACTS = function (state, { rootGetters }) {
  const network = rootGetters['global/network'];
  let customContractsByNetwork = state.customContracts[network.type.name];
  customContractsByNetwork = [];
  Vue.set(state.customContracts, network.type.name, customContractsByNetwork);
};
export default {
  SET_CUSTOM_TOKEN,
  DELETE_ALL_TOKENS,
  DELETE_CUSTOM_TOKEN,
  SET_CUSTOM_CONTRACT,
  DELETE_ALL_CONTRACTS,
  DELETE_CUSTOM_CONTRACT,
  INIT_STORE
};
