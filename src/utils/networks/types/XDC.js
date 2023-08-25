import xdc from '@/assets/images/networks/xdc.svg';

export default {
  name: 'XDC',
  name_long: 'XDC Network',
  homePage: 'https://xinfin.org/',
  blockExplorer: 'BlocksScan',
  blockExplorerTX: 'https://xdc.blocksscan.io/tx/[[txHash]]',
  blockExplorerAddr: 'https://xdc.blocksscan.io/addr/[[address]]',
  chainID: 50,
  contracts: import('@/_generated/contracts/contract-abi-etc.json').then(
    val => val.default
  ),
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
  coingeckoID: 'xdce-crowd-sale',
  gasPriceMultiplier: 1,
  balanceApi: ''
};
