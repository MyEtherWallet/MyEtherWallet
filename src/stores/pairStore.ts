import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { NewTokenInfo } from '@/composables/useSwap'

export const usePairStore = defineStore('pairStore', () => {
  // Swap pairs
  const swapFromToken = ref<NewTokenInfo | null>(null)
  const swapToToken = ref<NewTokenInfo | null>(null)

  const setSwapFromToken = (token: NewTokenInfo | null) => {
    swapFromToken.value = token
  }

  const setSwapToToken = (token: NewTokenInfo | null) => {
    swapToToken.value = token
  }

  const clearSwapPair = () => {
    swapFromToken.value = null
    swapToToken.value = null
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
    setSwapFromToken,
    setSwapToToken,
    clearSwapPair,
    tradeFromSymbol,
    tradeToSymbol,
    setTradeFromSymbol,
    setTradeToSymbol,
    clearTradePair,
  }
})
