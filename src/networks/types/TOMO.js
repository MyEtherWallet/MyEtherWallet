import tokens from '@/tokens/tokens-tomo.json';
import contracts from '@/contracts/contract-abi-tomo.json';
import tomo from '@/assets/images/networks/tomo.svg';

export default {
  name: 'TOMO',
  name_long: 'Tomo Coin',
  homePage: 'https://tomochain.com/',
  blockExplorerTX: 'https://explorer.tomocoin.io/#/tx/[[txHash]]',
  blockExplorerAddr: 'https://explorer.tomocoin.io/#/address/[[address]]',
  chainID: 88,
  tokens: tokens,
  contracts: contracts,
  icon: tomo
};
