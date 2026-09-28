import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'

/**
 * Regression test for Sentry APP-MEW-WEB-1ND.
 *
 * The Ledger connect awaits the WebUSB/BLE transport before running the unlock
 * flow. If the user closes the access dialog (or presses Back) while that is
 * pending, `currentView` resets to 'default'. The unlock then picked a manager
 * for the *current* view (Trezor, since it isn't 'ledger') with a null wallet
 * type, and the real hw-wallets manager threw
 * `TypeError: this.providerTypes[wallet] is not iterable`.
 *
 * The real TrezorManager is used, on top of a fake hw-wallets base (the real
 * package doesn't load under vitest) that keeps the library's provider lookup,
 * `for (const P of this.providerTypes[wallet])`, so the failure is the exact
 * Sentry TypeError.
 */
const h = vi.hoisted(() => ({
  addToastMessage: vi.fn(),
  captureException: vi.fn(),
  ledgerIsConnected: vi.fn(),
  resolveTransport: null as null | ((v: unknown) => void),
}))

vi.mock('@enkryptcom/hw-wallets', () => {
  class FakeProvider {
    static getSupportedNetworks = () => ['ETH']
    async init() {}
    async isConnected() {
      return true
    }
  }
  class FakeHWwalletManager {
    providerTypes: Record<string, (typeof FakeProvider)[]> = {
      ledger: [FakeProvider],
      trezor: [FakeProvider],
    }
    providers: Record<string, FakeProvider> = {}
    async isConnected(options: { wallet: string; networkName: string }) {
      // Mirrors @enkryptcom/hw-wallets HWwalletManager#getProvider.
      for (const P of this.providerTypes[options.wallet]) {
        if (P.getSupportedNetworks().includes(options.networkName)) {
          this.providers[options.networkName] = new P()
        }
      }
      return this.providers[options.networkName].isConnected()
    }
  }
  return { default: FakeHWwalletManager }
})

vi.mock('@/stores/accessStore', async () => {
  const { ref, computed } = await import('vue')
  const currentView = ref('ledger')
  const selectedChain = ref({ chainID: '1', name: 'ETHEREUM', type: 'EVM' })
  const store = {
    currentView,
    selectedChain,
    isEvmChain: computed(() => selectedChain.value?.type === 'EVM'),
    setSelectedChain: vi.fn(),
    setCurrentView: (view: string) => {
      currentView.value = view
    },
    closeAccessDialog: () => {
      currentView.value = 'default'
    },
  }
  return { useAccessStore: () => store }
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
vi.mock('@/modules/access/common/walletConfigs', () => ({
  walletConfigs: { ledger: { name: 'Ledger' }, trezor: { name: 'Trezor' } },
  WalletConfigType: { HARDWARE: 'hardware' },
}))
vi.mock('@/providers/ethereum/chainToEnum', () => ({
  chainToEnum: { ETHEREUM: 'ETH' },
}))
vi.mock('@/providers/ethereum/evmHardwareWallet', () => ({ default: class {} }))
vi.mock('@/providers/bitcoin/btcHardwareWallet', () => ({ default: class {} }))
vi.mock('@/providers/hw/ledger', () => ({
  default: class LedgerManager {
    isConnected = h.ledgerIsConnected
    getSupportedPaths = vi.fn(async () => [])
  },
}))
vi.mock('@/providers/hw/ledger/transport', () => ({
  getLedgerWebUSBTransport: () =>
    new Promise(resolve => {
      h.resolveTransport = resolve
    }),
  getLedgerBLETransport: vi.fn(),
  isWebUSBSupported: async () => true,
  isWebBLESupported: async () => false,
}))

import ModuleAccessHardwareWallet from '@/modules/access/ModuleAccessHardwareWallet.vue'
import { useAccessStore } from '@/stores/accessStore'
import { resetTrezorManager } from '@/providers/hw/trezorManager'

const stubs = {
  AppSheet: { template: '<div><slot /></div>' },
  AppStepper: { template: '<div><slot /></div>' },
  AppStepDescription: { template: '<div />' },
  AppBaseButton: { template: '<button @click="$emit(\'click\')"><slot /></button>' },
  AppBtnText: { template: '<button><slot /></button>' },
  SelectAddressList: { template: '<div />' },
  SelectChainForApp: { template: '<div />' },
  HardwareWalletDerivation: { template: '<div />' },
  ButtonNoWallet: { template: '<div />' },
}

beforeEach(() => {
  resetTrezorManager()
  h.resolveTransport = null
  useAccessStore().setCurrentView('ledger')
})

describe('ModuleAccessHardwareWallet – Ledger connect (APP-MEW-WEB-1ND)', () => {
  it('does not run the unlock flow when the dialog closes while the Ledger transport is opening', async () => {
    const wrapper = mount(ModuleAccessHardwareWallet, {
      global: { stubs, mocks: { $t: (k: string) => k } },
    })
    await flushPromises() // usbSupported -> true, Connect USB button renders

    await wrapper.find('button').trigger('click') // connectViaUSB, transport pending
    expect(h.resolveTransport).toBeTypeOf('function')

    // User closes the access dialog; the parent unmounts this view.
    useAccessStore().closeAccessDialog()
    wrapper.unmount()

    h.resolveTransport!({}) // device picker finally resolves
    await flushPromises()

    expect(h.captureException).not.toHaveBeenCalled()
    expect(h.addToastMessage).not.toHaveBeenCalled()
  })

  it('still connects through the Ledger manager when the view is unchanged', async () => {
    h.ledgerIsConnected.mockResolvedValue(true)
    const wrapper = mount(ModuleAccessHardwareWallet, {
      global: { stubs, mocks: { $t: (k: string) => k } },
    })
    await flushPromises()

    await wrapper.find('button').trigger('click')
    h.resolveTransport!({})
    await flushPromises()

    expect(h.ledgerIsConnected).toHaveBeenCalledWith(
      expect.objectContaining({ wallet: 'ledger', networkName: 'ETH' }),
    )
    expect(h.captureException).not.toHaveBeenCalled()
    wrapper.unmount()
  })
})
