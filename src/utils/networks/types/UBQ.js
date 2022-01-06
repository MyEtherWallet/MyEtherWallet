import tokens from '@/_generated/tokens/tokens-ubq.json';
import contracts from '@/_generated/contracts/contract-abi-ubq.json';
import clo from '@/assets/images/networks/ubq.svg';

export default {
  name: 'UBQ',
  name_long: 'UBIQ',
  homePage: 'https://ubiqsmart.com/',
  blockExplorerTX: 'https://ubiqscan.io/transactions/',
  blockExplorerAddr: 'https://ubiqscan.io/address/0x9009C0E585A58B01E2B5C9cd9c14D28e2EC3b196',
  chainID: 820,
  tokens: tokens,
  contracts: contracts,
  icon: ubq,
  currencyName: ‘UBQ’
};
