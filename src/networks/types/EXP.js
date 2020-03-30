import tokens from '@/_generated/tokens/tokens-exp.json';
import contracts from '@/_generated/contracts/contract-abi-exp.json';
import exp from '@/assets/images/networks/exp.svg';

export default {
  name: 'EXP',
  name_long: 'Expanse',
  homePage: 'https://expanse.tech/',
  blockExplorerTX: 'http://www.gander.tech/tx/[[txHash]]',
  blockExplorerAddr: 'http://www.gander.tech/address/[[address]]',
  chainID: 2,
  tokens: tokens,
  contracts: contracts,
  icon: exp,
  currencyName: 'EXP'
};
