import contracts from '@/contracts/contract-abi-tt.json';
import tokens from '@/tokens/tokens-tt.json';
import thundercore from '@/assets/images/networks/thundercore.svg';

export default {
  name: 'TT',
  name_long: 'THUNDERCORE',
  homePage: 'https://www.thundercore.com/',
  blockExplorerTX: 'https://scan.thundercore.com/transactions/[[txHash]]',
  blockExplorerAddr: 'https://scan.thundercore.com/address/[[address]]',
  chainID: 108,
  tokens: tokens,
  contracts: contracts,
  icon: thundercore
};
