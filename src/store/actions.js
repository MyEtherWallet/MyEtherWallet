
let decryptWallet = function ({commit}, wallet) {
  commit('DECRYPT_WALLET', wallet)
}

export default {
  decryptWallet
}
