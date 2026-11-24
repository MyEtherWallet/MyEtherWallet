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
  beforeEach(() => {
    setActivePinia(createPinia())
    // Live wallet balance: 4.478202 USDC, what the card and % buttons read
    useWalletStore().tokens = [
      {
        contract: USDC.address,
        decimals: 6,
        symbol: 'USDC',
        name: 'USD Coin',
        price: 1,
        balance: '4.478202',
        balanceWei: '4478202',
      },
    ] as never
  })

  // MEW-2690: the selected token is a frozen snapshot that can hold an older,
  // lower balance (1.5 USDC here) after the wallet balance goes up
  const staleUsdc = { ...USDC, balance: '1500000' }

  it('validates against the live wallet balance, not the token snapshot', () => {
    const { fromAmountError, isInsufficientBalanceError } = makeValidation(
      '2.239101',
      { isWalletConnected: true, fromToken: staleUsdc },
    )

    expect(isInsufficientBalanceError.value).toBe(false)
    expect(fromAmountError.value).toBe('')
  })

  it('accepts the whole live balance (MAX)', () => {
    const { isInsufficientBalanceError } = makeValidation('4.478202', {
      isWalletConnected: true,
      fromToken: staleUsdc,
    })

    expect(isInsufficientBalanceError.value).toBe(false)
  })

  it('still flags an amount above the live balance', () => {
    const { fromAmountError, isInsufficientBalanceError } = makeValidation(
      '4.478203',
      { isWalletConnected: true, fromToken: staleUsdc },
    )

    expect(isInsufficientBalanceError.value).toBe(true)
    expect(fromAmountError.value).toBe('trade.error.not_enough_balance')
  })
})

describe('useTradeValidation native balance check', () => {
  beforeEach(async () => {
    setActivePinia(createPinia())
    await useWalletStore().setTokens([
      {
        contract: MAIN_TOKEN_CONTRACT,
        balance: '2000000000000000000',
        decimals: 18,
      },
    ] as never)
  })

  // The swap list carries the native sentinel checksummed
  const eth = {
    ...USDC,
    symbol: 'ETH',
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    decimals: 18,
    balance: '0',
  }

  it('reads the native balance for a checksummed sentinel', () => {
    expect(
      makeValidation('1.5', { isWalletConnected: true, fromToken: eth })
        .isInsufficientBalanceError.value,
    ).toBe(false)
    expect(
      makeValidation('2.1', { isWalletConnected: true, fromToken: eth })
        .isInsufficientBalanceError.value,
    ).toBe(true)
  })
})
