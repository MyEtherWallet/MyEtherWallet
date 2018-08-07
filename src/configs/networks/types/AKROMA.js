const tokens = require('../../../../tokens/tokens-akroma.json')
const contracts = require('../../../../contracts/contract-abi-akroma.json')
export default {
  name: 'AKA',
  name_long: 'Akroma',
  homePage: 'https://akroma.io/',
  blockExplorerTX: 'https://akroma.io/explorer/transaction/[[txHash]]',
  blockExplorerAddr: 'https://akroma.io/explorer/address/[[address]]',
  chainID: 200625,
  tokens: tokens,
  contracts: contracts
}
