const setOnlineStatus = function ({ commit, dispatch }, val) {
  if (val) dispatch('wallet/setWeb3Instance', null, { root: true });
  commit('SET_ONLINE_STATUS', val);
};

const setLocale = function ({ commit }, val) {
  commit('SET_LOCALE', val);
};

const setLastPath = function ({ commit }, val) {
  commit('SET_LAST_PATH', val);
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

const setCurrency = function ({ commit }, val) {
  commit('SET_CURRENCY', val);
};

export default {
  setOnlineStatus,
  setLocale,
  setLastPath,
  setNetwork,
  setGasPrice,
  setAddressBook,
  setEthGasPrice,
  setCurrency
};
