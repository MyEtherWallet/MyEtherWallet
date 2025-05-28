import { ref, computed } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import type { Chain } from '@/mew_api/types'

import { useGlobalStore } from './globalStore'

export const useChainsStore = defineStore('chainsStore', () => {
  const globalStore = useGlobalStore()
  const { selectedNetwork } = storeToRefs(globalStore);
  const chains = ref<Chain[]>([])
  const isLoaded = ref(false)
  const selectedChain = computed(() => {
    return chains.value.find(chain => chain.name === selectedNetwork.value)
  })

  const setChainData = (_chains: Chain[]) => {
    chains.value = _chains
    if (_chains.length > 0) {
      isLoaded.value = true
    }
  }

  return { chains, isLoaded, setChainData, selectedChain }
})
