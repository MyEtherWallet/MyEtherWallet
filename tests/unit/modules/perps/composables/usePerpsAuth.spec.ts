import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ref, nextTick } from 'vue'

const mockGetLoginChallenge = vi.fn()
const mockCompleteLoginChallenge = vi.fn()
const mockSetToken = vi.fn()
const mockSetOnUnauthorized = vi.fn()
const mockAcceptAgreement = vi.fn()
const mockGetPerpsBalance = vi.fn()
const mockGetPortfolioSummary = vi.fn()

vi.mock('@/modules/perps/configs', () => ({
  BUILDER_CODE: 'BC',
  perpsClient: {
    getLoginChallenge: mockGetLoginChallenge,
    completeLoginChallenge: mockCompleteLoginChallenge,
    setToken: mockSetToken,
    setOnUnauthorized: mockSetOnUnauthorized,
    acceptAgreement: mockAcceptAgreement,
    getPerpsBalance: mockGetPerpsBalance,
    getPortfolioSummary: mockGetPortfolioSummary,
  },
}))

vi.mock('@/utils/crypto', () => ({
  encrypt: vi.fn(async (value: string) => `enc:${value}`),
  decrypt: vi.fn(async (value: string) => {
    if (value.startsWith('enc:')) return value.slice(4)
    throw new Error('decrypt failed')
  }),
}))

const walletAddress = ref<string | null>('0xabc')
type MockWallet = {
  getAddress: () => Promise<string>
  SignMessage: (args: { message: string }) => Promise<string>
  // Injected type keeps login() on the direct-sign path, skipping the
  // hardware-wallet confirmation prompt that would otherwise block forever.
  getWalletType: () => string
}
const makeWallet = (): MockWallet => ({
  getAddress: vi.fn(async () => '0xabc'),
  SignMessage: vi.fn(async () => 'signature'),
  getWalletType: vi.fn(() => 'WAGMI'),
})
const wallet = ref<MockWallet | null>(makeWallet())
const isWalletConnected = ref(true)

vi.mock('pinia', async () => {
  const actual = await vi.importActual<typeof import('pinia')>('pinia')
  return {
    ...actual,
    storeToRefs: () => ({ wallet, walletAddress, isWalletConnected }),
  }
})

vi.mock('@/stores/walletStore', () => ({
  useWalletStore: () => ({ wallet, walletAddress, isWalletConnected }),
}))

vi.mock('@/modules/perps/composables/usePerpsToasts', () => ({
  usePerpsToasts: () => ({
    toastLiquidationInitiated: vi.fn(),
  }),
}))

// Required for this spec to load at all: `@/analytics` reaches
// `@/modules/access/common/walletConfigs` → `@enkryptcom/hw-wallets`, which
// resolves a `@ledgerhq/hw-app-eth` path that does not exist in the installed
// version. Without this mock every test here dies at import.
const mockTrackSignIn = vi.fn()
vi.mock('@/analytics', () => ({
  analytics: {
    trackPerpsSignInEvent: mockTrackSignIn,
    trackPerpsSignInErrorEvent: vi.fn(),
  },
  PerpsSignInEvent: {
    CLICKED: 'Perps_Sign_In_Clicked',
    SUCCESS: 'Perps_Sign_In_Success',
    ERROR: 'Perps_Sign_In_Error',
    CANCEL: 'Perps_Sign_In_Cancel',
  },
  PerpsEventSource: {
    MAIN_BANNER: 'Perps_Main_Banner',
    MARKET_INFO: 'Perps_Market_Info',
    PORTFOLIO: 'Perps_Portfolio',
    TRADE: 'Perps_Trade',
  },
}))

// Region gate. Defaults to allowed so the pre-existing cases below exercise the
// normal auth flow; the restricted-region cases flip it.
const isPerpsRestricted = ref(false)

