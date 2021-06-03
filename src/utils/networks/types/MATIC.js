import matic from '@/assets/images/networks/network.svg';

export default {
  name: 'MATIC',
  name_long: 'MATIC Network',
  homePage: 'https://explorer-mainnet.maticvigil.com/',
  blockExplorerTX: 'https://explorer-mainnet.maticvigil.com/tx/[[txHash]]',
  blockExplorerAddr:
    'https://explorer-mainnet.maticvigil.com/address/[[address]]',
  chainID: 137,
  tokens: [],
  contracts: [],
  icon: matic,
  currencyName: 'MATIC',
  isEthVMSupported: {
    supported: false,
    url: null,
    websocket: null
  }
};
