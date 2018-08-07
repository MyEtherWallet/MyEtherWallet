const tokens = require('../../../../tokens/tokens-rop.json')
const contracts = require('../../../../contracts/contract-abi-rop.json')
export default {
  name: 'ROP',
  name_long: 'Ropsten',
  homePage: 'https://github.com/ethereum/ropsten',
  blockExplorerTX: 'https://ropsten.etherscan.io/tx/[[txHash]]',
  blockExplorerAddr: 'https://ropsten.etherscan.io/address/[[address]]',
  chainID: 3,
  tokens: tokens,
  contracts: contracts
}
