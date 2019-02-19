import tokens from '@/tokens/tokens-reosc.json';
import contracts from '@/contracts/contract-abi-reosc.json';
import reosc from '@/assets/images/networks/reosc.svg';

export default {
  name: 'REOSC',
  name_long: 'Reosc Ecosystem',
  homePage: 'https://www.reosc.io/',
  blockExplorerTX: 'https://explorer.reosc.io/tx/[[txHash]]',
  blockExplorerAddr: 'https://explorer.reosc.io/addr/[[address]]',
  chainID: 2894,
  tokens: tokens,
  contracts: contracts,
  icon: reosc
};
