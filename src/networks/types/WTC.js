import tokens from '@/_generated/tokens/wtc/0x668df218d073f413Ed2FCEa0D48CfbFd59C030Ae.json';
import wtc from '@/assets/images/networks/wtc.svg';

export default {
  name: 'WTC',
  name_long: 'Waltonchain',
  homePage: 'https://www.waltonchain.org/en/',
  blockExplorerTX: 'https://waltonchain.pro/pc/src/searchTran.html?[[txHash]]&ver=1.3',
  blockExplorerAddr: 'https://waltonchain.pro/pc/src/searchMiner.html?[[address]]&ver=1.3',
  chainID: 15,
  tokens: tokens,
  contracts: contracts,
  icon: wtc,
  currencyName: 'WTC'
};
