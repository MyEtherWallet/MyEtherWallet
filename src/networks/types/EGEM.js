import tokens from '@/tokens/tokens-egem.json';
import contracts from '@/contracts/contract-abi-egem.json';
import egem from '@/assets/images/networks/egem.svg';
// import { EthAbi } from '../ensAbis';

export default {
  name: 'EGEM',
  name_long: 'EtherGem',
  homePage: 'https://egem.io/',
  blockExplorerTX: 'https://explorer.egem.io/tx/[[txHash]]',
  blockExplorerAddr: 'https://explorer.egem.io/addr/[[address]]',
  chainID: 1987,
  tokens: tokens,
  contracts: contracts,
  ensResolver: '',
  ensAbi: '',
  icon: egem
};
