import tokens from '@/tokens/tokens-goerli.json';
import contracts from '@/contracts/contract-abi-goerli.json';
import { GOERLI } from '../tlds';

export default {
  name: 'GöETH',
  name_long: 'Goerli',
  homePage: 'https://github.com/goerli/testnet',
  blockExplorerTX: 'https://blockscout.com/eth/goerli/tx/[[txHash]]',
  blockExplorerAddr: 'https://blockscout.com/eth/goerli/address/[[address]]',
  chainID: 5,
  tokens: tokens,
  contracts: contracts,
  ens: {
    registry: '0x112234455c3a32fd11230c42e7bccd4a84e02010',
    registrarTLD: 'test',
    registrarType: 'fifs',
    supportedTld: GOERLI
  }
};
