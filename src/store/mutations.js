import store from 'store'

const CHECK_IF_ONLINE = function (state) {
  state.online =
    window.location.protocol === 'http:' ||
    window.location.protocol === 'https:'
}

const CLEAR_WALLET = function (state) {
  state.wallet = null
  state.account = {balance: 0}
}

const DECRYPT_WALLET = function (state, wallet) {
  state.wallet = wallet
}

const CHANGE_PAGE_STATE = function (state, arr) {
  state.pageStates[arr[0]][arr[1]] = arr[2]
  store.set(arr[1], arr[2])
}

const SET_WEB3_INSTANCE = function (state, web3) {
  if (web3.eth === undefined) {
    // eslint-disable-next-line
    state.web3 = new web3(new web3.providers.HttpProvider(state.network.url))
  } else {
    state.web3 = web3
  }
}

const SET_ACCOUNT_BALANCE = function (state, balance) {
  state.account.balance = balance
}

const SET_ACCOUNT_NONCE = function (state, nonce) {
  state.account.nonce = nonce
}

const SWITCH_NETWORK = function (state, networkObj) {
  state.network = networkObj
  store.set('network', networkObj)
}

const INIT_STATES = function (state, stateObj) {
  Object.keys(state).forEach(key => {
    state[key] = stateObj[key]
  })
}

const SET_GAS_PRICE = function (state, val) {
  state.gasPrice = val
  store.set('gasPrice', val)
}

export default {
  CHECK_IF_ONLINE,
  CLEAR_WALLET,
  DECRYPT_WALLET,
  CHANGE_PAGE_STATE,
  SET_WEB3_INSTANCE,
  SET_ACCOUNT_BALANCE,
  SET_ACCOUNT_NONCE,
  SWITCH_NETWORK,
  INIT_STATES,
  SET_GAS_PRICE
}