// Lets a test park the restore flow on its first await. While a gate is
// installed `resolvePerpsRestricted()` stays pending, which is the window a
// wallet switch has to land in.
let restrictedGate: {
  promise: Promise<boolean>
  resolve: (value: boolean) => void
} | null = null
const installRestrictedGate = () => {
  let resolve!: (value: boolean) => void
  const promise = new Promise<boolean>(r => {
    resolve = r
  })
  restrictedGate = { promise, resolve }
  return restrictedGate
}

vi.mock('@/modules/perps/composables/usePerpsRestriction', () => ({
  usePerpsRestriction: () => ({
    isPerpsRestricted,
    perpsHelpUrl: 'https://help.example.test',
  }),
  resolvePerpsRestricted: () =>
    restrictedGate
      ? restrictedGate.promise
      : Promise.resolve(isPerpsRestricted.value),
}))

// The restore path awaits the geo check before touching localStorage, so a
// couple of nextTicks are not always enough to see its result.
const flushPromises = () => new Promise<void>(resolve => setTimeout(resolve, 0))

describe('usePerpsAuth — clearAuth state reset (MEW-1860)', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
    localStorage.clear()
    walletAddress.value = '0xabc'
    wallet.value = makeWallet()
    isWalletConnected.value = true
    isPerpsRestricted.value = false

    mockGetLoginChallenge.mockResolvedValue({
      result: { id: 'challenge-id', message: 'sign-me' },
    })
    mockCompleteLoginChallenge.mockResolvedValue({
      result: { token: 'new-token', accountId: 'acc-1' },
    })
    mockAcceptAgreement.mockResolvedValue(undefined)
  })

  it('after logout, login() runs again instead of being silently blocked by the auth-restored guard', async () => {
    // Seed localStorage with an encrypted token for the current wallet so that
    // tryRestoreAuth() succeeds on first call and sets _authRestored = true.
    localStorage.setItem(
      'perps_auth_token',
      JSON.stringify(['enc:restored-token']),
    )
    localStorage.setItem(
      'perps_auth_account',
      JSON.stringify(['enc:restored-account']),
    )

    const { usePerpsAuth } = await import(
      '@/modules/perps/composables/usePerpsAuth'
    )
    const auth = usePerpsAuth()

    // Allow the immediate walletAddress watcher to restore the token.
    await flushPromises()
    expect(auth.token.value).toBe('restored-token')

    // User signs out.
    auth.logout()
    await nextTick()
    expect(auth.token.value).toBeNull()

    // User clicks "Sign in" again — login() must reach the challenge call,
    // not bail out from the stale _authRestored guard.
    await auth.login()
    expect(mockGetLoginChallenge).toHaveBeenCalledTimes(1)
    expect(auth.token.value).toBe('new-token')
  })

  it('after 401 unauthorized triggers clearAuth, login() can run again', async () => {
    localStorage.setItem(
      'perps_auth_token',
      JSON.stringify(['enc:restored-token']),
    )
    localStorage.setItem(
      'perps_auth_account',
      JSON.stringify(['enc:restored-account']),
    )

    const { usePerpsAuth } = await import(
      '@/modules/perps/composables/usePerpsAuth'
    )
    const auth = usePerpsAuth()
    await flushPromises()
    expect(auth.token.value).toBe('restored-token')

    // Simulate perpsClient firing its onUnauthorized callback (e.g., 401 from
    // a balance poll). The registered handler calls clearAuth() internally.
    const onUnauthorizedCb = mockSetOnUnauthorized.mock.calls[0]?.[0]
    expect(typeof onUnauthorizedCb).toBe('function')
    await onUnauthorizedCb()
    await nextTick()
    expect(auth.token.value).toBeNull()

    // Sign in should be reachable again.
    await auth.login()
    expect(mockGetLoginChallenge).toHaveBeenCalledTimes(1)
    expect(auth.token.value).toBe('new-token')
  })

  it('clearAuth resets isAuthenticating so the loading state cannot get stuck', async () => {
    localStorage.setItem(
      'perps_auth_token',
      JSON.stringify(['enc:restored-token']),
    )

    const { usePerpsAuth } = await import(
      '@/modules/perps/composables/usePerpsAuth'
    )
    const auth = usePerpsAuth()
    await flushPromises()

    // Simulate an in-flight login that crashed before reaching the finally
    // block (e.g., user closed the tab; the ref was left as `true`).
    // We don't have a way to await the inner finally directly, so we mutate
    // the flag and then call logout — clearAuth must drop it back to false.
    ;(auth.isAuthenticating as { value: boolean }).value = true
    auth.logout()
    await nextTick()
    expect(auth.isAuthenticating.value).toBe(false)
  })
})

