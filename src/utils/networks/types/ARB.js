import arbitrum from '@/assets/images/networks/arbitrum.svg';
export default {
  name: 'ARB',
  name_long: 'Arbitrum',
  homePage: 'https://arbitrum.io/',
  blockExplorer: 'arbiscan',
  blockExplorerTX: 'https://arbiscan.io/tx/[[txHash]]',
  blockExplorerAddr: 'https://arbiscan.io/address/[[address]]',
  chainID: 42161,
  tokens: import('@/_generated/tokens/tokens-eth.json').then(
    module => module.default
  ),
  contracts: import('@/_generated/contracts/contract-abi-eth.json').then(
    module => module.default
  ),
  icon: arbitrum,
  currencyName: 'ETH',
  isTestNetwork: false,
  isEthVMSupported: {
    supported: false,
    url: null,
    websocket: null
  },
  gasPriceMultiplier: 1,
  canBuy: true,
  coingeckoID: 'ethereum',
  balanceApi: 'https://partners.mewapi.io/balances/arb/',
  ensEnkryptType: 'ARB1'
};
