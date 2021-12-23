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

export default {
  addEthBlockTx,
  deleteEthBlockTx
};
