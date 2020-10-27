import tokens from '@/_generated/tokens/tokens-bsc.json';
import contracts from '@/_generated/contracts/contract-abi-bsc.json';
import bsc from '@/assets/images/icons/network.svg';

export default {
  name: 'BSC',
  name_long: 'Binane Smart Chain',
  homePage: 'https://www.binance.org/en/smartChain',
  blockExplorerTX: 'https://bscscan.com/tx/[[txHash]]',
  blockExplorerAddr: 'https://bscscan.com/address/[[address]]',
  chainID: 56,
  tokens: tokens,
  contracts: contracts,
  icon: bsc,
  currencyName: 'BNB'
};
