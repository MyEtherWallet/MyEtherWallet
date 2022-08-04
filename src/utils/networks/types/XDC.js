import xdc from '@/assets/images/networks/xdc.svg';

export default {
  name: 'XDC',
  name_long: 'XDC.Network',
  homePage: 'https://xinfin.org/',
  blockExplorerTX: 'https://xdc.blocksscan.io/tx/[[txHash]]',
  blockExplorerAddr: 'https://xdc.blocksscan.io/addr/[[address]]',
  chainID: 50,
  tokens: [],
  contracts: [],
  icon: xdc,
  currencyName: 'XDC',
  isTestNetwork: false,
  isEthVMSupported: {
    supported: false,
    url: null,
    blockExplorerTX: '',
    blockExplorerAddr: '',
    websocket: null
  },
  coingeckID: 'xdc-network',
  gasPriceMultiplier: 1
};
