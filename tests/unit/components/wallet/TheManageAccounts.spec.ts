// tests/unit/components/wallet/TheManageAccounts.spec.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'

// vi.hoisted runs before vi.mock factories are evaluated (hoisting safe)
const { mockSwitchTo, mockDeleteAccount, mockStartAdd, mockFetchFor, mockTrack } =
  vi.hoisted(() => ({
    mockSwitchTo: vi.fn(),
    mockDeleteAccount: vi.fn(),
    mockStartAdd: vi.fn(),
    mockFetchFor: vi.fn(() => Promise.resolve()),
    mockTrack: vi.fn(),
  }))

const active = {
  id: 'EVM:0xa',
  address: '0xA000000000000000000000000000000000000001',
  chainType: 'EVM',
  kind: 'signing',
  walletName: 'Ledger',
  icon: '',
  addedAt: 1,
}
const saved = [
  {
    id: 'EVM:0xb',
    address: '0xB000000000000000000000000000000000000002',
    chainType: 'EVM',
    kind: 'watchOnly',
    walletName: 'Watch',
    icon: '',
    addedAt: 2,
  },
]

vi.mock('@/stores/savedAccountsStore', () => ({
  useSavedAccountsStore: () => ({
    activeAccount: active,
    savedAccounts: saved,
    activeId: 'EVM:0xa',
  }),
}))

vi.mock('@/composables/useAccountSwitch', () => ({
  useAccountSwitch: () => ({
    switchTo: mockSwitchTo,
    deleteAccount: mockDeleteAccount,
  }),
}))

vi.mock('@/composables/useAddAccount', () => ({
  useAddAccount: () => ({ startAdd: mockStartAdd }),
}))

vi.mock('@/composables/useAccountBalances', () => ({
  useAccountBalances: () => ({
    balances: { value: {} },
    isLoading: { value: false },
    fetchFor: mockFetchFor,
  }),
}))

vi.mock('@/stores/walletStore', () => ({
  useWalletStore: () => ({
    disconnectWallet: vi.fn(),
    walletAddress: '0xA000000000000000000000000000000000000001',
  }),
}))

vi.mock('@/stores/chainsStore', () => ({
  useChainsStore: () => ({ selectedChain: { name: 'ETHEREUM', type: 'EVM' } }),
}))

vi.mock('@/analytics', () => ({
  analytics: { trackMultiAddressEvent: mockTrack },
}))

import TheManageAccounts from '@/components/core_layouts/wallet/TheManageAccounts.vue'
import { MultiAddressEvent } from '@/analytics/events'

const mountPopup = () =>
  mount(TheManageAccounts, {
    props: { openDialog: true },
    global: {
      stubs: {
        AppDialog: {
          template: '<div><slot name="title"/><slot name="content"/></div>',
        },
        TheCurrentNetwork: true,
        ThePaperWallet: true,
        AppBlockie: true,
      },
      mocks: { $t: (k: string) => k },
    },
  })

describe('TheManageAccounts', () => {
  beforeEach(() => {
    mockTrack.mockClear()
    mockSwitchTo.mockClear()
    mockDeleteAccount.mockClear()
    mockStartAdd.mockClear()
    mockFetchFor.mockClear()
  })

  it('renders the active account and the saved rows', () => {
    const w = mountPopup()
    expect(w.text()).toContain('Ledger')
    expect(w.findAllComponents({ name: 'ManageAccountsRow' }).length).toBe(2) // active + 1 saved
    expect(mockTrack).toHaveBeenCalledWith(MultiAddressEvent.OPENED)
  })

  it('starts the add flow from the Add button', async () => {
    const w = mountPopup()
    await w.find('[data-test="add-address"]').trigger('click')
    expect(mockStartAdd).toHaveBeenCalled()
  })

  it('switches when a saved row emits select', async () => {
    const w = mountPopup()
    const rows = w.findAllComponents({ name: 'ManageAccountsRow' })
    await rows[1].vm.$emit('select')
    expect(mockSwitchTo).toHaveBeenCalledWith(saved[0])
    expect(mockTrack).toHaveBeenCalledWith(MultiAddressEvent.SWITCHED)
  })

  it('deletes when a saved row emits delete and tracks the event', async () => {
    const w = mountPopup()
    const rows = w.findAllComponents({ name: 'ManageAccountsRow' })
    await rows[1].vm.$emit('delete')
    expect(mockDeleteAccount).toHaveBeenCalledWith(saved[0])
    expect(mockTrack).toHaveBeenCalledWith(MultiAddressEvent.DELETED)
  })
})
