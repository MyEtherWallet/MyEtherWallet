import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ref, computed } from 'vue'

// The debounce is irrelevant to the guards under test, and running fetchQuote
// synchronously keeps the cases free of timer plumbing.
vi.mock('@vueuse/core', () => ({
  useDebounceFn: (fn: (...args: unknown[]) => unknown) => fn,
}))

// Partial: `useTradeExecution` transitively pulls in `@/i18n`, which needs the
// real `createI18n`. Only `useI18n` is stubbed, to keep `t()` outside a component.
vi.mock('vue-i18n', async importOriginal => ({
  ...(await importOriginal<typeof import('vue-i18n')>()),
  useI18n: () => ({ t: (key: string) => key }),
}))

const mockAddToastMessage = vi.fn()
vi.mock('@/stores/toastStore', () => ({
  useToastStore: () => ({ addToastMessage: mockAddToastMessage }),
}))

const mockAddOrder = vi.fn()
vi.mock('@/stores/tradeOrdersStore', () => ({
  useTradeOrdersStore: () => ({ addOrder: mockAddOrder }),
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
// without this mock the spec dies at import. The trackers double as the probes
// for "did this action do any of its work?".
const mockTrackTradeEvent = vi.fn()
const mockTrackTradeEventStatus = vi.fn()
const mockTrackTradeEventError = vi.fn()
vi.mock('@/analytics', () => ({
  analytics: {
    trackTradeEvent: mockTrackTradeEvent,
    trackTradeEventStatus: mockTrackTradeEventStatus,
    trackTradeEventError: mockTrackTradeEventError,
  },
  TradeEvent: {
    PRELIMINARY_SHOWN: 'Trade_Preliminary_Rate_Shown',
    CLICK_APPROVE: 'Trade_Click_Approve',
    CLICK_TRADE: 'Trade_Click_Trade',
    OFFER_SHOWN: 'Trade_Offer_Shown',
    OFFER_PROCEED: 'Trade_Offer_Proceed',
  },
  TradeEventStatus: { INITIATED: 'Trade_Initiated' },
  TradeEventError: {
    PRELIMINARY_ERROR: 'Trade_Preliminary_Error',
    OFFER_ERROR: 'Trade_Offer_Error',
    APPROVAL_ERROR: 'Trade_Approval_Error',
    SIGN_ERROR: 'Trade_Sign_Error',
  },
}))

// Any attempt to reach the provider is a failure of the guard: 1inch is only
// touched after every gate has passed, so a throwing stub turns a leak into a
// loud rejection instead of a silent network call.
const mockGetQuote = vi.fn()
const mockSetApproval = vi.fn()
const mockSubmitOrder = vi.fn()
vi.mock('@/modules/trade/providers/oneinch_fusion/oneInchFusion', () => ({
  default: class {
    getQuote = mockGetQuote
    setApproval = mockSetApproval
    submitOrder = mockSubmitOrder
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

// Mirrors the store: the restriction flag starts `false`, so "allowed" is only
// true once the geo check has RESOLVED and come back unrestricted. Keeping the
// derivation here rather than a second free ref stops the cases from expressing
// a combination the store cannot produce.
const isTradingRestrictedInRegion = ref(false)
const hasResolvedRegion = ref(true)
const isTradingAllowedInRegion = computed(
  () => hasResolvedRegion.value && !isTradingRestrictedInRegion.value,
)

const makeQuoteHarness = async () => {
  const { useTradeQuote } =
    await import('@/modules/trade/composables/useTradeQuote')
  const toAmount = ref('')
  const isLoadingQuote = ref(false)
  const generalError = ref('')
  const quote = useTradeQuote({
    fromTokenSelected: ref({ ...TOKEN, symbol: 'USDC' }) as never,
    toTokenSelected: ref({ ...TOKEN }) as never,
    fromAmount: ref('100'),
    toAmount,
    walletAddress: ref('0xwallet'),
    wallet: ref({}),
    selectedFromChain: ref({ chainID: '1', name: 'ETHEREUM' }) as never,
    isMarketOpen: computed(() => true),
    isSelectedAssetTradeable: computed(() => true),
    isTradingAllowedInRegion,
    hasPreQuoteError: computed(() => false),
    generalError,
    isLoadingQuote,
    isReviewModalOpen: ref(false),
  })
  return { ...quote, toAmount, isLoadingQuote, generalError }
}

const makeExecutionHarness = async (needsApprovalValue = true) => {
  const { useTradeExecution } =
    await import('@/modules/trade/composables/useTradeExecution')
  return useTradeExecution({
    fromTokenSelected: ref({ ...TOKEN, symbol: 'USDC' }) as never,
    toTokenSelected: ref({ ...TOKEN }) as never,
    fromAmount: ref('100'),
    walletAddress: ref('0xwallet'),
    wallet: ref({}),
    selectedFromChain: ref({ chainID: '1', name: 'ETHEREUM' }) as never,
    currentQuote: ref({ startAmount: 1n, endAmount: 1n, avgAmount: 1n }),
    needsApproval: ref(needsApprovalValue),
    isTradingRestrictedInRegion,
    isTradingAllowedInRegion,
  })
}

describe('trade actions in a restricted region', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    hasResolvedRegion.value = true
    isTradingRestrictedInRegion.value = true
    mockGetQuote.mockRejectedValue(new Error('provider must not be reached'))
    mockSetApproval.mockRejectedValue(new Error('provider must not be reached'))
    mockSubmitOrder.mockRejectedValue(new Error('provider must not be reached'))
  })

  it('fetchQuote does not request a quote', async () => {
    const { fetchQuote, toAmount, isLoadingQuote } = await makeQuoteHarness()

    await fetchQuote()

    expect(mockGetQuote).not.toHaveBeenCalled()
    expect(toAmount.value).toBe('0')
    // Returned before the loading flag was raised, so the spinner never shows.
    expect(isLoadingQuote.value).toBe(false)
  })

  it('startTradeFlow does not send an approval', async () => {
    const { startTradeFlow, isApproving } = await makeExecutionHarness()

    await startTradeFlow()

    expect(mockSetApproval).not.toHaveBeenCalled()
    expect(mockTrackTradeEvent).not.toHaveBeenCalled()
    expect(isApproving.value).toBe(false)
  })

  it('startTradeFlow does not advance past idle', async () => {
    const { startTradeFlow, tradeFlowStep } = await makeExecutionHarness(false)

    await startTradeFlow()

    expect(tradeFlowStep.value).toBe('idle')
    expect(mockTrackTradeEvent).not.toHaveBeenCalled()
  })

  it('confirmTrade does not submit an order', async () => {
    const { confirmTrade } = await makeExecutionHarness()

    await confirmTrade()

    expect(mockSubmitOrder).not.toHaveBeenCalled()
    expect(mockAddOrder).not.toHaveBeenCalled()
    expect(mockTrackTradeEventStatus).not.toHaveBeenCalled()
  })

  it('confirmTrade closes an already-open review modal rather than leaving a dead button', async () => {
    // The geo check can resolve while the review modal is up, since the flag
    // starts `false` and is corrected asynchronously.
    const execution = await makeExecutionHarness()
    execution.tradeFlowStep.value = 'review'

    await execution.confirmTrade()

    expect(execution.tradeFlowStep.value).toBe('idle')
  })
})

// The window this guard exists for: on first load the restriction flag reads
// `false` because nothing has been checked yet, not because trading is allowed.
// Gating on `!isTradingRestrictedInRegion` passes here, which is the bug.
describe('trade actions before the region check resolves', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    hasResolvedRegion.value = false
    isTradingRestrictedInRegion.value = false
    mockGetQuote.mockRejectedValue(new Error('provider must not be reached'))
    mockSetApproval.mockRejectedValue(new Error('provider must not be reached'))
    mockSubmitOrder.mockRejectedValue(new Error('provider must not be reached'))
  })

  it('fetchQuote does not request a quote', async () => {
    const { fetchQuote, toAmount, isLoadingQuote } = await makeQuoteHarness()

    await fetchQuote()

    expect(mockGetQuote).not.toHaveBeenCalled()
    expect(toAmount.value).toBe('0')
    expect(isLoadingQuote.value).toBe(false)
  })

  it('startTradeFlow does not send an approval', async () => {
    const { startTradeFlow, isApproving } = await makeExecutionHarness()

    await startTradeFlow()

    expect(mockSetApproval).not.toHaveBeenCalled()
    expect(isApproving.value).toBe(false)
  })

  it('confirmTrade does not submit an order', async () => {
    const { confirmTrade } = await makeExecutionHarness()

    await confirmTrade()

    expect(mockSubmitOrder).not.toHaveBeenCalled()
    expect(mockAddOrder).not.toHaveBeenCalled()
  })

  // The pre-submit recheck: the guard at the top of confirmTrade runs before an
  // await, so a check that lands against the user in that gap must still stop
  // the order.
  it('confirmTrade aborts if the check resolves as restricted mid-flight', async () => {
    hasResolvedRegion.value = true
    const { confirmTrade, tradeFlowStep } = await makeExecutionHarness()
    tradeFlowStep.value = 'review'

    // Lands during confirmTrade's dynamic import, after the first guard passed.
    void Promise.resolve().then(() => {
      isTradingRestrictedInRegion.value = true
    })
    await confirmTrade()

    expect(mockSubmitOrder).not.toHaveBeenCalled()
    expect(tradeFlowStep.value).toBe('idle')
  })
})

describe('trade actions where trading is permitted', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    hasResolvedRegion.value = true
    isTradingRestrictedInRegion.value = false
  })

  // Proves the guards above are the restriction doing its job, not the harness
  // failing to reach the work for some unrelated reason.

  it('startTradeFlow still opens the review modal', async () => {
    const { startTradeFlow, tradeFlowStep } = await makeExecutionHarness(false)

    await startTradeFlow()

    expect(tradeFlowStep.value).toBe('review')
    expect(mockTrackTradeEvent).toHaveBeenCalledWith(
      'Trade_Click_Trade',
      expect.anything(),
    )
  })

  it('fetchQuote still reaches the provider', async () => {
    mockGetQuote.mockResolvedValue({ startAmount: 1n, avgAmount: 1n })
    const { fetchQuote } = await makeQuoteHarness()

    await fetchQuote()

    expect(mockGetQuote).toHaveBeenCalledTimes(1)
  })

  it('startTradeFlow still sends the approval and chains into review', async () => {
    mockSetApproval.mockResolvedValue(undefined)
    const { startTradeFlow, tradeFlowStep } = await makeExecutionHarness()

    await startTradeFlow()

    expect(mockSetApproval).toHaveBeenCalledTimes(1)
    expect(tradeFlowStep.value).toBe('review')
  })

  it('confirmTrade still submits the order', async () => {
    mockSubmitOrder.mockResolvedValue({ hash: '0xhash' })
    const { confirmTrade } = await makeExecutionHarness()

    await confirmTrade()

    expect(mockSubmitOrder).toHaveBeenCalledTimes(1)
    expect(mockAddOrder).toHaveBeenCalledTimes(1)
  })
})
