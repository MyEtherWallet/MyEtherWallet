import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'

// Drives the real useTradeModule with the real token, validation, form and
// pair-guard composables, so the OIP wiring between them is under test.
// Everything that reaches the network or a wallet is stubbed, down to the
// members the module reads while it sets up.
const h = await vi.hoisted(async () => {
  const { ref } = await import('vue')
  const { defineStore } = await import('pinia')
  return { ref, defineStore, state: {} as Record<string, any> }
})

vi.mock('vue-i18n', async importOriginal => ({
  ...(await importOriginal<typeof import('vue-i18n')>()),
  useI18n: () => ({
    t: (key: string, params?: Record<string, unknown>) =>
      params ? `${key}|${JSON.stringify(params)}` : key,
  }),
}))

vi.mock('@/composables/useFetchMewApi', () => ({
  useFetchMewApi: () => ({
    useMEWFetch: () => ({
      get: () => ({ json: () => Promise.resolve({ data: h.ref(null) }) }),
    }),
  }),
}))

vi.mock('@/modules/trade/composables/useTrade', () => ({
  useTrade: () => {
    const tradableAssets = h.ref<any>(null)
    const additionalBuyAssets = h.ref<any>(null)
    h.state.tradableAssets = tradableAssets
    return {
      supportedChainNames: h.ref(['ETHEREUM']),
      tradableAssets,
      additionalBuyAssets,
      hardcodedTokensInfo: h.ref([]),
      isLoading: h.ref(false),
      loadTradableAssets: async () => {
        tradableAssets.value = h.state.assetsPayload()
        additionalBuyAssets.value = h.state.supportingPayload()
      },
    }
  },
}))

vi.mock('@/stores/swapStore', () => ({
  useSwapStore: h.defineStore('swapStoreMock', () => ({
    fromTokens: h.ref<any[]>(h.state.swapFromTokens()),
    swapLoaded: h.ref(true),
    initSwapper: async () => {},
  })),
}))

vi.mock('@/stores/walletStore', () => ({
  MAIN_TOKEN_CONTRACT: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  useWalletStore: h.defineStore('walletStoreMock', () => ({
    isWalletConnected: h.ref(false),
    walletAddress: h.ref<string | null>(null),
    userAddress: h.ref<string | null>(null),
    wallet: h.ref<any>(null),
    isWatchOnly: h.ref(false),
    allTokens: h.ref<any[]>([]),
    isLoadingBalances: h.ref(false),
    hasChainBalance: h.ref(true),
  })),
}))

vi.mock('@/stores/chainsStore', () => ({
  useChainsStore: h.defineStore('chainsStoreMock', () => {
    const chains = h.ref<any[]>([{ name: 'ETHEREUM', chainID: '1' }])
    return { chains, selectedChain: h.ref<any>(chains.value[0]) }
  }),
}))

vi.mock('@/stores/globalStore', () => ({
  useGlobalStore: h.defineStore('globalStoreMock', () => ({
    isTradingRestrictedInRegion: h.ref(false),
    isTradingAllowedInRegion: h.ref(true),
  })),
}))

vi.mock('@/stores/marketStatusStore', () => ({
  useMarketStatusStore: h.defineStore('marketStatusStoreMock', () => ({
    marketStatus: h.ref<any>({}),
    currentSession: h.ref<string | null>('regular'),
    isTradingSessionOpen: h.ref(true),
    hasStaleBoundary: () => false,
    fetchMarketStatus: async () => {},
    acquire: () => {},
    release: () => {},
  })),
}))

vi.mock('@/stores/accessStore', () => ({
  useAccessStore: h.defineStore('accessStoreMock', () => ({})),
}))

vi.mock('@/stores/tradeOrdersStore', () => ({
  useTradeOrdersStore: h.defineStore('tradeOrdersStoreMock', () => ({})),
}))

vi.mock('@/analytics', () => ({ analytics: {}, ConnectWalletEvent: {} }))

