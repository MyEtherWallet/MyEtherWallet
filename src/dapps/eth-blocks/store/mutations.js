import localStore from 'store';
import Configs from './configs';

const INIT_STORE = function (state) {
  if (localStore.get(Configs.LOCAL_STORAGE_KEYS.ethBlocksTxs)) {
    const savedStore = localStore.get(Configs.LOCAL_STORAGE_KEYS.ethBlocksTxs);
    if (savedStore.stateVersion === Configs.VERSION.ethBlocksTxs) {
      Object.assign(state, savedStore);
    }
  }
};

/**
 *
 * @param {Object} obj - block object: {network: 'ETH', blockNumber: 223, hash: '0x...'}
 */
const ADD_ETH_BLOCK_TX = function (state, obj) {
  if (state.ethBlocksTxs.length >= 100) {
    state.ethBlocksTxs.shift();
  }
  state.ethBlocksTxs.push(obj);
};

/**
 *
 * @param {Object} obj - block object: {network: 'ETH', blockNumber: 223, hash: '0x...'}
 */
const DELETE_ETH_BLOCK_TX = function (state, obj) {
  const idx = state.ethBlocksTxs.findIndex(item => {
    if (item.hash === obj.hash) {
      return item;
    }
  });
  if (idx >= 0) {
    state.ethBlocksTxs.splice(idx, 1);
  }
};

/**
 *
 * @param {string} blockNumber
 */
const ADD_BLOCK_TO_CART = function (state, blockNumber) {
  if (state.cart.length >= 100) {
    state.cart.shift();
  }
  state.cart.push(blockNumber);
};

/**
 *
 * @param {string} blockNumber
 */
const REMOVE_FROM_CART = function (state, blockNumber) {
  state.cart = state.cart.filter(item => {
    if (item !== blockNumber) return item;
  });
};

export default {
  INIT_STORE,
  ADD_ETH_BLOCK_TX,
  DELETE_ETH_BLOCK_TX,
  ADD_BLOCK_TO_CART,
  REMOVE_FROM_CART
};
