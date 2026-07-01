// tests/unit/components/wallet/TheAddressMenu.spec.ts
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

const walletStoreMock = {
  isWalletConnected: true,
  walletAddress: '0xA000000000000000000000000000000000000001',
  isWatchOnly: false,
}

vi.mock('@/stores/walletStore', () => ({
  useWalletStore: () => walletStoreMock,
}))

// Mock pinia's storeToRefs so plain-object mocks work in templates
vi.mock('pinia', async (importOriginal) => {
  const actual = await importOriginal<typeof import('pinia')>()
  const { ref } = await import('vue')
  return {
    ...actual,
    storeToRefs: (store: Record<string, unknown>) => {
      const result: Record<string, ReturnType<typeof ref>> = {}
      for (const key of Object.keys(store)) {
        result[key] = ref(store[key])
      }
      return result
    },
  }
})

vi.mock('@/composables/useAppBreakpoints', () => ({ useAppBreakpoints: () => ({ isXS: false }) }))

// Cut the walletConfigs → @enkryptcom/hw-wallets → ledger module chain
vi.mock('@/modules/access/common/walletConfigs', () => ({
  WalletConfigType: {
    MOBILE: 'mobile',
    HARDWARE: 'hardware',
    SOFTWARE: 'software',
    DESKTOP: 'desktop',
    EXTENSION: 'extension',
    MOCK: 'mock',
  },
  walletConfigs: {},
  ACCESS_WALLET_VIEWS: [],
  defaultWalletId: '',
}))

vi.mock('@/stores/watchOnlyStore', () => ({
  useWatchOnlyStore: () => ({
    activeAccount: null,
    savedAccounts: [],
    activeId: null,
    backfill: vi.fn(),
    watchOnlyAddresses: { EVM: [], BITCOIN: [] },
  }),
}))

// Mocks for TheManageAccounts deep dependency chain (pulled in via static import)
vi.mock('@/composables/useAccountSwitch', () => ({
  useAccountSwitch: () => ({ switchTo: vi.fn(), deleteAccount: vi.fn() }),
}))
vi.mock('@/composables/useAddAccount', () => ({
  useAddAccount: () => ({ startAdd: vi.fn() }),
}))
vi.mock('@/composables/useAccountBalances', () => ({
  useAccountBalances: () => ({ balances: { value: {} }, isLoading: { value: false }, fetchFor: vi.fn() }),
}))
vi.mock('@/stores/chainsStore', () => ({
  useChainsStore: () => ({ selectedChain: { name: 'ETHEREUM', type: 'EVM' } }),
}))
vi.mock('@/analytics', () => ({
  analytics: { trackMultiAddressEvent: vi.fn() },
}))
vi.mock('@/analytics/events', () => ({
  MultiAddressEvent: { OPENED: 'OPENED', SWITCHED: 'SWITCHED', DELETED: 'DELETED', ADD_STARTED: 'ADD_STARTED' },
}))

import TheAddressMenu from '@/components/core_layouts/wallet/TheAddressMenu.vue'

describe('TheAddressMenu', () => {
  it('opens TheManageAccounts (not the old dialog) on click', async () => {
    const w = mount(TheAddressMenu, {
      global: {
        stubs: {
          AppBlockie: true,
          IconWatchOnly: true,
          ChevronDownIcon: true,
          TheManageAccounts: {
            name: 'TheManageAccounts',
            template: '<div data-test="manage-accounts" />',
            props: ['openDialog'],
          },
        },
        mocks: {
          $t: (k: string) => k,
        },
      },
    })
    expect(w.findComponent({ name: 'TheManageAccounts' }).exists()).toBe(true)
    await w.find('button').trigger('click')
    expect(w.findComponent({ name: 'TheManageAccounts' }).props('openDialog')).toBe(true)
  })

  it('emits openChange when the popup open-state changes', async () => {
    const w = mount(TheAddressMenu, {
      global: {
        stubs: {
          AppBlockie: true,
          IconWatchOnly: true,
          ChevronDownIcon: true,
          TheManageAccounts: {
            name: 'TheManageAccounts',
            template: '<div data-test="manage-accounts" />',
            props: ['openDialog'],
          },
        },
        mocks: {
          $t: (k: string) => k,
        },
      },
    })
    await w.find('button').trigger('click')
    expect(w.emitted('openChange')?.at(-1)).toEqual([true])
  })
})
