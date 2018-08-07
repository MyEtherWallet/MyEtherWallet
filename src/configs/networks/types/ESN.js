const tokens = require('../../../../tokens/tokens-esn.json')
const contracts = require('../../../../contracts/contract-abi-esn.json')
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
