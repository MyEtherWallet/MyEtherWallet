import { SUPPORTED_CHAINS } from '@/modules/trade/providers/oneinch_fusion/configs'
import { useChainsStore } from '@/stores/chainsStore'

const TX_HASH_PLACEHOLDER = '[[txHash]]'

export const getTradeExplorerLink = (
  chainId: number,
  txHash: string,
): string => {
  if (!txHash) return ''

  const apiChain = useChainsStore().allChains.find(
    chain => chain.chainID === String(chainId),
  )
  if (apiChain?.blockExplorerTX?.includes(TX_HASH_PLACEHOLDER)) {
    return apiChain.blockExplorerTX.replace(TX_HASH_PLACEHOLDER, txHash)
  }

  const chainConfig = SUPPORTED_CHAINS.find(c => c.chainId === chainId)
  const blockExplorer = chainConfig?.chain.blockExplorers?.default?.url
  if (!blockExplorer) return ''
  return `${blockExplorer}/tx/${txHash}`
}
