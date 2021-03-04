import store from 'store';
import { Toast } from '@/helpers';

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

const UPDATE_BLOCK_NUMBER = function (state, blockNumber) {
  state.blockNumber = blockNumber;
};

const CHECK_IF_ONLINE = async function (state, status) {
  state.online = status;
  if (state.online) {
    const darkList = await fetch(
      'https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/src/addresses/addresses-darklist.json'
    )
      .then(res => res.json())
      .catch(e => {
        Toast.responseHandler(e, Toast.ERROR);
      });
    state.darklist = {
      data: darkList,
      timestamp: Date.now()
    };
  }
};

const CLEAR_WALLET = function (state) {
  state.wallet = null;
  state.account = {
    balance: 0,
    address: null,
    isHardWare: null,
    identifier: ''
  };
};

const DECRYPT_WALLET = function (state, wallet) {
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
  state.account.balance = balance;
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

const SET_LAST_PATH = function (state, val) {
  state.path = val;
};

const SET_WEB3_INSTANCE = function (state, web3) {
  state.web3 = web3;
};

const SET_LOCALE = function (state, { locale, save }) {
  state.locale = locale;
  if (save) store.set('locale', locale);
};

const SWITCH_NETWORK = function (state, networkObj) {
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

const SAVE_QUERY_VAL = function (state, newQuery) {
  state.linkQuery = newQuery;
};

const TOGGLE_TEMP_HIDE = function (state) {
  state.tempHide = !state.tempHide;
};

const SET_ETH_GASPRICE = function (state, val) {
  state.ethGasPrice = val;
  store.set('fetchedGasPrice', val);
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
  TOGGLE_SIDEMENU,
  GETTING_STARTED_DONE,
  UPDATE_BLOCK_NUMBER,
  SAVE_QUERY_VAL,
  SET_ADDRESS_BOOK,
  SET_LOCALE,
  TOGGLE_TEMP_HIDE,
  SET_ETH_GASPRICE
};
