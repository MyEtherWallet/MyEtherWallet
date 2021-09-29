const setCustomToken = function ({ rootGetters, commit }, token) {
  commit('SET_CUSTOM_TOKEN', { token, rootGetters });
};

const deleteToken = function ({ rootGetters, commit }, token) {
  commit('DELETE_CUSTOM_TOKEN', { token, rootGetters });
};

const deleteAll = function ({ rootGetters, commit }) {
  commit('DELETE_ALL_TOKENS', { rootGetters });
};

export default {
  setCustomToken,
  deleteAll,
  deleteToken
};
