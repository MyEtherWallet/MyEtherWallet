import { ref } from 'vue'
import type { Chain } from '@/mew_api/types'
import type { NewTokenInfo } from '@/stores/swapStore'
import { useFormPristine } from '@/composables/useFormPristine'

/**
 * Per-instance state record for the trade module, threaded into the sibling
 * composables as their shared option bag. The record exists to break a circular
 * dependency: useTradeValidation reads the quote flags below, while
 * useTradeQuote needs validation's `hasPreQuoteError`.
 *
 * Ownership within the record: `isLoadingQuote`, `isPairUnavailable`,
 * `isBelowMinimum` and `generalError` are quote outputs — useTradeQuote is
 * their sole writer (via runQuote/resetQuote); everything else is written by
 * the module/template. Keep it that way when adding fields.
 */
export function useTradeForm(initialChain?: Chain) {
  const selectedFromChain = ref<Chain | undefined>(initialChain)
  const fromTokenSelected = ref<NewTokenInfo | null>(null)
  const fromTokenManuallySelected = ref(false)
  const toTokenManuallySelected = ref(false)
  const toTokenSelected = ref<NewTokenInfo | null>(null)
  const fromAmount = ref('')
  const toAmount = ref('')
  const generalError = ref('')
  const toAmountError = ref('')
  const displayGeneralError = ref('')
  const isLoadingQuote = ref(false)
  const isPairUnavailable = ref(false)
  const isBelowMinimum = ref(false)
  const {
    isPristine,
    reset: resetPristine,
    markDirty,
  } = useFormPristine([fromAmount])

  return {
    selectedFromChain,
    fromTokenSelected,
    fromTokenManuallySelected,
    toTokenManuallySelected,
    toTokenSelected,
    fromAmount,
    toAmount,
    generalError,
    toAmountError,
    displayGeneralError,
    isLoadingQuote,
    isPairUnavailable,
    isBelowMinimum,
    isPristine,
    resetPristine,
    markDirty,
  }
}

export type TradeForm = ReturnType<typeof useTradeForm>
