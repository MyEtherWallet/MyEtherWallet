import tokens from '@/_generated/tokens/tokens-etc.json';
import contracts from '@/_generated/contracts/contract-abi-etc.json';
import go from '@/assets/images/networks/go.svg';

export default {
  name: 'GO',
  name_long: 'Gochain',
  homePage: 'https://gochain.io/',
  blockExplorerTX: 'https://explorer.gochain.io/tx/[[txHash]]',
  blockExplorerAddr: 'https://explorer.gochain.io/addr/[[address]]',
  chainID: 60,
  tokens: tokens,
  contracts: contracts,
  icon: go,
  currencyName: 'GO',
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
  coingeckID: 'gochain'
};
