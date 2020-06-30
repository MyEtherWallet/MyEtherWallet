const setState = function ({ commit }, obj) {
  commit('SET_STATE', obj);
};

const addAccount = function ({ commit }, obj) {
  commit('ADD_ACCOUNT', obj);
};

const deleteAccount = function ({ commit }, obj) {
  commit('DELETE_ACCOUNT', obj);
};

const updateAccount = function ({ commit }, obj) {
  commit('UPDATE_ACCOUNT', obj);
};

const addFavoriteWallet = function ({ commit }, obj) {
  commit('ADD_FAVORITE_WALLET', obj);
};

const deleteFavoriteWallet = function ({ commit }, obj) {
  commit('DELETE_FAVORITE_WALLET', obj);
};

const setDefaultNetwork = function ({ commit }, obj) {
  commit('SET_DEF_NETWORK', obj);
};

const setDefaultChainId = function ({ commit }, obj) {
  commit('SET_DEF_CHAIN_ID', obj);
};

const addSite = function ({ commit }, obj) {
  commit('ADD_SITE', obj);
};

const deleteSite = function ({ commit }, obj) {
  commit('DELETE_SITE', obj);
};

export default {
  setState,
  addAccount,
  deleteAccount,
  updateAccount,
  addFavoriteWallet,
  setDefaultNetwork,
  deleteFavoriteWallet,
  setDefaultChainId,
  addSite,
  deleteSite
};
