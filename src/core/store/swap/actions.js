/**
 * Sets tokens prefetched when swap module loads
 * @param Array tokens
 */
const setSwapTokens = function ({ commit }, tokens) {
  commit('SET_SWAP_TOKENS', tokens);
};
export default { setSwapTokens };
