import tokens from '@/_generated/tokens/tokens-music.json';
import contracts from '@/_generated/contracts/contract-abi-music.json';
import music from '@/assets/images/networks/music.svg';

export default {
  name: 'MUSIC',
  name_long: 'Music Coin',
  homePage: 'https://musicoin.org/',
  blockExplorerTX: ' https://orbiter.musicoin.org/tx/[[txHash]]',
  blockExplorerAddr: ' https://orbiter.musicoin.org/addr/[[address]]',
  chainID: 7762959,
  tokens: tokens,
  contracts: contracts,
  icon: music,
  currencyName: 'MUSIC'
};
