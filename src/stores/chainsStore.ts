import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Chain } from '@/mew_api/types'
import Configs from '@/configs'

export const useChainsStore = defineStore('chainsStore', () => {
  const chains = ref<Chain[]>([])
  const isLoaded = ref(false)

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

  return { chains, isLoaded, setChainData }
})
