import * as tokens from '@/tokens/tokens-clo.json'
import * as contracts from '@/contracts/contract-abi-clo.json'
export default {
  name: 'CLO',
  name_long: 'Callisto',
  homePage: 'https://callisto.network/',
  blockExplorerTX: 'https://cloexplorer.org/tx/[[txHash]]',
  blockExplorerAddr: 'https://cloexplorer.org/addr/[[address]]',
  chainID: 820,
  tokens: tokens,
  contracts: contracts
}
