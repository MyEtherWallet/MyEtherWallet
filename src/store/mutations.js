
const DECRYPT_WALLET = function (state, wallet) {
  state.wallet = wallet
}

const CHECK_IF_ONLINE = function (state) {
  state.online = window.location.protocol === 'http:' || window.location.protocol === 'https:'
}

export default {
  DECRYPT_WALLET,
  CHECK_IF_ONLINE
}
