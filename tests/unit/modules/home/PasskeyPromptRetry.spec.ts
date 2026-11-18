import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { createPinia, defineStore, setActivePinia } from 'pinia'
import { ref } from 'vue'
import BigNumber from 'bignumber.js'

/**
 * The Home prompt with its real composable, against the one case mocks of
 * that composable cannot show: the passkey is made, making it the check
 * fails, and the account now has a passkey that protects nothing.
 */

type Passkey = { credentialId: string; active: boolean }

const h = await vi.hoisted(async () => {
  const { ref } = await import('vue')
  return {
    passkeys: ref<Passkey[]>([]),
    addPasskey: vi.fn(),
    activatePasskeys: vi.fn(),
  }
})

// The real stores reach the hardware-wallet SDK and the Privy modules, which
// break test load under jsdom; the prompt only reads these few fields.
vi.mock('@/stores/walletStore', () => ({
  useWalletStore: defineStore('walletStore', () => ({
    wallet: ref({ getWalletType: () => 'PRIVY' }),
    isWatchOnly: ref(false),
    walletAddress: ref('0x1111111111111111111111111111111111111111'),
    isLoadingBalances: ref(false),
    totalFiatPortfolioValueBN: ref(new BigNumber('50')),
  })),
}))
vi.mock('@/stores/authStore', () => ({
  useAuthStore: defineStore('authStore', () => ({
    email: ref('ada@example.com'),
    loginMethod: ref('google'),
    passkeys: h.passkeys,
    addPasskey: h.addPasskey,
    activatePasskeys: h.activatePasskeys,
  })),
}))
vi.mock('@/providers/privy/passkeySupport', () => ({
  passkeySupported: () => true,
}))
vi.mock('@/analytics', () => ({
  analytics: { trackAccountSecurityEvent: vi.fn() },
}))
vi.mock('vue-i18n', async importOriginal => {
  const actual = await importOriginal<typeof import('vue-i18n')>()
  return { ...actual, useI18n: () => ({ t: (key: string) => key }) }
})

import PasskeyPromptCard from '@/modules/home/components/PasskeyPromptCard.vue'

enableAutoUnmount(afterEach)

const addButton = (w: ReturnType<typeof mount>) =>
  w.findAll('button').find(b => b.text() === 'homePage.passkeyPrompt.add')!

describe('the Home passkey prompt when a passkey is made but cannot be made the check', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    setActivePinia(createPinia())
    h.passkeys.value = []
    // Privy linked the passkey, then the second half failed.
    h.addPasskey.mockImplementation(async () => {
      h.passkeys.value = [{ credentialId: 'cred-new', active: false }]
      throw new Error('Operation reached timeout: mfa:submit-enrollment')
    })
  })

  const render = () =>
    mount(PasskeyPromptCard, {
      global: { mocks: { $t: (key: string) => key } },
    })

  it('stays, says that it failed, and offers to try again', async () => {
    const w = render()

    await addButton(w).trigger('click')
    await flushPromises()

    expect(w.find('[role="alert"]').text()).toContain(
      'homePage.passkeyPrompt.error',
    )
    expect(addButton(w).exists()).toBe(true)
  })

  it('finishes that passkey on the next try, without making a second one', async () => {
    h.activatePasskeys.mockImplementation(async () => {
      h.passkeys.value = [{ credentialId: 'cred-new', active: true }]
    })
    const w = render()
    await addButton(w).trigger('click')
    await flushPromises()

    await addButton(w).trigger('click')
    await flushPromises()

    expect(h.addPasskey).toHaveBeenCalledTimes(1)
    expect(h.activatePasskeys.mock.calls).toEqual([['home_prompt']])
    // The wallet is protected now, so the prompt has nothing left to ask.
    expect(w.text()).toBe('')
  })
})
