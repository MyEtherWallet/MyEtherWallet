import url from 'url';
import web3 from 'web3';
import Vue from 'vue';
import MEWProvider from '@/wallets/web3-provider';
import {
  MEW_CONNECT,
  WALLET_CONNECT,
  WALLET_LINK
} from '@/wallets/bip44/walletTypes';
import * as unit from 'ethjs-unit';
import { formatters } from 'web3-core-helpers';
import { MEW_CX } from '@/builds/configs/types';
import {
  txIndexes,
  swapIndexes,
  addUpdateNotification,
  addUpdateSwapNotification
} from '@/helpers/notificationFormatters';
import BigNumber from 'bignumber.js';

const addNotification = function ({ dispatch, commit, state }, val) {
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
  dispatch('pruneNotifications');
};

const addSwapNotification = async function ({ dispatch, commit, state }, val) {
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
  dispatch('pruneNotifications');
};

const pruneNotifications = ({ commit, state }) => {
  const newNotif = {};

  Object.keys(state.notifications).forEach(item => {
    newNotif[item] = state.notifications[item];
  });

  const removeEntries = async entries => {
    const entry = entries.pop();
    if (entry) {
      const address = state.account.address.toLowerCase();
      const idIndex = newNotif[address].findIndex(item => item.id === entry.id);
      if (idIndex > -1) {
        newNotif[address].splice(idIndex, 1);
      }
      return removeEntries(entries);
    }
    return newNotif;
  };
  if (!newNotif[state.account.address]) return;
  const check = newNotif[state.account.address]
    .filter(item => item.network === state.network.type.name)
    .sort((a, b) => {
      a = a.timestamp;
      b = b.timestamp;

      return a > b ? -1 : a < b ? 1 : 0;
    })
    .slice(25)
    .filter(item => {
      return (
        (new Date().getTime() - new Date(item.timestamp).getTime()) / 86400000 >
        5
      );
    });

  if (check.length > 0) {
    removeEntries(check).then(result => {
      commit('UPDATE_NOTIFICATION', result);
    });
  }
};

const addCustomPath = function ({ commit, state }, val) {
  const newPaths = { ...state.customPaths };
  newPaths[val.label] = { label: val.label, path: val.path };
  commit('ADD_CUSTOM_PATH', newPaths);
};

const removeCustomPath = function ({ commit, state }, val) {
  const newPaths = { ...state.customPaths };
  delete newPaths[val.label];
  commit('ADD_CUSTOM_PATH', newPaths);
};

const checkIfOnline = function ({ commit, dispatch }, val) {
  if (val) dispatch('setWeb3Instance');
  commit('CHECK_IF_ONLINE', val);
};

const gettingStartedDone = function ({ commit }) {
  commit('GETTING_STARTED_DONE');
};

const clearWallet = function ({ commit, state }) {
  const linkTo = state.path !== '' ? state.path : '/';
  if (
    state.wallet &&
    (state.wallet.identifier === MEW_CONNECT ||
      state.wallet.identifier === WALLET_CONNECT ||
      state.wallet.identifier === WALLET_LINK)
  ) {
    state.wallet.getConnection().disconnect();
  }
  Vue.router.push(linkTo);
  commit('CLEAR_WALLET');
};

const createAndSignTx = function ({ commit }, val) {
  commit('CREATE_AND_SIGN_TX', val);
};

const decryptWallet = function ({ commit, dispatch }, params) {
  // if the wallet param (param[0]) is undefined or null then all the subsequent setup steps will also fail.
  // just explicitly stop it here.
  if (params[0] !== undefined && params[0] !== null) {
    commit('DECRYPT_WALLET', params[0]);
    dispatch('setWeb3Instance', params[1]);
  } else {
    // Could replace this (sentry gets triggered) with a toast, to handle more gracefully
    // Or some means of informing the user of an issue
    return Promise.reject(
      Error(
        'Received null or undefined wallet parameter. Please refresh the page and try again'
      )
    );
  }
};

const removeNotification = function ({ commit, state }, val) {
  // address, index, object
  const address = val[0].toLowerCase();
  const newNotif = {};

  Object.keys(state.notifications).forEach(item => {
    newNotif[item] = state.notifications[item];
  });
  const idIndex = newNotif[address].findIndex(entry => entry.id === val[1].id);
  if (idIndex > -1) {
    newNotif[address].splice(idIndex, 1);
  }

  commit('UPDATE_NOTIFICATION', newNotif);
};

const setAccountBalance = function ({ commit }, balance) {
  commit('SET_ACCOUNT_BALANCE', balance);
};

const setGasPrice = function ({ commit }, gasPrice) {
  commit('SET_GAS_PRICE', gasPrice);
};

const setAddressBook = function ({ commit }, addressBook) {
  commit('SET_ADDRESS_BOOK', addressBook);
};

const setState = function ({ commit }, stateObj) {
  commit('INIT_STATES', stateObj);
};

const setLocale = function ({ commit }, val) {
  commit('SET_LOCALE', val);
};

const setWeb3Instance = function ({ dispatch, commit, state }, provider) {
  const hostUrl = state.network.url
    ? url.parse(state.network.url)
    : state.Networks['ETH'][0];
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
  web3Instance.currentProvider.sendAsync = web3Instance.currentProvider.send;
  if (BUILD_TYPE !== MEW_CX) {
    web3Instance['mew'] = {};
    web3Instance['mew'].sendBatchTransactions = arr => {
      // eslint-disable-next-line no-async-promise-executor
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
  }
  commit('SET_WEB3_INSTANCE', web3Instance);
};

const switchNetwork = function ({ commit }, networkObj) {
  commit('SWITCH_NETWORK', networkObj);
};
const setENS = function ({ commit }, ens) {
  commit('SET_ENS', ens);
};

const toggleSideMenu = function ({ commit }) {
  commit('TOGGLE_SIDEMENU');
};

const updateNotification = function ({ commit, state }, val) {
  // address, index, object
  const address = val[0].toLowerCase();
  const newNotif = {};
  Object.keys(state.notifications).forEach(item => {
    newNotif[item] = state.notifications[item];
  });
  const idIndex = newNotif[address].findIndex(entry => entry.id === val[2].id);
  if (idIndex > -1) {
    newNotif[address][idIndex] = val[2];
  } else {
    newNotif[address][val[1]] = val[2];
  }

  commit('UPDATE_NOTIFICATION', newNotif);
};

const updateTransaction = function ({ commit, state }, val) {
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

const setLastPath = function ({ commit }, val) {
  commit('SET_LAST_PATH', val);
};

const updateBlockNumber = function ({ commit }, val) {
  commit('UPDATE_BLOCK_NUMBER', val);
};

const saveQueryVal = function ({ commit }, val) {
  commit('SAVE_QUERY_VAL', val);
};

const toggleTempHide = function ({ commit }) {
  commit('TOGGLE_TEMP_HIDE');
};

const setEthGasPrice = function ({ commit }, val) {
  commit('SET_ETH_GASPRICE', val);
};

export default {
  addNotification,
  addSwapNotification,
  addCustomPath,
  checkIfOnline,
  clearWallet,
  createAndSignTx,
  decryptWallet,
  pruneNotifications,
  removeCustomPath,
  removeNotification,
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
  updateBlockNumber,
  saveQueryVal,
  setAddressBook,
  toggleSideMenu,
  setLocale,
  toggleTempHide,
  setEthGasPrice
};
