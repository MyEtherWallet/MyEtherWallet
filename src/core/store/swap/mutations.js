const SET_SWAP_TOKENS = async function (state, tokens) {
  state.swapTokens = tokens;
  state.prefetched = true;
};

export default { SET_SWAP_TOKENS };
