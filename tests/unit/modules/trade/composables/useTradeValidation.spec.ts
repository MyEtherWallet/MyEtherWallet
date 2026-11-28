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
import { MAIN_TOKEN_CONTRACT, useWalletStore } from '@/stores/walletStore'

const USDC = {
  symbol: 'USDC',
  address: '0x0000000000000000000000000000000000000001',
  decimals: 6,
  price: 1,
  balance: '100000000',
  logoURI: '',
}

const makeValidation = (
  fromAmount: string,
  { isWalletConnected = false, fromToken = USDC } = {},
) => {
  const isBelowMinimum = ref(false)
  const generalError = ref('')
  const form = {
    fromTokenSelected: ref({ ...fromToken }),
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
    isWalletConnected: ref(isWalletConnected),
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

describe('useTradeValidation balance check', () => {
  beforeEach(async () => {
    setActivePinia(createPinia())
    // Live wallet balances, what the card and % buttons read
    await useWalletStore().setTokens([
      { contract: USDC.address, balance: '4478202', decimals: 6 },
      { contract: MAIN_TOKEN_CONTRACT, balance: '2000000000000000000' },
    ] as never)
  })

  const balanceError = (amount: string, fromToken: typeof USDC) =>
    makeValidation(amount, { isWalletConnected: true, fromToken })
      .fromAmountError.value

  it('validates against the live wallet balance, not the token snapshot', () => {
    // MEW-2690: the selected token is a frozen snapshot that can keep an
    // older, lower balance (1.5 USDC) after the wallet balance goes up
    const staleUsdc = { ...USDC, balance: '1500000' }

    // 50% and MAX from the ticket video
    expect(balanceError('2.239101', staleUsdc)).toBe('')
    expect(balanceError('4.478202', staleUsdc)).toBe('')
    expect(balanceError('4.478203', staleUsdc)).toBe(
      'trade.error.not_enough_balance',
    )
  })

  it('reads the native balance for a checksummed sentinel', () => {
    const eth = {
      ...USDC,
      address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      decimals: 18,
      balance: '0',
    }

    expect(balanceError('1.5', eth)).toBe('')
    expect(balanceError('2.1', eth)).toBe('trade.error.not_enough_balance')
  })
})
