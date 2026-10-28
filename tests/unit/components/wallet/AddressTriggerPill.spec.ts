import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { reactive } from 'vue'

const walletStore = reactive({
  walletAddress: '0xA000000000000000000000000000000000000001',
  isWatchOnly: false,
  isLoadingBalances: false,
  formattedTotalFiatPortfolioValue: '$130.23',
})

const watchOnlyStore = {
  activeAccount: { addressName: 'Address 1' },
}

const chainsStore = {
  selectedChain: { icon: 'https://example.com/eth.png', name: 'ETHEREUM' },
}

vi.mock('@/stores/walletStore', () => ({ useWalletStore: () => walletStore }))
vi.mock('@/stores/watchOnlyStore', () => ({
  useWatchOnlyStore: () => watchOnlyStore,
}))
vi.mock('@/stores/chainsStore', () => ({ useChainsStore: () => chainsStore }))

vi.mock('pinia', async importOriginal => {
  const actual = await importOriginal<typeof import('pinia')>()
  const { toRefs } = await import('vue')
  return {
    ...actual,
    storeToRefs: (store: Record<string, unknown>) => toRefs(store),
  }
})

import AddressTriggerPill from '@/components/core_layouts/wallet/AddressTriggerPill.vue'

const AppAddressSelector = {
  name: 'AppAddressSelector',
  props: [
    'address',
    'name',
    'balance',
    'loading',
    'connected',
    'networkIcon',
    'open',
  ],
  template: '<button />',
}

const factory = (props: Record<string, unknown> = {}) =>
  mount(AddressTriggerPill, {
    props,
    global: { stubs: { AppAddressSelector } },
  })

describe('AddressTriggerPill', () => {
  it('feeds the active account from the stores into the Address selector', () => {
    const selector = factory().findComponent({ name: 'AppAddressSelector' })
    expect(selector.props()).toMatchObject({
      address: '0xA000000000000000000000000000000000000001',
      name: 'Address 1',
      balance: '$130.23',
      loading: false,
      connected: true,
      networkIcon: 'https://example.com/eth.png',
      open: false,
    })
  })

  it('marks a watch-only account as not connected', () => {
    walletStore.isWatchOnly = true
    const selector = factory().findComponent({ name: 'AppAddressSelector' })
    expect(selector.props('connected')).toBe(false)
    walletStore.isWatchOnly = false
  })

  it('passes the loading and open states through', () => {
    walletStore.isLoadingBalances = true
    const selector = factory({ open: true }).findComponent({
      name: 'AppAddressSelector',
    })
    expect(selector.props('loading')).toBe(true)
    expect(selector.props('open')).toBe(true)
    walletStore.isLoadingBalances = false
  })
})
