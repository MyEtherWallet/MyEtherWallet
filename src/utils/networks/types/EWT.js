import tokens from '@/_generated/tokens/tokens-ewt.json';
import contracts from '@/_generated/contracts/contract-abi-ewt.json';
import ewt from '@/assets/images/networks/ewt.svg';

export default {
  name: 'EWT',
  name_long: 'EnergyWeb Token',
  homePage: 'https://www.energyweb.org/',
  blockExplorerTX: 'https://explorer.energyweb.org/tx/[[txHash]]',
  blockExplorerAddr: 'https://explorer.energyweb.org/address/[[address]]',
  chainID: 246,
  tokens: tokens,
  contracts: contracts,
  icon: ewt,
  currencyName: 'EWT'
};
