import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import type { Ref } from 'vue'

/**
 * The hardware-wallet address picker must issue exactly ONE list load — five
 * device reads plus ONE batched balances request — per connect and per chain /
 * path change. It used to issue several: the connect flow rewrote a persisted
 * derivation that was no longer in the supported list, which the path watcher
 * answered with its own reload one second later; on Trezor a chain switch did
 * the same. Each stray load re-read the device and re-hit the (rate limited)
 * balances endpoint, one call per address.
 */
// Fixtures live in vi.hoisted too: the vi.mock factories below reference them
// and are hoisted above every top-level const.
const { ETH_PATHS, BTC_PATHS, ETH_CHAIN, BTC_CHAIN } = vi.hoisted(() => ({
  ETH_PATHS: [
    {
      path: "m/44'/60'/0'/{index}",
      label: 'Ethereum',
      basePath: "m/44'/60'/0'",
    },
    {
      path: "m/44'/60'/{index}'/0/0",
      label: 'Ledger Live',
      basePath: "m/44'/60'",
    },
  ],
  BTC_PATHS: [
    { path: "m/84'/0'/{index}'/0/0", label: 'Bitcoin', basePath: "m/84'/0'" },
  ],
  ETH_CHAIN: {
    name: 'ETHEREUM',
    chainID: '1',
    type: 'EVM',
    currencyName: 'ETH',
  },
  BTC_CHAIN: { name: 'BITCOIN', type: 'BITCOIN', currencyName: 'BTC' },
}))

const h = vi.hoisted(() => ({
  // one fake device manager shared by the Ledger class and the Trezor singleton
  supportedPaths: [] as Array<{
    path: string
    label: string
    basePath: string
  }>,
  manager: {
    isConnected: vi.fn(async () => true),
    getSupportedPaths: vi.fn(async () => h.supportedPaths),
    getAddress: vi.fn(async ({ pathIndex }: { pathIndex: string }) => ({
      address: `0xaddr${pathIndex}`,
      publicKey: `0xpub${pathIndex}`,
    })),
  },
  fetchNativeBalances: vi.fn(
    async (_chain: unknown, addresses: string[]) =>
      new Map(addresses.map(a => [a.toLowerCase(), 10n ** 18n])),
  ),
  closeLedgerTransport: vi.fn(async () => undefined),
  getLedgerWebUSBTransport: vi.fn(async () => ({})),
  setWallet: vi.fn(async () => undefined),
  addToastMessage: vi.fn(),
  captureException: vi.fn(),
  // reactive store state, filled in by the async mock factories below
  store: {} as {
    currentView: Ref<string>
    selectedChain: Ref<Record<string, unknown> | null>
    ledgerSelectedDerivation: Ref<{
      path: string
      label: string
      basePath: string
    }>
    trezorSelectedDerivation: Ref<{
      path: string
      label: string
      basePath: string
    }>
    wallet: Ref<null>
  },
}))

