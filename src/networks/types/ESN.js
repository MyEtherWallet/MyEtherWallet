import tokens from '@/tokens/tokens-esn.json';
import contracts from '@/contracts/contract-abi-esn.json';
import esn from '@/assets/images/networks/esn.svg';

export default {
  name: 'ESN',
  name_long: 'EtherSocial',
  homePage: 'https://ethersocial.org/',
  blockExplorerTX: 'https://ethersocial.net/tx/[[txHash]]',
  blockExplorerAddr: 'https://ethersocial.net/addr/[[address]]',
  chainID: 31102,
  tokens: tokens,
  contracts: contracts,
  icon: esn
};
