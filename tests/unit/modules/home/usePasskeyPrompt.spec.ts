import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, defineStore, setActivePinia } from 'pinia'
import { ref } from 'vue'
import BigNumber from 'bignumber.js'

const ADDRESS = '0x1111111111111111111111111111111111111111'
const OTHER = '0x2222222222222222222222222222222222222222'

// The real stores reach the hardware-wallet SDK and the Privy modules, which
// break test load under jsdom; the composable only reads these few fields.
const state = vi.hoisted(() => ({
  walletType: 'PRIVY' as string | null,
  isWatchOnly: false,
  walletAddress: '' as string | null,
  isLoadingBalances: false,
  totalFiat: '50',
  passkeys: [] as unknown[],
  supported: true,
}))
vi.mock('@/stores/walletStore', () => ({
  useWalletStore: defineStore('walletStore', () => ({
    wallet: ref(
      state.walletType === null
        ? null
        : { getWalletType: () => state.walletType },
    ),
    isWatchOnly: ref(state.isWatchOnly),
    walletAddress: ref(state.walletAddress),
    isLoadingBalances: ref(state.isLoadingBalances),
    totalFiatPortfolioValueBN: ref(new BigNumber(state.totalFiat)),
  })),
}))
vi.mock('@/stores/authStore', () => ({
  useAuthStore: defineStore('authStore', () => ({
    email: ref('ada@example.com'),
    loginMethod: ref('google'),
    passkeys: ref(state.passkeys),
  })),
}))
vi.mock('@/providers/privy/passkeySupport', () => ({
  passkeySupported: () => state.supported,
}))

const { usePasskeyPrompt } =
  await import('@/modules/home/composables/usePasskeyPrompt')

/** The prompt as a fresh page load sees it, for the given state. */
const prompt = (overrides: Partial<typeof state> = {}) => {
  Object.assign(state, {
    walletType: 'PRIVY',
    isWatchOnly: false,
    walletAddress: ADDRESS,
    isLoadingBalances: false,
    totalFiat: '50',
    passkeys: [],
    supported: true,
    ...overrides,
  })
  setActivePinia(createPinia())
  return usePasskeyPrompt()
}

describe('usePasskeyPrompt', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('shows for a connected Privy wallet that holds funds and has no passkey', () => {
    expect(prompt().isVisible.value).toBe(true)
  })

  it('waits for the balances before it decides', () => {
    expect(prompt({ isLoadingBalances: true }).isVisible.value).toBe(false)
  })

  it('does not show for an empty wallet', () => {
    expect(prompt({ totalFiat: '0' }).isVisible.value).toBe(false)
  })

  it('does not show once a passkey protects the wallet', () => {
    expect(
      prompt({ passkeys: [{ credentialId: 'a', active: true }] }).isVisible
        .value,
    ).toBe(false)
  })

  it('still shows, to finish the job, while the only passkey was made but protects nothing yet', () => {
    const half = prompt({ passkeys: [{ credentialId: 'a', active: false }] })

    expect(half.isVisible.value).toBe(true)
    expect(half.awaitsActivation.value).toBe(true)
  })

  it('has nothing to finish for an account without a passkey', () => {
    expect(prompt().awaitsActivation.value).toBe(false)
  })

  it('does not show for a wallet that is not Privy, or a Privy address that is only being viewed', () => {
    expect(prompt({ walletType: 'INJECTED' }).isVisible.value).toBe(false)
    expect(prompt({ isWatchOnly: true }).isVisible.value).toBe(false)
  })

  it('does not show on a browser that cannot make a passkey', () => {
    expect(prompt({ supported: false }).isVisible.value).toBe(false)
  })

  it('goes away when dismissed and stays away after a reload', () => {
    const first = prompt()
    first.dismiss()
    expect(first.isVisible.value).toBe(false)

    expect(prompt().isVisible.value).toBe(false)
  })

  it('remembers a dismissal per account, whatever the case of the address', () => {
    prompt().dismiss()

    expect(
      prompt({ walletAddress: ADDRESS.toUpperCase() }).isVisible.value,
    ).toBe(false)
    expect(prompt({ walletAddress: OTHER }).isVisible.value).toBe(true)
  })
})
