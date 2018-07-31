import nodeList from '@/configs/networks'
const state = {
  web3: {},
  network: {
    chainId: 1,
    url: 'https://api.myetherwallet.com/eth',
    port: 80,
    username: null,
    password: null,
    tokens: [],
    contracts: []
  },
  wallet: null,
  account: {
    balance: 0
  },
  Transactions: {},
  Networks: nodeList,
  Errors: {},
  online: true,
  pageStates: {
    interface: {
      sideMenu: 'send'
    }
  },
  notifications: {},
  gasPrice: 41
}

export default state
