import store from 'store';

const ADD_NOTIFICATION = function(state, newNotif) {
  state.notifications = newNotif;
  store.set('notifications', newNotif);
};

const ADD_SWAP_TRANSACTION = function(state, newTx) {
  state.transactions = newTx;
  store.set('transactions', newTx);
};

const ADD_CUSTOM_PATH = function(state, paths) {
  state.customPaths = paths;
  store.set('customPaths', paths);
};

const CHECK_IF_ONLINE = function(state) {
  state.online =
    window.location.protocol === 'http:' ||
    window.location.protocol === 'https:';
};

const CLEAR_WALLET = function(state) {
  state.wallet = null;
  state.account = { balance: 0 };
};

const DECRYPT_WALLET = function(state, wallet) {
  state.wallet = wallet;
};

const INIT_STATES = function(state, stateObj) {
  Object.keys(state).forEach(key => {
    state[key] = stateObj[key];
  });
};

const SET_ACCOUNT_BALANCE = function(state, balance) {
  state.account.balance = balance;
};

const SET_ENS = function(state, ens) {
  state.ens = ens;
};

const SET_GAS_PRICE = function(state, val) {
  state.gasPrice = val;
  store.set('gasPrice', val);
};

const SET_LAST_PATH = function(state, val) {
  state.path = val;
};

const SET_WEB3_INSTANCE = function(state, web3) {
  state.web3 = web3;
};

const SWITCH_NETWORK = function(state, networkObj) {
  state.network = networkObj;
  store.set('network', networkObj);
};

const UPDATE_NOTIFICATION = function(state, newNotif) {
  state.notifications = newNotif;
  store.set('notifications', newNotif);
};

const UPDATE_SWAP_TRANSACTION = function(state, newTx) {
  state.transactions = newTx;
  store.set('transactions', newTx);
};

const TOGGLE_SIDEMENU = function(state) {
  state.sidemenuOpen = !state.sidemenuOpen;
};

export default {
  ADD_NOTIFICATION,
  ADD_SWAP_TRANSACTION,
  ADD_CUSTOM_PATH,
  CHECK_IF_ONLINE,
  CLEAR_WALLET,
  DECRYPT_WALLET,
  INIT_STATES,
  SET_ACCOUNT_BALANCE,
  SET_LAST_PATH,
  SET_GAS_PRICE,
  SET_ENS,
  SET_WEB3_INSTANCE,
  SWITCH_NETWORK,
  UPDATE_NOTIFICATION,
  UPDATE_SWAP_TRANSACTION,
  TOGGLE_SIDEMENU
};
