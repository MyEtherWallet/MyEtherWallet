const customTokens = function (state, _, rootState, rootGetters) {
  const network = rootGetters['global/network'];
  return state.customTokens[network.type.name] || [];
};

const hasCustom = function (state, _, rootState, rootGetters) {
  const tokens = rootGetters['custom/customTokens'];
  return tokens.length > 0;
};

export default {
  customTokens,
  hasCustom
};
