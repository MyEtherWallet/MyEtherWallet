import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'

/**
 * Regression test for Sentry APP-MEW-WEB-1GR.
 *
 * Opening the Ledger step straight from the URL (browser Back to
 * `/portfolio/access?type=ledger`, a refresh, a deep link) skips the wallet
 * chooser, which only offers Ledger on chains it supports. The access chain
 * then falls back to the app's chain, here Arbitrum Nova, and "Connect via USB"
 * threw `ledger: no provider for network: ARBNova` from LedgerManager.
 *
 * The real LedgerManager, configs and walletConfigs run; only the device apps
 * (LedgerEthereum / LedgerBitcoin) and the transport are faked.
 */
const h = vi.hoisted(() => ({
  addToastMessage: vi.fn(),
  captureException: vi.fn(),
  deviceIsConnected: vi.fn(),
  resolveTransport: null as null | ((v: unknown) => void),
}))

const { ETHEREUM, ARBITRUM_NOVA } = vi.hoisted(() => ({
  ETHEREUM: { chainID: '1', name: 'ETHEREUM', type: 'EVM' },
  ARBITRUM_NOVA: { chainID: '42170', name: 'ARBITRUM_NOVA', type: 'EVM' },
}))

vi.mock('@/providers/hw/ledger/ledgerEthereum', () => ({
  LedgerEthereum: class {
    constructor(public network: string) {}
    async init() {}
    isConnected = () => h.deviceIsConnected(this.network)
    getSupportedPaths = () => [
      { basePath: "m/44'/60'/0'", path: "m/44'/60'/0'/{index}" },
    ]
    async getAddress() {
      return { address: '0x0', publicKey: '0x0' }
    }
  },
}))
vi.mock('@/providers/hw/ledger/ledgerBitcoin', () => ({
  LedgerBitcoin: class {},
}))
vi.mock('@/providers/hw/ledger/transport', () => ({
  getLedgerWebUSBTransport: vi.fn(
    () =>
      new Promise(resolve => {
        h.resolveTransport = resolve
      }),
  ),
  getLedgerBLETransport: vi.fn(),
  closeLedgerTransport: vi.fn(async () => undefined),
  isLedgerInterfaceBusyError: () => false,
  isWebUSBSupported: async () => true,
  isWebBLESupported: async () => false,
}))
// The real package doesn't load under vitest; walletConfigs only needs the
// Trezor network check from it.
vi.mock('@enkryptcom/hw-wallets', () => ({
  default: class {
    isNetworkSupported = () => false
  },
}))
vi.mock('@/providers/ethereum/chainToEnum', () => ({
  chainToEnum: { ETHEREUM: 'ETH', ARBITRUM_NOVA: 'ARBNova' },
}))

