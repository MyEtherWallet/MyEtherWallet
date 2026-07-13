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
const wallet = ref<{ getAddress: () => Promise<string>; SignMessage: (args: { message: string }) => Promise<string> } | null>({
  getAddress: vi.fn(async () => '0xabc'),
  SignMessage: vi.fn(async () => 'signature'),
})
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

describe('usePerpsAuth — clearAuth state reset (MEW-1860)', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
    localStorage.clear()
    walletAddress.value = '0xabc'
    wallet.value = {
      getAddress: vi.fn(async () => '0xabc'),
      SignMessage: vi.fn(async () => 'signature'),
    }
    isWalletConnected.value = true

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
    await nextTick()
    await nextTick()
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
    await nextTick()
    await nextTick()
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
    await nextTick()
    await nextTick()

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
