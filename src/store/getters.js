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

export default {
  all,
  wallet,
  online,
  network
}
