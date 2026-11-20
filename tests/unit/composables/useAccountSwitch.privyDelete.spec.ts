// Deleting the connected Privy account, through the real account switch and
// the real auth, wallet and saved-address stores. Only Privy itself and the
// network are stood in for: the specs of each store alone mock the others,
// and so cannot see what they do to each other.
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

const fake = vi.hoisted(() => ({
  privy: {
    getAccessToken: vi.fn(),
    user: { get: vi.fn() },
    auth: {
      logout: vi.fn(),
      email: { sendCode: vi.fn(), loginWithCode: vi.fn() },
      oauth: { generateURL: vi.fn(), loginWithCode: vi.fn() },
    },
    embeddedWallet: { create: vi.fn(), getEthereumProvider: vi.fn() },
    mfa: { clearMfa: vi.fn() },
  },
}))
vi.mock('@/providers/privy/client', () => ({
  privy: fake.privy,
  privyReady: async () => undefined,
}))
vi.mock('@/providers/privy/walletIframe', () => ({
  mountWalletIframe: () => {},
  teardownWalletIframe: () => {},
}))
vi.mock('@/providers/privy/passkey', () => ({
  linkPasskey: vi.fn(),
  enrollPasskeys: vi.fn(),
  unlinkPasskey: vi.fn(),
  PasskeyCancelledError: class extends Error {},
}))
vi.mock('@/providers/privy/mfaChallenge', () => ({
  answerPasskeyChecks: () => {},
}))
vi.mock('@/modules/trade/composables', () => ({
  useMarketStatus: () => ({ isTradingRestrictedInRegion: { value: false } }),
}))
// The address screening is a network call in the app, and answers like one:
// later. A wallet being connected is still on its way while it does.
vi.mock('@/modules/trade/providers/ondoHelpers', () => ({
  checkAddressRestriction: () =>
    new Promise(resolve => setTimeout(() => resolve(false), 30)),
}))
vi.mock('@/analytics', () => ({
  analytics: new Proxy({}, { get: () => () => {} }),
  WalletStatus: {},
  BalanceBracket: {},
}))
vi.mock('@/analytics/events', () => ({
  AccountSecurityEvent: {},
  OnboardingEvent: {},
}))
vi.mock('@/modules/access/common/walletConfigs', () => ({
  WalletConfigType: { SOFTWARE: 'software', EXTENSION: 'extension' },
  walletConfigs: {},
}))
vi.mock('@sentry/vue', () => ({
  default: { captureException: () => {}, setTag: () => {} },
  captureException: () => {},
  setTag: () => {},
}))
vi.mock('@/stores/stocksStore', () => ({
  useStocksStore: () => ({ stocksBalances: [], allStocks: [] }),
}))
vi.mock('@/stores/chainsStore', async () => {
  const { defineStore } = await import('pinia')
  const { ref } = await import('vue')
  const chain = {
    name: 'ETHEREUM',
    nameLong: 'Ethereum',
    type: 'EVM',
    chainID: '1',
  }
  return {
    useChainsStore: defineStore('chainsStoreForPrivyDelete', () => ({
      selectedChain: ref(chain),
      isEvmChain: ref(true),
      isBitcoinChain: ref(false),
      chains: ref([chain]),
    })),
  }
})
vi.mock('@/stores/toastStore', () => ({
  useToastStore: () => ({ addToastMessage: () => {}, showToast: () => {} }),
}))
vi.mock('@/mew_api/fetchWithRetry', () => ({
  fetchWithRetry: async () => ({ result: [] }),
}))

import { useAccountSwitch } from '@/composables/useAccountSwitch'
import PrivyWallet from '@/providers/ethereum/privyWallet'
import { useAuthStore } from '@/stores/authStore'
import { useWalletStore } from '@/stores/walletStore'
import { useWatchOnlyStore } from '@/stores/watchOnlyStore'

const ADDRESS = '0x1111111111111111111111111111111111111111'
const OTHER = '0x2222222222222222222222222222222222222222'
const CHAIN = {
  name: 'ETHEREUM',
  nameLong: 'Ethereum',
  type: 'EVM',
  chainID: '1',
}
const user = {
  id: 'did:privy:1',
  created_at: 1,
  mfa_methods: [],
  linked_accounts: [
    { type: 'email', address: 'ada@example.com' },
    {
      type: 'wallet',
      id: 'w-1',
      address: ADDRESS,
      chain_id: 'eip155:1',
      chain_type: 'ethereum',
      connector_type: 'embedded',
      wallet_client: 'privy',
      wallet_client_type: 'privy',
      wallet_index: 0,
      delegated: false,
      imported: false,
      recovery_method: 'privy',
      user_can_sign: true,
    },
  ],
}
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

type Saved = { address: string }
const savedAddresses = (store: ReturnType<typeof useWatchOnlyStore>) =>
  (store.allAccounts as Saved[]).map(account => account.address.toLowerCase())

/** Log in with Privy and connect its wallet, as the login flow does. */
const connectPrivyWallet = async () => {
  sessionStorage.setItem('privy:token', '"tok"')
  fake.privy.getAccessToken.mockResolvedValue('tok')
  fake.privy.user.get.mockResolvedValue({ user })
  fake.privy.auth.email.loginWithCode.mockResolvedValue({
    user,
    is_new_user: false,
  })
  fake.privy.embeddedWallet.getEthereumProvider.mockResolvedValue({
    request: async () => null,
  })
  fake.privy.auth.logout.mockImplementation(async () => {
    fake.privy.getAccessToken.mockResolvedValue(null)
  })

  const auth = useAuthStore()
  const wallets = useWalletStore()
  await auth.loginWithEmailCode('ada@example.com', '123456')
  await auth.provisionWallet('1')
  await vi.waitFor(() => expect(wallets.walletAddress).toBe(ADDRESS))
  expect(wallets.wallet).toBeInstanceOf(PrivyWallet)
  return { auth, wallets, saved: useWatchOnlyStore() }
}

describe('deleting the connected Privy account', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    setActivePinia(createPinia())
  })

  it.each([
    ['it is the only saved account', false],
    ['another account is saved beside it', true],
  ])('removes its address for good when %s', async (_case, withOther) => {
    const { auth, saved } = await connectPrivyWallet()
    if (withOther) {
      saved.tryAddAddress(
        OTHER,
        CHAIN as never,
        'WATCH_ONLY',
        'EVM' as never,
        'Other',
      )
    }
    const account = (saved.allAccounts as Saved[]).find(
      entry => entry.address.toLowerCase() === ADDRESS,
    )
    expect(account).toBeDefined()

    await useAccountSwitch().deleteAccount(account as never)
    // Ending the login leaves the wallet watch-only on its way out. That
    // must not put the address back once it has been deleted.
    await wait(200)

    expect(savedAddresses(saved)).not.toContain(ADDRESS)
    expect(auth.status).toBe('anonymous')
    if (withOther) expect(savedAddresses(saved)).toContain(OTHER)
  })

  it('keeps its address removed when it is deleted right after it was disconnected', async () => {
    const { wallets, saved } = await connectPrivyWallet()
    const account = (saved.allAccounts as Saved[]).find(
      entry => entry.address.toLowerCase() === ADDRESS,
    )

    // Disconnecting falls back to the same address, watch-only, and that
    // takes a moment. The address is deleted before it has landed.
    wallets.disconnectWallet()
    await useAccountSwitch().deleteAccount(account as never)
    await wait(200)

    expect(savedAddresses(saved)).not.toContain(ADDRESS)
    expect(wallets.walletAddress).toBeNull()
  })
})
