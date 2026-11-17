import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, RouterLinkStub, type VueWrapper } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { ref } from 'vue'

// Everything the header hosts besides the navbar has its own spec.
const stub = (name: string) => ({ default: { name, template: '<div />' } })
vi.mock('@/components/AppSelect.vue', () => stub('AppSelect'))
vi.mock('@/components/core_layouts/TheAppSideMenu.vue', () =>
  stub('TheAppSideMenu'),
)
vi.mock('@/components/core_layouts/wallet/TheAddressMenu.vue', () =>
  stub('TheAddressMenu'),
)
vi.mock('@/components/core_layouts/TheNotificationsPopup.vue', () =>
  stub('TheNotificationsPopup'),
)
vi.mock('@/components/core_layouts/TheSettingsPopup.vue', () =>
  stub('TheSettingsPopup'),
)
vi.mock('@/modules/global_search/ModuleGlobalSearch.vue', () =>
  stub('ModuleGlobalSearch'),
)
vi.mock('@/components/navbar/AppNavLink.vue', () => stub('AppNavLink'))

vi.mock('pinia', async orig => ({
  ...(await orig<typeof import('pinia')>()),
  storeToRefs: (store: unknown) => store,
}))
vi.mock('@/stores/walletStore', () => ({
  useWalletStore: () => ({
    isWalletConnected: ref(false),
    setWatchOnlyIfExist: vi.fn(),
  }),
}))
vi.mock('@/stores/chainsStore', () => ({
  useChainsStore: () => ({ selectedChain: ref({ type: 'EVM' }) }),
}))
vi.mock('@/stores/watchOnlyStore', () => ({
  useWatchOnlyStore: () => ({ watchOnlyAddresses: {} }),
}))
vi.mock('@/stores/globalStore', () => ({
  useGlobalStore: () => ({ fetchTradingRestriction: vi.fn() }),
}))
vi.mock('@/modules/global_search/composables/useGlobalSearch', () => ({
  useGlobalSearch: () => ({ isOpen: ref(false), close: vi.fn() }),
}))
vi.mock('@/composables/useDetectedAddress', () => ({
  useDetectedAddress: () => ({ refreshDetectedAddress: vi.fn() }),
}))
vi.mock('@/composables/useAppBreakpoints', () => ({
  useAppBreakpoints: () => ({ isXLAndUp: ref(true) }),
}))

// The connect overlay opens over whatever page the user is on.
const ACCESS_OVER_STOCKS = {
  name: 'stocks-access',
  query: { category: 'tech', type: 'default' },
}
vi.mock('@/composables/useWalletFlowRoute', () => ({
  useWalletFlowRoute: () => ({ accessRoute: ref(ACCESS_OVER_STOCKS) }),
}))
const push = vi.fn()
vi.mock('vue-router', async orig => ({
  ...(await orig<typeof import('vue-router')>()),
  useRouter: () => ({ push }),
}))
const analytics = vi.hoisted(() => ({
  trackConnectWalletEvent: vi.fn(),
  trackCreateWalletEvent: vi.fn(),
}))
vi.mock('@/analytics', () => ({ analytics }))

const { ConnectWalletEvent } = await import('@/analytics/events')
const { default: TheHeader } =
  await import('@/components/core_layouts/TheHeader.vue')

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  missingWarn: false,
  fallbackWarn: false,
  messages: {
    en: {
      access_wallet: {
        social: { title: 'Log in/Sign Up', title_short: 'Log in' },
      },
    },
  },
})

let wrapper: VueWrapper | undefined
const mountHeader = () => {
  wrapper = mount(TheHeader, {
    global: {
      plugins: [i18n],
      directives: { ripple: { mounted: () => {}, updated: () => {} } },
      stubs: { RouterLink: RouterLinkStub },
    },
  })
  return wrapper
}
beforeEach(() => vi.clearAllMocks())
afterEach(() => wrapper?.unmount())

const logIn = (w: VueWrapper) => w.get('[data-testid="navbar-log-in"]')

describe('TheHeader — logged out', () => {
  it('offers one button, Log in/Sign Up', () => {
    const w = mountHeader()

    expect(logIn(w).text()).toContain('Log in/Sign Up')
    expect(w.text()).not.toContain('Create')
    expect(w.text()).not.toContain('Connect')
  })

  it('opens Log in / Sign Up over the current page, keeping its query', async () => {
    const w = mountHeader()

    await logIn(w).trigger('click')

    expect(push).toHaveBeenCalledTimes(1)
    expect(push).toHaveBeenCalledWith({
      name: 'stocks-access',
      query: { category: 'tech', type: 'sign_up' },
    })
  })

  it('reports the click the way the Connect button did', async () => {
    const w = mountHeader()

    await logIn(w).trigger('click')

    expect(analytics.trackConnectWalletEvent).toHaveBeenCalledWith(
      ConnectWalletEvent.CLICKED,
      { source: 'Header_Connect' },
    )
    expect(analytics.trackCreateWalletEvent).not.toHaveBeenCalled()
  })
})
