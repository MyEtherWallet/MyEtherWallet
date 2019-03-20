import url from 'url';
import web3 from 'web3';
import Vue from 'vue';
import MEWProvider from '@/wallets/web3-provider';
import { MEW_CONNECT } from '@/wallets/bip44/walletTypes';
import * as unit from 'ethjs-unit';
import { formatters } from 'web3-core-helpers';
import {
  txIndexes,
  swapIndexes,
  addUpdateNotification,
  addUpdateSwapNotification
} from '@/helpers/notificationFormatters';
import BigNumber from 'bignumber.js';

const addNotification = function({ commit, state }, val) {
  let address;

  if (val[1] != undefined) {
    address = val[txIndexes.address].toLowerCase();
  } else {
    throw Error('Unable to determine sending address for notification.');
  }

  const newNotif = {};
  Object.keys(state.notifications).forEach(item => {
    newNotif[item] = state.notifications[item];
  });

  if (!Array.isArray(newNotif[address])) newNotif[address] = [];

  newNotif[address] = addUpdateNotification(
    newNotif[address],
    val,
    state.network.type.name
  );
  commit('ADD_NOTIFICATION', newNotif);
};

const addSwapNotification = async function({ commit, state }, val) {
  const address = val[swapIndexes.address].toLowerCase();
  const newNotif = {};
  Object.keys(state.notifications).forEach(item => {
    newNotif[item] = state.notifications[item];
  });

  if (!Array.isArray(newNotif[address])) newNotif[address] = [];

  newNotif[address] = await addUpdateSwapNotification(
    newNotif[address],
    val,
    state.network.type.name
  );

  commit('ADD_NOTIFICATION', newNotif);
};

const addCustomPath = function({ commit, state }, val) {
  const newPaths = { ...state.customPaths };
  newPaths[val.label] = { label: val.label, path: val.path };
  commit('ADD_CUSTOM_PATH', newPaths);
};

const removeCustomPath = function({ commit, state }, val) {
  const newPaths = { ...state.customPaths };
  delete newPaths[val.label];
  commit('ADD_CUSTOM_PATH', newPaths);
};

const checkIfOnline = function({ commit }) {
  commit('CHECK_IF_ONLINE');
};

const gettingStartedDone = function({ commit }) {
  commit('GETTING_STARTED_DONE');
};

const clearWallet = function({ commit, state }) {
  if (state.wallet.identifier === MEW_CONNECT) {
    state.wallet.mewConnect().disconnectRTC();
  }
  Vue.router.push('/');
  commit('CLEAR_WALLET');
};

const createAndSignTx = function({ commit }, val) {
  commit('CREATE_AND_SIGN_TX', val);
};

const decryptWallet = function({ commit, dispatch }, params) {
  // params[0] = wallet, params[1] = provider
  if (params[0].identifier === MEW_CONNECT) {
    params[0].mewConnect().on('RtcClosedEvent', () => {
      if (params[0].mewConnect().getConnectonState()) {
        this._vm.$eventHub.$emit('mewConnectDisconnected');
        dispatch('clearWallet');
      }
    });
  }
  commit('DECRYPT_WALLET', params[0]);
  dispatch('setWeb3Instance', params[1]);
};

const setAccountBalance = function({ commit }, balance) {
  commit('SET_ACCOUNT_BALANCE', balance);
};

const setGasPrice = function({ commit }, gasPrice) {
  commit('SET_GAS_PRICE', gasPrice);
};

const setState = function({ commit }, stateObj) {
  commit('INIT_STATES', stateObj);
};

const setWeb3Instance = function({ dispatch, commit, state }, provider) {
  const hostUrl = url.parse(state.network.url);
  const options = {};
  // eslint-disable-next-line
  const parsedUrl = `${hostUrl.protocol}//${hostUrl.host}${
    state.network.port ? ':' + state.network.port : ''
  }${hostUrl.pathname}`;
  state.network.username !== '' && state.network.password !== ''
    ? (options['headers'] = {
        authorization: `Basic: ${btoa(
          state.network.username + ':' + state.network.password
        )}`
      })
    : {};
  const web3Instance = new web3(
    new MEWProvider(
      provider ? provider : parsedUrl,
      options,
      {
        state,
        dispatch
      },
      this._vm.$eventHub
    )
  );
  web3Instance['mew'] = {};
  web3Instance['mew'].sendBatchTransactions = arr => {
    return new Promise(async resolve => {
      for (let i = 0; i < arr.length; i++) {
        const localTx = {
          to: arr[i].to,
          data: arr[i].data,
          from: arr[i].from,
          value: arr[i].value,
          gasPrice: arr[i].gasPrice
        };
        const gas = await (arr[i].gas === undefined
          ? web3Instance.eth.estimateGas(localTx)
          : arr[i].gas);
        const nonce = await (arr[i].nonce === undefined
          ? web3Instance.eth.getTransactionCount(state.account.address)
          : arr[i].nonce);
        arr[i].nonce = new BigNumber(nonce + i).toFixed();
        arr[i].gas = gas;
        arr[i].chainId = !arr[i].chainId
          ? state.network.type.chainID
          : arr[i].chainId;
        arr[i].gasPrice =
          arr[i].gasPrice === undefined
            ? unit.toWei(state.gasPrice, 'gwei')
            : arr[i].gasPrice;
        arr[i] = formatters.inputCallFormatter(arr[i]);
      }

      const batchSignCallback = promises => {
        resolve(promises);
      };
      this._vm.$eventHub.$emit(
        'showTxCollectionConfirmModal',
        arr,
        batchSignCallback,
        state.wallet.isHardware
      );
    });
  };
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
  const address = val[0].toLowerCase();
  const newNotif = {};
  Object.keys(state.notifications).forEach(item => {
    newNotif[item] = state.notifications[item];
  });

  newNotif[address][val[1]] = val[2];
  commit('UPDATE_NOTIFICATION', newNotif);
};

const updateTransaction = function({ commit, state }, val) {
  // address, index, object

  const address = val[0].toLowerCase();
  const newNotif = {};
  Object.keys(state.transactions).forEach(item => {
    newNotif[item] = state.transactions[item];
  });

  const entryIndex = newNotif[address].findIndex(entry => {
    return entry.orderId === val[1];
  });

  newNotif[address][entryIndex].status = val[2];
  commit('UPDATE_SWAP_TRANSACTION', newNotif);
};

const setLastPath = function({ commit }, val) {
  commit('SET_LAST_PATH', val);
};

const updateBlockNumber = function({ commit }, val) {
  commit('UPDATE_BLOCK_NUMBER', val);
};

export default {
  addNotification,
  addSwapNotification,
  addCustomPath,
  checkIfOnline,
  clearWallet,
  createAndSignTx,
  decryptWallet,
  removeCustomPath,
  setAccountBalance,
  setGasPrice,
  setState,
  setENS,
  setLastPath,
  setWeb3Instance,
  switchNetwork,
  updateNotification,
  updateTransaction,
  gettingStartedDone,
  updateBlockNumber
};
