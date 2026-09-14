import { ref } from 'vue'
import type { Chain } from '@/mew_api/types'
import type { NewTokenInfo } from '@/stores/swapStore'
import { useFormPristine } from '@/composables/useFormPristine'

export function useTradeForm(initialChain?: Chain) {
  const selectedFromChain = ref<Chain | undefined>(initialChain)
  const fromTokenSelected = ref<NewTokenInfo | null>(null)
  const fromTokenManuallySelected = ref(false)
  const toTokenSelected = ref<NewTokenInfo | null>(null)
  const fromAmount = ref('')
  const toAmount = ref('')
  const generalError = ref('')
  const toAmountError = ref('')
  const displayGeneralError = ref('')
  const isLoadingQuote = ref(false)
  const { isPristine, reset: resetPristine, markDirty } = useFormPristine([fromAmount])

  return {
    selectedFromChain, fromTokenSelected, fromTokenManuallySelected,
    toTokenSelected, fromAmount, toAmount, generalError, toAmountError,
    displayGeneralError, isLoadingQuote, isPristine, resetPristine, markDirty,
  }
}

export type TradeForm = ReturnType<typeof useTradeForm>
