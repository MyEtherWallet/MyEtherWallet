import nodeList from '@/networks';
const state = {
  web3: {},
  network: {
    auth: false,
    password: '',
    port: 443,
    service: 'myetherwallet.com',
    type: {
      blockExplorerAddr: 'https://ropsten.etherscan.io/address/[[txHash]]',
      blockExplorerTX: 'https://ropsten.etherscan.io/tx/[[txHash]]',
      chainID: 3,
      contracts: [],
      homePage: 'https://github.com/ethereum/ropsten',
      name: 'ROP',
      name_long: 'Ropsten',
      tokens: []
    },
    url: 'https://api.myetherwallet.com/rop',
    username: ''
  },
  wallet: null,
  account: {
    balance: 0
  },
  Transactions: {},
  Networks: nodeList,
  Errors: {},
  online: true,
  customPaths: {},
  notifications: {},
  gasPrice: 41,
  ens: {}
};

export default state;
