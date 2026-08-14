import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'

const switchTo = vi.fn()
const deleteAccount = vi.fn()
const startAdd = vi.fn()
const connectSaved = vi.fn()
const fetchIfStale = vi.fn()
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
  connectionOrder: [] as string[],
}
const walletStore = { detectedAddress: ref<string | null>(null), walletName: ref('MetaMask'), totalFiatPortfolioValueBN: ref(130.23), tokens: ref([{}, {}]), isLoadingBalances: ref(false), setIsLoadingBalances: vi.fn(), refreshBalances: vi.fn(), walletAddress: ref('0xA000000000000000000000000000000000000001'), isWatchOnly: false, isWalletConnected: false, formattedTotalFiatPortfolioValue: '$130.23', disconnectWallet: vi.fn(), clearDetectedAddress }

vi.mock('@/stores/watchOnlyStore', () => ({ useWatchOnlyStore: () => store }))
vi.mock('@/composables/useAccountSwitch', () => ({ useAccountSwitch: () => ({ switchTo, deleteAccount }) }))
vi.mock('@/composables/useAddAccount', () => ({ useAddAccount: () => ({ startAdd, connectSaved }) }))
vi.mock('@/composables/useAccountBalances', () => ({ useAccountBalances: () => ({ cached: vi.fn(() => undefined), loadingFor: vi.fn(() => false), fetchIfStale, refreshOne, set: vi.fn() }) }))
vi.mock('@/stores/walletStore', () => ({ useWalletStore: () => walletStore }))
vi.mock('@/stores/providerStore', () => ({ useProviderStore: () => ({ providers: [] }) }))
vi.mock('@/stores/accessStore', () => ({ useAccessStore: () => ({ connectAddressInfo: ref(null), closeAccessDialog: vi.fn(), clearConnectAddressInfo: vi.fn() }) }))
// Mock the module to cut the useConnectWallet → wagmi/ledger import chain.
vi.mock('@/components/core_layouts/wallet/ManageAccountsConnectAddressView.vue', () => ({ default: { name: 'ManageAccountsConnectAddressView', template: '<div />' } }))
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
  ManageAccountsConnectAddressView: { name: 'ManageAccountsConnectAddressView', template: '<div />' },
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
    name: 'ManageAccountsRow',
    props: ['account', 'isActive', 'balance', 'balanceLoading', 'scrollRoot'],
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

  it('connects the saved address directly (skips the chooser) and keeps the popup open', async () => {
    const w = factory()
    await w.get('[data-test="card-connect-btn"]').trigger('click')
    expect(connectSaved).toHaveBeenCalledTimes(1)
    expect(startAdd).not.toHaveBeenCalled()
    // Popup stays open so the connect-address prompt can slide in.
    expect(w.emitted('update:openDialog')).toBeUndefined()
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

  it('hides the detected footer when the detected address is already saved', () => {
    // Race: switching the extension account both saves the new address (connect
    // auto-retry) and flags it as detected (header listener). Once it's in the
    // saved list the prompt must disappear reactively.
    walletStore.detectedAddress.value = '0x1' // already present in allAccounts
    const w = factory()
    expect(w.find('[data-test="save-detected"]').exists()).toBe(false)
  })

  it('labels the detected footer with the connected wallet name', () => {
    walletStore.detectedAddress.value = '0x9a8b'
    const w = factory()
    // $t is stubbed to echo the key; the detected_wallet key is used for the label.
    expect(w.text()).toContain('multi_address.detected_wallet')
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

  it('groups saved addresses by chain type; active group expanded, other collapsed', () => {
    const original = store.allAccounts
    store.allAccounts = [
      { id: 'EVM:0x1', address: '0x1', addressName: 'A1', walletName: 'W', kind: 'signing', icon: '', chainType: 'EVM' },
      { id: 'BITCOIN:bc1', address: 'bc1', addressName: 'B1', walletName: 'W', kind: 'watchOnly', icon: '', chainType: 'BITCOIN' },
    ]
    try {
      const w = factory()
      // Selected chain is EVM → EVM is the active group (first + expanded).
      // ($t is stubbed to echo the key, so assert on the per-group data-test +
      // count rather than the interpolated label.)
      expect(w.find('[data-test="group-header-EVM"]').exists()).toBe(true)
      expect(w.find('[data-test="group-header-EVM"]').text()).toContain('(1)')
      expect(w.find('[data-test="group-header-BITCOIN"]').exists()).toBe(true)
      expect(w.find('[data-test="group-body-EVM"]').exists()).toBe(true)
      expect(w.find('[data-test="group-body-BITCOIN"]').exists()).toBe(false)
    } finally {
      store.allAccounts = original
    }
  })

  it('does not render a group with no saved addresses', () => {
    // Default store has only EVM accounts → the Bitcoin group is absent entirely.
    const w = factory()
    expect(w.find('[data-test="group-header-EVM"]').exists()).toBe(true)
    expect(w.find('[data-test="group-header-BITCOIN"]').exists()).toBe(false)
  })

  it('expands a collapsed group when its header is clicked', async () => {
    const original = store.allAccounts
    store.allAccounts = [
      { id: 'EVM:0x1', address: '0x1', addressName: 'A1', walletName: 'W', kind: 'signing', icon: '', chainType: 'EVM' },
      { id: 'BITCOIN:bc1', address: 'bc1', addressName: 'B1', walletName: 'W', kind: 'watchOnly', icon: '', chainType: 'BITCOIN' },
    ]
    try {
      const w = factory()
      expect(w.find('[data-test="group-body-BITCOIN"]').exists()).toBe(false)
      await w.get('[data-test="group-header-BITCOIN"]').trigger('click')
      expect(w.find('[data-test="group-body-BITCOIN"]').exists()).toBe(true)
    } finally {
      store.allAccounts = original
    }
  })

  it('floats the most-recently-connected address to the top of its group', () => {
    const original = store.allAccounts
    // EVM:0x1 is saved LAST but was the last connection → it must render first.
    store.allAccounts = [
      { id: 'EVM:0x2', address: '0x2', addressName: 'A2', walletName: 'W', kind: 'watchOnly', icon: '', chainType: 'EVM' },
      { id: 'EVM:0x1', address: '0x1', addressName: 'A1', walletName: 'W', kind: 'signing', icon: '', chainType: 'EVM' },
    ]
    store.connectionOrder = ['EVM:0x1']
    try {
      const rows = factory().findAll('[data-test="group-body-EVM"] .row')
      expect(rows[0].attributes('data-id')).toBe('EVM:0x1')
    } finally {
      store.allAccounts = original
      store.connectionOrder = []
    }
  })

  it('keeps a connected address at the top after selecting/viewing another (no reorder on select)', () => {
    const original = store.allAccounts
    // EVM:0x1 was connected (in the order stack) then EVM:0x2 is merely viewed; the
    // view is watch-only and never enters the stack, so 0x1 stays first.
    store.allAccounts = [
      { id: 'EVM:0x1', address: '0x1', addressName: 'A1', walletName: 'W', kind: 'watchOnly', icon: '', chainType: 'EVM' },
      { id: 'EVM:0x2', address: '0x2', addressName: 'A2', walletName: 'W', kind: 'watchOnly', icon: '', chainType: 'EVM' },
    ]
    store.connectionOrder = ['EVM:0x1'] // 0x1 connected earlier; 0x2 only viewed
    try {
      const rows = factory().findAll('[data-test="group-body-EVM"] .row')
      expect(rows.map(r => r.attributes('data-id'))).toEqual(['EVM:0x1', 'EVM:0x2'])
    } finally {
      store.allAccounts = original
      store.connectionOrder = []
    }
  })

  it('stacks connections newest-first, pushing the previous one down', () => {
    const original = store.allAccounts
    store.allAccounts = [
      { id: 'EVM:0x1', address: '0x1', addressName: 'A1', walletName: 'W', kind: 'watchOnly', icon: '', chainType: 'EVM' },
      { id: 'EVM:0x2', address: '0x2', addressName: 'A2', walletName: 'W', kind: 'signing', icon: '', chainType: 'EVM' },
      { id: 'EVM:0x3', address: '0x3', addressName: 'A3', walletName: 'W', kind: 'watchOnly', icon: '', chainType: 'EVM' },
    ]
    // Connected 0x1 first, then 0x2 (newest) → [0x2, 0x1, then never-connected 0x3].
    store.connectionOrder = ['EVM:0x2', 'EVM:0x1']
    try {
      const rows = factory().findAll('[data-test="group-body-EVM"] .row')
      expect(rows.map(r => r.attributes('data-id'))).toEqual(['EVM:0x2', 'EVM:0x1', 'EVM:0x3'])
    } finally {
      store.allAccounts = original
      store.connectionOrder = []
    }
  })

  it('shows the unsaved-address note when the connected address is over the cap', () => {
    const origAddr = walletStore.walletAddress.value
    walletStore.isWalletConnected = true
    walletStore.isWatchOnly = false
    walletStore.walletAddress.value = '0xNOTSAVED' // not in allAccounts (0x1 / 0x2)
    try {
      expect(factory().find('[data-test="over-cap-note"]').exists()).toBe(true)
    } finally {
      walletStore.walletAddress.value = origAddr
      walletStore.isWalletConnected = false
    }
  })

  it('hides the unsaved-address note when the connected address is saved', () => {
    const origAddr = walletStore.walletAddress.value
    walletStore.isWalletConnected = true
    walletStore.isWatchOnly = false
    walletStore.walletAddress.value = '0x1' // present in allAccounts
    try {
      expect(factory().find('[data-test="over-cap-note"]').exists()).toBe(false)
    } finally {
      walletStore.walletAddress.value = origAddr
      walletStore.isWalletConnected = false
    }
  })

  it('fetches a visible non-active address (debounced); active is live and incompatible is skipped', () => {
    vi.useFakeTimers()
    const original = store.allAccounts
    store.allAccounts = [
      { id: 'EVM:0x1', address: '0x1', addressName: 'A1', walletName: 'W', kind: 'signing', icon: '', chainType: 'EVM' }, // active → live, excluded
      { id: 'EVM:0x2', address: '0x2', addressName: 'A2', walletName: 'W', kind: 'watchOnly', icon: '', chainType: 'EVM' }, // non-active EVM → fetched
      { id: 'BITCOIN:bc1', address: 'bc1', addressName: 'B1', walletName: 'W', kind: 'watchOnly', icon: '', chainType: 'BITCOIN' }, // incompatible on EVM chain
    ]
    try {
      const w = factory()
      // Every row reports itself visible; only the compatible, non-active one fetches.
      w.findAllComponents({ name: 'ManageAccountsRow' }).forEach(r =>
        r.vm.$emit('visibility-change', true),
      )
      vi.advanceTimersByTime(300) // flush the debounce
      const addrs = fetchIfStale.mock.calls.map(c => (c[0] as { address: string }).address)
      expect(addrs).toEqual(['0x2'])
    } finally {
      store.allAccounts = original
      vi.useRealTimers()
    }
  })
})
