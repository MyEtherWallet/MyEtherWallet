import tokens from '@/tokens/tokens-etsc.json';
import contracts from '@/contracts/contract-abi-etsc.json';
import etsc from '@/assets/images/networks/etsc.svg';
// import { EthAbi } from '../ensAbis';

export default {
  name: 'ETSC',
  name_long: 'EthereumSocial',
  homePage: 'https://ethereumsocial.kr/',
  blockExplorerTX: 'https://explorer.ethereumsocial.kr/tx/[[txHash]]',
  blockExplorerAddr: 'https://explorer.ethereumsocial.kr/addr/[[address]]',
  chainID: 28,
  tokens: tokens,
  contracts: contracts,
  ensResolver: '',
  ensAbi: '',
  icon: etsc
};
