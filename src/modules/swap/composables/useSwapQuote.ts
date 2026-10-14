import type { ComputedRef, Ref } from 'vue'
import type { ProviderQuoteResponse } from '@enkryptcom/swap'
import type { SwapForm } from './useSwapForm'

interface Options {
  form: SwapForm
  fetchQuotes: () => Promise<void>
  debounceFetchQuotes: () => void
  bestRate: ComputedRef<ProviderQuoteResponse | null>
}

interface SwapQuote {
  fetchQuotes: () => Promise<void>
  debounceFetchQuotes: () => void
  providers: Ref<ProviderQuoteResponse[]>
  selectedQuote: Ref<ProviderQuoteResponse | undefined>
  bestRate: ComputedRef<ProviderQuoteResponse | null>
  quotesError: Ref<boolean>
}

export function useSwapQuote(options: Options): SwapQuote {
  return {
    fetchQuotes: options.fetchQuotes,
    debounceFetchQuotes: options.debounceFetchQuotes,
    providers: options.form.providers,
    selectedQuote: options.form.selectedQuote,
    bestRate: options.bestRate,
    quotesError: options.form.quotesError,
  }
}
