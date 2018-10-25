import url from 'url';
import web3 from 'web3';
import MEWProvider from '@/wallets/web3-provider';

const addNotification = function({ commit, state }, val) {
  const address = web3.utils.toChecksumAddress(val[0]);
  const newNotif = {};
  Object.keys(state.notifications).forEach(item => {
    newNotif[item] = state.notifications[item];
  });

  if (!Array.isArray(newNotif[address])) newNotif[address] = [];

  newNotif[address].push({
    title: val[2],
    read: false,
    timestamp: new Date(),
    body: val[1].hasOwnProperty('message') ? val[1].message : val[1],
    expanded: false
  });

  commit('ADD_NOTIFICATION', newNotif);
};

const addCustomPath = function({ commit, state }, val) {
  const newPaths = { ...state.customPaths };
  newPaths[val.dpath] = { label: val.label, dpath: val.dpath };
  commit('ADD_CUSTOM_PATH', newPaths);
};

const checkIfOnline = function({ commit }) {
  commit('CHECK_IF_ONLINE');
};

const clearWallet = function({ commit, state }) {
  if (state.wallet.identifier === 'MEWconnect') {
    state.wallet.wallet.mewConnectDisconnect();
  }
  commit('CLEAR_WALLET');
};

const createAndSignTx = function({ commit }, val) {
  commit('CREATE_AND_SIGN_TX', val);
};

const decryptWallet = function({ commit, dispatch }, wallet) {
  commit('DECRYPT_WALLET', wallet);
  dispatch('setWeb3Instance');
};

const setAccountBalance = function({ commit }, balance) {
  commit('SET_ACCOUNT_BALANCE', +balance);
};

const setGasPrice = function({ commit }, gasPrice) {
  commit('SET_GAS_PRICE', gasPrice);
};

const setWeb3Wallet = function({ commit }, wallet) {
  commit('SET_WEB3_PROVIDER_WALLET', wallet);
};

const setState = function({ commit }, stateObj) {
  commit('INIT_STATES', stateObj);
};

const setWeb3Instance = function({ dispatch, commit, state }, provider) {
  const hostUrl = url.parse(state.network.url);
  const web3Instance = new web3(
    new MEWProvider(
      provider
        ? provider
        : `${hostUrl.protocol}//${hostUrl.host}:${state.network.port}${
            hostUrl.pathname
          }`,
      null,
      {
        state: state,
        dispatch
      },
      this._vm.$eventHub
    )
  );
  commit('SET_WEB3_INSTANCE', web3Instance);
};

const switchNetwork = function({ commit }, networkObj) {
  // check if wallet is hardware.  if true, check if it supports this network. if not, do nothing
  commit('SWITCH_NETWORK', networkObj);
};
const setENS = function({ commit }, ens) {
  commit('SET_ENS', ens);
};

const updateNotification = function({ commit, state }, val) {
  // address, index, object
  const address = web3.utils.toChecksumAddress(val[0]);
  const newNotif = {};
  Object.keys(state.notifications).forEach(item => {
    newNotif[item] = state.notifications[item];
  });

  newNotif[address][val[1]] = val[2];
  commit('UPDATE_NOTIFICATION', newNotif);
};

export default {
  addNotification,
  addCustomPath,
  checkIfOnline,
  clearWallet,
  createAndSignTx,
  decryptWallet,
  setAccountBalance,
  setGasPrice,
  setWeb3Wallet,
  setState,
  setENS,
  setWeb3Instance,
  switchNetwork,
  updateNotification
};
