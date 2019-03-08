import tokens from '@/tokens/tokens-thundercore.json';
import contracts from '@/contracts/contract-abi-thundercore.json';
import thundercore from '@/assets/images/networks/thundercore.svg';

export default {
  name: 'THUNDERCORE',
  name_long: 'TT',
  homePage: 'https://www.thundercore.com/',
  blockExplorerTX: 'https://scan.thundercore.com/transactions/[[txHash]]',
  blockExplorerAddr: 'https://scan.thundercore.com/address/[[address]]',
  chainID: 108,
  tokens: tokens,
  contracts: contracts,
  icon: thundercore
};
