import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'

const switchTo = vi.fn()
const deleteAccount = vi.fn()
const startAdd = vi.fn()
const connectSaved = vi.fn()
const fetchFor = vi.fn()
const refreshOne = vi.fn()
const renameAccount = vi.fn(() => ({ ok: true }))
const tryAddAddress = vi.fn(() => ({ added: true }))
const backfill = vi.fn()
const clearDetectedAddress = vi.fn()

const store = {
  activeAccount: { id: 'EVM:0x1', address: '0x1', addressName: 'Address 1', walletName: 'W', kind: 'signing', icon: '', chainType: 'EVM' },
  allAccounts: [
    { id: 'EVM:0x1', address: '0x1', addressName: 'Address 1', walletName: 'W', kind: 'signing', icon: '', chainType: 'EVM' },
    { id: 'EVM:0x2', address: '0x2', addressName: 'Address 2', walletName: 'W', kind: 'watchOnly', icon: '', chainType: 'EVM' },
  ],
  renameAccount, tryAddAddress, backfill,
  watchOnlyAddresses: { EVM: [], BITCOIN: [] },
}
const walletStore = { detectedAddress: ref<string | null>(null), totalFiatPortfolioValueBN: ref(130.23), tokens: ref([{}, {}]), isLoadingBalances: ref(false), setIsLoadingBalances: vi.fn(), refreshBalances: vi.fn(), walletAddress: '0xA000000000000000000000000000000000000001', isWatchOnly: false, formattedTotalFiatPortfolioValue: '$130.23', disconnectWallet: vi.fn(), clearDetectedAddress }

vi.mock('@/stores/watchOnlyStore', () => ({ useWatchOnlyStore: () => store }))
vi.mock('@/composables/useAccountSwitch', () => ({ useAccountSwitch: () => ({ switchTo, deleteAccount }) }))
vi.mock('@/composables/useAddAccount', () => ({ useAddAccount: () => ({ startAdd, connectSaved }) }))
vi.mock('@/composables/useAccountBalances', () => ({ useAccountBalances: () => ({ balances: ref({}), isLoading: ref(false), fetchFor, refreshOne, clear: vi.fn() }) }))
vi.mock('@/stores/walletStore', () => ({ useWalletStore: () => walletStore }))
vi.mock('@/stores/chainsStore', () => ({ useChainsStore: () => ({ selectedChain: { name: 'ETH', type: 'EVM', blockExplorerAddr: 'https://e/[[address]]' } }) }))
vi.mock('@/analytics', () => ({ analytics: { trackMultiAddressEvent: vi.fn() } }))
vi.mock('@/analytics/events', () => ({ MultiAddressEvent: { OPENED: 'o', SWITCHED: 's', ADD_STARTED: 'a', DELETED: 'd', RENAMED: 'r', DETECTED_SAVED: 'ds' } }))
vi.mock('vue-i18n', () => ({ useI18n: () => ({ t: (k: string) => k }) }))

import TheManageAccounts from '@/components/core_layouts/wallet/TheManageAccounts.vue'

const stubs = {
  Teleport: true,
  AddressTriggerPill: { name: 'AddressTriggerPill', template: '<button />' },
  TheCurrentNetwork: true, ThePaperWallet: true,
  ManageAccountsNetworkView: { name: 'ManageAccountsNetworkView', template: '<div />' },
  ManageAccountsRenameModal: {
    name: 'ManageAccountsRenameModal',
    props: ['isOpen', 'currentName'],
    template: '<div data-test="rename-modal" :data-open="isOpen" @click="$emit(\'save\', \'Renamed\')" />',
  },
  ManageAccountsCard: {
    name: 'ManageAccountsCard',
    props: ['account', 'balance'],
    template: '<div data-test="active-card" :data-id="account.id" @click="$emit(\'rename\')"><button data-test="card-disconnect" @click.stop="$emit(\'disconnect\')" /><button data-test="card-connect-btn" @click.stop="$emit(\'connect\')" /></div>',
  },
  ManageAccountsRow: {
    props: ['account', 'isActive'],
    template: '<div class="row" :data-id="account.id" :data-active="isActive" @click="$emit(\'rename\')"></div>',
  },
}
const factory = () =>
  mount(TheManageAccounts, { props: { openDialog: true, anchor: document.body }, global: { stubs, mocks: { $t: (k: string) => k } } })

beforeEach(() => { vi.clearAllMocks(); walletStore.detectedAddress.value = null })

