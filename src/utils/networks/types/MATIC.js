import matic from '@/assets/images/networks/matic.svg';
import tokens from '@/_generated/tokens/tokens-matic.json';
export default {
  name: 'MATIC',
  name_long: 'Polygon (Matic)',
  homePage: 'https://polygonscan.com/',
  blockExplorerTX: 'https://polygonscan.com/tx/[[txHash]]',
  blockExplorerAddr: 'https://polygonscan.com/address/[[address]]',
  chainID: 137,
  tokens: tokens,
  contracts: [],
  icon: matic,
  isTestNetwork: false,
  currencyName: 'MATIC',
  isEthVMSupported: {
    supported: false,
    url: null,
    websocket: null
  },
  gasPriceMultiplier: 1.5,
  canBuy: true,
  coingeckoID: 'matic-network'
};
