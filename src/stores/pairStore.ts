import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { NewTokenInfo } from '@/composables/useSwap'
import type { Chain } from '@/mew_api/types'

export const usePairStore = defineStore('pairStore', () => {
  // Swap pairs
  const swapFromToken = ref<NewTokenInfo | null>(null)
  const swapToToken = ref<NewTokenInfo | null>(null)
  const swapToChain = ref<Chain | null>(null)

  const setSwapFromToken = (token: NewTokenInfo | null) => {
    swapFromToken.value = token
  }

  const setSwapToToken = (token: NewTokenInfo | null) => {
    swapToToken.value = token
  }

  const setSwapToChain = (chain: Chain | null) => {
    swapToChain.value = chain
  }

  const clearSwapPair = () => {
    swapFromToken.value = null
    swapToToken.value = null
    swapToChain.value = null
  }

  // Trade pairs
  const tradeFromSymbol = ref<string | null>(null)
  const tradeToSymbol = ref<string | null>(null)

  const setTradeFromSymbol = (symbol: string | null) => {
    tradeFromSymbol.value = symbol
  }

  const setTradeToSymbol = (symbol: string | null) => {
    tradeToSymbol.value = symbol
  }

  const clearTradePair = () => {
    tradeFromSymbol.value = null
    tradeToSymbol.value = null
  }

  return {
    swapFromToken,
    swapToToken,
    swapToChain,
    setSwapFromToken,
    setSwapToToken,
    setSwapToChain,
    clearSwapPair,
    tradeFromSymbol,
    tradeToSymbol,
    setTradeFromSymbol,
    setTradeToSymbol,
    clearTradePair,
  }
})
