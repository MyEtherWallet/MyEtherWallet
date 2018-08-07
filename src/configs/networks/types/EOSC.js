const tokens = require('../../../../tokens/tokens-eosc.json')
const contracts = require('../../../../contracts/contract-abi-eosc.json')
export default {
  name: 'EOSC',
  name_long: 'EOS-Classic',
  homePage: 'https://eos-classic.io/',
  blockExplorerTX: 'https://explorer.eos-classic.io/tx/[[txHash]]',
  blockExplorerAddr: 'https://explorer.eos-classic.io/addr/[[address]]',
  chainID: 20,
  tokens: tokens,
  contracts: contracts
}
