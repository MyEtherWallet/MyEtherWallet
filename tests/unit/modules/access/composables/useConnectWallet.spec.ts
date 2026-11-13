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
const setWalletSpy = vi.fn()

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
    async getAddress(): Promise<string> {
      return '0xabc'
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
  // walletStore/walletUtils import the real `@/i18n` singleton at module load,
  // which calls createI18n. Stub it so those transitive imports don't crash.
  createI18n: () => ({ global: { t: (key: string) => key } }),
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
  useWalletStore: () => ({ setWallet: setWalletSpy }),
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

// Not injected and not a mobile wallet, so there is no WalletConnect fallback.
const extensionOnlyWallet: WalletConfig = {
  id: 'coinbase',
  name: 'Coinbase Wallet',
  icon: 'data:image/png;base64,x',
  type: [WalletConfigType.EXTENSION],
}

describe('useConnectWallet — extension not detected (MEW-2589)', () => {
  beforeEach(() => {
    addToastMessage.mockReset()
  })

  it('auto-dismisses the toast and replaces it on a repeat click', async () => {
    const { connect } = useConnectWallet()
    await connect(extensionOnlyWallet)
    await connect(extensionOnlyWallet)

    const [first, second] = addToastMessage.mock.calls.map(([toast]) => toast)
    expect(first.text).toBe('access_wallet.toast.web3_wallet_not_detected')
    expect(first.isInfinite).toBeFalsy()
    expect(first.id).toBeTruthy()
    expect(second.id).toBe(first.id)
  })
})

const walletConnectWallet: WalletConfig = {
  id: 'walletConnect',
  name: 'WalletConnect',
  icon: 'data:image/png;base64,x',
  type: [],
}

describe('useConnectWallet — WalletConnect approved (MEW-2588)', () => {
  beforeEach(() => {
    addToastMessage.mockReset()
    captureExceptionSpy.mockReset()
    setWalletSpy.mockReset()
    accessStoreMock.closeAccessDialog.mockReset()
    connectorsRef.length = 0
    connectorsRef.push({
      id: 'walletConnect',
      onDisconnect: vi.fn(),
      emitter: { on: vi.fn() },
      connect: async () => ({ accounts: ['0xabc'] }),
    })
  })

  it('toasts a failure after approval instead of closing with no wallet', async () => {
    setWalletSpy.mockRejectedValueOnce(new Error('boom'))
    const { connect } = useConnectWallet()
    await connect(walletConnectWallet)
    await flushPromises()

    expect(accessStoreMock.closeAccessDialog).not.toHaveBeenCalled()
    expect(addToastMessage).toHaveBeenCalledTimes(1)
    expect(addToastMessage.mock.calls[0][0]).toMatchObject({
      text: 'access_wallet.toast.could_not_connect',
      textSecondary: 'boom',
    })
    expect(captureExceptionSpy).toHaveBeenCalled()
  })
})

// Shapes and links copied from the real RainbowKit 2.2.11 connector list: 47 of
// its 70 connectors share the id `walletConnect` and Argent's comes first.
const RAW_URI = 'wc:abc123@2?relay-protocol=irn&symKey=deadbeef'
const ENCODED_URI = 'wc%3Aabc123%402%3Frelay-protocol%3Dirn%26symKey%3Ddeadbeef'
const rawUri = (uri: string) => uri

const fakeWalletConnectConnector = (rkDetails: Record<string, unknown>) => ({
  id: 'walletConnect',
  onDisconnect: vi.fn(),
  emitter: { on: vi.fn() },
  connect: vi.fn(async () => ({ accounts: [] })),
  rkDetails,
})
type FakeConnector = ReturnType<typeof fakeWalletConnectConnector>

const argentConnector = fakeWalletConnectConnector({
  id: 'argent',
  mobile: {
    getUri: (uri: string) => `argent://app/wc?uri=${encodeURIComponent(uri)}`,
  },
  qrCode: { getUri: rawUri },
})
const trustConnector = fakeWalletConnectConnector({
  id: 'trust',
  mobile: {
    getUri: (uri: string) => `trust://wc?uri=${encodeURIComponent(uri)}`,
  },
  qrCode: { getUri: rawUri },
})
const rainbowLink = (uri: string) =>
  `https://rnbwapp.com/wc?uri=${encodeURIComponent(uri)}&connector=rainbowkit`
const rainbowConnector = fakeWalletConnectConnector({
  id: 'rainbow',
  mobile: { getUri: rainbowLink },
  qrCode: { getUri: rainbowLink },
})
// RainbowKit registers the generic wallet twice: first a connector that opens
// WalletConnect's own modal (the one useWalletList keeps), then a plain one.
const modalConnector = fakeWalletConnectConnector({
  id: 'walletConnect',
  qrCode: { getUri: rawUri },
  isWalletConnectModalConnector: true,
  showQrModal: true,
})
const genericConnector = fakeWalletConnectConnector({
  id: 'walletConnect',
  qrCode: { getUri: rawUri },
})
const mewLink = (uri: string) =>
  `https://mewwallet.com/wc?uri=${encodeURIComponent(uri)}`
const mewConnector = fakeWalletConnectConnector({
  id: 'mew',
  mobile: { getUri: mewLink },
  qrCode: { getUri: mewLink },
})

// useWalletList builds a RainbowKit wallet's config by spreading its connector.
const configFor = (connector: FakeConnector, name: string): WalletConfig => ({
  ...connector,
  id: connector.id,
  name,
  icon: 'data:image/png;base64,x',
  type: [WalletConfigType.MOBILE],
})

describe('useConnectWallet — WalletConnect QR link (MEW-2288)', () => {
  const allConnectors = [
    argentConnector,
    trustConnector,
    rainbowConnector,
    modalConnector,
    genericConnector,
    mewConnector,
  ]

  beforeEach(() => {
    connectorsRef.length = 0
    connectorsRef.push(...allConnectors)
    allConnectors.forEach(connector => {
      connector.emitter.on.mockReset()
      connector.connect.mockClear()
    })
    accessStoreMock.setWagmiWalletData.mockClear()
  })

  /** Let `connector` announce the pairing URI, as wagmi does on connect. */
  const announceUri = (connector: FakeConnector) =>
    connector.emitter.on.mock.calls
      .filter(([event]) => event === 'message')
      .forEach(([, handler]) => handler({ type: 'display_uri', data: RAW_URI }))

  /** The link the dialog renders as QR code and copy value. */
  const linkOnScreen = () =>
    accessStoreMock.setWagmiWalletData.mock.lastCall?.[0]

  /** Click `wallet` in a fresh dialog, then let every connector announce. */
  const linkShownFor = async (wallet: WalletConfig) => {
    const { connect } = useConnectWallet()
    await connect(wallet)
    await flushPromises()
    allConnectors.forEach(announceUri)
    return linkOnScreen()
  }

  it('gives the generic WalletConnect wallet the raw wc: URI, not the link of the first connector', async () => {
    expect(await linkShownFor(configFor(modalConnector, 'WalletConnect'))).toBe(
      RAW_URI,
    )
  })

  it('connects the generic WalletConnect wallet without opening the WalletConnect modal', async () => {
    await linkShownFor(configFor(modalConnector, 'WalletConnect'))
    expect(modalConnector.connect).not.toHaveBeenCalled()
    expect(genericConnector.connect).toHaveBeenCalledTimes(1)
  })

  it('encodes the QR link of the clicked wallet', async () => {
    expect(await linkShownFor(configFor(rainbowConnector, 'Rainbow'))).toBe(
      `https://rnbwapp.com/wc?uri=${ENCODED_URI}&connector=rainbowkit`,
    )
  })

  it('keeps the raw wc: URI for a wallet whose only deep link is a same-device scheme', async () => {
    expect(await linkShownFor(configFor(trustConnector, 'Trust Wallet'))).toBe(
      RAW_URI,
    )
  })

  const mewMobile: WalletConfig = {
    id: 'mew',
    name: 'MEW Mobile',
    icon: 'data:image/png;base64,x',
    type: [WalletConfigType.MOBILE],
    walletViewType: 'wallet_connect',
  }

  it('resolves MEW Mobile, whose static config carries no RainbowKit details', async () => {
    expect(await linkShownFor(mewMobile)).toBe(
      `https://mewwallet.com/wc?uri=${ENCODED_URI}`,
    )
  })

  // Every WalletConnect connector shares one provider, and wagmi keeps a single
  // `display_uri` handler on it: the first connector that connected. A wallet
  // clicked later is only ever announced through that first connector.
  it('shows the link of the wallet clicked last when wagmi announces through an earlier connector', async () => {
    await useConnectWallet().connect(mewMobile)
    await flushPromises()
    await useConnectWallet().connect(configFor(trustConnector, 'Trust Wallet'))
    await flushPromises()

    announceUri(mewConnector)

    expect(linkOnScreen()).toBe(RAW_URI)
  })
})
