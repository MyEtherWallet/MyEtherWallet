import { describe, it, expect, vi } from 'vitest'

// The perps modules pull the wallet configs, which load Ledger.
vi.mock('@/modules/access/common/walletConfigs', () => ({
  WalletConfigType: {},
}))
import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import i18n from '@/i18n'
import PerpsSelectMarketDialog from '@/modules/perps/components/PerpsSelectMarketDialog.vue'
import AppSegmentedControl from '@/components/segmented_control/AppSegmentedControl.vue'
import type { TokenSelectorItem } from '@/components/token_selector/types'
import type { Contract } from '@/modules/perps/sdk/types'

// Renders only the slot, so the test reads what the dialog hands the modal.
const ModalStub = defineComponent({
  name: 'AppTokenSelectorModal',
  props: [
    'modelValue',
    'search',
    'title',
    'items',
    'selectedId',
    'sortOptions',
    'sortValue',
    'sortDirection',
  ],
  emits: ['update:modelValue', 'update:search', 'sort', 'select'],
  template: '<div><slot name="before-list" /></div>',
})

const contract = (baseCurrency: string, extra: Partial<Contract> = {}) =>
  ({
    market: `${baseCurrency}-USD`,
    baseCurrency,
    lastPrice: '100',
    priceChangePercent: '-2.21',
    ...extra,
  }) as unknown as Contract

const ETH = contract('ETH')
const BTC = contract('BTC', { priceChangePercent: undefined })

const mountDialog = () =>
  mount(PerpsSelectMarketDialog, {
    props: {
      isOpen: true,
      contracts: [ETH, BTC],
      filterTabs: [
        { value: 'all', label: 'All' },
        { value: 'Crypto', label: 'Crypto' },
      ],
      activeFilter: 'all',
      search: '',
      sortValue: 'volume',
      sortDirection: 'desc',
      sortOptions: [
        { value: 'name', label: 'Name', numeric: false },
        { value: 'volume', label: 'Volume', numeric: true },
      ],
      selectedMarketName: 'ETH-USD',
      getMarketDisplayName: (c: Contract) => `${c.baseCurrency} Perp`,
    },
    global: {
      plugins: [i18n],
      stubs: { AppTokenSelectorModal: ModalStub },
    },
  })

describe('PerpsSelectMarketDialog', () => {
  it('hands the modal one row per market with price and 24h change', () => {
    const modal = mountDialog().getComponent(ModalStub)
    const items = modal.props('items') as TokenSelectorItem<Contract>[]
    expect(items.map(i => [i.id, i.symbol, i.name])).toEqual([
      ['ETH-USD', 'ETH', 'ETH Perp'],
      ['BTC-USD', 'BTC', 'BTC Perp'],
    ])
    expect(items[0].rightAccessory).toMatchObject({
      kind: 'balance-performance',
      change: -2.21,
    })
    // No change from the API: the price alone.
    expect(items[1].rightAccessory?.kind).toBe('balance')
    expect(modal.props('selectedId')).toBe('ETH-USD')
    expect(modal.props('title')).toBe('Select perps market')
  })

  it('forwards sort, search and the picked market', () => {
    const wrapper = mountDialog()
    const modal = wrapper.getComponent(ModalStub)
    modal.vm.$emit('sort', 'name')
    modal.vm.$emit('update:search', 'et')
    const [item] = modal.props('items') as TokenSelectorItem<Contract>[]
    modal.vm.$emit('select', item)
    expect(wrapper.emitted('setSort')).toEqual([['name']])
    expect(wrapper.emitted('update:search')).toEqual([['et']])
    expect(wrapper.emitted('select')).toEqual([[ETH]])
  })

  it('keeps the category filter above the list', async () => {
    const wrapper = mountDialog()
    const filter = wrapper.getComponent(AppSegmentedControl)
    filter.vm.$emit('update:modelValue', 'Crypto')
    expect(wrapper.emitted('update:activeFilter')).toEqual([['Crypto']])
  })
})
