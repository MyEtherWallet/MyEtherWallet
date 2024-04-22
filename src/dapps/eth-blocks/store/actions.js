import localStore from 'store';
import Configs from './configs';

const initStore = function () {
  if (localStore.get(Configs.LOCAL_STORAGE_KEYS.ethBlocksTxs)) {
    const savedStore = localStore.get(Configs.LOCAL_STORAGE_KEYS.ethBlocksTxs);
    if (savedStore.stateVersion === Configs.VERSION.ethBlocksTxs) {
      this.$state = Object.assign(this.$state, savedStore);
    }
  }
};

/**
 * Adds blockNumber with a transaction
 * @param {Object} val - {blockNumber: '123', network: 'ETH', hash: '0x...'}
 */
const addEthBlockTx = function (val) {
  if (this.ethBlocksTxs.length >= 100) {
    this.ethBlocksTxs.shift();
  }
  this.ethBlocksTxs.push(val);
};
/**
 * Deletes blockNumber with a transaction from the eth Blocks
 * @param {Object} val - block number
 */
const deleteEthBlockTx = function (val) {
  const idx = this.ethBlocksTxs.findIndex(item => {
    if (item.hash === val.hash) {
      return item;
    }
  });
  if (idx >= 0) {
    this.ethBlocksTxs.splice(idx, 1);
  }
};

/**
 * Adds blockNumber to cart (ETH)
 * @param {string} val
 */
const addBlockToCart = function (val) {
  if (this.cart.ETH.length >= 100) {
    this.cart.ETH.shift();
  }
  this.cart.ETH.push(val);
};

/**
 * remove blockNumber to cart (ETH)
 * @param {string} val
 */
const removeBlockFromCart = function (val) {
  this.cart.ETH = this.cart.ETH.filter(item => {
    if (item !== val) return item;
  });
};

/**
 * empty cart
 * @param {string} val
 */
const emptyCart = function () {
  this.cart.ETH = [];
};

export default {
  initStore,
  addEthBlockTx,
  deleteEthBlockTx,
  addBlockToCart,
  removeBlockFromCart,
  emptyCart
};
