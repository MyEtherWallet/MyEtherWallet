import { override, WalletWrapper } from '@/wallets';
import url from 'url';
import web3 from 'web3';

const addNotification = function({ commit, state }, val) {
  const newNotif = {};
  Object.keys(state.notifications).forEach(item => {
    newNotif[item] = state.notifications[item];
  });

  if (!Array.isArray(newNotif[val[0]])) newNotif[val[0]] = [];

  newNotif[val[0]].push({
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

const decryptWallet = function({ commit, state }, wallet) {
  const wrappedWallet = new WalletWrapper(wallet);
  const _web3 = state.web3;
  override(_web3, wrappedWallet, this._vm.$eventHub);
  commit('DECRYPT_WALLET', wrappedWallet);
  commit('SET_WEB3_INSTANCE', _web3);
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

const setWeb3Instance = function({ commit, state }, provider) {
  if (provider && provider.currentProvider) {
    commit(
      'SET_WEB3_INSTANCE',
      override(
        new web3(provider.currentProvider),
        state.wallet,
        this._vm.$eventHub
      )
    );
  } else {
    const hostUrl = url.parse(state.network.url);
    const web3Instance = new web3(
      `${hostUrl.protocol}//${hostUrl.host}:${state.network.port}${
        hostUrl.pathname
      }`
    );
    commit(
      'SET_WEB3_INSTANCE',
      override(web3Instance, state.wallet, this._vm.$eventHub)
    );
  }
};

const switchNetwork = function({ commit }, networkObj) {
  // check if wallet is hardware.  if true, check if it supports this network. if not, do nothing
  commit('SWITCH_NETWORK', networkObj);
};

const updateNotification = function({ commit, state }, val) {
  // address, index, object
  const newNotif = {};
  Object.keys(state.notifications).forEach(item => {
    newNotif[item] = state.notifications[item];
  });

  newNotif[val[0]][val[1]] = val[2];
  commit('UPDATE_NOTIFICATION', newNotif);
};

const updatePageState = function({ commit }, arr) {
  commit('CHANGE_PAGE_STATE', arr);
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
  setWeb3Instance,
  switchNetwork,
  updateNotification,
  updatePageState
};
