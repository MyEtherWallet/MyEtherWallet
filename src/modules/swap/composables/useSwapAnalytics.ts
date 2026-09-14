import type { Ref } from 'vue'
import type { Chain } from '@/mew_api/types'
import type { SwapPayloadShared } from '@/analytics'
import type { SwapForm } from './useSwapForm'

interface Options {
  form: SwapForm
  selectedChain: Ref<Chain | undefined>
}

export function useSwapAnalytics({ form, selectedChain }: Options) {
  const getAnalyticsShared = (): SwapPayloadShared => ({
    isBridge: selectedChain.value?.name !== form.selectedToChain.value?.name,
    fromAmount: form.fromAmount.value,
    toAmount: form.toAmount.value,
    fromToken: form.fromTokenSelected.value?.symbol || 'N/A',
    toToken: form.toTokenSelected.value?.symbol || 'N/A',
    fromNetwork: selectedChain.value?.name || 'N/A',
    toNetwork: form.selectedToChain.value?.name || 'N/A',
    swapPair: `${form.fromTokenSelected.value?.symbol || 'N/A'}-${form.toTokenSelected.value?.symbol || 'N/A'}`,
    providerName: form.selectedQuote.value?.provider || 'N/A',
  })

  return { getAnalyticsShared }
}
