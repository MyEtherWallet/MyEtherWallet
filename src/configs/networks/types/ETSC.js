const tokens = require('../../../../tokens/tokens-etsc.json')
const contracts = require('../../../../contracts/contract-abi-etsc.json')
export default {
  name: 'ETSC',
  name_long: 'EthereumSocial',
  homePage: 'https://ethereumsocial.kr/',
  blockExplorerTX: 'https://explorer.ethereumsocial.kr/tx/[[txHash]]',
  blockExplorerAddr: 'https://explorer.ethereumsocial.kr/addr/[[address]]',
  chainID: 28,
  tokens: tokens,
  contracts: contracts
}
