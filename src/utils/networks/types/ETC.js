import etc from '@/assets/images/networks/etc.svg';

export default {
  name: 'ETC',
  name_long: 'Ethereum Classic',
  homePage: 'https://ethereumclassic.org/',
  blockExplorer: 'Blockscout',
  blockExplorerTX: 'https://blockscout.com/etc/mainnet/tx/[[txHash]]',
  blockExplorerAddr: 'https://blockscout.com/etc/mainnet/address/[[address]]',
  chainID: 61,
  tokens: import('@/_generated/tokens/tokens-etc.json').then(
    val => val.default
  ),
  contracts: import('@/_generated/contracts/contract-abi-etc.json').then(
    val => val.default
  ),
  icon: etc,
  currencyName: 'ETC',
  isTestNetwork: false,
  isEthVMSupported: {
    supported: false,
    url: null,
    blockExplorerTX: '',
    blockExplorerAddr: '',
    websocket: null
  },
  gasPriceMultiplier: 1,
  canBuy: false,
  coingeckoID: 'ethereum-classic',
  balanceApi: ''
};
