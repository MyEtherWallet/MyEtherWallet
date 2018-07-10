const state = {
  web3: {

  },
  network: {
    chainId: 0,
    RpcUrl: 'default rpc url',
    port: 8545,
    username: null,
    password: null
  },
  wallet: null,
  ABI: {
    ETH: [],
    ROP: [],
    hashAsKey: {name: '', address: '', ABI: []}
  },
  Tokens: {
    ETH: [],
    ROP: []
  },
  Transactions: {},
  Networks: {
    ETH: {},
    ROP: {}
  },
  Errors: {},
  homepage: {
    // Landing page sublink location
    sublink: 'about'
  },
  sendOfflineData: {
    states: {
      gweiSlow: '',
      gweiRegular: '',
      gweiFast: '',
      // --- Generate Information ---
      generateInfoExpended: false,
      fromAddress: '',
      speedOfTransaction: '',
      nonce: '',
      // --- Generate Transaction ---
      coinType: {label: 'ETH', value: 'eth'},
      depositAmount: '',
      toAddress: '',
      data: '',
      gasLimit: ''
      // --- Send Transaction ---
    },
    stateSetter: function (state, data) {
      this.states[state] = data
    },
    stateGetter: function (state) {
      return this.states[state]
    }
  },
  pageStates: {
    pageLocation: '',
    sendOffline: {
      processLocation: 'process1'
    },
    txSideMenu: {
      send: false,
      sendEth: false,
      sendOffline: false,
      swap: false,
      dapps: false,
      contract: false,
      interactContract: false,
      deployContract: false
    },
    activeMenuSetter: function (theMenuNames) {
      this.txSideMenu.send = false
      this.txSideMenu.sendEth = false
      this.txSideMenu.sendOffline = false
      this.txSideMenu.swap = false
      this.txSideMenu.dapps = false
      this.txSideMenu.contract = false
      this.txSideMenu.interactContract = false
      this.txSideMenu.deployContract = false
      for (var i = 0; i < theMenuNames.length; i++) {
        this.txSideMenu[theMenuNames[i]] = true
      }
    }
  }
}

export default {
  state
}