describe('usePerpsAuth — restricted region hard block', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
    localStorage.clear()
    walletAddress.value = '0xabc'
    wallet.value = makeWallet()
    isWalletConnected.value = true
    isPerpsRestricted.value = true

    mockGetLoginChallenge.mockResolvedValue({
      result: { id: 'challenge-id', message: 'sign-me' },
    })
    mockCompleteLoginChallenge.mockResolvedValue({
      result: { token: 'new-token', accountId: 'acc-1' },
    })
    mockAcceptAgreement.mockResolvedValue(undefined)
  })

  it('login() never requests a challenge', async () => {
    const { usePerpsAuth } = await import(
      '@/modules/perps/composables/usePerpsAuth'
    )
    const auth = usePerpsAuth()
    await flushPromises()

    await auth.login()

    expect(mockGetLoginChallenge).not.toHaveBeenCalled()
    expect(auth.token.value).toBeNull()
  })

  it('login() never prompts for a signature', async () => {
    const { usePerpsAuth } = await import(
      '@/modules/perps/composables/usePerpsAuth'
    )
    const auth = usePerpsAuth()
    await flushPromises()

    await auth.login()

    expect(wallet.value?.SignMessage).not.toHaveBeenCalled()
    expect(auth.showSigningPrompt.value).toBe(false)
  })

  it('login() does not emit a sign-in click, so the funnel is not inflated', async () => {
    const { usePerpsAuth } = await import(
      '@/modules/perps/composables/usePerpsAuth'
    )
    const auth = usePerpsAuth()
    await flushPromises()

    await auth.login()

    expect(mockTrackSignIn).not.toHaveBeenCalled()
  })

  it('does not restore a token stored before the region became restricted', async () => {
    // The regression this guards: a user signs in at home, then travels. Without
    // the gate the stored token rehydrates and the signed-in portfolio renders
    // where the blocked state belongs.
    localStorage.setItem(
      'perps_auth_token',
      JSON.stringify(['enc:restored-token']),
    )
    localStorage.setItem(
      'perps_auth_account',
      JSON.stringify(['enc:restored-account']),
    )

    const { usePerpsAuth } = await import(
      '@/modules/perps/composables/usePerpsAuth'
    )
    const auth = usePerpsAuth()
    await flushPromises()

    expect(auth.token.value).toBeNull()
    expect(mockSetToken).not.toHaveBeenCalledWith('restored-token')
  })

  it('leaves the stored token in place rather than purging it', async () => {
    // Deliberate: restore is skipped, not destroyed, so returning to an allowed
    // region gives the session back instead of forcing a fresh signature.
    localStorage.setItem(
      'perps_auth_token',
      JSON.stringify(['enc:restored-token']),
    )

    const { usePerpsAuth } = await import(
      '@/modules/perps/composables/usePerpsAuth'
    )
    usePerpsAuth()
    await flushPromises()

    expect(JSON.parse(localStorage.getItem('perps_auth_token') ?? '[]')).toEqual(
      ['enc:restored-token'],
    )
  })

  it('restores normally once the region is allowed again', async () => {
    isPerpsRestricted.value = false
    localStorage.setItem(
      'perps_auth_token',
      JSON.stringify(['enc:restored-token']),
    )
    localStorage.setItem(
      'perps_auth_account',
      JSON.stringify(['enc:restored-account']),
    )

    const { usePerpsAuth } = await import(
      '@/modules/perps/composables/usePerpsAuth'
    )
    const auth = usePerpsAuth()
    await flushPromises()

    // Proves the block above is the gate doing its job, not the fixture failing
    // to restore for some unrelated reason.
    expect(auth.token.value).toBe('restored-token')
  })
})

