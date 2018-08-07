const addNotification = function ({commit, state}, val) {
  const newNotif = {}
  Object.keys(state.notifications).forEach(item => {
    newNotif[item] = state.notifications[item]
  })

  newNotif[val[0]].push({
    title: val[2],
    read: false,
    timestamp: new Date(),
    body: val[1].message ? val[1].message : val[1],
    expanded: false
  })
  commit('ADD_NOTIFICATION', newNotif)
}

const checkIfOnline = function ({commit}) {
  commit('CHECK_IF_ONLINE')
}

const clearWallet = function ({commit}) {
  commit('CLEAR_WALLET')
}

const createAndSignTx = function ({commit}, val) {
  commit('CREATE_AND_SIGN_TX', val)
}

const decryptWallet = function ({commit}, wallet) {
  commit('DECRYPT_WALLET', wallet)
}

const setAccountBalance = function ({commit}, balance) {
  commit('SET_ACCOUNT_BALANCE', balance)
}

const setGasPrice = function ({commit}, gasPrice) {
  commit('SET_GAS_PRICE', gasPrice)
}

const setState = function ({commit}, stateObj) {
  commit('INIT_STATES', stateObj)
}

const setWeb3Instance = function ({commit}, web3) {
  if (web3.eth === undefined) {
    // eslint-disable-next-line
    let web3Instance = new web3(new web3.providers.HttpProvider(state.network.url))
    commit('SET_WEB3_INSTANCE', web3Instance)
  } else {
    commit('SET_WEB3_INSTANCE', web3)
  }
}

const switchNetwork = function ({commit}, networkObj) {
  commit('SWITCH_NETWORK', networkObj)
}

const updateNotification = function ({commit, state}, val) {
  // address, index, object
  const newNotif = {}
  Object.keys(state.notifications).forEach(item => {
    newNotif[item] = state.notifications[item]
  })

  newNotif[val[0]][val[1]] = val[2]
  commit('UPDATE_NOTIFICATION', newNotif)
}

const updatePageState = function ({commit}, arr) {
  commit('CHANGE_PAGE_STATE', arr)
}

export default {
  addNotification,
  checkIfOnline,
  clearWallet,
  createAndSignTx,
  decryptWallet,
  setAccountBalance,
  setGasPrice,
  setState,
  setWeb3Instance,
  switchNetwork,
  updateNotification,
  updatePageState
}
