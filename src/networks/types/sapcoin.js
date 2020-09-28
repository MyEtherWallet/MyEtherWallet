import tokens from '@/_generated/tokens/tokens-sapcoin.json';
import contracts from '@/_generated/contracts/contract-abi-sapcoin.json';
import sapcoin from '@/assets/images/networks/sapcoin.svg';

export default {
  name: ‘SAP’,
  name_long: ‘Callisto’,
  homePage: ‘
https://callisto.network/'
,
  blockExplorerTX: ‘
https://explorer.callisto.network/tx/[[txHash]]'
,
  blockExplorerAddr: ‘
https://explorer.callisto.network/account/[[address]]'
,
  chainID: 820,
  tokens: tokens,
  contracts: contracts,
  icon: sapcoin,
  currencyName: ‘SAP’
};
