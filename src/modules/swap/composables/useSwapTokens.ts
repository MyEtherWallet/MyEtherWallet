import type { ComputedRef } from 'vue'
import type { Chain } from '@/mew_api/types'
import type { NewTokenInfo } from '@/stores/swapStore'
import type { SwapForm } from './useSwapForm'

interface Options {
  form: SwapForm
  setFromToken: () => void
  setToToken: () => void
  parsedFromTokens: ComputedRef<NewTokenInfo[]>
  filteredToTokens: ComputedRef<NewTokenInfo[]>
  parsedToChains: ComputedRef<Chain[]>
  fromChains: ComputedRef<Chain[]>
}

export function useSwapTokens(options: Options) {
  return {
    setFromToken: options.setFromToken,
    setToToken: options.setToToken,
    parsedFromTokens: options.parsedFromTokens,
    filteredToTokens: options.filteredToTokens,
    localToTokens: options.form.localToTokens,
    parsedToChains: options.parsedToChains,
    fromChains: options.fromChains,
  }
}
