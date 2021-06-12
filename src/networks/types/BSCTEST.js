import tokens from '@/_generated/tokens/tokens-bsc.json';
import contracts from '@/_generated/contracts/contract-abi-bsc.json';
import bsc from '@/assets/images/icons/network.svg';

export default {
  name: 'BSCTEST',
  name_long: 'Binance Smart Chain Testnet',
  homePage: 'https://www.binance.org/en/smartChain',
  blockExplorerTX: 'https://testnet.bscscan.com/tx/[[txHash]]',
  blockExplorerAddr: 'https://testnet.bscscan.com/address/[[address]]',
  chainID: 97,
  tokens: tokens,
  contracts: contracts,
  icon: bsc,
  currencyName: 'BNB'
};