describe('TheManageAccounts', () => {
  it('shows the no-address empty state (no card) when there is no active account', () => {
    const original = store.activeAccount
    store.activeAccount = null
    try {
      const w = factory()
      expect(w.find('[data-test="active-card"]').exists()).toBe(false)
      expect(w.find('[data-test="no-active-address"]').exists()).toBe(true)
    } finally {
      store.activeAccount = original
    }
  })

  it('renders the active-account card, all accounts as rows, and the count', () => {
    const w = factory()
    expect(w.find('[data-test="active-card"]').exists()).toBe(true)
    const rows = w.findAll('.row')
    expect(rows).toHaveLength(2)
    // active account is highlighted in the list too
    expect(rows[0].attributes('data-active')).toBe('true')
    expect(w.text()).toContain('2')
  })

  it('opens the rename modal on a card rename request and saving calls renameAccount', async () => {
    const w = factory()
    await w.get('[data-test="active-card"]').trigger('click') // emits rename → opens modal + closes popup
    expect(w.get('[data-test="rename-modal"]').attributes('data-open')).toBe('true')
    expect(w.emitted('update:openDialog')?.at(-1)).toEqual([false])
    await w.get('[data-test="rename-modal"]').trigger('click') // stub emits save
    expect(renameAccount).toHaveBeenCalled()
  })

  it('disconnects the wallet but keeps the popup open when the card emits disconnect', async () => {
    const w = factory()
    await w.get('[data-test="card-disconnect"]').trigger('click')
    expect(walletStore.disconnectWallet).toHaveBeenCalledTimes(1)
    // Popup stays open (no close emitted) so the user stays in the manage-accounts context.
    expect(w.emitted('update:openDialog')).toBeUndefined()
  })

  it('connects the saved address directly (skips the chooser) and closes when the card emits connect', async () => {
    const w = factory()
    await w.get('[data-test="card-connect-btn"]').trigger('click')
    expect(connectSaved).toHaveBeenCalledTimes(1)
    expect(startAdd).not.toHaveBeenCalled()
    expect(w.emitted('update:openDialog')?.at(-1)).toEqual([false])
  })

  it('backfills once on open', () => {
    factory()
    expect(backfill).toHaveBeenCalledTimes(1)
  })

  it('opens the rename modal on a row rename request and saving calls renameAccount', async () => {
    const w = factory()
    await w.findAll('.row')[0].trigger('click') // emits rename → opens modal
    expect(w.get('[data-test="rename-modal"]').attributes('data-open')).toBe('true')
    await w.get('[data-test="rename-modal"]').trigger('click') // stub emits save
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

  it('shows the extension guided prompt while a detected address is present', () => {
    walletStore.detectedAddress.value = '0x9a8b'
    const w = factory()
    expect(w.get('[data-test="detected-prompt"]').text()).toBeTruthy()
  })

  it('shows a duplicate message when the detected address is already saved', async () => {
    tryAddAddress.mockReturnValueOnce({ added: false, reason: 'duplicate' })
    walletStore.detectedAddress.value = '0x9a8b'
    const w = factory()
    await w.get('[data-test="save-detected"]').trigger('click')
    expect(w.get('[data-test="detected-message"]').text()).toBeTruthy()
    expect(clearDetectedAddress).not.toHaveBeenCalled() // keep the surface so the user can pick another
  })

  it('slides to the network view when the network row is clicked', async () => {
    const w = factory()
    await w.get('[data-test="network-row"]').trigger('click')
    expect(w.findComponent({ name: 'ManageAccountsNetworkView' }).exists()).toBe(true)
  })

  it('only fetches balances for accounts whose chain type matches the selected network', () => {
    const original = store.allAccounts
    store.allAccounts = [
      { id: 'EVM:0x1', address: '0x1', addressName: 'A1', walletName: 'W', kind: 'signing', icon: '', chainType: 'EVM' },
      { id: 'BITCOIN:bc1', address: 'bc1', addressName: 'B1', walletName: 'W', kind: 'watchOnly', icon: '', chainType: 'BITCOIN' },
    ]
    try {
      factory()
      const entries = fetchFor.mock.calls.at(-1)?.[0] as Array<{ address: string }>
      expect(entries.map(e => e.address)).toEqual(['0x1']) // BITCOIN address skipped on EVM chain
    } finally {
      store.allAccounts = original
    }
  })
})
