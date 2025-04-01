import base from '@/assets/images/networks/base.svg';

export default {
  name: 'BASE',
  name_long: 'Base Mainnet',
  homePage: 'https://base.org/',
  blockExplorer: 'Blockscout',
  blockExplorerTX: 'https://base.blockscout.com/tx/[[txHash]]',
  blockExplorerAddr: 'https://base.blockscout.com/address/[[address]]',
  chainID: 8453,
  tokens: import('@/_generated/tokens/tokens-goerli.json').then(
    val => val.default
  ),
  contracts: import('@/_generated/contracts/contract-abi-goerli.json').then(
    val => val.default
  ),
  icon: base,
  currencyName: 'ETH',
  isTestNetwork: false,
  isEthVMSupported: {
    supported: false,
    url: null,
    blockExplorerTX: '',
    blockExplorerAddr: '',
    websocket: null
  },
  coingeckoID: 'base',
  gasPriceMultiplier: 1,
  balanceApi: 'https://partners.mewapi.io/balances/base/'
};
