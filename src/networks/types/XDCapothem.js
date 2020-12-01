import tokens from '@/tokens/tokens-xdc.json';
import contracts from '@/contracts/contract-abi-xdc.json';
import xdc from '@/assets/images/networks/xdc.svg';

export default {
  name: 'XDC Apothem',
  name_long: 'Apothem.Network',
  homePage: 'https://apothem.Network/',
  blockExplorerTX: 'https://explorer.apothem.network/tx/[[txHash]]',
  blockExplorerAddr: 'https://explorer.apothem.network/addr/[[address]]',
  chainID: 51,
  tokens: tokens,
  contracts: contracts,
  icon: xdc,
  currencyName: 'XDC'
};
