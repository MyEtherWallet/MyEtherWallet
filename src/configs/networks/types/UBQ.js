import * as tokens from '@/tokens/tokens-ubq.json'
import * as contracts from '@/contracts/contract-abi-ubq.json'
export default {
  name: 'UBQ',
  name_long: 'Ubiq',
  homePage: 'https://ubiqsmart.com/',
  blockExplorerTX: 'https://ubiqscan.io/en/tx/[[txHash]]',
  blockExplorerAddr: 'https://ubiqscan.io/en/address/[[address]]',
  chainID: 8,
  tokens: tokens,
  contracts: contracts
}
