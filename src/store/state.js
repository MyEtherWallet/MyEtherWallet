import nodeList from '@/configs/networks'
const state = {
  web3: {

  },
  network: {
    chainId: 1,
    RpcUrl: 'https://api.myetherwallet.com/eth',
    port: 80,
    username: null,
    password: null,
    tokens: [],
    contracts: []
  },
  wallet: null,
  Transactions: {},
  Networks: nodeList,
  Errors: {},
  online: true,
  homepage: {
    // Landing page sublink location
    sublink: 'about'
  },
  pageStates: {
    sendOffline: {
      processLocation: 'process1'
    }
  }
}

export default state
