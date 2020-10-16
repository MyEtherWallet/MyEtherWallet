import store from 'store';
// import { Toast } from '@/helpers';

const ADD_NOTIFICATION = function (state, newNotif) {
  state.notifications = newNotif;
  store.set('notifications', newNotif);
};

const ADD_SWAP_TRANSACTION = function (state, newTx) {
  state.transactions = newTx;
  store.set('transactions', newTx);
};

const ADD_CUSTOM_PATH = function (state, paths) {
  state.customPaths = paths;
  store.set('customPaths', paths);
};

const GETTING_STARTED_DONE = function (state) {
  state.gettingStartedDone = true;
};

const SET_BLOCK_NUMBER = function (state, blockNumber) {
  state.blockNumber = blockNumber;
};

const REMOVE_WALLET = function (state) {
  state.wallet = null;
  state.account = {
    balance: 0,
    address: null,
    isHardWare: null,
    identifier: ''
  };
};

const SET_WALLET = function (state, wallet) {
  state.wallet = wallet;
  state.account['address'] = wallet.getAddressString();
  state.account['isHardware'] = wallet.isHardware;
  state.account['identifier'] = wallet.identifier;
  if (!wallet.hasOwnProperty('isHardWare')) {
    state.account['nickname'] = wallet.getNickname();
    state.account['keystore'] = wallet.getKeystore();
  }
};

const INIT_STATES = function (state, stateObj) {
  Object.keys(state).forEach(key => {
    state[key] = stateObj[key];
  });
};

const SET_ACCOUNT_BALANCE = function (state, balance) {
  const newObj = Object.assign({}, state.account);
  newObj.balance = balance;
  state.account = newObj;
};

const SET_ENS = function (state, ens) {
  state.ens = ens;
};

const SET_GAS_PRICE = function (state, val) {
  state.gasPrice = val;
  store.set('gasPrice', val);
};

const SET_ADDRESS_BOOK = function (state, val) {
  state.addressBook = val;
  store.set('addressBook', val);
};

const SET_WEB3_INSTANCE = function (state, web3) {
  state.web3 = web3;
};

const SET_NETWORK = function (state, networkObj) {
  state.network = networkObj;
  const _netObj = Object.assign({}, networkObj);
  if (_netObj.type.name !== 'CUS') {
    _netObj.type = {
      name: networkObj.type.name
    };
  }
  store.set('network', _netObj);
};

const UPDATE_NOTIFICATION = function (state, newNotif) {
  state.notifications = newNotif;
  store.set('notifications', newNotif);
};

const UPDATE_SWAP_TRANSACTION = function (state, newTx) {
  state.transactions = newTx;
  store.set('transactions', newTx);
};

const TOGGLE_SIDEMENU = function (state) {
  state.sidemenuOpen = !state.sidemenuOpen;
};

const SET_LINK_QUERY = function (state, newQuery) {
  state.linkQuery = newQuery;
};

const TOGGLE_TEMP_HIDE = function (state) {
  state.tempHide = !state.tempHide;
};

const SET_ETH_GASPRICE = function (state, val) {
  state.ethGasPrice = val;
  store.set('fetchedGasPrice', val);
};

const SET_USD = function (state, val) {
  state.usd = val;
};

export default {
  ADD_NOTIFICATION,
  ADD_SWAP_TRANSACTION,
  ADD_CUSTOM_PATH,
  REMOVE_WALLET,
  SET_WALLET,
  INIT_STATES,
  SET_ACCOUNT_BALANCE,
  SET_GAS_PRICE,
  SET_ENS,
  SET_WEB3_INSTANCE,
  SET_NETWORK,
  UPDATE_NOTIFICATION,
  UPDATE_SWAP_TRANSACTION,
  TOGGLE_SIDEMENU,
  GETTING_STARTED_DONE,
  SET_BLOCK_NUMBER,
  SET_LINK_QUERY,
  SET_ADDRESS_BOOK,
  TOGGLE_TEMP_HIDE,
  SET_ETH_GASPRICE,
  SET_USD
};
