import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref, unref, type Ref } from 'vue'
import { shallowMount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import BigNumber from 'bignumber.js'

// APP-MEW-WEB-1M6: spam tokens have no CoinGecko id, and their display name /
// symbol often embeds a URL ("Rare Address Generator at https://rareAddress.com").
// The portfolio allocation dialog fell back to that symbol as the token-info
// route id, and the token page dropped the raw id into the MEW API path, so the
// "https://" slashes turned it into an unknown API route -> 404 "Route not
// found", reported to Sentry.
const SPAM_ID = 'Rare Address Generator at https://rareAddress.com'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  missingWarn: false,
  fallbackWarn: false,
  messages: { en: {} },
})

// Captures every URL handed to useMEWFetch so the test can assert on the exact
// request path, without touching the network.
const requestedUrls: Array<Ref<string> | string> = []
vi.mock('@/composables/useFetchMewApi', () => ({
  useFetchMewApi: () => ({
    useMEWFetch: (url: Ref<string> | string) => {
      requestedUrls.push(url)
      return {
        get: () => ({
          json: () => ({
            data: ref(null),
            isFetching: ref(false),
            onFetchResponse: vi.fn(),
            onFetchError: vi.fn(),
          }),
        }),
      }
    },
  }),
}))

vi.mock('@/composables/useAssetDescription', () => ({
  useAssetDescription: () => ({
    description: ref(''),
    isFetchingDescription: ref(false),
  }),
}))
vi.mock('@/composables/useCurrency', () => ({
  useCurrency: () => ({
    currencySymbol: ref('$'),
    formatFiat: (v: unknown) => ({ display: String(v), value: String(v) }),
  }),
}))
vi.mock('@/stores/chainsStore', () => ({
  useChainsStore: () => ({
    selectedChain: ref({ name: 'BSC' }),
    allChains: [],
    chainHasSwapSupport: () => false,
  }),
}))
vi.mock('@/stores/walletMenuStore', () => ({
  useWalletMenuStore: () => ({
    isOpenSideMenu: ref(false),
    walletPanel: ref(''),
    setWalletPanel: vi.fn(),
  }),
}))
vi.mock('@/stores/walletStore', () => ({
  MAIN_TOKEN_CONTRACT: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  useWalletStore: () => ({
    walletAddress: ref('0x62a5d8b0cd15b7403c5e4822c7d53a7a38ae6d44'),
    isWalletConnected: ref(false),
  }),
}))
vi.mock('@/stores/tokenInfoStore', () => ({
  useTokenInfoStore: () => ({ tokenInfo: ref(null) }),
}))
vi.mock('@/stores/inputStore', () => ({
  useInputStore: () => ({ storeSwapValues: vi.fn() }),
}))
vi.mock('@/stores/watchlistTableStore', () => ({
  useWatchlistStore: () => ({
    isWatchListed: () => false,
    setWatchlistItem: vi.fn(),
  }),
}))
vi.mock('@/stores/recentlyViewedTokensStore', () => ({
  useRecentlyViewedTokensStore: () => ({ addToken: vi.fn() }),
}))

const push = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({ push }),
}))

const { default: ModuleTokenInfo } =
  await import('@/modules/crypto/ModuleTokenInfo.vue')
const { default: TokenInfoChart } =
  await import('@/modules/crypto/components/token_info/TokenInfoChart.vue')
const { default: AllocationDialog } =
  await import('@/modules/portfolio/components/allocation/AllocationDialog.vue')

const lastUrl = () => unref(requestedUrls[requestedUrls.length - 1])

describe('token-info API path for a non-CoinGecko token id (APP-MEW-WEB-1M6)', () => {
  beforeEach(() => {
    requestedUrls.length = 0
  })

  it('ModuleTokenInfo keeps the id inside a single path segment', () => {
    shallowMount(ModuleTokenInfo, {
      props: { tokenId: SPAM_ID },
      global: { plugins: [i18n] },
    })
    expect(lastUrl()).toBe(
      `/v1/web/pages/token-info/coins/${encodeURIComponent(SPAM_ID)}`,
    )
  })

  it('TokenInfoChart keeps the id inside a single path segment', () => {
    shallowMount(TokenInfoChart, {
      props: { tokenId: SPAM_ID },
      global: { plugins: [i18n] },
    })
    expect(lastUrl()).toBe(
      `/v1/web/token-price-chart/coins/${encodeURIComponent(SPAM_ID)}?interval=1D`,
    )
  })

  it('leaves ordinary CoinGecko ids untouched', () => {
    shallowMount(ModuleTokenInfo, {
      props: { tokenId: 'usd-coin' },
      global: { plugins: [i18n] },
    })
    expect(lastUrl()).toBe('/v1/web/pages/token-info/coins/usd-coin')
  })
})

describe('AllocationDialog routing (APP-MEW-WEB-1M6)', () => {
  const allocation = (overrides: Record<string, unknown>) => ({
    name: 'Token',
    symbol: 'TKN',
    percentage: new BigNumber(1),
    formattedPercentage: '1%',
    percentageNumber: 1,
    usdBalanceFormatted: '1',
    ...overrides,
  })

  const mountDialog = (tokens: ReturnType<typeof allocation>[]) =>
    shallowMount(AllocationDialog, {
      props: { tokens },
      global: {
        plugins: [i18n],
        stubs: {
          AppModal: { template: '<div><slot /></div>' },
        },
      },
    })

  beforeEach(() => {
    push.mockClear()
  })

  it('does not send a token without a coin id to the token page by its symbol', async () => {
    const wrapper = mountDialog([
      allocation({ name: SPAM_ID, symbol: SPAM_ID, id: undefined }),
    ])
    await wrapper.find('button').trigger('click')
    expect(push).not.toHaveBeenCalled()
  })

  it('routes a token with a coin id to its token page', async () => {
    const wrapper = mountDialog([
      allocation({ id: 'usd-coin', symbol: 'USDC' }),
    ])
    await wrapper.find('button').trigger('click')
    expect(push).toHaveBeenCalledWith({
      name: 'token-info-home',
      params: { tokenId: 'usd-coin' },
    })
  })
})
