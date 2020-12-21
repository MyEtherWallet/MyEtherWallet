import tokens from '@/_generated/tokens/tokens-goerli.json';
import contracts from '@/_generated/contracts/contract-abi-goerli.json';
import { GOERLI } from '../tlds';
import goerli from '@/assets/images/icons/network.svg';

export default {
  name: 'GOERLI',
  name_long: 'Goerli',
  homePage: 'https://github.com/goerli/testnet',
  blockExplorerTX: 'https://goerli.etherscan.io/tx/[[txHash]]',
  blockExplorerAddr: 'https://goerli.etherscan.io/address/[[address]]',
  chainID: 5,
  tokens: tokens,
  contracts: contracts,
  ens: {
    registry: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
    registrarTLD: 'eth',
    registrarType: 'permanent',
    supportedTld: GOERLI
  },
  icon: goerli,
  currencyName: 'GöETH'
};
