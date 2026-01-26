import { mainnet, bsc, type Chain } from 'viem/chains'

const SUPPORTED_CHAINS: Chain[] = [mainnet, bsc]
const BLOCK_EXPLORERS = {
  [mainnet.id]: 'https://etherscan.io/',
  [bsc.id]: 'https://bscscan.com/',
}

const NODE_URLS = {
  [mainnet.id]: 'https://nodes.mewapi.io/rpc/eth',
  [bsc.id]: 'https://nodes.mewapi.io/rpc/bsc',
}

const NATIVE_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'

const ONEINCH_APPROVAL_ADDRESS = '0x111111125421ca6dc452d289314280a0f8842a65'
const COW_APPROVAL_ADDRESS = '0xC92E8bdf79f0507f65a392b0ab4667716BFE0110'

export {
  SUPPORTED_CHAINS,
  BLOCK_EXPLORERS,
  ONEINCH_APPROVAL_ADDRESS,
  NATIVE_ADDRESS,
  COW_APPROVAL_ADDRESS,
  NODE_URLS,
}
