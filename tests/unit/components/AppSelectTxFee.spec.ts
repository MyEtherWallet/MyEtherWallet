import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { reactive, ref } from 'vue'

const walletStore = reactive({
  isWalletConnected: true,
  walletAddress: '0xA000000000000000000000000000000000000001',
  balanceWei: '0',
  hasChainBalance: true,
  isLoadingBalances: false,
})
const chainsStore = reactive({
  isLoaded: true,
  selectedChain: {
    type: 'EVM',
    chainID: '1',
    name: 'ETHEREUM',
    currencyName: 'ETH',
  },
  isEvmChain: true,
  isBitcoinChain: false,
})
const globalStore = reactive({
  gasPriceType: 'REGULAR',
  defaultGasPriceType: 'REGULAR',
})

vi.mock('@/stores/walletStore', () => ({ useWalletStore: () => walletStore }))
vi.mock('@/stores/chainsStore', () => ({ useChainsStore: () => chainsStore }))
vi.mock('@/stores/globalStore', () => ({ useGlobalStore: () => globalStore }))
vi.mock('@/stores/walletMenuStore', () => ({
  useWalletMenuStore: () => ({ openPanel: vi.fn() }),
}))
vi.mock('@/composables/useCurrency', () => ({
  useCurrency: () => ({ formatFiat: (v: unknown) => ({ display: `$${v}` }) }),
}))
vi.mock('@/composables/useFetchMewApi', () => ({
  useFetchMewApi: () => ({
    useMEWFetch: () => ({
      post: () => ({
        json: () => ({
          data: ref(null),
          onFetchResponse: vi.fn(),
          onFetchError: vi.fn(),
          execute: vi.fn(),
          isFetching: ref(false),
          aborted: ref(false),
        }),
      }),
    }),
  }),
}))
vi.mock('@/analytics', () => ({
  analytics: { trackClickTokenTradeEvent: vi.fn() },
  ClickTokenTradeEvent: { BUY: 'buy' },
}))
vi.mock('vue-i18n', () => ({ useI18n: () => ({ t: (k: string) => k }) }))
vi.mock('pinia', async importOriginal => {
  const actual = await importOriginal<typeof import('pinia')>()
  const { toRefs } = await import('vue')
  return {
    ...actual,
    storeToRefs: (store: Record<string, unknown>) => toRefs(store),
  }
})

import AppSelectTxFee from '@/components/AppSelectTxFee.vue'

const mountWithFees = (fees: unknown) =>
  mount(AppSelectTxFee, {
    props: { fees: fees as never, isLoadingFees: false },
    global: {
      stubs: { AppDialog: true, AppIcon: true },
      mocks: { $t: (k: string) => k },
    },
  })

describe('AppSelectTxFee', () => {
  // APP-MEW-WEB-16F: SwapOfferModal defaults swapGasFeeQuote to {} whenever the
  // swap has no gas quote yet, and hands that {} to AppSelectTxFee as `fees`.
  it('shows the loading state instead of crashing when fees has no fee tiers', () => {
    const wrapper = mountWithFees({})
    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
  })

  it('enables the fee button once fee tiers are present', () => {
    const tier = { nativeValue: '1000', fiatValue: '1', nativeSymbol: 'ETH' }
    const wrapper = mountWithFees({
      quoteId: 'q',
      fees: { ECONOMY: tier, REGULAR: tier, FAST: tier, FASTEST: tier },
    })
    expect(wrapper.find('button').attributes('disabled')).toBeUndefined()
  })
})