vi.mock('@/stores/accessStore', async () => {
  const { ref, computed } = await import('vue')
  const selectedChain = ref<Record<string, string> | null>(null)
  const store = {
    currentView: ref('ledger'),
    accessStep: ref(1),
    selectedChain,
    isEvmChain: computed(() => selectedChain.value?.type === 'EVM'),
    setSelectedChain: (chain: Record<string, string> | null) => {
      selectedChain.value = chain
    },
    closeAccessDialog: vi.fn(),
  }
  return { useAccessStore: () => store }
})
vi.mock('@/stores/chainsStore', async () => {
  const { ref } = await import('vue')
  // Nova first, so a fix can't pass by just taking chains[0].
  const chains = ref([ARBITRUM_NOVA, ETHEREUM])
  return { useChainsStore: () => ({ chains }) }
})
vi.mock('@/stores/derivationStore', async () => {
  const { ref } = await import('vue')
  const store = {
    trezorSelectedDerivation: ref({ basePath: '', path: '' }),
    ledgerSelectedDerivation: ref({ basePath: '', path: '' }),
    setSelectedTrezorDerivation: vi.fn(),
    setSelectedLedgerDerivation: vi.fn(),
  }
  return { useDerivationStore: () => store }
})
vi.mock('@/stores/walletStore', async () => {
  const { ref } = await import('vue')
  const store = { wallet: ref(null), setWallet: vi.fn() }
  return { useWalletStore: () => store, MAIN_TOKEN_CONTRACT: '0xeee' }
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
vi.mock('pinia', async importOriginal => {
  const actual = await importOriginal<typeof import('pinia')>()
  return { ...actual, storeToRefs: (store: Record<string, unknown>) => store }
})
vi.mock('vue-i18n', async importOriginal => {
  const actual = await importOriginal<typeof import('vue-i18n')>()
  return { ...actual, useI18n: () => ({ t: (k: string) => k }) }
})
vi.mock('@sentry/vue', () => ({ captureException: h.captureException }))
vi.mock('@/analytics', () => ({
  analytics: { trackConnectWalletEvent: vi.fn() },
  ConnectWalletEvent: { SUCCESS: 'success' },
}))
vi.mock('@/utils/walletUtils', () => ({
  getLocalizedWalletError: () => null,
  isTransientTrezorError: () => false,
  isTrezorSupported: () => true,
}))
vi.mock('@/composables/useNativeBalances', () => ({
  fetchNativeBalances: async () => new Map(),
  formatNativeBalance: () => '0',
}))
vi.mock('@/providers/ethereum/evmHardwareWallet', () => ({
  default: class {
    getAddress = async () => '0x0'
  },
}))
vi.mock('@/providers/bitcoin/btcHardwareWallet', () => ({ default: class {} }))

import ModuleAccessHardwareWallet from '@/modules/access/ModuleAccessHardwareWallet.vue'
import { useAccessStore } from '@/stores/accessStore'
import { useChainsStore } from '@/stores/chainsStore'

const stubs = {
  AppBaseButton: {
    emits: ['click'],
    template: '<button @click="$emit(\'click\')"><slot /></button>',
  },
  AccessDropdown: { template: '<div />' },
  AccessDerivationPath: { template: '<div />' },
  AccessAddressList: { template: '<div />' },
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.useFakeTimers({ toFake: ['setTimeout'] })
  h.deviceIsConnected.mockResolvedValue(true)
  useAccessStore().accessStep.value = 1
  // What the access dialog picks on a route-first entry: the app's chain.
  useAccessStore().setSelectedChain(ARBITRUM_NOVA)
})

afterEach(() => {
  vi.useRealTimers()
})

describe('ModuleAccessHardwareWallet – Ledger opened on a chain it does not support (APP-MEW-WEB-1GR)', () => {
  // `null`: the dialog resolved no chain (a refresh without ?walletNetwork= whose
  // saved network is gone), so connect would ask LedgerManager for `undefined`.
  it.each([
    ['an unsupported chain', ARBITRUM_NOVA],
    ['no chain', null],
  ])('connects on a Ledger-supported chain when opened on %s', async (_, chain) => {
    useAccessStore().setSelectedChain(chain)
    const wrapper = mount(ModuleAccessHardwareWallet, {
      global: { stubs, mocks: { $t: (k: string) => k } },
    })
    await flushPromises()

    await wrapper.find('button').trigger('click') // Connect via USB
    h.resolveTransport!({})
    await flushPromises()
    await vi.advanceTimersByTimeAsync(1000)

    expect(h.captureException).not.toHaveBeenCalled()
    expect(h.addToastMessage).not.toHaveBeenCalled()
    expect(useAccessStore().selectedChain.value).toEqual(ETHEREUM)
    expect(h.deviceIsConnected).toHaveBeenCalledWith('ETH')
    wrapper.unmount()
  })

  // On a refresh the chain list can arrive after the step mounts. Until then no
  // chain resolves, and connecting would hand the device an undefined network.
  it('keeps Connect disabled until a network is selected', async () => {
    const { chains } = useChainsStore()
    const loaded = chains.value
    chains.value = []
    useAccessStore().setSelectedChain(null)
    const wrapper = mount(ModuleAccessHardwareWallet, {
      global: { stubs, mocks: { $t: (k: string) => k } },
    })
    await flushPromises()
    expect(wrapper.find('button').attributes('disabled')).toBeDefined()

    chains.value = loaded
    await flushPromises()
    expect(useAccessStore().selectedChain.value).toEqual(ETHEREUM)
    expect(wrapper.find('button').attributes('disabled')).toBeUndefined()
    wrapper.unmount()
  })
})
