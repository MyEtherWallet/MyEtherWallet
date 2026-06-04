import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useChainsStore } from '@/stores/chainsStore'
import type { Chain } from '@/mew_api/types'

export function useEthOnlyChains() {
  const { chains } = storeToRefs(useChainsStore())

  const ethOnlyChains = computed<Chain[]>(() => {
    const eth = chains.value.find(c => c.name === 'ETHEREUM')
    return eth ? [eth] : []
  })

  return { ethOnlyChains }
}
