const setTrendingTokensState = function ({ commit }, trendingTokens) {
  commit('SET_STATE', trendingTokens);
};

export default {
  setTrendingTokensState
};