describe('usePerpsAuth — stale restore across a wallet switch', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
    localStorage.clear()
    walletAddress.value = null
    wallet.value = makeWallet()
    isWalletConnected.value = true
    isPerpsRestricted.value = false
    restrictedGate = null

    mockGetLoginChallenge.mockResolvedValue({
      result: { id: 'challenge-id', message: 'sign-me' },
    })
    mockCompleteLoginChallenge.mockResolvedValue({
      result: { token: 'new-token', accountId: 'acc-1' },
    })
    mockAcceptAgreement.mockResolvedValue(undefined)
  })

  /**
   * Seeds a token that belongs to address A only, and makes `decrypt`
   * address-aware so a restore running for B genuinely fails to claim it — the
   * production condition that decides which run installs a token.
   */
  const seedTokenForAddressA = async () => {
    localStorage.setItem('perps_auth_token', JSON.stringify(['tok@0xA']))
    localStorage.setItem('perps_auth_account', JSON.stringify(['acc@0xA']))

    // Pulled from the fresh module graph (beforeEach reset the registry), so this
    // is the same instance the composable will import.
    const { decrypt } = await import('@/utils/crypto')
    vi.mocked(decrypt).mockImplementation(
      async (value: string, address: string) => {
        const [kind, owner] = value.split('@')
        if (owner !== address) throw new Error('decrypt failed')
        return kind === 'tok' ? 'token-A' : 'account-A'
      },
    )
  }

  it('discards a restore for address A when the wallet switches to B mid-flight', async () => {
    await seedTokenForAddressA()
    const gate = installRestrictedGate()

    const { usePerpsAuth } = await import(
      '@/modules/perps/composables/usePerpsAuth'
    )
    const auth = usePerpsAuth()

    // Restore for A starts and parks on the region check.
    walletAddress.value = '0xA'
    await nextTick()

    // User switches wallets while A's restore is still suspended.
    walletAddress.value = '0xB'
    await nextTick()

    // Both runs resume. A's decrypt succeeds (the token is A's), B's fails —
    // so without a generation check A's token wins and the user ends up signed
    // in as A while B is the connected wallet.
    gate.resolve(false)
    await flushPromises()

    expect(auth.token.value).toBeNull()
    expect(mockSetToken).not.toHaveBeenCalledWith('token-A')
    expect(auth.accountId.value).toBeNull()
  })

  it('leaves a switched-away restore unable to block the new wallet from signing in', async () => {
    // Guards the fix rather than reproducing the bug (it passes either way):
    // `_authRestored` is one of login()'s early-return guards, so a generation
    // check that bails out while leaving that flag set would lock B out of
    // signing in — restored as neither A nor B, and unable to authenticate.
    await seedTokenForAddressA()
    const gate = installRestrictedGate()

    const { usePerpsAuth } = await import(
      '@/modules/perps/composables/usePerpsAuth'
    )
    const auth = usePerpsAuth()

    walletAddress.value = '0xA'
    await nextTick()
    walletAddress.value = '0xB'
    await nextTick()
    gate.resolve(false)
    await flushPromises()

    await auth.login()

    expect(mockGetLoginChallenge).toHaveBeenCalledTimes(1)
    expect(auth.token.value).toBe('new-token')
  })

  it('still restores when no switch happens, so the guard is not just blocking everything', async () => {
    await seedTokenForAddressA()
    const gate = installRestrictedGate()

    const { usePerpsAuth } = await import(
      '@/modules/perps/composables/usePerpsAuth'
    )
    const auth = usePerpsAuth()

    walletAddress.value = '0xA'
    await nextTick()
    gate.resolve(false)
    await flushPromises()

    expect(auth.token.value).toBe('token-A')
    expect(auth.accountId.value).toBe('account-A')
  })
})
