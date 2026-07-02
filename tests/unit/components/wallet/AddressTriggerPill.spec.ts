import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

const walletStore = {
  walletAddress: '0xA000000000000000000000000000000000000001',
  isWatchOnly: false,
  formattedTotalFiatPortfolioValue: '$130.23',
}

const watchOnlyStore = {
  activeAccount: { addressName: 'Address 1' },
}

const chainsStore = {
  selectedChain: { icon: 'https://example.com/eth.png', name: 'ETHEREUM' },
}

vi.mock('@/stores/walletStore', () => ({ useWalletStore: () => walletStore }))
vi.mock('@/stores/watchOnlyStore', () => ({ useWatchOnlyStore: () => watchOnlyStore }))
vi.mock('@/stores/chainsStore', () => ({ useChainsStore: () => chainsStore }))

vi.mock('pinia', async (importOriginal) => {
  const actual = await importOriginal<typeof import('pinia')>()
  const { ref } = await import('vue')
  return {
    ...actual,
    storeToRefs: (store: Record<string, unknown>) => {
      const result: Record<string, ReturnType<typeof ref>> = {}
      for (const key of Object.keys(store)) result[key] = ref(store[key])
      return result
    },
  }
})

import AddressTriggerPill from '@/components/core_layouts/wallet/AddressTriggerPill.vue'

const factory = () =>
  mount(AddressTriggerPill, {
    global: {
      stubs: { AppBlockie: true, EyeIcon: true, ChevronDownIcon: true },
    },
  })

describe('AddressTriggerPill', () => {
  it('renders the formatted balance and the account name', () => {
    const w = factory()
    expect(w.text()).toContain('$130.23')
    expect(w.text()).toContain('Address 1')
  })

  it('renders the active-network icon badge when selectedChain has an icon', () => {
    const w = factory()
    expect(w.find('img[src="https://example.com/eth.png"]').exists()).toBe(true)
  })

  it('shows the watch-only eye instead of the green dot when watch-only', () => {
    walletStore.isWatchOnly = true
    const w = factory()
    expect(w.find('[data-test="pill-watch-only"]').exists()).toBe(true)
    expect(w.find('[data-test="pill-connected"]').exists()).toBe(false)
    walletStore.isWatchOnly = false
  })
})
