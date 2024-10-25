/**
 * Returns all transactions in the state
 * @returns {Array}
 */
const getAllEthBlocksTxs = function (state, _, rootState, rootGetters) {
  const currentNetworkType = rootGetters['global/network'].type.name;
  const filteredArray = state.ethBlocksTxs.filter(item => {
    if (item.network === currentNetworkType) return item;
  });
  return state.ethBlocksTxs.length > 0 ? filteredArray : [];
};

/**
 * Returns all transactions in the state
 * @param {Object} block - {blockNumber: '1234', hash: '0x...', network: 'Eth' }
 * @returns {Object} --> {blockNumber: '1234', hash: '0x...', network: 'Eth' }
 */
const getEthBlockTx = state => block => {
  const filteredArray = state.ethBlocksTxs.filter(item => {
    if (
      block.blockNumber === item.blockNumber &&
      item.network === block.network
    ) {
      return item;
    }
  });
  return filteredArray.length > 0 ? filteredArray[0] : null;
};

export default { getAllEthBlocksTxs, getEthBlockTx };
