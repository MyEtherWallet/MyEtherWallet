import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'

type FakeWallet = { getWalletType: () => string } | null

// Refs the mocked stores hand out, so a test can change what is connected.
// storeToRefs is stubbed to a passthrough below.
const h = await vi.hoisted(async () => {
  const { ref } = await import('vue')
  return {
    isSettingsOpen: ref(true),
    wallet: ref<FakeWallet>(null),
    isWatchOnly: ref(false),
    email: ref<string | null>(null),
    loginMethod: ref<string | null>(null),
    disconnectWallet: vi.fn(),
    analytics: { consent: true, setTrackingConsent: vi.fn() },
    walletAddress: ref<string | null>(null),
    track: vi.fn(),
  }
})

vi.mock('@/analytics', () => ({
  analytics: { trackAccountSecurityEvent: h.track },
}))

vi.mock('@/stores/appLayoutStore', () => ({
  useAppLayoutStore: () => ({ isSettingsOpen: h.isSettingsOpen }),
}))
vi.mock('@/stores/walletStore', async () => {
  const { computed } = await import('vue')
  return {
    useWalletStore: () => ({
      wallet: h.wallet,
      walletAddress: h.walletAddress,
      isWatchOnly: h.isWatchOnly,
      isWalletUnlocked: computed(
        () => h.wallet.value !== null && !h.isWatchOnly.value,
      ),
      disconnectWallet: h.disconnectWallet,
    }),
  }
})
vi.mock('@/stores/authStore', () => ({
  useAuthStore: () => ({
    email: h.email,
    loginMethod: h.loginMethod,
  }),
}))
vi.mock('@/stores/analyticsStore', () => ({
  useAnalyticsStore: () => h.analytics,
}))
vi.mock('@/stores/globalStore', async () => {
  const { ref } = await import('vue')
  const store = { defaultGasPriceType: ref('REGULAR'), locale: ref('en') }
  return { useGlobalStore: () => store }
})
vi.mock('@/stores/chainsStore', async () => {
  const { ref } = await import('vue')
  const store = { selectedChain: ref({ nameLong: 'Ethereum', icon: '' }) }
  return { useChainsStore: () => store }
})
vi.mock('@/stores/currencyStore', async () => {
  const { ref } = await import('vue')
  const store = {
    selectedCurrency: ref('USD'),
    setCurrency: vi.fn(),
    ensureRates: vi.fn(),
  }
  return {
    useCurrencyStore: () => store,
    SUPPORTED_CURRENCIES: [{ code: 'USD' }, { code: 'EUR' }],
  }
})
vi.mock('@/composables/useAppBreakpoints', async () => {
  const { ref } = await import('vue')
  return { useAppBreakpoints: () => ({ isXS: ref(false) }) }
})
vi.mock('@/utils/fiatIcons', () => ({ getFiatIcon: () => '' }))
vi.mock('vue-i18n', async importOriginal => {
  const actual = await importOriginal<typeof import('vue-i18n')>()
  const { ref } = await import('vue')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key, locale: ref('en') }),
  }
})
vi.mock('pinia', async importOriginal => {
  const actual = await importOriginal<typeof import('pinia')>()
  return { ...actual, storeToRefs: (store: Record<string, unknown>) => store }
})

import TheSettingsPopup from '@/components/core_layouts/TheSettingsPopup.vue'
import SettingsLoginMethods from '@/components/core_layouts/settings/SettingsLoginMethods.vue'
import SettingsPhraseAcknowledge from '@/components/core_layouts/settings/SettingsPhraseAcknowledge.vue'

// The mocked stores are shared refs: a component left mounted by one test
// would react to the next test's changes.
enableAutoUnmount(afterEach)

const EMAIL = 'ada@example.com'

const open = () =>
  mount(TheSettingsPopup, {
    global: {
      mocks: { $t: (key: string) => key },
      stubs: {
        teleport: true,
        AppTokenLogo: true,
        AppSearchbar: true,
        SelectChainForApp: true,
        AppTooltip: { template: '<span><slot /></span>' },
        // Reads the auth store's passkeys; it has its own spec.
        SettingsPasskeys: true,
      },
    },
  })

const connect = (walletType: string, watchOnly = false) => {
  h.wallet.value = { getWalletType: () => walletType }
  h.isWatchOnly.value = watchOnly
}
const ADDRESS = '0x1111111111111111111111111111111111111111'
const connectPrivy = () => {
  connect('PRIVY')
  h.walletAddress.value = ADDRESS
  h.email.value = EMAIL
  h.loginMethod.value = 'google'
}

type Popup = ReturnType<typeof open>
const main = (w: Popup) => w.find('[data-test="settings-main"]')
const loginMethods = (w: Popup) =>
  w.find('[data-test="settings-login-methods"]')
