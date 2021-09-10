const customTokens = function (state, _, rootState, rootGetters) {
  const network = rootGetters['global/network'];
  return state.customTokens[network.type.name] || [];
};

export default {
  customTokens
};
