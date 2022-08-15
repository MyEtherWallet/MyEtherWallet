import tokens from '@/_generated/tokens/tokens-moonbeam.json';
import contracts from '@/_generated/contracts/contract-abi-moonbeam.json';
import moonbeam from '@/assets/images/networks/moonbeam.svg';

export default {
  name: 'Moonbeam',
  name_long: 'Moonbeam',
  homePage: 'https://moonbeam.network/',
  blockExplorer: 'Moonscan',
  blockExplorerTX: 'https://moonscan.io/tx/[[txHash]]',
  blockExplorerAddr: 'https://moonscan.io/addr/[[address]]',
  chainID: 1284,
  tokens: tokens,
  contracts: contracts,
  icon: moonbeam,
  currencyName: 'GLMR',
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
  coingeckID: 'moonbeam'
};
