import tokens from '@/tokens/tokens-poa.json';
import contracts from '@/contracts/contract-abi-poa.json';
import poa from '@/assets/images/networks/poa.svg';
// import { EthAbi } from '../ensAbis';

export default {
  name: 'POA',
  name_long: 'Proof of Authority',
  homePage: 'https://poa.network/',
  blockExplorerTX: 'https://poaexplorer.com/tx/[[txHash]]',
  blockExplorerAddr: 'https://poaexplorer.com/address/[[address]]',
  chainID: 99,
  tokens: tokens,
  contracts: contracts,
  ensResolver: '',
  ensAbi: '',
  icon: poa
};
