import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ref, computed } from 'vue'

// walletConfigs drags @enkryptcom/hw-wallets (ledger transport) into the
// import graph via @/analytics; the transport does not resolve under vitest.
vi.mock('@/modules/access/common/walletConfigs', () => ({
  WalletConfigType: {},
}))

// Partial: `useTradeQuote` transitively pulls in `@/i18n`, which needs the
// real `createI18n`. Only `useI18n` is stubbed, to keep `t()` outside a
// component (useTradeQuote calls it at the top of its own setup-less function).
vi.mock('vue-i18n', async importOriginal => ({
  ...(await importOriginal<typeof import('vue-i18n')>()),
  useI18n: () => ({ t: (key: string) => key }),
}))

const mockTrackTradeEvent = vi.fn()
const mockTrackTradeEventError = vi.fn()
vi.mock('@/analytics', () => ({
  analytics: {
    trackTradeEvent: mockTrackTradeEvent,
    trackTradeEventError: mockTrackTradeEventError,
  },
  TradeEvent: { PRELIMINARY_SHOWN: 'Trade_Preliminary_Rate_Shown' },
  TradeEventError: {
    PRELIMINARY_ERROR: 'Trade_Preliminary_Rate_Error',
    OFFER_ERROR: 'Trade_Offer_Error',
  },
}))

vi.mock('@sentry/vue', () => ({ captureException: vi.fn() }))

const mockGetQuote = vi.fn()
vi.mock('@/modules/trade/providers/oneinch_fusion/oneInchFusion', () => ({
  default: class {
    getQuote = mockGetQuote
    isApprovalRequired = vi.fn(async () => false)
  },
}))

const TOKEN = {
  symbol: 'AAPL',
  address: '0x0000000000000000000000000000000000000001',
  decimals: 18,
  price: 100,
  logoURI: '',
}

const makeHarness = async (isReviewModalOpenValue = false) => {
  const { useTradeQuote } =
    await import('@/modules/trade/composables/useTradeQuote')
  const toAmount = ref('')
  const fromAmount = ref('100')
  const isLoadingQuote = ref(false)
  const generalError = ref('')
  const isPairUnavailable = ref(false)
  const isReviewModalOpen = ref(isReviewModalOpenValue)
  const form = {
    fromTokenSelected: ref({ ...TOKEN, symbol: 'USDC' }),
    toTokenSelected: ref({ ...TOKEN }),
    fromAmount,
    toAmount,
    selectedFromChain: ref({ chainID: '1', name: 'ETHEREUM' }),
    generalError,
    isLoadingQuote,
    isPairUnavailable,
  } as never
  const quote = useTradeQuote({
    form,
    walletAddress: ref('0xwallet'),
    wallet: ref({}) as never,
    isMarketOpen: computed(() => true),
    isSelectedAssetTradeable: computed(() => true),
    isTradingAllowedInRegion: ref(true),
    hasPreQuoteError: computed(() => false),
    isReviewModalOpen,
  })
  return {
    ...quote,
    isReviewModalOpen,
    isLoadingQuote,
    fromAmount,
    isPairUnavailable,
  }
}

describe('useTradeQuote loading flag', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('raises the flag on the call, not after the debounce', async () => {
    mockGetQuote.mockResolvedValue({ startAmount: 1n, avgAmount: 1n })
    const { fetchQuote, isLoadingQuote } = await makeHarness()

    const pending = fetchQuote()
    expect(isLoadingQuote.value).toBe(true)

    await pending
    expect(isLoadingQuote.value).toBe(false)
  })

  it('does not raise the flag for an empty or zero amount', async () => {
    const { fetchQuote, isLoadingQuote, fromAmount } = await makeHarness()

    fromAmount.value = ''
    await fetchQuote()
    expect(isLoadingQuote.value).toBe(false)

    fromAmount.value = '0'
    await fetchQuote()
    expect(isLoadingQuote.value).toBe(false)
  })

  it('lowers the flag when the run bails out before requesting', async () => {
    mockGetQuote.mockResolvedValue({ startAmount: 1n, avgAmount: 1n })
    const { fetchQuote, isLoadingQuote, fromAmount } = await makeHarness()

    const pending = fetchQuote()
    expect(isLoadingQuote.value).toBe(true)
    fromAmount.value = ''

    await pending
    expect(isLoadingQuote.value).toBe(false)
    expect(mockGetQuote).not.toHaveBeenCalled()
  })
})

describe('useTradeQuote analytics', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fires PRELIMINARY_SHOWN on a successful sidebar quote', async () => {
    mockGetQuote.mockResolvedValue({ startAmount: 1n, avgAmount: 1n })
    const { fetchQuote } = await makeHarness(false)

    await fetchQuote()

    expect(mockTrackTradeEvent).toHaveBeenCalledWith(
      'Trade_Preliminary_Rate_Shown',
      expect.anything(),
    )
  })

  it('does not fire PRELIMINARY_SHOWN for the review modal refresh', async () => {
    mockGetQuote.mockResolvedValue({ startAmount: 1n, avgAmount: 1n })
    const { fetchQuote } = await makeHarness(true)

    await fetchQuote()

    expect(mockTrackTradeEvent).not.toHaveBeenCalled()
  })

  it('reports PRELIMINARY_ERROR for a sidebar quote failure', async () => {
    mockGetQuote.mockRejectedValue(new Error('boom'))
    const { fetchQuote } = await makeHarness(false)

    await fetchQuote()

    expect(mockTrackTradeEventError).toHaveBeenCalledWith(
      'Trade_Preliminary_Rate_Error',
      expect.anything(),
    )
  })

  it('flags the pair as unavailable on a 1inch client error', async () => {
    const clientError = Object.assign(new Error('cannot fetch price'), {
      expectedClientError: true,
    })
    mockGetQuote.mockRejectedValue(clientError)
    const { fetchQuote, isPairUnavailable } = await makeHarness(false)

    await fetchQuote()

    expect(isPairUnavailable.value).toBe(true)
  })

  it('leaves the pair flag down on a server or network failure', async () => {
    mockGetQuote.mockRejectedValue(new Error('boom'))
    const { fetchQuote, isPairUnavailable } = await makeHarness(false)

    await fetchQuote()

    expect(isPairUnavailable.value).toBe(false)
  })

  it('reports OFFER_ERROR for the same failure while the review modal is open', async () => {
    mockGetQuote.mockRejectedValue(new Error('boom'))
    const { fetchQuote } = await makeHarness(true)

    await fetchQuote()

    expect(mockTrackTradeEventError).toHaveBeenCalledWith(
      'Trade_Offer_Error',
      expect.anything(),
    )
  })

  it('reports OFFER_ERROR when no quote comes back while the review modal is open', async () => {
    mockGetQuote.mockResolvedValue(null)
    const { fetchQuote } = await makeHarness(true)

    await fetchQuote()

    expect(mockTrackTradeEventError).toHaveBeenCalledWith(
      'Trade_Offer_Error',
      expect.anything(),
    )
  })
})
