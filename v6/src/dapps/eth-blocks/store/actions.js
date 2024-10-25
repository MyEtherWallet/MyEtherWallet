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
 * Adds blockNumber to cart (ETH)
 * @param {string} val
 */
const addBlockToCart = function ({ commit }, val) {
  commit('ADD_BLOCK_TO_CART', val);
};

/**
 * remove blockNumber to cart (ETH)
 * @param {string} val
 */
const removeBlockFromCart = function ({ commit }, val) {
  commit('REMOVE_FROM_CART', val);
};

/**
 * empty cart
 * @param {string} val
 */
const emptyCart = function ({ commit }, val) {
  commit('EMPTY_CART', val);
};

export default {
  addEthBlockTx,
  deleteEthBlockTx,
  addBlockToCart,
  removeBlockFromCart,
  emptyCart
};
