/**
 * Sets tokens prefetched when swap module loads
 * @param Array tokens
 */
const setSwapTokens = function ({ commit }, tokens) {
  commit('SET_SWAP_TOKENS', tokens);
};
const resetPrefetch = function ({ commit }) {
  commit('SET_PREFETCH', false);
};

const setLocalContract = function ({ commit }, localContracts) {
  commit('SET_LOCAL_CONTRACT', localContracts);
};
export default { setSwapTokens, resetPrefetch, setLocalContract };
