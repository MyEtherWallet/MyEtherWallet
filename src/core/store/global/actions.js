const setOnlineStatus = function ({ commit, dispatch }, val) {
  if (val) dispatch('wallet/setWeb3Instance', null, { root: true });
  commit('SET_ONLINE_STATUS', val);
};

const setLocale = function ({ commit }, val) {
  commit('SET_LOCALE', val);
};

const setGasPrice = function ({ commit }, gasPrice) {
  commit('SET_GAS_PRICE', gasPrice);
};

const setAddressBook = function ({ commit }, addressBook) {
  commit('SET_ADDRESS_BOOK', addressBook);
};
const setNetwork = function ({ commit }, networkObj) {
  commit('SET_NETWORK', networkObj);
};
const setEthGasPrice = function ({ commit }, val) {
  commit('SET_ETH_GASPRICE', val);
};
const addCustomPath = function ({ commit }, val) {
  commit('ADD_CUSTOM_PATH', val);
};

const deleteCustomPath = function ({ commit }, val) {
  commit('DELETE_CUSTOM_PATH', val);
};

export default {
  setOnlineStatus,
  setLocale,
  setNetwork,
  setGasPrice,
  setAddressBook,
  setEthGasPrice,
  addCustomPath,
  deleteCustomPath
};
