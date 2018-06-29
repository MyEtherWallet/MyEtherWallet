const CHECK_IF_ONLINE = function (state) {
  state.online = window.location.protocol === 'http:' || window.location.protocol === 'https:'
}

const CLEAR_WALLET = function (state) {
  state.wallet = null
}

const DECRYPT_WALLET = function (state, wallet) {
  state.wallet = wallet
}

export default {
  CHECK_IF_ONLINE,
  CLEAR_WALLET,
  DECRYPT_WALLET
}
