const state = {
  account: {
    balance: 0
  },
  customPaths: {},
  ens: true,
  Errors: {},
  ethDonationAddress: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D',
  Networks: {},
  network: {},
  notifications: {},
  online: true,
  Transactions: {},
  wallet: null,
  web3: {
    eth: {}
  }
};

const getters = {
  account: () => {
    return { balance: 0 };
  },
  customPaths: () => {},
  ens: () => {},
  Errors: () => {},
  ethDonationAddress: () => '',
  gasPrice: () => 41,
  Networks: () => {},
  network: () => {
    return {
      auth: false,
      password: '',
      port: 443,
      service: 'infura.io',
      type: {
        blockExplorerAddr: 'https://etherscan.io/address/[[address]]',
        blockExplorerTX: 'https://etherscan.io/tx/[[txHash]]',
        chainID: 1,
        contracts: [],
        ensResolver: '0x314159265dd8dbb310642f98f50c066173c1259b',
        homePage: 'https://ethereum.org',
        name: 'ETH',
        name_long: 'Ethereum',
        tokens: []
      },
      url: 'https://mainnet.infura.io/mew'
    };
  },
  notifications: () => {},
  online: () => true,
  Transactions: () => {},
  wallet: () => {
    return {
      getChecksumAddressString: () => ''
    };
  },
  web3: () => {
    return {
      eth: {}
    };
  }
};

export { state, getters };
