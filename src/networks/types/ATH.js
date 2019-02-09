import tokens from '@/tokens/tokens-ath.json';
import contracts from '@/contracts/contract-abi-ath.json';
import ath from '@/assets/images/icons/network.svg';

export default {
  name: 'ATH',
  name_long: 'Atheios',
  homePage: 'https://www.atheios.com/',
  blockExplorerTX: 'https://scan.atheios.com/tx/[[txHash]]',
  blockExplorerAddr: 'https://scan.atheios.com/addr/[[address]]',
  chainID: 1620,
  tokens: tokens,
  contracts: contracts,
  icon: ath
};
