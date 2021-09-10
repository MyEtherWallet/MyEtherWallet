const setCustomToken = function ({ rootGetters, commit }, token) {
  commit('SET_CUSTOM_TOKEN', { token, rootGetters });
};

export default {
  setCustomToken
};
