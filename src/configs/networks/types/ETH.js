import tokens from '@/tokens/tokens-eth.json'
import contracts from '@/contracts/contract-abi-eth.json'

export default {
  name: 'ETH',
  name_long: 'Ethereum',
  homePage: 'https://ethereum.org',
  blockExplorerTX: 'https://etherscan.io/tx/[[txHash]]',
  blockExplorerAddr: 'https://etherscan.io/address/[[address]]',
  chainID: 1,
  tokens: tokens,
  contracts: contracts
}
