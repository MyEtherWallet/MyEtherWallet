const checkIfOnline = function ({ commit }) {
  commit('CHECK_IF_ONLINE')
}

const clearWallet = function ({ commit }) {
  commit('CLEAR_WALLET')
}

const decryptWallet = function ({ commit }, wallet) {
  commit('DECRYPT_WALLET', wallet)
}

const updatePageState = function ({ commit }, arr) {
  commit('CHANGE_PAGE_STATE', arr)
}

const setWeb3Instance = function ({ commit }, web3) {
  commit('SET_WEB3_INSTANCE', web3)
}

const setAccountBalance = function ({ commit }, balance) {
  commit('SET_ACCOUNT_BALANCE', balance)
}

const switchNetwork = function ({ commit }, networkObj) {
  commit('SWITCH_NETWORK', networkObj)
}

const setState = function ({ commit }, stateObj) {
  commit('INIT_STATES', stateObj)
}

const setGasPrice = function ({ commit }, gasPrice) {
  commit('SET_GAS_PRICE', gasPrice)
}

const setAccountNonce = function ({ commit }, nonce) {
  commit('SET_ACCOUNT_NONCE', nonce)
}

const addNotification = function ({ commit }, val) {
  commit('ADD_NOTIFICATION', val)
}

const updateNotification = function ({ commit }, val) {
  commit('UPDATE_NOTIFICATION', val)
}

export default {
  checkIfOnline,
  clearWallet,
  decryptWallet,
  updatePageState,
  setWeb3Instance,
  setAccountBalance,
  switchNetwork,
  setState,
  setGasPrice,
  setAccountNonce,
  addNotification,
  updateNotification
}
