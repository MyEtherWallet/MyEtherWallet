// tests/unit/composables/useConnectWallet.spec.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ref } from 'vue'
import {
  WalletConfigType,
  type WalletConfig,
} from '@/modules/access/common/walletConfigs'

// --- Shared spies, referenced from the hoisted vi.mock factories below. ---
// These are declared at module scope (before the bottom `await import`) so the
// lazily-invoked mock factories capture them by reference, mirroring the
// pattern used by useGlobalSearch.spec.ts.
const addToastMessage = vi.fn()
const captureExceptionSpy = vi.fn()
const wagmiConstructorSpy = vi.fn()

// generateConfig returns a wagmi config whose connector list is controllable
// per-test. An empty list reproduces the "no matching connector" scenario.
const connectorsRef: Array<Record<string, unknown>> = []

// The real walletConfigs module pulls in hardware-wallet deps (@ledgerhq,
// @enkryptcom/hw-wallets) and webp assets that don't resolve under vitest.
// The composable only needs the WalletConfigType enum at runtime.
vi.mock('@/modules/access/common/walletConfigs', () => ({
  WalletConfigType: {
    MOBILE: 'mobile',
    HARDWARE: 'hardware',
    SOFTWARE: 'software',
    DESKTOP: 'desktop',
    EXTENSION: 'extension',
    MOCK: 'mock',
  },
}))

vi.mock('@/providers/ethereum/wagmiConfig', () => ({
  generateConfig: () => ({ connectors: connectorsRef }),
}))

// Faithfully reproduce WagmiWallet: the constructor just stores the connector
// and connect() dereferences it — exactly what crashes in production when the
// connector is undefined. The guard under test must prevent this from ever
// being constructed with an undefined connector.
vi.mock('@/providers/ethereum/wagmiWallet', () => ({
  default: class WagmiWalletMock {
    connector: { connect: (opts: unknown) => Promise<unknown> } | undefined
    constructor(connector: never, chainId: string, config: unknown) {
      wagmiConstructorSpy(connector, chainId, config)
      this.connector = connector
    }
    async connect(): Promise<boolean> {
      const conn = (await this.connector!.connect({ chainId: 1 })) as {
        accounts: string[]
      }
      return conn.accounts.length > 0
    }
  },
}))

vi.mock('@/providers/ethereum/web3InjectedWallet', () => ({
  default: class {},
}))
vi.mock('@/providers/bitcoin/unisatInjectedWallet', () => ({
  default: class {},
}))

vi.mock('@sentry/vue', () => ({
  captureException: (...args: unknown[]) => captureExceptionSpy(...args),
}))

vi.mock('@/analytics', () => ({
  analytics: { trackConnectWalletEvent: vi.fn() },
  ConnectWalletEvent: { SUCCESS: 'success', FAILURE: 'failure' },
}))

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useRoute: () => ({ name: undefined }),
}))

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key: string) => key }),
}))

// storeToRefs is mocked to an identity so the plain store mocks below (whose
// reactive members are already refs) destructure cleanly.
vi.mock('pinia', () => ({
  storeToRefs: (store: unknown) => store,
}))

const accessStoreMock = {
  selectedChain: ref({ chainID: '1', name: 'Ethereum' }),
  isBitcoinChain: ref(false),
  setWagmiWalletData: vi.fn(),
  clearWeb3ConnectionError: vi.fn(),
  setClickedWeb3Wallet: vi.fn(),
  setCurrentView: vi.fn(),
  setWeb3ConnectionError: vi.fn(),
  closeAccessDialog: vi.fn(),
  setClickedWalletConnect: vi.fn(),
}

vi.mock('@/stores/accessStore', () => ({
  useAccessStore: () => accessStoreMock,
}))
vi.mock('@/stores/chainsStore', () => ({
  useChainsStore: () => ({ chains: ref([]) }),
}))
vi.mock('@/stores/providerStore', () => ({
  useProviderStore: () => ({ providers: ref([]) }),
}))
vi.mock('@/stores/walletStore', () => ({
  useWalletStore: () => ({ setWallet: vi.fn() }),
}))
vi.mock('@/stores/recentWalletsStore', () => ({
  useRecentWalletsStore: () => ({ addWallet: vi.fn() }),
}))
vi.mock('@/stores/globalStore', () => ({
  useGlobalStore: () => ({ setSelectedNetwork: vi.fn() }),
}))
vi.mock('@/stores/toastStore', () => ({
  useToastStore: () => ({ addToastMessage }),
}))

// Import after mocks are registered.
const { useConnectWallet } = await import(
  '@/modules/access/composables/useConnectWallet'
)

const flushPromises = () => new Promise(resolve => setTimeout(resolve, 0))

// A wallet whose id matches no wagmi connector, routed through the wagmi path
// (type does not include EXTENSION, no walletViewType).
const walletWithNoConnector: WalletConfig = {
  id: 'no-such-connector',
  name: 'Ghost Wallet',
  icon: 'data:image/png;base64,x',
  type: [WalletConfigType.MOBILE],
}

describe('useConnectWallet — no matching wagmi connector', () => {
  beforeEach(() => {
    addToastMessage.mockReset()
    captureExceptionSpy.mockReset()
    wagmiConstructorSpy.mockReset()
    connectorsRef.length = 0
  })

  it('does not construct WagmiWallet with an undefined connector', async () => {
    const { connect } = useConnectWallet()
    await connect(walletWithNoConnector)
    await flushPromises()

    expect(wagmiConstructorSpy).not.toHaveBeenCalled()
  })

  it('surfaces a friendly, handled error toast instead of crashing', async () => {
    const { connect } = useConnectWallet()
    await connect(walletWithNoConnector)
    await flushPromises()

    expect(addToastMessage).toHaveBeenCalledTimes(1)
    const toast = addToastMessage.mock.calls[0][0]
    expect(toast.text).toMatch(/not available|not detected|unavailable/i)
  })

  it('does not report an undefined-dereference TypeError to Sentry', async () => {
    const { connect } = useConnectWallet()
    await connect(walletWithNoConnector)
    await flushPromises()

    expect(captureExceptionSpy).not.toHaveBeenCalled()
  })
})
