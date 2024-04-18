/**
 * Sets tokens prefetched when swap module loads
 * @param Array tokens
 */
const setSwapTokens = function (tokens) {
  this.swapTokens = tokens;
  this.prefetched = true;
};
const resetPrefetch = function () {
  this.prefetched = false;
};
export default { setSwapTokens, resetPrefetch };
