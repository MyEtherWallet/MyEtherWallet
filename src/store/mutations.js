const CHECK_IF_ONLINE = function (state) {
  state.online = window.location.protocol === 'http:' || window.location.protocol === 'https:'
}

const CLEAR_WALLET = function (state) {
  state.wallet = null
}

const DECRYPT_WALLET = function (state, wallet) {
  state.wallet = wallet
}

const CHANGE_PAGE_STATE = function (state, arr) {
  state.pageStates[arr[0]][arr[1]] = arr[2]
}

const SET_WEB3_INSTANCE = function (state, web3) {
  web3.setProvider(state.network.RpcUrl)
  state.web3 = web3
}

const SET_ACCOUNT_BALANCE = function (state, balance) {
  state.account.balance = balance
}

export default {
  CHECK_IF_ONLINE,
  CLEAR_WALLET,
  DECRYPT_WALLET,
  CHANGE_PAGE_STATE,
  SET_WEB3_INSTANCE,
  SET_ACCOUNT_BALANCE
}
