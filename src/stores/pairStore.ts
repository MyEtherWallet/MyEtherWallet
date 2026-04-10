import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { NewTokenInfo } from '@/composables/useSwap'
import type { Chain } from '@/mew_api/types'

export const usePairStore = defineStore('pairStore', () => {
  // Swap pairs (same-chain swap view)
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

  // Bridge pairs (cross-chain bridge view)
  const bridgeFromToken = ref<NewTokenInfo | null>(null)
  const bridgeToToken = ref<NewTokenInfo | null>(null)
  const bridgeToChain = ref<Chain | null>(null)

  const setBridgeFromToken = (token: NewTokenInfo | null) => {
    bridgeFromToken.value = token
  }

  const setBridgeToToken = (token: NewTokenInfo | null) => {
    bridgeToToken.value = token
  }

  const setBridgeToChain = (chain: Chain | null) => {
    bridgeToChain.value = chain
  }

  const clearBridgePair = () => {
    bridgeFromToken.value = null
    bridgeToToken.value = null
    bridgeToChain.value = null
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
    bridgeFromToken,
    bridgeToToken,
    bridgeToChain,
    setBridgeFromToken,
    setBridgeToToken,
    setBridgeToChain,
    clearBridgePair,
    tradeFromSymbol,
    tradeToSymbol,
    setTradeFromSymbol,
    setTradeToSymbol,
    clearTradePair,
  }
})
