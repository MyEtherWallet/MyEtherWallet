import tokens from '@/_generated/tokens/tokens-xdai.json';
import contracts from '@/_generated/contracts/contract-abi-xdai.json';
import clo from '@/assets/images/networks/xdai.svg';

export default {
  name: 'xDai',
  name_long: 'xDai',
  homePage: 'https://rpc.xdaichain.com/',
  blockExplorerTX: 'https://blockscout.com/poa/xdai/tx/[[txHash]]',
  blockExplorerAddr: 'https://blockscout.com/poa/xdai/address/[[address]]',
  chainID: 100,
  tokens: tokens,
  contracts: contracts,
  icon: xdai,
  currencyName: 'xDai'
};
