import { SUPPORTED_CHAINS } from '@/modules/trade/providers/oneinch_fusion/configs'

export const getTradeExplorerLink = (
  chainId: number,
  txHash: string,
): string => {
  if (!txHash) return ''
  const chainConfig = SUPPORTED_CHAINS.find(c => c.chainId === chainId)
  const blockExplorer = chainConfig?.chain.blockExplorers?.default?.url
  if (!blockExplorer) return ''
  return `${blockExplorer}/tx/${txHash}`
}
