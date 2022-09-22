import kov from '@/assets/images/networks/network.svg';

export default {
  name: 'KOV',
  name_long: 'Kovan',
  homePage: 'https://kovan-testnet.github.io/website/',
  blockExplorer: 'Etherscan',
  blockExplorerTX: 'https://kovan.etherscan.io/tx/[[txHash]]',
  blockExplorerAddr: 'https://kovan.etherscan.io/address/[[address]]',
  chainID: 42,
  tokens: import('@/_generated/tokens/tokens-kov.json').then(
    val => val.default
  ),
  contracts: import('@/_generated/contracts/contract-abi-kov.json').then(
    val => val.default
  ),
  icon: kov,
  isTestNetwork: true,
  currencyName: 'KOV',
  isEthVMSupported: {
    supported: false,
    url: null,
    blockExplorerTX: '',
    blockExplorerAddr: '',
    websocket: null
  },
  gasPriceMultiplier: 1,
  canBuy: false,
  coingeckoID: null
};
