import contracts from '@/_generated/contracts/contract-abi-tt.json';
import tokens from '@/_generated/tokens/tokens-tt.json';
import thundercore from '@/assets/images/networks/thundercore.svg';

export default {
  name: 'TT',
  name_long: 'ThunderCore',
  homePage: 'https://www.thundercore.com/',
  blockExplorerTX: 'https://scan.thundercore.com/transactions/[[txHash]]',
  blockExplorerAddr: 'https://scan.thundercore.com/address/[[address]]',
  chainID: 108,
  tokens: tokens,
  contracts: contracts,
  icon: thundercore,
  currencyName: 'TT'
};
