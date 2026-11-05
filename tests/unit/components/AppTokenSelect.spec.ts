import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { reactive } from 'vue'
import i18n from '@/i18n'
import type { TokenBalance } from '@/mew_api/types'

const MAIN = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
const USDC_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'

const token = (extra: Partial<TokenBalance>): TokenBalance => ({
  contract: '0x0',
  balance: '0',
  balanceWei: '0',
  name: 'Token',
  symbol: 'TKN',
  ...extra,
})

const ETH = token({
  contract: MAIN,
  symbol: 'ETH',
  name: 'Ether',
  balance: '2',
  price: 2000,
  coinId: 'ethereum',
  price_change_percentage_24h: 1.5,
})
const USDC = token({
  contract: USDC_ADDRESS,
  symbol: 'USDC',
  name: 'USD Coin',
  balance: '100',
  price: 1,
  coinId: 'usd-coin',
})
// No holding: the row falls back to price + 24h.
const WBTC = token({
  contract: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
  symbol: 'WBTC',
  name: 'Wrapped Bitcoin',
  balance: '0',
  price: 60000,
  price_change_percentage_24h: -2,
})
const SPAM = token({ contract: '0x5', symbol: 'SPAM', name: 'Spam' })
const AAPL = token({
  contract: '0x6',
  symbol: 'AAPLon',
  name: 'Apple Ondo Tokenized',
  balance: '1',
  price: 200,
  ondo: {
    stockAlias: 'Apple',
    primaryMarket: { symbol: 'AAPLon' },
    underlyingMarket: {},
  },
})

const walletStore = reactive({
  isLoadingBalances: false,
  tokens: [] as TokenBalance[],
  safeMainTokenBalance: ETH as TokenBalance | null,
  getTokenBalance: (contract: string) =>
    [ETH, ...walletStore.tokens].find(
      t => t.contract.toLowerCase() === contract.toLowerCase(),
    ) ?? null,
})
const chainsStore = reactive({
  isLoaded: true,
  selectedChain: { name: 'ETHEREUM', icon: 'eth-chain.svg' },
})
const recentStore = reactive({
  recentlyViewedCrypto: [] as { id: string }[],
})

vi.mock('@/stores/walletStore', () => ({
  useWalletStore: () => walletStore,
  MAIN_TOKEN_CONTRACT: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
}))
vi.mock('@/stores/chainsStore', () => ({ useChainsStore: () => chainsStore }))
vi.mock('@/stores/recentlyViewedTokensStore', () => ({
  useRecentlyViewedTokensStore: () => recentStore,
}))
vi.mock('@/composables/useCurrency', () => ({
  useCurrency: () => ({ formatFiat: (v: unknown) => ({ display: `$${v}` }) }),
}))
vi.mock('pinia', async importOriginal => {
  const actual = await importOriginal<typeof import('pinia')>()
  const { toRefs } = await import('vue')
  return {
    ...actual,
    storeToRefs: (store: Record<string, unknown>) => toRefs(store),
  }
})

import AppTokenSelect from '@/components/AppTokenSelect.vue'
import AppTokenSelectorModal from '@/components/token_selector/AppTokenSelectorModal.vue'
import type { TokenSelectorItem } from '@/components/token_selector/types'

const mountSelect = (selectedTokenContract?: string) => {
  // The mount-time auto-select emits before `wrapper` is assigned.
  let wrapper: VueWrapper | undefined = undefined
  wrapper = mount(AppTokenSelect, {
    props: {
      selectedTokenContract,
      'onUpdate:selectedTokenContract': (v: string) =>
        wrapper?.setProps({ selectedTokenContract: v }),
    } as never,
    global: {
      plugins: [i18n],
      stubs: { AppPicker: true, AppTokenSelectorModal: true },
    },
  })
  return wrapper as VueWrapper
}

const modalOf = (wrapper: ReturnType<typeof mountSelect>) =>
  wrapper.findComponent(AppTokenSelectorModal)
const items = (wrapper: ReturnType<typeof mountSelect>) =>
  modalOf(wrapper).props('items') as TokenSelectorItem<TokenBalance>[]
const symbols = (list: TokenSelectorItem[]) => list.map(i => i.symbol)

