import url from 'url';
import web3 from 'web3';
import MEWProvider from '@/wallets/web3-provider';
import * as unit from 'ethjs-unit';
import { formatters } from 'web3-core-helpers';
import BigNumber from 'bignumber.js';

import {
  type as noticeTypes,
  txIndexes,
  swapIndexes,
  addUpdateNotification,
  addUpdateSwapNotification
} from '@/helpers/notificationFormatters';
import { WEB3_WALLET } from '../wallets/bip44/walletTypes';
import Web3PromiEvent from 'web3-core-promievent';

const addNotification = function({ commit, state }, val) {
  let address;

  if (val[1] != undefined) {
    address = web3.utils.toChecksumAddress(val[txIndexes.address]);
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
  const address = web3.utils.toChecksumAddress(val[swapIndexes.address]);
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
        arr[i].nonce = await (arr[i].nonce === undefined
          ? web3Instance.eth.getTransactionCount(
              state.wallet.getChecksumAddressString()
            )
          : arr[i].nonce);
        arr[i].nonce = +arr[i].nonce + i;
        arr[i].gas = await (arr[i].gas === undefined
          ? web3Instance.eth.estimateGas(localTx)
          : arr[i].gas);
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

      if (state.wallet.identifier === WEB3_WALLET) {
        const batch = new web3Instance.eth.BatchRequest();
        // MetaMask reverses the request order
        // see: https://github.com/MetaMask/metamask-extension/issues/5817
        const revArr = arr.reverse();
        const promises = revArr.map(tx => {
          const promiEvent = new Web3PromiEvent(false);
          const req = web3Instance.eth.sendTransaction.request(
            tx,
            (err, data) => {
              if (err !== null) {
                promiEvent.eventEmitter.emit('error', err);
                promiEvent.reject(err);
              }
              if (err === null) {
                promiEvent.eventEmitter.emit('transactionHash', data);
              }
            }
          );
          promiEvent.eventEmitter.on('error', err => {
            dispatch('addNotification', [
              noticeTypes.TRANSACTION_ERROR,
              tx.from,
              arr.find(entry => new BigNumber(tx.nonce).eq(entry.nonce)) || tx,
              err
            ]);
            this._vm.$eventHub.$emit(
              'showErrorModal',
              'Transaction Error!',
              'Return'
            );
          });
          promiEvent.eventEmitter.once('transactionHash', hash => {
            dispatch('addNotification', [
              noticeTypes.TRANSACTION_HASH,
              tx.from,
              arr.find(entry => new BigNumber(tx.nonce).eq(entry.nonce)),
              hash
            ]).then(() => {
              web3Instance.eth.sendTransaction.method._confirmTransaction(
                promiEvent,
                hash,
                req
              );
              this._vm.$eventHub.$emit(
                'showSuccessModal',
                'Transaction sent!',
                'Okay'
              );
            });
          });
          promiEvent.eventEmitter.once('receipt', receipt => {
            promiEvent.resolve(receipt);
            dispatch('addNotification', [
              noticeTypes.TRANSACTION_RECEIPT,
              tx.from,
              arr.find(entry => new BigNumber(tx.nonce).eq(entry.nonce)),
              receipt
            ]);
          });
          batch.add(req);
          return promiEvent.eventEmitter;
        });
        batchSignCallback(promises);
        batch.execute();
      } else {
        this._vm.$eventHub.$emit(
          'showTxCollectionConfirmModal',
          arr,
          batchSignCallback,
          state.wallet.isHardware
        );
      }
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

  const entryIndex = newNotif[address].findIndex(entry => {
    return entry.orderId === val[1];
  });

  newNotif[address][entryIndex].status = val[2];
  commit('UPDATE_SWAP_TRANSACTION', newNotif);
};

const setLastPath = function({ commit }, val) {
  commit('SET_LAST_PATH', val);
};

export default {
  addNotification,
  addSwapNotification,
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
