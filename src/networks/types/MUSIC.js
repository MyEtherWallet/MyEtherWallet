import tokens from '@/tokens/tokens-music.json';
import contracts from '@/contracts/contract-abi-music.json';
import music from '@/assets/images/networks/music.svg';

export default {
  name: 'MUSIC',
  name_long: 'Music Coin',
  homePage: 'https://musicoin.org/',
  blockExplorerTX: 'https://explorer.musicoin.org/tx/[[txHash]]',
  blockExplorerAddr: 'https://explorer.musicoin.org/account/[[address]]',
  chainID: 7762959,
  tokens: tokens,
  contracts: contracts,
  icon: music
};
