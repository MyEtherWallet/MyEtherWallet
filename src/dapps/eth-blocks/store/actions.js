import EthDater from 'ethereum-block-by-date';

/**
 * Adds blockNumber with a transaction
 * @param {Object} val - {blockNumber: '123', network: 'ETH', hash: '0x...'}
 */
const addEthBlockTx = function ({ commit }, val) {
  commit('ADD_ETH_BLOCK_TX', val);
};
/**
 * Deletes blockNumber with a transaction from the eth Blocks
 * @param {Object} val - block number
 */
const deleteEthBlockTx = function ({ commit }, val) {
  commit('DELETE_ETH_BLOCK_TX', val);
};

/**
 * Adds blockNumber to cart
 * @param {string} val
 */
const addBlockToCart = function ({ commit }, val) {
  commit('ADD_BLOCK_TO_CART', val);
};

/**
 * Sets up EthDater for use later
 */
const setDater = function ({ commit, rootState }) {
  const dater = new EthDater(rootState.wallet.web3);
  commit('SETUP_ETH_DATE', dater);
};

export default {
  addEthBlockTx,
  deleteEthBlockTx,
  addBlockToCart,
  setDater
};
