import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'

const switchTo = vi.fn()
const deleteAccount = vi.fn()
const startAdd = vi.fn()
const fetchFor = vi.fn()
const refreshOne = vi.fn()
const renameAccount = vi.fn(() => ({ ok: true }))
const tryAddAddress = vi.fn(() => ({ added: true }))
const backfill = vi.fn()
const clearDetectedAddress = vi.fn()

const store = {
  activeAccount: { id: 'EVM:0x1', address: '0x1', addressName: 'Address 1', walletName: 'W', kind: 'signing', icon: '', chainType: 'EVM' },
  savedAccounts: [{ id: 'EVM:0x2', address: '0x2', addressName: 'Address 2', walletName: 'W', kind: 'watchOnly', icon: '', chainType: 'EVM' }],
  renameAccount, tryAddAddress, backfill,
  watchOnlyAddresses: { EVM: [], BITCOIN: [] },
}
const walletStore = { detectedAddress: ref<string | null>(null), disconnectWallet: vi.fn(), clearDetectedAddress }

vi.mock('@/stores/watchOnlyStore', () => ({ useWatchOnlyStore: () => store }))
vi.mock('@/composables/useAccountSwitch', () => ({ useAccountSwitch: () => ({ switchTo, deleteAccount }) }))
vi.mock('@/composables/useAddAccount', () => ({ useAddAccount: () => ({ startAdd }) }))
vi.mock('@/composables/useAccountBalances', () => ({ useAccountBalances: () => ({ balances: ref({}), fetchFor, refreshOne }) }))
vi.mock('@/stores/walletStore', () => ({ useWalletStore: () => walletStore }))
vi.mock('@/stores/chainsStore', () => ({ useChainsStore: () => ({ selectedChain: { name: 'ETH', type: 'EVM', blockExplorerAddr: 'https://e/[[address]]' } }) }))
vi.mock('@/analytics', () => ({ analytics: { trackMultiAddressEvent: vi.fn() } }))
vi.mock('@/analytics/events', () => ({ MultiAddressEvent: { OPENED: 'o', SWITCHED: 's', ADD_STARTED: 'a', DELETED: 'd', RENAMED: 'r', DETECTED_SAVED: 'ds' } }))

import TheManageAccounts from '@/components/core_layouts/wallet/TheManageAccounts.vue'

const stubs = {
  AppDialog: { template: '<div><slot name="content" /></div>' },
  TheCurrentNetwork: true, ThePaperWallet: true,
  ManageAccountsRow: {
    props: ['account', 'isActive'],
    template: '<div class="row" :data-id="account.id" @click="$emit(\'rename\', \'New\')"></div>',
  },
}
const factory = () =>
  mount(TheManageAccounts, { props: { openDialog: true }, global: { stubs, mocks: { $t: (k: string) => k } } })

beforeEach(() => { vi.clearAllMocks(); walletStore.detectedAddress.value = null })

describe('TheManageAccounts', () => {
  it('renders active + saved rows and the count', () => {
    const w = factory()
    expect(w.findAll('.row')).toHaveLength(2)
    expect(w.text()).toContain('2')
  })

  it('backfills once on open', () => {
    factory()
    expect(backfill).toHaveBeenCalledTimes(1)
  })

  it('routes a row rename to renameAccount', async () => {
    const w = factory()
    await w.findAll('.row')[0].trigger('click')
    expect(renameAccount).toHaveBeenCalled()
  })

  it('shows the detected-address footer and saves only (no switch)', async () => {
    walletStore.detectedAddress.value = '0x9a8b'
    const w = factory()
    await w.get('[data-test="save-detected"]').trigger('click')
    expect(tryAddAddress).toHaveBeenCalled()
    expect(switchTo).not.toHaveBeenCalled()
  })

  it('hides the detected footer when there is no detected address', () => {
    expect(factory().find('[data-test="save-detected"]').exists()).toBe(false)
  })
})