const row = (w: Popup, label: string) =>
  main(w)
    .findAll('[data-testid="cell"]')
    .find(cell => cell.text().includes(label))
/**
 * Whether a panel is the one out of use. Browsers reflect `inert` as a
 * property; jsdom has none, so Vue writes the attribute as 'true' / 'false'.
 */
const isInert = (panel: ReturnType<Popup['find']>) => {
  const value = panel.attributes('inert')
  return value !== undefined && value !== 'false'
}
const logOut = (w: Popup) =>
  main(w)
    .findAll('button')
    .find(button => button.text().includes('settings.log_out'))

describe('TheSettingsPopup', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    h.isSettingsOpen.value = true
    h.wallet.value = null
    h.isWatchOnly.value = false
    h.email.value = null
    h.loginMethod.value = null
    h.analytics.consent = true
    h.walletAddress.value = null
  })

  describe('for every user', () => {
    it('lists the preferences, Analytics among them, with no Security heading', () => {
      const w = open()

      for (const label of [
        'settings.currency',
        'settings.language',
        'settings.default_fee',
        'settings.usage_analytics',
      ]) {
        expect(row(w, label)).toBeDefined()
      }
      expect(main(w).text()).not.toContain('settings.security')
    })

    it('is as wide as the account menu and never wider than the screen', () => {
      const w = open()

      const popup = w.find('[data-test="settings-popup"]')
      expect(popup.classes()).toContain('w-96')
      expect(popup.classes()).toContain('max-w-[calc(100vw-32px)]')
    })

    it('turns analytics off from its switch', async () => {
      const w = open()

      await main(w).find('[role="switch"]').trigger('click')

      expect(h.analytics.setTrackingConsent).toHaveBeenCalledWith(false)
    })

    it('still opens the currency list from its row', async () => {
      const w = open()

      await row(w, 'settings.currency')!.trigger('click')

      expect(isInert(main(w))).toBe(true)
      expect(isInert(w.find('[data-test="settings-currency"]'))).toBe(false)
    })
  })

  describe('the connected wallet', () => {
    it('gives a wallet that is not Privy a Log out and no Connected wallet section', () => {
      connect('INJECTED')
      const w = open()

      expect(logOut(w)).toBeDefined()
      expect(main(w).text()).not.toContain('settings.connected_wallet')
      expect(row(w, 'settings.login_methods')).toBeUndefined()
    })

    it('gives a watch-only address neither', () => {
      connect('PRIVY', true)
      const w = open()

      expect(logOut(w)).toBeUndefined()
      expect(main(w).text()).not.toContain('settings.connected_wallet')
    })

    it('gives a visitor with no wallet neither', () => {
      const w = open()

      expect(logOut(w)).toBeUndefined()
      expect(main(w).text()).not.toContain('settings.connected_wallet')
    })

    it('gives a connected Privy wallet the Connected wallet section, with Login methods and Recovery Phrase as its rows, and Log out', () => {
      connectPrivy()
      const w = open()

      const section = w.find('[data-test="settings-connected-wallet"]')
      expect(section.text()).toContain('settings.connected_wallet')
      const rows = section.findAll('[data-testid="cell"]')
      expect(rows.map(cell => cell.text())).toEqual([
        'settings.login_methods',
        'settings.recovery_phrase',
      ])
      expect(logOut(w)).toBeDefined()
    })

    it('opens Login methods with the method and email of the login, and comes back', async () => {
      connectPrivy()
      const w = open()

      await row(w, 'settings.login_methods')!.trigger('click')

      expect(isInert(main(w))).toBe(true)
      expect(isInert(loginMethods(w))).toBe(false)
      const screen = w.findComponent(SettingsLoginMethods)
      expect(screen.props()).toMatchObject({ method: 'google', email: EMAIL })

      screen.vm.$emit('back')
      await flushPromises()

      expect(isInert(main(w))).toBe(false)
      expect(isInert(loginMethods(w))).toBe(true)
    })

    it('leaves Login methods when the Privy wallet stops being the connected one', async () => {
      connectPrivy()
      const w = open()
      await row(w, 'settings.login_methods')!.trigger('click')

      h.isWatchOnly.value = true
      await flushPromises()

      expect(isInert(main(w))).toBe(false)
      expect(isInert(loginMethods(w))).toBe(true)
    })

    it('disconnects the wallet and closes on Log out', async () => {
      connect('LEDGER')
      const w = open()

      await logOut(w)!.trigger('click')

      expect(h.disconnectWallet).toHaveBeenCalledTimes(1)
      expect(h.isSettingsOpen.value).toBe(false)
    })
  })

  // The phrase itself is shown by Privy, on the wallet export page: Settings
  // only says what to know first and sends the user there.
  describe('the recovery phrase', () => {
    const acknowledge = (w: Popup) =>
      w.find('[data-test="settings-phrase-ack"]')
    let openWindow: ReturnType<typeof vi.spyOn>
    beforeEach(() => {
      openWindow = vi.spyOn(window, 'open').mockReturnValue(null)
    })
    afterEach(() => openWindow.mockRestore())

    /** Settings on "Before you continue", for a connected Privy wallet. */
    const openAcknowledgement = async () => {
      connectPrivy()
      const w = open()
      await row(w, 'settings.recovery_phrase')!.trigger('click')
      return w
    }

    it('opens on "Before you continue" and opens nothing else yet', async () => {
      const w = await openAcknowledgement()

      expect(isInert(acknowledge(w))).toBe(false)
      expect(isInert(main(w))).toBe(true)
      expect(openWindow).not.toHaveBeenCalled()
      expect(h.track).toHaveBeenCalledWith('Recovery_Phrase_Opened')
    })

    it('opens the wallet export page in its own tab when the user asks to view the phrase', async () => {
      const w = await openAcknowledgement()

      w.findComponent(SettingsPhraseAcknowledge).vm.$emit('view')
      await flushPromises()

      // No opener: the page gets nothing of this tab, not even its storage.
      expect(openWindow.mock.calls).toEqual([
        ['/wallet-export.html', '_blank', 'noopener'],
      ])
      expect(h.track).toHaveBeenCalledWith('Recovery_Phrase_Export_Opened')
      expect(isInert(main(w))).toBe(false)
    })

    it('goes back to Settings from "Before you continue"', async () => {
      const w = await openAcknowledgement()

      w.findComponent(SettingsPhraseAcknowledge).vm.$emit('back')
      await flushPromises()

      expect(isInert(main(w))).toBe(false)
      expect(openWindow).not.toHaveBeenCalled()
    })

    it('leaves "Before you continue" when the Privy wallet stops being the connected one', async () => {
      const w = await openAcknowledgement()

      h.isWatchOnly.value = true
      await flushPromises()

      expect(isInert(main(w))).toBe(false)
    })

    it('has no Recovery Phrase row for a wallet that is not Privy', () => {
      connect('LEDGER')
      const w = open()

      expect(row(w, 'settings.recovery_phrase')).toBeUndefined()
    })
  })

  // The popup is fixed to the screen, so the page cannot scroll it: a panel
  // taller than the room under the popup has to scroll by itself, or its last
  // controls (removing a passkey, the button to the phrase) cannot be reached.
  describe('a Privy panel on a short screen', () => {
    const SCREEN_HEIGHT = window.innerHeight
    afterEach(() => {
      window.innerHeight = SCREEN_HEIGHT
    })

    // jsdom lays nothing out, so the popup sits at the top of the screen:
    // 8px under its button, with 16px kept clear at the bottom.
    const ROOM_ON_500 = 500 - 8 - 16
    const panels = [
      ['Login methods', 'settings.login_methods', 'settings-login-methods'],
      [
        '"Before you continue"',
        'settings.recovery_phrase',
        'settings-phrase-ack',
      ],
    ] as const

    /** Open `rowLabel`'s panel, laid out `contentHeight` tall, on a 500px screen. */
    const openPanel = async (
      rowLabel: string,
      testId: string,
      contentHeight: number,
    ) => {
      window.innerHeight = 500
      connectPrivy()
      const w = open()
      const panel = w.find(`[data-test="${testId}"]`)
      Object.defineProperty(panel.element, 'scrollHeight', {
        configurable: true,
        value: contentHeight,
      })
      await row(w, rowLabel)!.trigger('click')
      await flushPromises()
      const track = panel.element.parentElement as HTMLElement
      return { w, panel: panel.element as HTMLElement, track }
    }

    it.each(panels)(
      '%s keeps its own height when it fits',
      async (_name, rowLabel, testId) => {
        const { track } = await openPanel(rowLabel, testId, 300)

        expect(track.style.height).toBe('300px')
      },
    )

    it.each(panels)(
      '%s stops at the bottom of the screen and scrolls when it does not fit',
      async (_name, rowLabel, testId) => {
        const { panel, track } = await openPanel(rowLabel, testId, 700)

        expect(track.style.height).toBe(`${ROOM_ON_500}px`)
        expect(panel.style.maxHeight).toBe(`${ROOM_ON_500}px`)
        expect(panel.classList).toContain('overflow-y-auto')
      },
    )

    it('follows the screen when it gets shorter', async () => {
      const { track } = await openPanel(
        'settings.recovery_phrase',
        'settings-phrase-ack',
        400,
      )
      expect(track.style.height).toBe('400px')

      window.innerHeight = 300
      window.dispatchEvent(new Event('resize'))
      await flushPromises()

      expect(track.style.height).toBe(`${300 - 8 - 16}px`)
    })
  })
})
