import tokens from '@/_generated/tokens/tokens-ella.json';
import contracts from '@/_generated/contracts/contract-abi-ella.json';
import ella from '@/assets/images/networks/ella.svg';

export default {
  name: 'ELLA',
  name_long: 'Ellaism',
  homePage: 'https://ellaism.org/',
  blockExplorerTX: 'https://explorer.ellaism.io/transaction/[[txHash]]',
  blockExplorerAddr: 'https://explorer.ellaism.io/address/[[address]]',
  chainID: 64,
  tokens: tokens,
  contracts: contracts,
  icon: ella,
  currencyName: 'ELLA'
};
