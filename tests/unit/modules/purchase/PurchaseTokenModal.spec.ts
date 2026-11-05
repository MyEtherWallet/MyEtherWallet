import { describe, it, expect, beforeEach, vi } from 'vitest'

// The real stores pull walletStore (Ledger); the modal only reads these fields.
vi.mock('@/stores/chainsStore', async () => {
  const { defineStore } = await vi.importActual<typeof import('pinia')>('pinia')
  const { ref } = await vi.importActual<typeof import('vue')>('vue')
  return {
    useChainsStore: defineStore('chains', () => ({
      chains: ref([{ name: 'POLYGON', currencyName: 'POL' }]),
      getChainIcon: (name: string) => `chain-${name}.svg`,
    })),
  }
})
vi.mock('@/stores/purchaseStore', async () => {
  const { defineStore } = await vi.importActual<typeof import('pinia')>('pinia')
  const { ref } = await vi.importActual<typeof import('vue')>('vue')
  return {
    usePurchaseStore: defineStore('purchase', () => ({
      coinImages: ref(new Map<string, string>()),
    })),
  }
})
vi.mock('@/composables/useCurrency', () => ({
  useCurrency: () => ({
    formatFiat: (value: string) => ({ display: `$${value}` }),
  }),
}))

import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import i18n from '@/i18n'
import PurchaseTokenModal from '@/modules/purchase/components/PurchaseTokenModal.vue'
import AppTokenSelectorModal from '@/components/token_selector/AppTokenSelectorModal.vue'
import { useRecentlyViewedTokensStore } from '@/stores/recentlyViewedTokensStore'
import type { TokenSelectorItem } from '@/components/token_selector/types'
import type { BuyNetwork } from '@/stores/purchaseStore'
import type { PurchaseAsset } from '@/types/buyToken'

const asset = (
  chain: string,
  symbol: string,
  extra: Partial<PurchaseAsset> = {},
): PurchaseAsset => ({
  chain,
  symbol,
  name: `${symbol} on ${chain}`,
  coingecko_id: symbol.toLowerCase(),
  contract_address: `0x${symbol}`,
  providers: [],
  is_sell_supported: true,
  ...extra,
})

const ETH_USDC = asset('ETH', 'USDC', {
  market_data: {
    price: '1.0001',
    price_change_percentage_24h: '-0.02',
  } as PurchaseAsset['market_data'],
})
const ETH_ETH = asset('ETH', 'ETH')
const POL_POL = asset('POL', 'POL')
const BTC_BTC = asset('BTC', 'BTC')

const NETWORKS: BuyNetwork[] = [
  { chain: 'ETH', name: 'Ethereum', tokens: [ETH_USDC, ETH_ETH] },
  { chain: 'POL', name: 'Polygon', tokens: [POL_POL] },
  { chain: 'BTC', name: 'Bitcoin', tokens: [BTC_BTC] },
]

const mountModal = async (props: Record<string, unknown> = {}) => {
  const pinia = createPinia()
  setActivePinia(pinia)
  const wrapper = mount(PurchaseTokenModal, {
    props: {
      isOpen: false,
      side: 'buy',
      networks: NETWORKS,
      defaultChainCode: 'ETH',
      selectedToken: ETH_ETH,
      compatibleChains: ['ETH', 'POL'],
      incompatibleChains: ['BTC'],
      ...props,
    },
    global: {
      plugins: [pinia, i18n],
      stubs: { AppTokenSelectorModal: true },
    },
  })
  // The network filter resets on open.
  await wrapper.setProps({ isOpen: true })
  return wrapper
}

const ids = (items: TokenSelectorItem[]) => items.map(item => item.id)

describe('PurchaseTokenModal', () => {
  beforeEach(() => localStorage.clear())

  it('titles the modal by side, as in Figma', async () => {
    const title = async (side: string) =>
      (await mountModal({ side }))
        .findComponent(AppTokenSelectorModal)
        .props('title')
    expect(await title('buy')).toBe('Select asset to buy')
    expect(await title('sell')).toBe('Select asset to sell')
  })

  it('lists all networks, the compatible ones, then the incompatible ones disabled', async () => {
    const wrapper = await mountModal()
    const modal = wrapper.findComponent(AppTokenSelectorModal)

    expect(modal.props('networks')).toEqual([
      { value: null, name: 'All networks' },
      { value: 'ETH', name: 'Ethereum', icon: 'chain-ETHEREUM.svg' },
      { value: 'POL', name: 'Polygon', icon: 'chain-POLYGON.svg' },
      {
        value: 'BTC',
        name: 'Bitcoin',
        icon: 'chain-BITCOIN.svg',
        disabled: true,
      },
    ])
    expect(modal.props('network')).toBe('ETH')
  })

  it('maps the default network tokens to rows with price and 24h change', async () => {
    const modal = (await mountModal()).findComponent(AppTokenSelectorModal)
    const items = modal.props('items') as TokenSelectorItem[]

    expect(ids(items)).toEqual(['ETH:USDC', 'ETH:ETH'])
    expect(items[0]).toMatchObject({
      symbol: 'USDC',
      name: 'USDC on ETH',
      chainIcon: 'chain-ETHEREUM.svg',
      rightAccessory: {
        kind: 'balance-performance',
        primary: '$1.0001',
        change: -0.02,
      },
      raw: ETH_USDC,
    })
    // No market data, no right column.
    expect(items[1].rightAccessory).toBeUndefined()
    expect(modal.props('selectedId')).toBe('ETH:ETH')
    expect(modal.props('quickPicks')).toEqual([])
  })

  it('filters by network and search, never showing incompatible chains', async () => {
    const wrapper = await mountModal()
    const modal = wrapper.findComponent(AppTokenSelectorModal)

    await modal.vm.$emit('update:network', null)
    expect(ids(modal.props('items') as TokenSelectorItem[])).toEqual([
      'ETH:USDC',
      'ETH:ETH',
      'POL:POL',
    ])

    await modal.vm.$emit('update:network', 'POL')
    expect(ids(modal.props('items') as TokenSelectorItem[])).toEqual([
      'POL:POL',
    ])

    await modal.vm.$emit('update:network', null)
    await modal.vm.$emit('update:search', 'usdc on')
    expect(ids(modal.props('items') as TokenSelectorItem[])).toEqual([
      'ETH:USDC',
    ])
  })

  it('falls back to all networks when the default chain is not compatible', async () => {
    const modal = (await mountModal({ defaultChainCode: 'BTC' })).findComponent(
      AppTokenSelectorModal,
    )
    expect(modal.props('network')).toBeNull()
  })

  it('shows recently viewed tokens by coingecko id', async () => {
    const wrapper = await mountModal()
    useRecentlyViewedTokensStore().addToken({
      id: 'usdc',
      symbol: 'USDC',
      name: 'USD Coin',
    })
    await wrapper.vm.$nextTick()

    const modal = wrapper.findComponent(AppTokenSelectorModal)
    expect(ids(modal.props('recentItems') as TokenSelectorItem[])).toEqual([
      'ETH:USDC',
    ])
  })

  it('emits update:selected with the picked token', async () => {
    const wrapper = await mountModal()
    const modal = wrapper.findComponent(AppTokenSelectorModal)
    const [usdc] = modal.props('items') as TokenSelectorItem[]

    await modal.vm.$emit('select', usdc)
    expect(wrapper.emitted('update:selected')).toEqual([[ETH_USDC]])
  })
})
