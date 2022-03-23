import tokens from '@/_generated/tokens/tokens-rop.json';
import contracts from '@/_generated/contracts/contract-abi-rop.json';
import rop from '@/assets/images/networks/network.svg';
import { ROP } from '../tlds';

export default {
  name: 'ROP',
  name_long: 'Ropsten',
  homePage: 'https://github.com/ethereum/ropsten',
  blockExplorerTX: 'https://ropsten.etherscan.io/tx/[[txHash]]',
  blockExplorerAddr: 'https://ropsten.etherscan.io/address/[[address]]',
  chainID: 3,
  tokens: tokens,
  contracts: contracts,
  isTestNetwork: true,
  ens: {
    registry: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
    registrarTLD: 'eth',
    registrarType: 'permanent',
    supportedTld: ROP,
    subgraphPath:
      'https://api.thegraph.com/subgraphs/name/ensdomains/ensropsten'
  },
  icon: rop,
  currencyName: 'ROP',
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
