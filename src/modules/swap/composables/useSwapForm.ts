import { ref, type Ref } from 'vue'
import type { Chain, QuotesResponse } from '@/mew_api/types'
import type { NewTokenInfo } from '@/stores/swapStore'
import type { ProviderQuoteResponse, ProviderSwapResponse } from '@enkryptcom/swap'
import type { HexPrefixedString } from '@/providers/types'
import { useFormPristine } from '@/composables/useFormPristine'

export interface SwapForm {
  selectedToChain: Ref<Chain | undefined>
  fromTokenSelected: Ref<NewTokenInfo | null>
  toTokenSelected: Ref<NewTokenInfo | null>
  toAddressError: Ref<string>
  generalError: Ref<string>
  fromAmount: Ref<string>
  toAmount: Ref<string>
  userToAddress: Ref<string>
  foundNickName: Ref<string>
  providers: Ref<ProviderQuoteResponse[]>
  selectedQuote: Ref<ProviderQuoteResponse | undefined>
  swapInfo: Ref<ProviderSwapResponse | null>
  swapGasFeeQuote: Ref<QuotesResponse | undefined>
  txHash: Ref<HexPrefixedString>
  localToTokens: Ref<NewTokenInfo[]>
  isLoadingQuotes: Ref<boolean>
  bestSwapLoadingOpen: Ref<boolean>
  bestOfferSelectionOpen: Ref<boolean>
  swapInitiatedOpen: Ref<boolean>
  txProceeding: Ref<boolean>
  quotesError: Ref<boolean>
  isPristine: Ref<boolean>
  resetPristine: () => void
  markFormDirty: () => void
}

export function useSwapForm(): SwapForm {
  const selectedToChain = ref<Chain>()
  const fromTokenSelected = ref<NewTokenInfo | null>(null)
  const toTokenSelected = ref<NewTokenInfo | null>(null)
  const toAddressError = ref('')
  const generalError = ref('')
  const fromAmount = ref('')
  const toAmount = ref('')
  const userToAddress = ref('')
  const foundNickName = ref('')
  const providers = ref<ProviderQuoteResponse[]>([])
  const selectedQuote = ref<ProviderQuoteResponse>()
  const swapInfo = ref<ProviderSwapResponse | null>(null)
  const swapGasFeeQuote = ref<QuotesResponse>()
  const txHash = ref<HexPrefixedString>('0x')
  const localToTokens = ref<NewTokenInfo[]>([])
  const isLoadingQuotes = ref(false)
  const bestSwapLoadingOpen = ref(false)
  const bestOfferSelectionOpen = ref(false)
  const swapInitiatedOpen = ref(false)
  const txProceeding = ref(false)
  const quotesError = ref(false)
  const { isPristine, reset: resetPristine, markDirty: markFormDirty } =
    useFormPristine([userToAddress, fromAmount])

  return {
    selectedToChain, fromTokenSelected, toTokenSelected, toAddressError,
    generalError, fromAmount, toAmount, userToAddress, foundNickName,
    providers, selectedQuote, swapInfo, swapGasFeeQuote, txHash, localToTokens,
    isLoadingQuotes, bestSwapLoadingOpen, bestOfferSelectionOpen,
    swapInitiatedOpen, txProceeding, quotesError, isPristine,
    resetPristine, markFormDirty,
  }
}
