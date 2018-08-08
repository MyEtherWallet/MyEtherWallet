import * as tokens from '@/tokens/tokens-esn.json'
import * as contracts from '@/contracts/contract-abi-esn.json'
export default {
  name: 'ESN',
  name_long: 'EtherSocial',
  homePage: 'https://ethersocial.org/',
  blockExplorerTX: 'https://ethersocial.net/tx/[[txHash]]',
  blockExplorerAddr: 'https://ethersocial.net/addr/[[address]]',
  chainID: 31102,
  tokens: tokens,
  contracts: contracts
}
