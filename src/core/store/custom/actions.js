const setCustomToken = function ({ rootGetters, commit }, token) {
  commit('SET_CUSTOM_TOKEN', { token, rootGetters });
};

const deleteToken = function ({ rootGetters, commit }, token) {
  commit('DELETE_CUSTOM_TOKEN', { token, rootGetters });
};

const deleteAll = function ({ rootGetters, commit }) {
  commit('DELETE_ALL_TOKENS', { rootGetters });
};

const setAddressBook = function ({ commit }, addressBook) {
  commit('SET_ADDRESS_BOOK', addressBook);
};

const addCustomPath = function ({ commit }, val) {
  commit('ADD_CUSTOM_PATH', val);
};

const deleteCustomPath = function ({ commit }, val) {
  commit('DELETE_CUSTOM_PATH', val);
};

export default {
  setAddressBook,
  setCustomToken,
  deleteAll,
  deleteToken,
  addCustomPath,
  deleteCustomPath
};
