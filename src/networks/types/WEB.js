import tokens from '@/tokens/tokens-web.json';
import contracts from '@/contracts/contract-abi-web.json';
import web from '@/assets/images/networks/web.svg';

export default {
  name: 'WEB',
  name_long: 'Webchain',
  homePage: 'https://webchain.network/',
  blockExplorerTX: 'https://explorer.webchain.network/tx/[[txHash]]',
  blockExplorerAddr: 'https://explorer.webchain.network/addr/[[address]]',
  chainID: 101,
  tokens: tokens,
  contracts: contracts,
  icon: web
};
