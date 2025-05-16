import { ref, computed } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import type { Chain } from '@/mew_api/types'
import Configs from '@/configs'

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
    chains.value = _chains.map(chain => {
      return {
        ...chain,
        icon: `${Configs.MEW_API_URL}${chain.icon}`,
      }
    })
    if (_chains.length > 0) {
      isLoaded.value = true
    }
  }

  return { chains, isLoaded, setChainData, selectedChain }
})
