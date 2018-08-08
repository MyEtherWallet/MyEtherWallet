import * as tokens from '@/tokens/tokens-tomo.json'
import * as contracts from '@/contracts/contract-abi-tomo.json'
export default {
  name: 'TOMO',
  name_long: 'Tomo Coin',
  homePage: 'https://tomochain.com/',
  blockExplorerTX: 'https://explorer.tomocoin.io/#/tx/[[txHash]]',
  blockExplorerAddr: 'https://explorer.tomocoin.io/#/address/[[address]]',
  chainID: 40686,
  tokens: tokens,
  contracts: contracts
}
