import tokens from '@/_generated/tokens/tokens-etc.json';
import contracts from '@/_generated/contracts/contract-abi-etc.json';
import etc from '@/assets/images/networks/etc.svg';

export default {
  name: 'ETC',
  name_long: 'Ethereum Classic',
  homePage: 'https://ethereumclassic.org/',
  blockExplorerTX: 'https://blockscout.com/etc/mainnet/tx/[[txHash]]',
  blockExplorerAddr: 'https://blockscout.com/etc/mainnet/address/[[address]]',
  chainID: 61,
  tokens: tokens,
  contracts: contracts,
  icon: etc,
  currencyName: 'ETC',
  isTestNetwork: false,
  isEthVMSupported: {
    supported: false,
    url: null,
    blockExplorerTX: '',
    blockExplorerAddr: '',
    websocket: null
  },
  gasPriceMultiplier: 1,
  canBuy: false,
  coingeckoID: 'ethereum-classic'
};
