import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref, computed } from 'vue'
import { createPinia, setActivePinia } from 'pinia'

vi.mock('@/modules/access/common/walletConfigs', () => ({
  WalletConfigType: {},
}))

vi.mock('vue-i18n', async importOriginal => ({
  ...(await importOriginal<typeof import('vue-i18n')>()),
  useI18n: () => ({ t: (key: string) => key }),
}))

import { useTradeValidation } from '@/modules/trade/composables/useTradeValidation'

const USDC = {
  symbol: 'USDC',
  address: '0x0000000000000000000000000000000000000001',
  decimals: 6,
  price: 1,
  balance: '100000000',
  logoURI: '',
}

const makeValidation = (fromAmount: string) => {
  const isBelowMinimum = ref(false)
  const generalError = ref('')
  const form = {
    fromTokenSelected: ref({ ...USDC }),
    toTokenSelected: ref({ ...USDC, address: '0x2' }),
    fromAmount: ref(fromAmount),
    toAmount: ref('1'),
    isLoadingQuote: ref(false),
    isPairUnavailable: ref(false),
    isBelowMinimum,
    generalError,
  } as never
  const validation = useTradeValidation({
    form,
    isWalletConnected: ref(false),
    isMarketOpen: computed(() => true),
    isSelectedAssetTradeable: computed(() => true),
    supportedNetwork: computed(() => true),
  })
  return { ...validation, isBelowMinimum, generalError }
}

describe('useTradeValidation minimum errors', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('shows the unified minimum copy for an amount under the local floor', () => {
    const { fromAmountError, isInsufficientBalanceError } =
      makeValidation('0.5')

    expect(fromAmountError.value).toBe('trade.error.minimum_not_reached')
    expect(isInsufficientBalanceError.value).toBe(false)
  })

  it('shows the same copy in the same place when 1inch rejects the amount', () => {
    const { fromAmountError, isBelowMinimum, isTradeDisabled } =
      makeValidation('5')
    expect(fromAmountError.value).toBe('')

    isBelowMinimum.value = true

    expect(fromAmountError.value).toBe('trade.error.minimum_not_reached')
    expect(isTradeDisabled.value).toBe(true)
  })

  it('does not paint the balance red for a minimum error', () => {
    const { isInsufficientBalanceError, isBelowMinimum } = makeValidation('5')
    isBelowMinimum.value = true

    expect(isInsufficientBalanceError.value).toBe(false)
  })
})