vi.mock('@/modules/trade/composables/useTradeQuote', () => ({
  useTradeQuote: (options: any) => {
    h.state.quoteOptions = options
    return { fetchQuote: () => {}, cancelQuote: () => {}, resetQuote: () => {} }
  },
}))

vi.mock('@/modules/trade/composables/useTradeExecution', () => ({
  useTradeExecution: () => ({
    tradeFlowStep: h.ref('idle'),
    orderHash: h.ref(null),
  }),
}))

vi.mock('@/modules/trade/composables/useMarketStatusDisplay', () => ({
  useMarketStatusDisplay: () => ({}),
}))

vi.mock('@/composables/useMaxAmount', () => ({
  useMaxAmount: () => ({ setMaxAmount: () => {} }),
}))

vi.mock('@/composables/useBlockedContent', () => ({
  useBlockedContent: () => ({}),
}))

// The module does not return `toTokenManuallySelected`; keep a handle on the
// real form to read it.
vi.mock('@/modules/trade/composables/useTradeForm', async importOriginal => {
  const mod =
    await importOriginal<
      typeof import('@/modules/trade/composables/useTradeForm')
    >()
  return {
    ...mod,
    useTradeForm: (...args: Parameters<typeof mod.useTradeForm>) =>
      (h.state.form = mod.useTradeForm(...args)),
  }
})

import { useTradeModule } from '@/modules/trade/composables/useTradeModule'
import { usePairStore } from '@/stores/pairStore'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { useToastStore } from '@/stores/toastStore'

const NATIVE = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
const ADDRESS = {
  AAPL: '0x00000000000000000000000000000000000000a1',
  BIG5: '0x00000000000000000000000000000000000000a2',
  MAG7X: '0x00000000000000000000000000000000000000a3',
  TSLA: '0x00000000000000000000000000000000000000a4',
  USDT: '0x00000000000000000000000000000000000000c1',
  USDC: '0x00000000000000000000000000000000000000c2',
  UNI: '0x00000000000000000000000000000000000000e9',
}

const tradable = (symbol: string, address: string, isPortfolio?: boolean) => ({
  symbol,
  ...(isPortfolio === undefined ? {} : { isPortfolio }),
  tradable: true,
  primaryMarket: { price: '25' },
  addresses: [{ chainName: 'ETHEREUM', address, decimals: 18 }],
})

const supporting = (symbol: string, address: string) => ({
  name: symbol,
  symbol,
  price: 1,
  isPortfolio: null,
  addresses: [
    { chainName: 'ETHEREUM', tokenLogoUrl: null, address, decimals: 6 },
  ],
})

const assets = (flagged: boolean) => () => [
  tradable('AAPLon', ADDRESS.AAPL, flagged ? false : undefined),
  tradable('BIG5on', ADDRESS.BIG5, flagged ? true : undefined),
  tradable('MAG7Xon', ADDRESS.MAG7X, flagged ? true : undefined),
  tradable('TSLAon', ADDRESS.TSLA, flagged ? false : undefined),
]

const token = (symbol: string, address: string, price: number) => ({
  symbol,
  name: symbol,
  address,
  price,
  decimals: 18,
})

const fromTokens = () => [
  token('ETH', NATIVE, 2500),
  token('USDT', ADDRESS.USDT, 0.999),
  token('UNI', ADDRESS.UNI, 5),
  token('AAPLON', ADDRESS.AAPL, 25),
  token('BIG5ON', ADDRESS.BIG5, 20),
]

type Api = ReturnType<typeof useTradeModule>

let wrapper: ReturnType<typeof mount> | undefined

const mountModule = async (beforeMount?: () => void) => {
  const pinia = createPinia()
  setActivePinia(pinia)
  beforeMount?.()
  let api!: Api
  wrapper = mount(
    defineComponent({
      setup() {
        api = useTradeModule()
        return () => null
      },
    }),
    { global: { plugins: [pinia] } },
  )
  await flushPromises()
  await nextTick()
  return api
}

const pair = (api: Api) =>
  `${api.fromTokenSelected.value?.symbol}>${api.toTokenSelected.value?.symbol}`

