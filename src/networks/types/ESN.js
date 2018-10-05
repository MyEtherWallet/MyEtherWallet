import tokens from '@/tokens/tokens-esn.json';
import contracts from '@/contracts/contract-abi-esn.json';
// import { EthAbi } from '../ensAbis';

export default {
  name: 'ESN',
  name_long: 'EtherSocial',
  homePage: 'https://ethersocial.org/',
  blockExplorerTX: 'https://ethersocial.net/tx/[[txHash]]',
  blockExplorerAddr: 'https://ethersocial.net/addr/[[address]]',
  chainID: 31102,
  tokens: tokens,
  contracts: contracts,
  ensResolver: '',
  ensAbi: ''
};
