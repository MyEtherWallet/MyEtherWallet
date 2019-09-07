import tokens from '@/tokens/tokens-tomo.json';
import contracts from '@/contracts/contract-abi-tomo.json';
import tomo from '@/assets/images/networks/tomo.svg';

export default {
  name: 'TOMO',
  name_long: 'TomoChain',
  homePage: 'https://tomochain.com/',
  blockExplorerTX: 'https://scan.tomochain.com/txs/[[txHash]]',
  blockExplorerAddr: 'https://scan.tomochain.com/address/[[address]]',
  chainID: 88,
  tokens: tokens,
  contracts: contracts,
  icon: tomo,
  currencyName: 'TOMO'
};
