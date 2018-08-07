const tokens = require('../../../../tokens/tokens-ella.json')
const contracts = require('../../../../contracts/contract-abi-ella.json')
export default {
  name: 'ELLA',
  name_long: 'Ellaism',
  homePage: 'https://ellaism.org/',
  blockExplorerTX: 'https://explorer.ellaism.org/tx/[[txHash]]',
  blockExplorerAddr: 'https://explorer.ellaism.org/addr/[[address]]',
  chainID: 64,
  tokens: tokens,
  contracts: contracts
}
