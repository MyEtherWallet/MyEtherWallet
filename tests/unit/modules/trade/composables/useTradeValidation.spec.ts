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

const makeOipValidation = (
  fromAmount: string,
  over: {
    price?: number
    isOipTrade?: boolean
    isFromTokenStable?: boolean
    isOipPairAllowed?: boolean
  } = {},
) => {
  const isBelowMinimum = ref(false)
  const form = {
    fromTokenSelected: ref({ ...USDC, price: over.price ?? 1 }),
    toTokenSelected: ref({ ...USDC, address: '0x2' }),
    fromAmount: ref(fromAmount),
    toAmount: ref('1'),
    isLoadingQuote: ref(false),
    isPairUnavailable: ref(false),
    isBelowMinimum,
    generalError: ref(''),
  } as never
  const validation = useTradeValidation({
    form,
    isWalletConnected: ref(false),
    isMarketOpen: computed(() => true),
    isSelectedAssetTradeable: computed(() => true),
    supportedNetwork: computed(() => true),
    isOipTrade: computed(() => over.isOipTrade ?? true),
    isFromTokenStable: computed(() => over.isFromTokenStable ?? false),
    isOipPairAllowed: computed(() => over.isOipPairAllowed ?? true),
  })
  return { ...validation, isBelowMinimum }
}

describe('useTradeValidation OIP minimum', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('blocks an OIP trade worth less than $10', () => {
    const {
      fromAmountError,
      isOipMinimumError,
      isTradeDisabled,
      hasPreQuoteError,
      isInsufficientBalanceError,
    } = makeOipValidation('9.99')

    expect(fromAmountError.value).toBe('trade.error.oip_minimum')
    expect(isOipMinimumError.value).toBe(true)
    expect(isTradeDisabled.value).toBe(true)
    expect(hasPreQuoteError.value).toBe(true)
    expect(isInsufficientBalanceError.value).toBe(false)
  })

  it('lets an OIP trade worth $10 through', () => {
    const {
      fromAmountError,
      isOipMinimumError,
      isTradeDisabled,
      hasPreQuoteError,
    } = makeOipValidation('10')

    expect(fromAmountError.value).toBe('')
    expect(isOipMinimumError.value).toBe(false)
    expect(isTradeDisabled.value).toBe(false)
    expect(hasPreQuoteError.value).toBe(false)
  })

  it('judges the USD value at cent precision', () => {
    // 10 × 0.9995 = 9.995, $10.00 to the cent; 10 × 0.999 = 9.99.
    expect(
      makeOipValidation('10', { price: 0.9995 }).fromAmountError.value,
    ).toBe('')
    expect(
      makeOipValidation('10', { price: 0.999 }).fromAmountError.value,
    ).toBe('trade.error.oip_minimum')
  })

  it('passes 10 stable tokens even when they are priced under $10', () => {
    const { fromAmountError, isTradeDisabled, hasPreQuoteError } =
      makeOipValidation('10', { price: 0.999, isFromTokenStable: true })

    expect(fromAmountError.value).toBe('')
    expect(isTradeDisabled.value).toBe(false)
    expect(hasPreQuoteError.value).toBe(false)
  })

  it('still blocks fewer than 10 stable tokens worth less than $10', () => {
    const { fromAmountError, isTradeDisabled } = makeOipValidation('9.99', {
      price: 0.999,
      isFromTokenStable: true,
    })

    expect(fromAmountError.value).toBe('trade.error.oip_minimum')
    expect(isTradeDisabled.value).toBe(true)
  })

  it('cannot enforce the minimum without a price', () => {
    const { fromAmountError, hasPreQuoteError } = makeOipValidation('1', {
      price: 0,
    })

    expect(fromAmountError.value).toBe('')
    expect(hasPreQuoteError.value).toBe(false)
  })

  it('leaves a non-OIP pair on the existing floor and copy', () => {
    const ok = makeOipValidation('5', { isOipTrade: false })
    expect(ok.fromAmountError.value).toBe('')
    expect(ok.isTradeDisabled.value).toBe(false)
    expect(ok.hasPreQuoteError.value).toBe(false)

    const underFloor = makeOipValidation('0.5', { isOipTrade: false })
    expect(underFloor.fromAmountError.value).toBe(
      'trade.error.minimum_not_reached',
    )
    expect(underFloor.isOipMinimumError.value).toBe(false)
  })

  it('names the OIP minimum instead of the generic copy, including after a provider rejection', () => {
    // Under the generic floor too: the OIP copy is the more specific one.
    expect(makeOipValidation('0.5').fromAmountError.value).toBe(
      'trade.error.oip_minimum',
    )

    const rejected = makeOipValidation('9')
    rejected.isBelowMinimum.value = true
    expect(rejected.fromAmountError.value).toBe('trade.error.oip_minimum')
  })

  it('keeps the generic copy when the provider rejects an amount over $10', () => {
    const { fromAmountError, isOipMinimumError, isBelowMinimum } =
      makeOipValidation('12')
    isBelowMinimum.value = true

    expect(fromAmountError.value).toBe('trade.error.minimum_not_reached')
    expect(isOipMinimumError.value).toBe(false)
  })

  it('reports excess decimals before the OIP minimum', () => {
    const { fromAmountError, isDecimalsError, isOipMinimumError } =
      makeOipValidation('1.1234567')

    expect(fromAmountError.value).toBe('trade.error.remove_decimals')
    expect(isDecimalsError.value).toBe(true)
    expect(isOipMinimumError.value).toBe(false)
  })

  it('disables the trade and the quote for a refused OIP pair, whatever the amount', () => {
    const { fromAmountError, isTradeDisabled, hasPreQuoteError } =
      makeOipValidation('50', { isOipPairAllowed: false })

    expect(fromAmountError.value).toBe('')
    expect(isTradeDisabled.value).toBe(true)
    expect(hasPreQuoteError.value).toBe(true)
  })
})
