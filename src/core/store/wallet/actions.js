import url from 'url';
import web3 from 'web3';
import MEWProvider from '@/utils/web3-provider';
import {
  MEW_CONNECT,
  WALLET_CONNECT,
  WALLET_LINK
} from '@/modules/access-wallet/hardware/handlers/configs/configWalletTypes';
import * as unit from 'ethjs-unit';
import { formatters } from 'web3-core-helpers';
import BigNumber from 'bignumber.js';

import { EventBus } from '@/core/plugins/eventBus';

const removeWallet = function ({ commit, state }) {
  if (
    state.instance &&
    (state.instance.identifier === MEW_CONNECT ||
      state.instance.identifier === WALLET_CONNECT ||
      state.instance.identifier === WALLET_LINK)
  ) {
    state.instance.getConnection().disconnect();
  }
  commit('REMOVE_WALLET');
};

const setWallet = function ({ commit, dispatch }, params) {
  commit('SET_WALLET', params[0]);
  dispatch('setWeb3Instance', params[1]);
};

const setAccountBalance = function ({ commit }, balance) {
  commit('SET_BALANCE', balance);
};

const setWeb3Instance = function (
  { commit, state, rootState, rootGetters },
  provider
) {
  const hostUrl = rootState.global.currentNetwork.url
    ? url.parse(rootState.global.currentNetwork.url)
    : rootGetters['global/Networks']['ETH'][0];
  const options = {};
  // eslint-disable-next-line
  const parsedUrl = `${hostUrl.protocol}//${hostUrl.host}${
    rootState.global.currentNetwork.port
      ? ':' + rootState.global.currentNetwork.port
      : ''
  }${hostUrl.pathname}`;
  rootState.global.currentNetwork.username !== '' &&
  rootState.global.currentNetwork.password !== ''
    ? (options['headers'] = {
        authorization: `Basic: ${btoa(
          rootState.global.currentNetwork.username +
            ':' +
            rootState.global.currentNetwork.password
        )}`
      })
    : {};
  const web3Instance = new web3(
    new MEWProvider(provider ? provider : parsedUrl, options)
  );
  web3Instance.currentProvider.sendAsync = web3Instance.currentProvider.send;
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
          ? web3Instance.eth.getTransactionCount(state.address)
          : arr[i].nonce);
        arr[i].nonce = BigNumber(nonce + i).toFixed();
        arr[i].gas = gas;
        arr[i].chainId = !arr[i].chainId
          ? rootState.global.currentNetwork.type.chainID
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
      EventBus.$emit(
        'showTxCollectionConfirmModal',
        arr,
        batchSignCallback,
        state.instance.isHardware
      );
    });
  };
  commit('SET_WEB3_INSTANCE', web3Instance);
};

const setENS = function ({ commit }, ens) {
  commit('SET_ENS', ens);
};

const setOwnedDomains = function ({ commit }, ownedDomains) {
  commit('SET_OWNED_DOMAINS', ownedDomains);
};

const setBlockNumber = function ({ commit }, val) {
  commit('SET_BLOCK_NUMBER', val);
};

export default {
  removeWallet,
  setWallet,
  setAccountBalance,
  setENS,
  setWeb3Instance,
  setBlockNumber,
  setOwnedDomains
};
