import { ref, computed } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import type { Chain } from '@/mew_api/types'
import { useGlobalStore } from './globalStore'

export const useChainsStore = defineStore('chainsStore', () => {
  const globalStore = useGlobalStore()
  const { selectedNetwork } = storeToRefs(globalStore)
  const chains = ref<Chain[]>([])
  const isLoaded = ref(false)
  const selectedChain = computed<Chain | undefined>(() => {
    return chains.value.find(
      (chain: Chain) => chain.name === selectedNetwork.value,
    )
  })

  const setChainData = (_chains: Chain[]) => {
    chains.value = _chains
    if (_chains.length > 0) {
      isLoaded.value = true
    }
  }

  const getChainIcon = (chainName: string): string | undefined => {
    const chain = chains.value.find(chain => chain.name === chainName)
    return chain?.icon
  }

  const isBitcoinChain = computed(() => {
    return selectedChain.value?.type === 'BITCOIN'
  })

  const isEvmChain = computed(() => {
    return selectedChain.value?.type === 'EVM'
  })
  const isSolChain = computed(() => {
    return selectedChain.value?.type === 'SOLANA'
  })

  return {
    chains,
    isLoaded,
    setChainData,
    getChainIcon,
    selectedChain,
    isBitcoinChain,
    isEvmChain,
    isSolChain,
  }
})
