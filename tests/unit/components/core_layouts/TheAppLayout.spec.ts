import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import type { Router, RouteRecordRaw } from 'vue-router'

vi.mock('@/stores/walletStore', async () => {
  const { defineStore } = await import('pinia')
  const { ref } = await import('vue')
  return {
    useWalletStore: defineStore('walletStore', () => ({
      wallet: ref(null),
      isWalletConnected: ref(false),
      isConnectingWallet: ref(false),
    })),
  }
})
vi.mock('@/stores/accessStore', async () => {
  const { defineStore } = await import('pinia')
  const { ref } = await import('vue')
  return {
    useAccessStore: defineStore('accessStore', () => ({
      isOpenAccessDialog: ref(false),
    })),
  }
})
vi.mock('vue-i18n', () => ({ useI18n: () => ({ t: (k: string) => k }) }))
vi.mock('@myetherwallet/vue-common-components', () => ({
  AppFooter: { render: () => null },
}))
vi.mock('@/composables/useFooterProps', () => ({ useFooterProps: () => ({}) }))
const stub = vi.hoisted(() => () => ({ default: { render: () => null } }))
vi.mock('@/components/core_layouts/TheHeader.vue', stub)
vi.mock('@/components/core_layouts/LayoutWallet.vue', stub)
vi.mock('@/modules/access/common/walletConfigs', () => ({
  ACCESS_WALLET_VIEWS: ['default'],
  CREATE_WALLET_VIEWS: ['default'],
}))
vi.mock('@/views/ViewAccessWallet.vue', stub)
vi.mock('@/views/ViewCreateWallet.vue', stub)

import TheAppLayout from '@/components/core_layouts/TheAppLayout.vue'
import { withWalletFlowRoutes } from '@/router/routesWalletFlow'
import { Provider } from '@/providers'

const Page = { template: '<router-view />' }

const PAGES: RouteRecordRaw[] = [
  { path: '/', name: 'Home', component: Page },
  {
    path: '/crypto',
    name: 'Crypto',
    component: Page,
    children: [
      { path: 'token/:tokenId', name: 'token-info-crypto', component: Page },
    ],
  },
  { path: '/stocks', name: 'Stocks', component: Page },
]

let router: Router
// jsdom has no layout, so Element#scrollTo doesn't exist; spy on it instead.
const scrollTo = vi.fn()

const mountAt = async (path: string) => {
  router = createRouter({
    history: createMemoryHistory(),
    routes: withWalletFlowRoutes(PAGES),
  })
  await router.push(path)
  await router.isReady()
  const wrapper = mount(TheAppLayout, {
    global: {
      plugins: [router, createPinia()],
      provide: { [Provider.ANALYTICS]: { amplitude: {} } },
      stubs: { teleport: true },
    },
  })
  scrollTo.mockClear()
  return wrapper.find('.overflow-y-auto').element
}

const navigate = async (to: Parameters<Router['push']>[0]) => {
  await router.push(to)
  await flushPromises()
}

beforeEach(() => {
  HTMLElement.prototype.scrollTo = scrollTo
})
afterEach(() => {
  delete (HTMLElement.prototype as Partial<HTMLElement>).scrollTo
})

describe('TheAppLayout scroll on navigation', () => {
  it('brings a new page to the top of the app scroll container', async () => {
    const container = await mountAt('/crypto')

    await navigate('/stocks')

    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
    expect(scrollTo.mock.contexts[0]).toBe(container)
  })

  it('keeps the page in place when a drawer opens over it and closes', async () => {
    await mountAt('/crypto')

    await navigate('/crypto/token/eth')
    await navigate('/crypto')

    expect(scrollTo).not.toHaveBeenCalled()
  })

  it('keeps the page in place when the connect overlay opens over it', async () => {
    await mountAt('/stocks')

    await navigate({ name: 'Stocks-access' })

    expect(scrollTo).not.toHaveBeenCalled()
  })

  it('leaves hash links to the page that owns the anchor', async () => {
    await mountAt('/')

    await navigate('/stocks#oip')

    expect(scrollTo).not.toHaveBeenCalled()
  })
})
