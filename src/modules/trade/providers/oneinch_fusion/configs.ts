import { mainnet, bsc, type Chain } from 'viem/chains'

const SUPPORTED_CHAINS: {
  chain: Chain
  node: string
  chainId: number
  chainName: string
}[] = [
  {
    chain: mainnet,
    chainId: mainnet.id,
    node: 'wss://nodes.mewapi.io/ws/eth',
    chainName: 'ETHEREUM',
  },
  {
    chain: bsc,
    chainId: bsc.id,
    node: 'wss://nodes.mewapi.io/ws/bsc',
    chainName: 'BSC',
  },
]

const NATIVE_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'

const ONEINCH_APPROVAL_ADDRESS = '0x111111125421ca6dc452d289314280a0f8842a65'

export { SUPPORTED_CHAINS, ONEINCH_APPROVAL_ADDRESS, NATIVE_ADDRESS }
