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

const mountWithFees = (fees: unknown, extra: Record<string, unknown> = {}) =>
  mount(AppSelectTxFee, {
    props: { fees: fees as never, isLoadingFees: false, ...extra },
    attachTo: document.body,
    global: {
      stubs: { AppModal: true, AppIcon: true },
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

  describe('dropdown', () => {
    const tier = (fiat: string) => ({
      nativeValue: '1000',
      fiatValue: fiat,
      nativeSymbol: 'ETH',
    })
    const fees = {
      quoteId: 'q',
      fees: {
        ECONOMY: tier('1'),
        REGULAR: tier('2'),
        FAST: tier('3'),
        FASTEST: tier('4'),
      },
    }

    it('shows the selected fee and its tier tag on the trigger', () => {
      const wrapper = mountWithFees(fees, { dropdown: true })
      const trigger = wrapper.get('[data-testid="dropdown-trigger"]')
      expect(trigger.attributes('disabled')).toBeUndefined()
      expect(trigger.text()).toContain('$2')
      expect(trigger.text()).toContain('select_fee.regular.title')
    })

    it('lists every tier and picks the clicked one', async () => {
      globalStore.gasPriceType = 'REGULAR'
      const wrapper = mountWithFees(fees, { dropdown: true })
      await wrapper.get('[data-testid="dropdown-trigger"]').trigger('click')
      const rows = wrapper.findAll('[role="option"]')
      expect(rows).toHaveLength(4)
      await rows[0].trigger('click')
      expect(globalStore.gasPriceType).toBe('ECONOMY')
      expect(wrapper.find('[role="option"]').exists()).toBe(false)
    })

    it('keeps the picked fee on mount when resetToDefault is off', () => {
      globalStore.gasPriceType = 'FAST'
      globalStore.defaultGasPriceType = 'REGULAR'
      mountWithFees(fees, { dropdown: true, resetToDefault: false })
      expect(globalStore.gasPriceType).toBe('FAST')
      mountWithFees(fees, { dropdown: true })
      expect(globalStore.gasPriceType).toBe('REGULAR')
    })

    it('stays disabled while there are no fee tiers', () => {
      const wrapper = mountWithFees({}, { dropdown: true })
      expect(
        wrapper.get('[data-testid="dropdown-trigger"]').attributes('disabled'),
      ).toBeDefined()
    })
  })
})
