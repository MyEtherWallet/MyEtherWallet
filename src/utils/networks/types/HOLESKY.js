import { HOLESKY } from '../tlds';
import network from '@/assets/images/networks/network.svg';

export default {
  name: 'HOLESKY',
  name_long: 'Holesky',
  homePage: 'https://github.com/eth-clients/holesky',
  blockExplorer: 'Etherscan',
  blockExplorerTX: 'https://holesky.etherscan.io/tx/[[txHash]]',
  blockExplorerAddr: 'https://holesky.etherscan.io/address/[[address]]',
  chainID: 17000,
  tokens: import('@/_generated/tokens/tokens-akroma.json').then(
    module => module.default
  ),
  contracts: import('@/_generated/contracts/contract-abi-akroma.json').then(
    module => module.default
  ),
  ens: {
    registry: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
    registrarTLD: 'eth',
    registrarType: 'permanent',
    supportedTld: HOLESKY,
    subgraphPath:
      'https://api.studio.thegraph.com/query/49574/ensholesky/version/latest'
  },
  isTestNetwork: true,
  isEthVMSupported: {
    supported: false,
    url: null,
    websocket: null
  },
  icon: network,
  currencyName: 'HolETH',
  gasPriceMultiplier: 1,
  canBuy: false,
  coingeckoID: null,
  balanceApi: ''
};
