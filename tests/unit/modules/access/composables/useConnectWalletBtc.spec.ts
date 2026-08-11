// tests/unit/composables/useConnectWalletBtc.spec.ts
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { ToastType } from '@/types/notification/index'
import {
  WalletConfigType,
  type WalletConfig,
} from '@/modules/access/common/walletConfigs'
import type { Chain } from '@/mew_api/types'

// --- Mocks ---------------------------------------------------------------

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useRoute: () => ({ name: undefined }),
}))

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (k: string) => k }),
  // Real stores (used via real pinia below) import the `@/i18n` singleton at
  // module load, which calls createI18n. Stub it so those imports don't crash.
  createI18n: () => ({ global: { t: (k: string) => k } }),
}))

// Avoid pulling the heavy wagmi / rainbowkit graph into the unit test.
vi.mock('@/providers/ethereum/wagmiConfig', () => ({
  generateConfig: () => ({ connectors: [] }),
}))

vi.mock('@/providers/ethereum/wagmiWallet', () => ({ default: class {} }))
vi.mock('@/providers/ethereum/web3InjectedWallet', () => ({
  default: class {},
}))

vi.mock('@sentry/vue', () => ({ captureException: vi.fn() }))

// walletConfigs.ts imports these hardware-wallet libs (used lazily inside
// canSupport helpers). Their transitive @ledgerhq/hw-app-eth dep does not
// resolve cleanly under Vitest, so stub the leaf modules to load the graph.
vi.mock('@enkryptcom/hw-wallets', () => ({
  default: class {
    isNetworkSupported() {
      return false
    }
  },
}))
vi.mock('@/providers/hw/ledger', () => ({
  default: class {
    isNetworkSupported() {
      return false
    }
  },
}))

vi.mock('@/analytics', () => ({
  analytics: { trackConnectWalletEvent: vi.fn() },
  ConnectWalletEvent: { SUCCESS: 'success', SHOWN: 'shown' },
}))

// Spy on the Bitcoin injected wallet. We record the constructor args so we can
// assert it is never instantiated with an undefined provider — that undefined
// deref is the MEW-2040 crash (`Cannot read properties of undefined (reading
// 'getNetwork')`). connect() resolves false so the happy-path branch never
// reaches _storeWallet (which would drag in the full wallet store graph).
const unisatCtorSpy = vi.fn()
vi.mock('@/providers/bitcoin/unisatInjectedWallet', () => ({
  default: class {
    constructor(...args: unknown[]) {
      unisatCtorSpy(...args)
    }
    connect() {
      return Promise.resolve(false)
    }
  },
}))

const { useConnectWallet } = await import(
  '@/modules/access/composables/useConnectWallet'
)
import { useAccessStore } from '@/stores/accessStore'
import { useToastStore } from '@/stores/toastStore'

// --- Helpers -------------------------------------------------------------

const BITCOIN_CHAIN = {
  name: 'BITCOIN',
  type: 'BITCOIN',
} as unknown as Chain

const makeWallet = (id: string, name: string): WalletConfig => ({
  id,
  name,
  icon: `${id}.webp`,
  type: [WalletConfigType.EXTENSION],
})

const flush = () => new Promise(resolve => setTimeout(resolve, 0))

// --- Tests ---------------------------------------------------------------

describe('useConnectWallet — Bitcoin injected wallet guard (MEW-2040)', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    unisatCtorSpy.mockReset()
    useAccessStore().setSelectedChain(BITCOIN_CHAIN)
    // Clean slate for injected providers each run.
    window.unisat = undefined
    window.enkrypt = undefined
  })

  afterEach(() => {
    window.unisat = undefined
    window.enkrypt = undefined
  })

  it('does not instantiate the injected BTC wallet for an unsupported wallet (no undefined deref) and shows a friendly warning', async () => {
    // SafePal-style wallet: neither unisat nor enkrypt, and no BTC injection.
    const toastStore = useToastStore()
    const addToastSpy = vi.spyOn(toastStore, 'addToastMessage')

    const { connect } = useConnectWallet()
    await connect(makeWallet('safepal', 'SafePal'))
    await flush()

    // The crash was caused by `new UnisatInjectWallet(undefined, ...)`.
    expect(unisatCtorSpy).not.toHaveBeenCalled()
    expect(addToastSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: ToastType.Warning,
        textSecondary: expect.stringMatching(/bitcoin/i),
      }),
    )
  })

  it('still guards unsupported wallets even when a different BTC extension (enkrypt) is installed', async () => {
    // Enkrypt IS present, but the selected wallet is SafePal. The old code fell
    // through to `enkryptInjection!`, wrongly using enkrypt's provider.
    window.enkrypt = {
      providers: { bitcoin: { getNetwork: () => Promise.resolve('livenet') } },
    } as unknown as typeof window.enkrypt

    const { connect } = useConnectWallet()
    await connect(makeWallet('safepal', 'SafePal'))
    await flush()

    expect(unisatCtorSpy).not.toHaveBeenCalled()
  })

  it('still connects supported injected wallets (unisat) when present', async () => {
    const unisatInjection = {
      getNetwork: () => Promise.resolve('livenet'),
    } as unknown as typeof window.unisat
    window.unisat = unisatInjection

    const { connect } = useConnectWallet()
    await connect(makeWallet('unisat', 'Unisat'))
    await flush()

    expect(unisatCtorSpy).toHaveBeenCalledTimes(1)
    expect(unisatCtorSpy).toHaveBeenCalledWith(unisatInjection, 'BITCOIN')
  })
})
