import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ref, computed } from 'vue'

// Partial: `useTradeExecution` transitively pulls in `@/i18n`, which needs the
// real `createI18n`. Only `useI18n` is stubbed, to keep `t()` outside a component.
vi.mock('vue-i18n', async importOriginal => ({
  ...(await importOriginal<typeof import('vue-i18n')>()),
  useI18n: () => ({ t: (key: string) => key }),
}))

vi.mock('@/stores/toastStore', () => ({
  useToastStore: () => ({ addToastMessage: vi.fn() }),
}))

const mockAddOrder = vi.fn()
vi.mock('@/stores/tradeOrdersStore', () => ({
  useTradeOrdersStore: () => ({
    addOrder: mockAddOrder,
    getOrdersByAddress: () => [],
  }),
}))

vi.mock('@/stores/rewardsStore', () => ({
  useRewardsStore: () => ({
    checkAvailabilityAfterTransaction: vi.fn(async () => false),
    minSpendTrade: ref('250'),
  }),
}))

vi.mock('@/stores/holdingsStore', () => ({
  useHoldingsStore: () => ({
    activeReward: null,
    info: null,
    status: undefined,
  }),
}))

vi.mock('@sentry/vue', () => ({ captureException: vi.fn() }))

// `@/analytics` pulls in the hardware-wallet configs, which resolve a
// `@ledgerhq/hw-app-eth` path that does not exist in the installed version —
// without this mock the spec dies at import.
vi.mock('@/analytics', () => ({
  analytics: {
    trackTradeEvent: vi.fn(),
    trackTradeEventStatus: vi.fn(),
    trackTradeEventError: vi.fn(),
  },
  TradeEvent: { OFFER_PROCEED: 'Trade_Offer_Proceed' },
  TradeEventStatus: {
    INITIATED: 'Trade_Initiated',
    UNSUBMITTED: 'Trade_Unsubmitted',
  },
  TradeEventError: {
    SIGN_ERROR: 'Trade_Sign_Error',
    RELAYER_ERROR: 'Trade_Relayer_Error',
  },
}))

const mockSubmitOrder = vi.fn()
vi.mock('@/modules/trade/providers/oneinch_fusion/oneInchFusion', () => ({
  default: class {
    submitOrder = mockSubmitOrder
    setApproval = vi.fn()
    isApprovalRequired = vi.fn(async () => false)
  },
}))

const USDC = {
  symbol: 'USDC',
  address: '0x0000000000000000000000000000000000000001',
  decimals: 6,
  price: 1,
  logoURI: 'usdc.png',
}
const AAPL = {
  symbol: 'AAPL',
  address: '0x0000000000000000000000000000000000000002',
  decimals: 18,
  price: 200,
  logoURI: 'aapl.png',
}
// What `clearValues` would default the form back to once the modal is dismissed.
const TSLA = {
  symbol: 'TSLA',
  address: '0x0000000000000000000000000000000000000003',
  decimals: 18,
  price: 300,
  logoURI: 'tsla.png',
}

const ORIGINAL_QUOTE = {
  startAmount: 500_000_000_000_000_000n,
  endAmount: 480_000_000_000_000_000n,
  avgAmount: 490_000_000_000_000_000n,
}

const makeHarness = async () => {
  const { useTradeForm } =
    await import('@/modules/trade/composables/useTradeForm')
  const { useTradeExecution } =
    await import('@/modules/trade/composables/useTradeExecution')
  const form = useTradeForm({ chainID: '1', name: 'ETHEREUM' } as never)
  form.fromTokenSelected.value = USDC as never
  form.toTokenSelected.value = AAPL as never
  form.fromAmount.value = '100'
  const currentQuote = ref<typeof ORIGINAL_QUOTE | null>({ ...ORIGINAL_QUOTE })
  const execution = useTradeExecution({
    form,
    walletAddress: ref('0xwallet'),
    wallet: ref({}) as never,
    currentQuote,
    needsApproval: ref(false),
    isTradingRestrictedInRegion: ref(false),
    isTradingAllowedInRegion: computed(() => true),
  })
  // Mirrors `clearValues` in useTradeModule, which the module runs when the
  // progress modal is dismissed (processing → idle) — possibly while the order
  // is still being signed or relayed.
  const clearForm = () => {
    form.fromAmount.value = ''
    form.toAmount.value = ''
    form.fromTokenSelected.value = USDC as never
    form.toTokenSelected.value = TSLA as never
    currentQuote.value = null
  }
  return { ...execution, form, currentQuote, clearForm }
}

describe('confirmTrade saves what the user confirmed (MEW trade notification)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('keeps the confirmed amount, tokens and quote when the form is cleared mid-submit', async () => {
    const { confirmTrade, clearForm } = await makeHarness()
    // The relayer call is where the user has time to close the progress modal.
    mockSubmitOrder.mockImplementation(async () => {
      clearForm()
      return { hash: '0xorder' }
    })

    await confirmTrade()

    expect(mockAddOrder).toHaveBeenCalledTimes(1)
    const saved = mockAddOrder.mock.calls[0][0]
    expect(saved).toMatchObject({
      hash: '0xorder',
      status: 'pending',
      fromAmount: '100',
      fromSymbol: 'USDC',
      fromDecimals: 6,
      fromTokenIcon: 'usdc.png',
      fromTokenAddress: USDC.address,
      toSymbol: 'AAPL',
      toDecimals: 18,
      toTokenIcon: 'aapl.png',
      toTokenAddress: AAPL.address,
      // avgAmount of the quote the user reviewed, in AAPL units
      expectedToAmount: '0.49',
      usdValue: '100.00',
      toUsdValue: '98.00',
      chainId: 1,
      chainName: 'ETHEREUM',
    })
  })

  it('submits the order with the confirmed tokens and amount, not the live form', async () => {
    const { confirmTrade, form } = await makeHarness()
    mockSubmitOrder.mockImplementation(async (config: unknown) => {
      // Simulate a watcher swapping the token while the signature is pending:
      // the submit config must already be fixed by now.
      form.toTokenSelected.value = TSLA as never
      return { hash: '0xorder', config }
    })

    await confirmTrade()

    expect(mockSubmitOrder).toHaveBeenCalledWith(
      expect.objectContaining({
        fromTokenAddress: USDC.address,
        toTokenAddress: AAPL.address,
        amount: '100000000', // 100 USDC in base units (6 decimals)
        fromTokenDecimals: 6,
        toTokenDecimals: 18,
      }),
      expect.anything(),
    )
  })
})
