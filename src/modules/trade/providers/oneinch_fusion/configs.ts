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
    node: 'https://nodes.mewapi.io/rpc/eth',
    chainName: 'ETHEREUM',
  },
  {
    chain: bsc,
    chainId: bsc.id,
    node: 'https://nodes.mewapi.io/rpc/bsc',
    chainName: 'BSC',
  },
]

const NATIVE_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'

const ONEINCH_APPROVAL_ADDRESS = '0x111111125421ca6dc452d289314280a0f8842a65'
const COW_APPROVAL_ADDRESS = '0xC92E8bdf79f0507f65a392b0ab4667716BFE0110'

export {
  SUPPORTED_CHAINS,
  ONEINCH_APPROVAL_ADDRESS,
  NATIVE_ADDRESS,
  COW_APPROVAL_ADDRESS,
}
