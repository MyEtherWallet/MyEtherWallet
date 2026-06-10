import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import type { Ref } from 'vue'
import { PURCHASE_CHAIN_TO_V7 } from '@/types/buyToken'
import type { BuyNetwork } from '@/stores/purchaseStore'
import type { Chain } from '@/mew_api/types'
import { useWalletStore } from '@/stores/walletStore'

export function usePurchaseCompatibility(
  networks: Ref<BuyNetwork[]>,
  walletChain: Ref<Chain | undefined>,
  chains: Ref<Chain[]>,
) {
  const walletStore = useWalletStore()
  const { isWalletConnected } = storeToRefs(walletStore)

  const compatibleChainCodes = computed<string[]>(() => {
    if (!isWalletConnected.value || !walletChain.value) return networks.value.map(n => n.chain)
    const walletType = walletChain.value.type
    return networks.value
      .filter(network => {
        const v7Name = PURCHASE_CHAIN_TO_V7[network.chain]
        const chain = chains.value.find(c => c.name === v7Name)
        return chain?.type === walletType
      })
      .map(n => n.chain)
  })

  const incompatibleChainCodes = computed<string[]>(() => {
    if (!isWalletConnected.value || !walletChain.value) return []
    return networks.value
      .filter(n => !compatibleChainCodes.value.includes(n.chain))
      .map(n => n.chain)
  })

  return { compatibleChainCodes, incompatibleChainCodes }
}
