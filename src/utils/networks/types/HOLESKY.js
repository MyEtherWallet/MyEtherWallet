import goerli from '@/assets/images/networks/network.svg';

export default {
  name: 'HOLESKY',
  name_long: 'Holesky',
  homePage: 'https://github.com/eth-clients/holesky',
  blockExplorer: 'Etherscan',
  blockExplorerTX: 'https://holesky.etherscan.io//tx/[[txHash]]',
  blockExplorerAddr: 'https://holesky.etherscan.io//address/[[address]]',
  chainID: 17000,
  tokens: import('@/_generated/tokens/tokens-akroma.json').then(
    module => module.default
  ),
  contracts: import('@/_generated/contracts/contract-abi-akroma.json').then(
    module => module.default
  ),
  isTestNetwork: true,
  isEthVMSupported: {
    supported: false,
    url: null,
    websocket: null
  },
  icon: goerli,
  currencyName: 'HolETH',
  gasPriceMultiplier: 1,
  canBuy: false,
  coingeckoID: null,
  balanceApi: ''
};
