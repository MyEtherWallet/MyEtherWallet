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

const setGasPriceType = function ({ commit }, type) {
  commit('SET_GAS_PRICE_TYPE', type);
};

const setAddressBook = function ({ commit }, addressBook) {
  commit('SET_ADDRESS_BOOK', addressBook);
};
const setNetwork = function ({ commit }, networkObj) {
  console.log(networkObj);
  commit('SET_NETWORK', networkObj);
};
const addLocalContract = function ({ commit }, localContract) {
  commit('ADD_LOCAL_CONTRACT', localContract);
};
const setImportedState = function ({ commit }, stateObj) {
  stateObj['localStore'] = true;
  commit('SET_IMPORTED_STATE', stateObj);
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
  setGasPriceType,
  setAddressBook,
  setImportedState,
  addLocalContract,
  addCustomPath,
  deleteCustomPath
};
