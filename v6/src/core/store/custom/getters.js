const customTokens = function (state, _, rootState, rootGetters) {
  const network = rootGetters['global/network'];
  return state.tokens[network.type.name] || [];
};

const hasCustom = function (state, _, rootState, rootGetters) {
  const tokens = rootGetters['custom/customTokens'];
  return tokens.length > 0;
};

const hiddenTokens = function (state, _, rootState, rootGetters) {
  const network = rootGetters['global/network'];
  return state.hiddenTokens[network.type.name] || [];
};

const hasHidden = function (state, _, rootState, rootGetters) {
  const tokens = rootGetters['custom/hiddenTokens'];
  return tokens.length > 0;
};

export default {
  customTokens,
  hasCustom,
  hiddenTokens,
  hasHidden
};
