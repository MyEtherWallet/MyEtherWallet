import tokens from '@/_generated/tokens/tokens-etc.json';
import contracts from '@/_generated/contracts/contract-abi-etc.json';
import mintme from '@/assets/images/networks/mintme.svg';

export default {
  name: 'MINTME',
  name_long: 'MintMe Coin',
  homePage: 'https://www.mintme.com/coin/',
  blockExplorer: 'MintMe',
  blockExplorerTX: 'https://www.mintme.com/explorer/tx/[[txHash]]',
  blockExplorerAddr: 'https://www.mintme.com/explorer/addr/[[address]]',
  chainID: 24734,
  tokens: tokens,
  contracts: contracts,
  isTestNetwork: false,
  icon: mintme,
  currencyName: 'MINTME',
  isEthVMSupported: {
    supported: false,
    url: null,
    websocket: null
  },
  gasPriceMultiplier: 1,
  coingeckoID: 'webchain'
};