beforeEach(() => {
  walletStore.tokens = [USDC, WBTC, SPAM, AAPL]
  walletStore.safeMainTokenBalance = ETH
  recentStore.recentlyViewedCrypto = []
})

describe('AppTokenSelect', () => {
  it('auto-selects the native token on mount', () => {
    const wrapper = mountSelect()
    expect(wrapper.emitted('update:selectedTokenContract')).toEqual([[MAIN]])
  })

  it('maps tokens to rows: holding, else price + 24h', () => {
    const wrapper = mountSelect(MAIN)
    const byId = Object.fromEntries(items(wrapper).map(i => [i.id, i]))

    expect(byId[MAIN].rightAccessory).toEqual({
      kind: 'balance',
      primary: '$4000',
      secondary: '2 ETH',
    })
    expect(byId[WBTC.contract].rightAccessory).toEqual({
      kind: 'balance-performance',
      primary: '$60000',
      change: -2,
    })
    expect(byId['0x5'].rightAccessory).toBeUndefined()

    // ids are lowercased so the selection matches regardless of case.
    const usdc = byId[USDC_ADDRESS.toLowerCase()]
    expect(usdc).toMatchObject({ symbol: 'USDC', name: 'USD Coin' })
    expect(byId['0x6']).toMatchObject({ isStock: true, name: 'Apple' })

    const modal = modalOf(wrapper)
    expect(modal.props('networkIcon')).toBe('eth-chain.svg')
    expect(modal.props('selectedId')).toBe(MAIN)
    expect(modal.props('networks')).toEqual([])
  })

  it('builds quick picks with the chain native symbol', () => {
    const wrapper = mountSelect(MAIN)
    expect(symbols(modalOf(wrapper).props('quickPicks'))).toEqual([
      'USDC',
      'WBTC',
      'ETH',
    ])
  })

  it('shows recently viewed tokens matched by CoinGecko id or contract', () => {
    recentStore.recentlyViewedCrypto = [
      { id: 'usd-coin' },
      { id: 'bitcoin' },
      { id: WBTC.contract.toUpperCase() },
      { id: USDC_ADDRESS },
    ]
    const wrapper = mountSelect(MAIN)
    expect(symbols(modalOf(wrapper).props('recentItems'))).toEqual([
      'USDC',
      'WBTC',
    ])
  })

  it('sorts by USD balance desc and toggles the direction on a repeat pick', async () => {
    const wrapper = mountSelect(MAIN)
    const modal = modalOf(wrapper)
    expect(modal.props('sortValue')).toBe('USD Balance')
    expect(modal.props('sortDirection')).toBe('desc')
    expect(symbols(items(wrapper)).slice(0, 3)).toEqual([
      'ETH',
      'AAPLon',
      'USDC',
    ])

    modal.vm.$emit('sort', 'USD Balance')
    await wrapper.vm.$nextTick()
    expect(modal.props('sortDirection')).toBe('asc')

    modal.vm.$emit('sort', 'Symbol')
    await wrapper.vm.$nextTick()
    expect(modal.props('sortValue')).toBe('Symbol')
    expect(modal.props('sortDirection')).toBe('asc')
    // sortObjectArrayString treats "asc" as Z-A (unchanged behaviour).
    expect(symbols(items(wrapper))).toEqual([
      'WBTC',
      'USDC',
      'SPAM',
      'ETH',
      'AAPLon',
    ])
  })

  it('fuzzy-searches on name and symbol', async () => {
    const wrapper = mountSelect(MAIN)
    modalOf(wrapper).vm.$emit('update:search', 'wrapped')
    await wrapper.vm.$nextTick()
    expect(symbols(items(wrapper))).toEqual(['WBTC'])
  })

  it('emits the picked contract and reports the open state', async () => {
    const wrapper = mountSelect(MAIN)
    const modal = modalOf(wrapper)
    modal.vm.$emit('update:modelValue', true)
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('open:selectToken')).toEqual([[true]])

    const usdc = items(wrapper).find(i => i.symbol === 'USDC')!
    modal.vm.$emit('select', usdc)
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:selectedTokenContract')!.at(-1)).toEqual([
      USDC_ADDRESS,
    ])
    expect(modal.props('selectedId')).toBe(USDC_ADDRESS.toLowerCase())
  })
})
