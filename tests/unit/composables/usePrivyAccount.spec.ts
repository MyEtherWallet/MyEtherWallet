import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, defineStore, setActivePinia } from 'pinia'
import { ref } from 'vue'
import { WalletType } from '@/providers/types'

// The real stores reach the hardware-wallet SDK and the Privy modules, which
// break test load under jsdom; the composable only reads these few fields.
const state = vi.hoisted(() => ({
  walletType: null as string | null,
  isWatchOnly: false,
  email: null as string | null,
  loginMethod: null as string | null,
}))
vi.mock('@/stores/walletStore', () => ({
  useWalletStore: defineStore('wallet', () => ({
    wallet: ref(
      state.walletType === null
        ? null
        : { getWalletType: () => state.walletType },
    ),
    isWatchOnly: ref(state.isWatchOnly),
  })),
}))
vi.mock('@/stores/authStore', () => ({
  useAuthStore: defineStore('authStore', () => ({
    email: ref(state.email),
    loginMethod: ref(state.loginMethod),
  })),
}))

const { usePrivyAccount } = await import('@/composables/usePrivyAccount')

const account = (
  overrides: Partial<typeof state> = {},
): ReturnType<typeof usePrivyAccount> => {
  Object.assign(state, {
    walletType: WalletType.PRIVY,
    isWatchOnly: false,
    email: 'ada@example.com',
    loginMethod: 'google',
    ...overrides,
  })
  setActivePinia(createPinia())
  return usePrivyAccount()
}

describe('usePrivyAccount', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('knows the connected Privy wallet by its login email and method', () => {
    const { isPrivyConnected, email, loginMethod } = account()

    expect(isPrivyConnected.value).toBe(true)
    expect(email.value).toBe('ada@example.com')
    expect(loginMethod.value).toBe('google')
  })

  it('does not count a saved Privy address that is only being viewed', () => {
    const { isPrivyConnected, email, loginMethod } = account({
      isWatchOnly: true,
    })

    expect(isPrivyConnected.value).toBe(false)
    expect(email.value).toBeNull()
    expect(loginMethod.value).toBeNull()
  })

  it("keeps a login's email off another wallet that is connected while the login lives on", () => {
    const { isPrivyConnected, email, loginMethod } = account({
      walletType: WalletType.INJECTED,
    })

    expect(isPrivyConnected.value).toBe(false)
    expect(email.value).toBeNull()
    expect(loginMethod.value).toBeNull()
  })

  it('is not connected when there is no wallet', () => {
    const { isPrivyConnected, email } = account({ walletType: null })

    expect(isPrivyConnected.value).toBe(false)
    expect(email.value).toBeNull()
  })
})