// What the picker does: write the v-model, then emit `select:token`.
const userPicksFrom = (api: Api, symbol: string) => {
  const picked = api.fromTokens.value.find(t => t.symbol === symbol)!
  api.fromTokenSelected.value = picked
  api.onFromTokenSelected(picked)
}
const userPicksTo = (api: Api, symbol: string) => {
  const picked = api.toTokenSantized.value.find(t => t.symbol === symbol)!
  expect(picked, `${symbol} is offered in the To list`).toBeTruthy()
  api.toTokenSelected.value = picked
  api.onToTokenSelected(picked)
}

const lastToast = () => useToastStore().messages.at(-1)?.text ?? ''
const isToManuallySelected = () =>
  h.state.form.toTokenManuallySelected.value as boolean

beforeEach(() => {
  h.state.assetsPayload = assets(true)
  h.state.supportingPayload = () => [
    supporting('usdt', ADDRESS.USDT),
    supporting('usdc', ADDRESS.USDC),
  ]
  h.state.swapFromTokens = fromTokens
})

afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
})

describe('useTradeModule OIP wiring', () => {
  describe('a From pick that refuses the pair (AC-04)', () => {
    it('resets To before the toast, which names the new To', async () => {
      const api = await mountModule()
      userPicksTo(api, 'BIG5ON')
      expect(pair(api)).toBe('ETH>BIG5ON')
      expect(isToManuallySelected()).toBe(true)

      userPicksFrom(api, 'UNI')

      // Synchronously: the toast is raised inside the same handler.
      expect(pair(api)).toBe('UNI>AAPLON')
      expect(lastToast()).toContain('"from":"UNI","to":"AAPLON"')
      expect(isToManuallySelected()).toBe(false)
    })

    it('keeps To and its manual flag when the pair is still allowed', async () => {
      const api = await mountModule()
      userPicksTo(api, 'TSLAON')

      userPicksFrom(api, 'UNI')
      await nextTick()

      expect(pair(api)).toBe('UNI>TSLAON')
      expect(isToManuallySelected()).toBe(true)
    })

    it('never resets To onto the token being sold', async () => {
      const api = await mountModule()
      userPicksTo(api, 'BIG5ON')

      // AAPLON heads the list a non-OIP stock can buy, itself included.
      userPicksFrom(api, 'AAPLON')

      expect(api.toTokenSantized.value[0].symbol).toBe('AAPLON')
      expect(pair(api)).toBe('AAPLON>TSLAON')
    })

    it('resets a pair that only becomes refused once the flags arrive', async () => {
      h.state.assetsPayload = assets(false)
      const api = await mountModule()
      userPicksFrom(api, 'UNI')
      userPicksTo(api, 'BIG5ON')
      await nextTick()
      expect(pair(api)).toBe('UNI>BIG5ON')

      h.state.tradableAssets.value = assets(true)()
      await nextTick()

      expect(pair(api)).toBe('UNI>AAPLON')
      expect(isToManuallySelected()).toBe(false)
    })
  })

  describe('an OIP token requested from outside the panel (AC-11)', () => {
    it('switches a non-cash From to the default cash token on mount', async () => {
      const api = await mountModule(() => {
        usePairStore().setTradeFromSymbol('UNI')
        useWalletMenuStore().setSelectedTradeTokenSymbol('BIG5on')
      })

      expect(pair(api)).toBe('ETH>BIG5ON')
    })

    it('does the same while mounted, and clears the amount typed for the old From', async () => {
      const api = await mountModule()
      userPicksFrom(api, 'UNI')
      api.fromAmount.value = '3'
      await nextTick()

      useWalletMenuStore().setSelectedTradeTokenSymbol('BIG5on')
      await nextTick()

      expect(pair(api)).toBe('ETH>BIG5ON')
      expect(api.fromAmount.value).toBe('')
    })

    it('keeps a From that is already cash, and its amount', async () => {
      const api = await mountModule()
      userPicksFrom(api, 'USDT')
      api.fromAmount.value = '25'
      await nextTick()

      useWalletMenuStore().setSelectedTradeTokenSymbol('MAG7Xon')
      await nextTick()

      expect(pair(api)).toBe('USDT>MAG7XON')
      expect(api.fromAmount.value).toBe('25')
    })

    it('falls back to the first cash token when the default From is not one', async () => {
      // A checksummed native sentinel misses the default's exact-match lookup,
      // which then ends on the first listed token.
      h.state.swapFromTokens = () => [
        token('UNI', ADDRESS.UNI, 5),
        token('AAPLON', ADDRESS.AAPL, 25),
        token('ETH', '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', 2500),
        token('USDT', ADDRESS.USDT, 0.999),
      ]
      const api = await mountModule(() => {
        usePairStore().setTradeFromSymbol('AAPLON')
        useWalletMenuStore().setSelectedTradeTokenSymbol('BIG5on')
      })

      expect(pair(api)).toBe('ETH>BIG5ON')
    })
  })

  describe('the $10 minimum (AC-05, AC-06, AC-08)', () => {
    const enter = (api: Api, amount: string) => {
      api.fromAmount.value = amount
      api.toAmount.value = '1'
    }

    it('blocks an OIP buy under the minimum and lets 10 stable tokens through', async () => {
      const api = await mountModule()
      userPicksFrom(api, 'USDT')
      userPicksTo(api, 'BIG5ON')
      expect(pair(api)).toBe('USDT>BIG5ON')
      // Nothing is said about the minimum until an amount is entered.
      expect(api.fromAmountError.value).toBe('')
      expect(api.isOipMinimumError.value).toBe(false)

      enter(api, '9.99')
      expect(api.fromAmountError.value).toBe('trade.error.oip_minimum')
      expect(api.isOipMinimumError.value).toBe(true)
      expect(api.isTradeDisabled.value).toBe(true)
      expect(h.state.quoteOptions.hasPreQuoteError.value).toBe(true)
      api.isFromAmountErrorVisible.value = true
      expect(api.ctaDisabledLabel.value).toBe('trade.error.oip_minimum')

      // USDT is priced at $0.999: $9.99 in value, but 10 tokens of a stable.
      enter(api, '10')
      expect(api.fromAmountError.value).toBe('')
      expect(api.isTradeDisabled.value).toBe(false)
      expect(h.state.quoteOptions.hasPreQuoteError.value).toBe(false)
    })

    it('blocks an OIP sell under the minimum', async () => {
      const api = await mountModule()
      userPicksFrom(api, 'BIG5ON')
      expect(pair(api)).toBe('BIG5ON>USDT')

      enter(api, '0.4')
      expect(api.fromAmountError.value).toBe('trade.error.oip_minimum')
      expect(api.isTradeDisabled.value).toBe(true)

      enter(api, '0.5')
      expect(api.fromAmountError.value).toBe('')
      expect(api.isTradeDisabled.value).toBe(false)
    })

    it('leaves a pair without an OIP token on the existing floor', async () => {
      const api = await mountModule()
      userPicksTo(api, 'AAPLON')

      enter(api, '0.0008')
      expect(api.fromAmountError.value).toBe('')
      expect(api.isTradeDisabled.value).toBe(false)

      enter(api, '0.0002')
      expect(api.fromAmountError.value).toBe('trade.error.minimum_not_reached')
      expect(api.isOipMinimumError.value).toBe(false)
    })
  })

  it('applies nothing against a backend that does not send the flag (AC-10)', async () => {
    h.state.assetsPayload = assets(false)
    const api = await mountModule(() => {
      usePairStore().setTradeFromSymbol('UNI')
      useWalletMenuStore().setSelectedTradeTokenSymbol('BIG5on')
    })

    expect(pair(api)).toBe('UNI>BIG5ON')
    api.fromAmount.value = '1'
    api.toAmount.value = '1'
    expect(api.fromAmountError.value).toBe('')
    expect(api.isTradeDisabled.value).toBe(false)
  })
})
