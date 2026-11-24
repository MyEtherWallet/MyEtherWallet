import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ref, computed, nextTick } from 'vue'

// Partial: `useTradeExecution` transitively pulls in `@/i18n`, which needs the
// real `createI18n`. Only `useI18n` is stubbed, to keep `t()` outside a component.
vi.mock('vue-i18n', async importOriginal => ({
  ...(await importOriginal<typeof import('vue-i18n')>()),
  useI18n: () => ({ t: (key: string) => key }),
}))

const mockAddToast = vi.fn()
vi.mock('@/stores/toastStore', () => ({
  useToastStore: () => ({ addToastMessage: mockAddToast }),
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
  const walletAddress = ref<string | null>('0xwallet')
  const execution = useTradeExecution({
    form,
    walletAddress,
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
  return { ...execution, form, currentQuote, walletAddress, clearForm }
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
      fromAddress: '0xwallet',
    })
  })

  it('keeps submission and the saved order on the account that confirmed', async () => {
    const { confirmTrade, walletAddress } = await makeHarness()
    mockSubmitOrder.mockImplementation(async () => {
      // Account switched in the wallet while the relayer call was in flight.
      walletAddress.value = '0xother'
      return { hash: '0xorder' }
    })

    await confirmTrade()

    expect(mockSubmitOrder).toHaveBeenCalledWith(
      expect.objectContaining({ fromAddress: '0xwallet' }),
      expect.anything(),
    )
    expect(mockAddOrder.mock.calls[0][0]).toMatchObject({
      fromAddress: '0xwallet',
    })
  })

  it('does not submit without a connected address', async () => {
    const { confirmTrade, walletAddress } = await makeHarness()
    walletAddress.value = null

    await confirmTrade()

    expect(mockSubmitOrder).not.toHaveBeenCalled()
    expect(mockAddOrder).not.toHaveBeenCalled()
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

// The wallet (a phone over WalletConnect) holds the order signature until the
// user acts on it.
const deferred = <T>() => {
  let resolve!: (value: T) => void
  let reject!: (reason: unknown) => void
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

describe('closing the progress modal while the wallet is pending (MEW-2694)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('stops waiting on close but still saves an order signed later', async () => {
    const { confirmTrade, tradeFlowStep, txProceeding } = await makeHarness()
    const pending = deferred<{ hash: string }>()
    mockSubmitOrder.mockReturnValue(pending.promise)

    const confirming = confirmTrade()
    await vi.waitFor(() => expect(mockSubmitOrder).toHaveBeenCalled())
    expect(txProceeding.value).toBe(true)

    tradeFlowStep.value = 'idle'
    await nextTick()
    expect(txProceeding.value).toBe(false)

    pending.resolve({ hash: '0xorder' })
    await confirming
    expect(mockAddOrder).toHaveBeenCalledOnce()
    expect(mockAddToast).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'trade-processing-0xorder' }),
    )
  })

  it('leaves a newer confirm alone when the abandoned one settles', async () => {
    const { confirmTrade, tradeFlowStep, txProceeding } = await makeHarness()
    const first = deferred<{ hash: string }>()
    mockSubmitOrder
      .mockReturnValueOnce(first.promise)
      .mockReturnValueOnce(deferred().promise)

    const firstConfirm = confirmTrade()
    await vi.waitFor(() => expect(mockSubmitOrder).toHaveBeenCalledTimes(1))
    tradeFlowStep.value = 'idle'
    await nextTick()

    tradeFlowStep.value = 'review'
    void confirmTrade()
    await vi.waitFor(() => expect(mockSubmitOrder).toHaveBeenCalledTimes(2))

    first.reject(Object.assign(new Error('User rejected'), { code: 4001 }))
    await firstConfirm
    expect(tradeFlowStep.value).toBe('processing')
    expect(txProceeding.value).toBe(true)
  })

  it('saves an abandoned unsubmitted native order without taking over the newer confirm', async () => {
    const { NativeOrderUnsubmittedError } =
      await import('@/modules/trade/providers/oneinch_fusion/nativeOrderError')
    const { confirmTrade, tradeFlowStep, orderHash } = await makeHarness()
    const first = deferred<{ hash: string }>()
    mockSubmitOrder
      .mockReturnValueOnce(first.promise)
      .mockReturnValueOnce(deferred().promise)

    const firstConfirm = confirmTrade()
    await vi.waitFor(() => expect(mockSubmitOrder).toHaveBeenCalledTimes(1))
    tradeFlowStep.value = 'idle'
    await nextTick()
    tradeFlowStep.value = 'review'
    void confirmTrade()
    await vi.waitFor(() => expect(mockSubmitOrder).toHaveBeenCalledTimes(2))

    first.reject(
      new NativeOrderUnsubmittedError({
        orderHash: '0xstranded',
        depositTxHash: '0xdeposit',
        proxyAddress: '0xproxy',
        nativeOrder: {} as never,
        cause: new Error('relayer 500'),
      }),
    )
    await firstConfirm
    expect(mockAddOrder).toHaveBeenCalledWith(
      expect.objectContaining({ hash: '0xstranded', status: 'unsubmitted' }),
    )
    expect(orderHash.value).toBe('')
  })

  it('does not bring back the deposit flag when closed while the provider loads', async () => {
    const { confirmTrade, tradeFlowStep, depositPending, form } =
      await makeHarness()
    form.fromTokenSelected.value = {
      ...USDC,
      symbol: 'ETH',
      address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      decimals: 18,
    } as never
    mockSubmitOrder.mockReturnValue(deferred().promise)

    void confirmTrade()
    await nextTick()
    tradeFlowStep.value = 'idle'
    await nextTick()
    // Closed before the 1inch provider finished loading.
    expect(mockSubmitOrder).not.toHaveBeenCalled()

    await vi.waitFor(() => expect(mockSubmitOrder).toHaveBeenCalled())
    expect(depositPending.value).toBe(false)
  })
})
