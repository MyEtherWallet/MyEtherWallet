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
export default { setSwapTokens, resetPrefetch };
