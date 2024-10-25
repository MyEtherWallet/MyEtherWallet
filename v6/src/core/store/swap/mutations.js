const SET_SWAP_TOKENS = async function (state, tokens) {
  state.swapTokens = tokens;
  state.prefetched = true;
};

const SET_PREFETCH = async function (state, prefetch) {
  state.prefetched = prefetch;
};

export default { SET_SWAP_TOKENS, SET_PREFETCH };