vi.mock('@/stores/derivationStore', async () => {
  const { ref } = await import('vue')
  const empty = () => ({ path: '', label: '', basePath: '' })
  const ledgerSelectedDerivation = ref(empty())
  const trezorSelectedDerivation = ref(empty())
  h.store.ledgerSelectedDerivation = ledgerSelectedDerivation
  h.store.trezorSelectedDerivation = trezorSelectedDerivation
  return {
    useDerivationStore: () => ({
      ledgerSelectedDerivation,
      trezorSelectedDerivation,
      setSelectedLedgerDerivation: (
        p: typeof ledgerSelectedDerivation.value,
      ) => {
        ledgerSelectedDerivation.value = p
      },
      setSelectedTrezorDerivation: (
        p: typeof trezorSelectedDerivation.value,
      ) => {
        trezorSelectedDerivation.value = p
      },
    }),
  }
})
vi.mock('@/stores/accessStore', async () => {
  const { ref, computed } = await import('vue')
  const currentView = ref('ledger')
  const selectedChain = ref<Record<string, unknown> | null>(ETH_CHAIN)
  h.store.currentView = currentView
  h.store.selectedChain = selectedChain
  return {
    useAccessStore: () => ({
      currentView,
      selectedChain,
      isEvmChain: computed(() => selectedChain.value?.type === 'EVM'),
      setSelectedChain: (c: Record<string, unknown>) =>
        (selectedChain.value = c),
      closeAccessDialog: vi.fn(),
    }),
  }
})
vi.mock('@/stores/walletStore', async () => {
  const { ref } = await import('vue')
  const wallet = ref(null)
  h.store.wallet = wallet
  return { useWalletStore: () => ({ wallet, setWallet: h.setWallet }) }
})
vi.mock('@/stores/recentWalletsStore', () => ({
  useRecentWalletsStore: () => ({ addWallet: vi.fn() }),
}))
vi.mock('@/stores/globalStore', () => ({
  useGlobalStore: () => ({ setSelectedNetwork: vi.fn() }),
}))
vi.mock('@/stores/toastStore', () => ({
  useToastStore: () => ({ addToastMessage: h.addToastMessage }),
}))
vi.mock('@/providers/hw/ledger', () => ({
  default: class LedgerManagerMock {
    isConnected = h.manager.isConnected
    getSupportedPaths = h.manager.getSupportedPaths
    getAddress = h.manager.getAddress
  },
}))
vi.mock('@/providers/hw/trezorManager', () => ({
  getTrezorManager: () => h.manager,
}))
vi.mock('@/providers/hw/ledger/transport', () => ({
  getLedgerWebUSBTransport: h.getLedgerWebUSBTransport,
  getLedgerBLETransport: vi.fn(),
  closeLedgerTransport: h.closeLedgerTransport,
  isLedgerInterfaceBusyError: () => false,
  isWebUSBSupported: async () => true,
  isWebBLESupported: async () => false,
}))
vi.mock('@/providers/ethereum/evmHardwareWallet', () => ({
  default: class EvmHardwareWalletMock {
    constructor(
      _chainId: string,
      private address: string,
    ) {}
    getAddress = async () => this.address
  },
}))
vi.mock('@/providers/bitcoin/btcHardwareWallet', () => ({
  default: class BtcHardwareWalletMock {
    constructor(private publicKey: string) {}
    getAddress = async () => `bc1q${this.publicKey}`
  },
}))
vi.mock('@/composables/useNativeBalances', () => ({
  fetchNativeBalances: h.fetchNativeBalances,
  formatNativeBalance: (v: bigint) => v.toString(),
}))
vi.mock('@/modules/access/common/walletConfigs', () => ({
  walletConfigs: {
    ledger: { id: 'ledger', name: 'Ledger', type: ['hardware'] },
    trezor: { id: 'trezor', name: 'Trezor', type: ['hardware'] },
  },
  WalletConfigType: { HARDWARE: 'hardware' },
}))
vi.mock('@/utils/walletUtils', async importOriginal => {
  const actual = await importOriginal<typeof import('@/utils/walletUtils')>()
  return { ...actual, isTrezorSupported: () => true }
})
vi.mock('@/analytics', () => ({
  analytics: { trackConnectWalletEvent: vi.fn() },
  ConnectWalletEvent: { SUCCESS: 'success' },
}))
vi.mock('@sentry/vue', () => ({ captureException: h.captureException }))
vi.mock('vue-i18n', async importOriginal => {
  const actual = await importOriginal<typeof import('vue-i18n')>()
  return { ...actual, useI18n: () => ({ t: (k: string) => k }) }
})
vi.mock('pinia', async importOriginal => {
  const actual = await importOriginal<typeof import('pinia')>()
  return { ...actual, storeToRefs: (store: Record<string, unknown>) => store }
})

import ModuleAccessHardwareWallet from '@/modules/access/ModuleAccessHardwareWallet.vue'

const SelectAddressList = {
  name: 'SelectAddressList',
  props: ['walletList', 'isLoading', 'modelValue'],
  template: '<div />',
}
const stubs = {
  SelectAddressList,
  AppSheet: { template: '<div><slot /></div>' },
  AppStepper: {
    props: ['steps', 'description', 'activeStep'],
    template: '<div><slot /></div>',
  },
  AppStepDescription: { template: '<div />' },
  // Native click falls through to the root <button>; do NOT also $emit('click')
  // or the parent handler runs twice.
  AppBaseButton: {
    props: ['disabled', 'isLoading'],
    template: '<button :disabled="disabled"><slot /></button>',
  },
  AppBtnText: { template: '<button><slot /></button>' },
  SelectChainForApp: { template: '<div />' },
  HardwareWalletDerivation: { template: '<div />' },
  ButtonNoWallet: { template: '<div />' },
}

// Every mounted component watches the shared chain / derivation refs, so a
// wrapper left mounted by one test would react (and load) in the next.
const mounted: Array<ReturnType<typeof mount>> = []
const factory = () => {
  const w = mount(ModuleAccessHardwareWallet, {
    global: { stubs, mocks: { $t: (k: string) => k } },
  })
  mounted.push(w)
  return w
}

/** Drain microtasks / zero-delay work without advancing the fake clock. */
const settle = async (): Promise<void> => {
  for (let i = 0; i < 10; i++) await vi.advanceTimersByTimeAsync(0)
}

/** Click Connect and let the connect flow (1s device settle) plus the first load run. */
const connect = async (w: ReturnType<typeof factory>): Promise<void> => {
  await settle() // onMounted → usbSupported
  await w.get('button').trigger('click')
  await vi.advanceTimersByTimeAsync(1000) // unlockWallet's settle timer
  await settle()
}

