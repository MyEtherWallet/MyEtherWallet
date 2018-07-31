const addNotification = function ({ commit }, val) {
  commit('ADD_NOTIFICATION', val)
}

const checkIfOnline = function ({ commit }) {
  commit('CHECK_IF_ONLINE')
}

const clearWallet = function ({ commit }) {
  commit('CLEAR_WALLET')
}

const createAndSignTx = function ({ commit }, val) {
  commit('CREATE_AND_SIGN_TX', val)
}

const decryptWallet = function ({ commit }, wallet) {
  commit('DECRYPT_WALLET', wallet)
}

const setAccountBalance = function ({ commit }, balance) {
  commit('SET_ACCOUNT_BALANCE', balance)
}

const setGasPrice = function ({ commit }, gasPrice) {
  commit('SET_GAS_PRICE', gasPrice)
}

const setState = function ({ commit }, stateObj) {
  commit('INIT_STATES', stateObj)
}

const setWeb3Instance = function ({ commit }, web3) {
  commit('SET_WEB3_INSTANCE', web3)
}

const switchNetwork = function ({ commit }, networkObj) {
  commit('SWITCH_NETWORK', networkObj)
}

const updateNotification = function ({ commit }, val) {
  commit('UPDATE_NOTIFICATION', val)
}

const updatePageState = function ({ commit }, arr) {
  commit('CHANGE_PAGE_STATE', arr)
}

export default {
  addNotification,
  checkIfOnline,
  clearWallet,
  createAndSignTx,
  decryptWallet,
  setAccountBalance,
  setGasPrice,
  setState,
  setWeb3Instance,
  switchNetwork,
  updateNotification,
  updatePageState
}
