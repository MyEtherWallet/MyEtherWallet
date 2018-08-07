const tokens = require('../../../../tokens/tokens-rin.json')
const contracts = require('../../../../contracts/contract-abi-rin.json')
export default {
  name: 'RIN',
  name_long: 'Rinkeby',
  homePage: 'https://www.rinkeby.io/',
  blockExplorerTX: 'https://rinkeby.etherscan.io/tx/[[txHash]]',
  blockExplorerAddr: 'https://rinkeby.etherscan.io/address/[[address]]',
  chainID: 4,
  tokens: tokens,
  contracts: contracts
}
