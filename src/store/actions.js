import url from 'url';
import web3 from 'web3';
import MEWProvider from '@/wallets/web3-provider';
import * as unit from 'ethjs-unit';
import { formatters } from 'web3-core-helpers';

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

const addSwapTransaction = function({ commit, state }, val) {
  const address = web3.utils.toChecksumAddress(val[0]);
  const newNotif = {};
  Object.keys(state.transactions).forEach(item => {
    newNotif[item] = state.transactions[item];
  });
  if (!Array.isArray(newNotif[address])) newNotif[address] = [];

  newNotif[address].push(val[1]); // TODO: reduce the ammount of information stored
  commit('ADD_SWAP_TRANSACTION', newNotif);
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

const decryptWallet = function({ commit, dispatch }, params) {
  // params[0] = wallet, params[1] = provider
  commit('DECRYPT_WALLET', params[0]);
  dispatch('setWeb3Instance', params[1]);
};

const setAccountBalance = function({ commit }, balance) {
  commit('SET_ACCOUNT_BALANCE', +balance);
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
  state.network.username !== '' && state.network.password !== ''
    ? (options['headers'] = {
        authorization: `Basic: ${btoa(
          state.network.username + ':' + state.network.password
        )}`
      })
    : {};
  const web3Instance = new web3(
    new MEWProvider(
      provider
        ? provider
        : `${hostUrl.protocol}//${hostUrl.host}:${state.network.port}${
            hostUrl.pathname
          }`,
      options,
      {
        state,
        dispatch
      },
      this._vm.$eventHub
    )
  );
  web3Instance['mew'] = {};
  web3Instance['mew'].sendBatchTransactions = async arr => {
    for (let i = 0; i < arr.length; i++) {
      const localTx = {
        to: arr[i].to,
        data: arr[i].data,
        from: arr[i].from,
        value: arr[i].value
      };
      arr[i].nonce = await (arr[i].nonce === undefined
        ? web3Instance.eth.getTransactionCount(
            state.wallet.getChecksumAddressString()
          )
        : arr[i].nonce);
      arr[i].nonce += i;
      arr[i].gas = await (arr[i].gas === undefined
        ? web3Instance.eth.estimateGas(localTx)
        : arr.gas);
      arr[i].chainId = !arr[i].chainId
        ? state.network.type.chainID
        : arr[i].chainId;
      arr[i].gasPrice =
        arr[i].gasPrice === undefined
          ? unit.toWei(state.gasPrice, 'gwei')
          : arr[i].gasPrice;
      arr[i] = formatters.inputCallFormatter(arr[i]);
    }

    this._vm.$eventHub.$emit(
      'showTxCollectionConfirmModal',
      arr,
      state.wallet.isHardware
    );
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
  const address = web3.utils.toChecksumAddress(val[0]);
  const newNotif = {};
  Object.keys(state.notifications).forEach(item => {
    newNotif[item] = state.notifications[item];
  });

  newNotif[address][val[1]] = val[2];
  commit('UPDATE_NOTIFICATION', newNotif);
};

const updateTransaction = function({ commit, state }, val) {
  // address, index, object
  const address = web3.utils.toChecksumAddress(val[0]);
  const newNotif = {};
  Object.keys(state.transactions).forEach(item => {
    newNotif[item] = state.transactions[item];
  });

  newNotif[address][val[1]] = val[2];
  commit('UPDATE_SWAP_TRANSACTION', newNotif);
};

const setLastPath = function({ commit }, val) {
  commit('SET_LAST_PATH', val);
};

export default {
  addNotification,
  addSwapTransaction,
  addCustomPath,
  checkIfOnline,
  clearWallet,
  createAndSignTx,
  decryptWallet,
  setAccountBalance,
  setGasPrice,
  setState,
  setENS,
  setLastPath,
  setWeb3Instance,
  switchNetwork,
  updateNotification,
  updateTransaction
};
