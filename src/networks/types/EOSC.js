import tokens from '@/tokens/tokens-eosc.json';
import contracts from '@/contracts/contract-abi-eosc.json';
import eosc from '@/assets/images/networks/eosc.svg';

export default {
  name: 'EOSC',
  name_long: 'EOS-Classic',
  homePage: 'https://eos-classic.io/',
  blockExplorerTX: 'https://explorer.eos-classic.io/tx/[[txHash]]',
  blockExplorerAddr: 'https://explorer.eos-classic.io/addr/[[address]]',
  chainID: 20,
  tokens: tokens,
  contracts: contracts,
  ensResolver: '',
  icon: eosc
};
