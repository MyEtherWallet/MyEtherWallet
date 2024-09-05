import { HOLESKY } from '../tlds';
import network from '@/assets/images/networks/network.svg';

export default {
  name: 'SEPOLIA',
  name_long: 'Sepolia Testnet',
  homePage: 'https://sepolia.dev/',
  blockExplorer: 'ethVM',
  blockExplorerTX: 'https://sepolia.ethvm.com/tx/[[txHash]]',
  blockExplorerAddr: 'https://sepolia.ethvm.com/address/[[address]]',
  chainID: 11155111,
  tokens: import('@/_generated/tokens/tokens-goerli.json').then(
    val => val.default
  ),
  contracts: import('@/_generated/contracts/contract-abi-goerli.json').then(
    val => val.default
  ),
  ens: {
    registry: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
    registrarTLD: 'eth',
    registrarType: 'permanent',
    supportedTld: HOLESKY,
    subgraphPath:
      'https://api.studio.thegraph.com/proxy/49574/enssepolia/version/latest'
  },
  isTestNetwork: true,
  icon: network,
  currencyName: 'SEP',
  isEthVMSupported: {
    supported: false,
    url: null,
    blockExplorerTX: '',
    blockExplorerAddr: '',
    websocket: null
  },
  gasPriceMultiplier: 1,
  canBuy: false,
  coingeckoID: null,
  balanceApi: ''
};
