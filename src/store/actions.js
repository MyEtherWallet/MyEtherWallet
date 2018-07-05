const checkIfOnline = function ({commit}) {
  commit('CHECK_IF_ONLINE')
}

const clearWallet = function ({commit}) {
  commit('CLEAR_WALLET')
}

const decryptWallet = function ({commit}, wallet) {
  commit('DECRYPT_WALLET', wallet)
}

const updatePageState = function ({commit}, arr) {
  commit('CHANGE_PAGE_STATE', arr)
}

const setWeb3Instance = function ({commit}, web3) {
  commit('SET_WEB3_INSTANCE', web3)
}

const setAccountBalance = function ({commit}, balance) {
  commit('SET_ACCOUNT_BALANCE', balance)
}

export default {
  checkIfOnline,
  clearWallet,
  decryptWallet,
  updatePageState,
  setWeb3Instance,
  setAccountBalance
}
