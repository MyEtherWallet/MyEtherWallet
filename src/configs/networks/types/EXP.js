const tokens = require('../../../../tokens/tokens-exp.json')
const contracts = require('../../../../contracts/contract-abi-exp.json')
export default {
  name: 'EXP',
  name_long: 'Expanse',
  homePage: 'https://expanse.tech/',
  blockExplorerTX: 'http://www.gander.tech/tx/[[txHash]]',
  blockExplorerAddr: 'http://www.gander.tech/address/[[address]]',
  chainID: 2,
  tokens: tokens,
  contracts: contracts
}
