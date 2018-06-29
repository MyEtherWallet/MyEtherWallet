const checkIfOnline = function ({commit}) {
  commit('CHECK_IF_ONLINE')
}

const clearWallet = function ({commit}) {
  commit('CLEAR_WALLET')
}

const decryptWallet = function ({commit}, wallet) {
  commit('DECRYPT_WALLET', wallet)
}

export default {
  checkIfOnline,
  clearWallet,
  decryptWallet
}
