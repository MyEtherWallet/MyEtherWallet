import eth from '@/assets/images/networks/eth.svg';
import { GOERLI } from '../tlds';

export default {
  name: 'ETH',
  name_long: 'Ethereum',
  homePage: 'https://ethereum.org',
  blockExplorer: 'ethVM',
  blockExplorerTX: 'https://ethvm.com/tx/[[txHash]]',
  blockExplorerAddr: 'https://ethvm.com/address/[[address]]',
  chainID: 1,
  tokens: import('@/_generated/tokens/tokens-eth.json').then(
    module => module.default
  ),
  contracts: import('@/_generated/contracts/contract-abi-eth.json').then(
    module => module.default
  ),
  isTestNetwork: false,
  ens: {
    registry: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
    registrarTLD: 'eth',
    registrarType: 'permanent',
    supportedTld: GOERLI,
    subgraphPath:
      'https://gateway-arbitrum.network.thegraph.com/api/eb17d5e0f1e62e505370ef6bfd7c2844/subgraphs/id/5XqPmWe6gjyrJtFn9cLy237i4cWw2j9HcUJEXsP5qGtH'
  },
  icon: eth,
  currencyName: 'ETH',
  isEthVMSupported: {
    supported: true,
    url: 'http://api.ethvm.com/',
    blockExplorerTX: 'https://ethvm.com/tx/[[txHash]]',
    blockExplorerAddr: 'https://ethvm.com/address/[[address]]',
    websocket: null
  },
  gasPriceMultiplier: 1,
  canBuy: true,
  coingeckoID: 'ethereum',
  balanceApi: 'https://tokenbalance.mewapi.io/eth?address=',
  ensEnkryptType: 'ETH'
};
