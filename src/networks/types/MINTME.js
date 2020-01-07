import tokens from '@/tokens/tokens-web.json';
import contracts from '@/contracts/contract-abi-web.json';
import mintme from '@/assets/images/networks/web.svg';

export default {
  name: 'MINTME',
  name_long: 'MintMe.com Coin',
  homePage: 'https://www.mintme.com/coin/',
  blockExplorerTX: 'https://www.mintme.com/explorer/tx/[[txHash]]',
  blockExplorerAddr: 'https://www.mintme.com/explorer/addr/[[address]]',
  chainID: 24484,
  tokens: tokens,
  contracts: contracts,
  icon: mintme,
  currencyName: 'MINTME'
};
