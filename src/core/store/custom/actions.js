const setCustomToken = function ({ rootGetters, commit }, token) {
  commit('SET_CUSTOM_TOKEN', { token, rootGetters });
};

const deleteToken = function ({ rootGetters, commit }, token) {
  commit('DELETE_CUSTOM_TOKEN', { token, rootGetters });
};

const deleteAllTokens = function ({ rootGetters, commit }) {
  commit('DELETE_ALL_TOKENS', { rootGetters });
};

const setContract = function ({ rootGetters, commit }, token) {
  commit('SET_CUSTOM_TOKEN', { token, rootGetters });
};

const deleteContract = function ({ rootGetters, commit }, token) {
  commit('DELETE_CUSTOM_TOKEN', { token, rootGetters });
};

const deleteAllContracts = function ({ rootGetters, commit }) {
  commit('DELETE_ALL_TOKENS', { rootGetters });
};
export default {
  setCustomToken,
  deleteAllTokens,
  deleteToken,
  setContract,
  deleteContract,
  deleteAllContracts
};
