const all = (state) => {
  return state
}

const wallet = (state) => {
  return state.wallet
}

const network = (state) => {
  return state.network
}

const online = (state) => {
  return state.online
}

const account = (state) => {
  return state.account
}

const notifications = (state) => {
  return state.notifications
}

export default {
  account,
  all,
  wallet,
  online,
  network,
  notifications
}