beforeEach(() => {
  vi.useFakeTimers()
  h.supportedPaths = ETH_PATHS
  h.manager.isConnected.mockClear()
  h.manager.getSupportedPaths.mockClear()
  h.manager.getAddress.mockClear()
  h.fetchNativeBalances.mockClear()
  h.fetchNativeBalances.mockImplementation(
    async (_chain: unknown, addresses: string[]) =>
      new Map(addresses.map(a => [a.toLowerCase(), 10n ** 18n])),
  )
  h.closeLedgerTransport.mockClear()
  h.addToastMessage.mockClear()
  h.store.currentView.value = 'ledger'
  h.store.selectedChain.value = ETH_CHAIN
  h.store.ledgerSelectedDerivation.value = { path: '', label: '', basePath: '' }
  h.store.trezorSelectedDerivation.value = { path: '', label: '', basePath: '' }
})
afterEach(() => {
  for (const w of mounted.splice(0)) {
    try {
      w.unmount()
    } catch {
      // already unmounted by the test
    }
  }
  vi.useRealTimers()
})

describe('ModuleAccessHardwareWallet — one load per trigger', () => {
  it('connecting with a persisted path that is no longer supported loads the list exactly once (5 device reads, 1 batched balances call)', async () => {
    // Persisted from an earlier session, not in ETH_PATHS → the connect flow
    // must replace it, and that write must not queue a second load.
    h.store.ledgerSelectedDerivation.value = {
      path: "m/44'/61'/0'/{index}",
      label: 'Old',
      basePath: "m/44'/61'/0'",
    }
    const w = factory()
    await connect(w)
    // Let any stray 1s-delayed reload fire if one was queued.
    await vi.advanceTimersByTimeAsync(3000)
    await settle()

    expect(h.manager.getAddress).toHaveBeenCalledTimes(5)
    expect(h.fetchNativeBalances).toHaveBeenCalledTimes(1)
    expect(h.fetchNativeBalances).toHaveBeenCalledWith(
      { name: 'ETHEREUM', type: 'EVM', chainID: '1' },
      ['0xaddr0', '0xaddr1', '0xaddr2', '0xaddr3', '0xaddr4'],
    )
    const list = w.findComponent(SelectAddressList)
    expect(list.props('walletList')).toHaveLength(5)
    expect(list.props('walletList')[0]).toMatchObject({
      address: '0xaddr0',
      balance: '1000000000000000000',
    })
    expect(list.props('isLoading')).toBe(false)
  })

  it('shows the addresses (with a 0 balance) when the balances request fails, instead of blocking access', async () => {
    h.fetchNativeBalances.mockRejectedValue(new Error('429 Too Many Requests'))
    const w = factory()
    await connect(w)

    const list = w.findComponent(SelectAddressList)
    expect(list.props('walletList')).toHaveLength(5)
    expect(list.props('walletList')[1]).toMatchObject({
      address: '0xaddr1',
      balance: '0',
    })
    expect(list.props('isLoading')).toBe(false)
    expect(h.addToastMessage).not.toHaveBeenCalled()
  })

  it('on Trezor, a chain switch that also changes the derivation reloads exactly once', async () => {
    h.store.currentView.value = 'trezor'
    const w = factory()
    await connect(w)
    expect(h.fetchNativeBalances).toHaveBeenCalledTimes(1)

    h.supportedPaths = BTC_PATHS
    h.store.selectedChain.value = BTC_CHAIN
    await settle() // chain watcher: isConnected → getSupportedPaths → derivation rewrite
    await vi.advanceTimersByTimeAsync(1000) // scheduled reload
    await settle()
    await vi.advanceTimersByTimeAsync(3000) // any duplicate would land here
    await settle()

    expect(h.manager.getAddress).toHaveBeenCalledTimes(10)
    expect(h.fetchNativeBalances).toHaveBeenCalledTimes(2)
    expect(h.fetchNativeBalances.mock.calls[1][0]).toMatchObject({
      name: 'BITCOIN',
      type: 'BITCOIN',
    })
  })

  it('releases the Ledger transport when the flow is left without connecting a wallet, but not after access', async () => {
    const w = factory()
    await connect(w)
    w.unmount()
    expect(h.closeLedgerTransport).toHaveBeenCalledTimes(1)

    h.closeLedgerTransport.mockClear()
    const w2 = factory()
    await connect(w2)
    // "Access wallet" is the AppBaseButton on step 2 (the connect button is gone).
    await w2.get('button').trigger('click')
    await settle()
    expect(h.setWallet).toHaveBeenCalled()
    w2.unmount()
    expect(h.closeLedgerTransport).not.toHaveBeenCalled()
  })
})
