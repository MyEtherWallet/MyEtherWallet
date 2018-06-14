const checkIfOnline = function ({commit}) {
  commit('CHECK_IF_ONLINE')
}

const decryptWallet = function ({commit}, wallet) {
  commit('DECRYPT_WALLET', wallet)
}

export default {
  checkIfOnline,
  decryptWallet
}
