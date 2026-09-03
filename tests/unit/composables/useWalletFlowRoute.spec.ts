import { describe, it, expect, vi, beforeEach } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import type { Router, RouteRecordRaw } from 'vue-router'

// Mirrors the real lists in walletConfigs.ts — the route guards validate `?type=`
// against them, so a narrowed stub would make valid steps look like invalid ones.
vi.mock('@/modules/access/common/walletConfigs', () => ({
  ACCESS_WALLET_VIEWS: [
    'default',
    'ledger',
    'trezor',
    'keystore',
    'mnemonic',
    'private_key',
    'wallet_connect',
    'web3_wallet',
  ],
  CREATE_WALLET_VIEWS: ['default', 'buy', 'mnemonic'],
}))
vi.mock('@/views/ViewAccessWallet.vue', () => ({
  default: { render: () => null },
}))
vi.mock('@/views/ViewCreateWallet.vue', () => ({
  default: { render: () => null },
}))

import { withWalletFlowRoutes } from '@/router/routesWalletFlow'
import {
  useWalletFlowRoute,
  useWalletFlowUrlSync,
} from '@/composables/useWalletFlowRoute'

const Blank = { render: () => null }

const PAGES: RouteRecordRaw[] = [
  { path: '/', name: 'Home', component: Blank },
  {
    path: '/crypto',
    name: 'Crypto',
    component: Blank,
    children: [
      { path: 'token/:tokenId', name: 'token-info-crypto', component: Blank },
    ],
  },
  { path: '/stocks', name: 'Stocks', component: Blank },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: Blank,
    meta: { noWalletFlow: true },
  },
]

let router: Router

type Api = ReturnType<typeof useWalletFlowRoute>

/** Mount the composable inside the router context and hand back its return value. */
const setup = async (path: string): Promise<Api> => {
  await router.push(path)
  await router.isReady()
  let api!: Api
  mount(
    defineComponent({
      setup() {
        api = useWalletFlowRoute()
        return () => h('div')
      },
    }),
    { global: { plugins: [router] } },
  )
  return api
}

beforeEach(() => {
  router = createRouter({
    history: createMemoryHistory(),
    routes: withWalletFlowRoutes(PAGES),
  })
})

describe('useWalletFlowRoute', () => {
  it('targets the overlay on the current page', async () => {
    const { accessRoute, createRoute } = await setup('/stocks')
    expect(accessRoute.value.name).toBe('Stocks-access')
    expect(createRoute.value.name).toBe('Stocks-create')
  })

  it('targets the canonical standalone routes from Home', async () => {
    const { accessRoute, createRoute } = await setup('/')
    expect(accessRoute.value.name).toBe('Access')
    expect(createRoute.value.name).toBe('CreateWallet')
  })

  it('inherits a param’d host without passing params explicitly', async () => {
    const { accessRoute } = await setup('/crypto/token/peaq-2')
    expect(accessRoute.value.name).toBe('token-info-crypto-access')
    expect(router.resolve(accessRoute.value).fullPath).toContain('peaq-2')
  })

  it('reports the host page (not the overlay) while an overlay is active', async () => {
    const { hostRouteName, isWalletFlowRoute } = await setup(
      '/crypto/token/peaq-2/access?type=default',
    )
    expect(hostRouteName.value).toBe('token-info-crypto')
    expect(isWalletFlowRoute.value).toBe(true)
  })

  it('is not a wallet-flow route on a plain page', async () => {
    const { isWalletFlowRoute } = await setup('/stocks')
    expect(isWalletFlowRoute.value).toBe(false)
  })

  it('falls back to the canonical route on an opted-out page', async () => {
    const { accessRoute } = await setup('/nope')
    expect(accessRoute.value.name).toBe('Access')
  })

  it('returns to the host page on close, keeping its query and dropping type', async () => {
    const { closeWalletFlowRoute } = await setup(
      '/crypto/access?category=defi&type=default',
    )
    await closeWalletFlowRoute()
    expect(router.currentRoute.value.fullPath).toBe('/crypto?category=defi')
  })
})

/**
 * Mount the URL-sync composable with a caller-controlled open flag + view, mirroring
 * how ModuleAccessWallet / ModuleCreateWallet use it.
 */
const setupSync = async (
  path: string,
  kind: 'access' | 'create',
  isOpen = ref(false),
  currentView = ref('default'),
) => {
  await router.push(path)
  await router.isReady()
  mount(
    defineComponent({
      setup() {
        useWalletFlowUrlSync(isOpen, kind, currentView)
        return () => h('div')
      },
    }),
    { global: { plugins: [router] } },
  )
  return { isOpen, currentView }
}

describe('useWalletFlowUrlSync', () => {
  it('puts the flow in the URL when a caller opens the dialog by flag', async () => {
    // The reported bug: the dialog opened from /portfolio but the URL stayed there,
    // so the flow was neither deep-linkable nor cancellable back to the page.
    const { isOpen } = await setupSync('/stocks', 'access')
    isOpen.value = true
    await nextTick()
    await flushPromises()
    await flushPromises()
    expect(router.currentRoute.value.fullPath).toBe(
      '/stocks/access?type=default',
    )
  })

  it('carries the step the caller selected into ?type=', async () => {
    const view = ref('default')
    const { isOpen } = await setupSync('/stocks', 'access', ref(false), view)
    // openAccessDialog() resets the view, then the caller sets it — both happen before
    // the watcher flushes, so the URL must reflect the final value.
    isOpen.value = true
    view.value = 'mnemonic'
    await nextTick()
    await flushPromises()
    expect(router.currentRoute.value.query.type).toBe('mnemonic')
  })

  it('syncs under a param’d host', async () => {
    const { isOpen } = await setupSync('/crypto/token/peaq-2', 'access')
    isOpen.value = true
    await nextTick()
    await flushPromises()
    expect(router.currentRoute.value.fullPath).toBe(
      '/crypto/token/peaq-2/access?type=default',
    )
  })

  it('does not navigate when already on its own overlay route', async () => {
    const { isOpen } = await setupSync(
      '/stocks/access?type=ledger',
      'access',
      ref(true),
    )
    const before = router.currentRoute.value.fullPath
    isOpen.value = false
    isOpen.value = true
    await nextTick()
    await flushPromises()
    // A remount / route-first entry must not clobber the deep-linked step.
    expect(router.currentRoute.value.fullPath).toBe(before)
  })

  it('does navigate when on the OTHER overlay route, so create -> connect moves the URL', async () => {
    const { isOpen } = await setupSync('/create?type=default', 'access')
    isOpen.value = true
    await nextTick()
    await flushPromises()
    expect(router.currentRoute.value.fullPath).toBe('/access?type=default')
  })

  it('ignores the dialog closing (the route view owns that)', async () => {
    const { isOpen } = await setupSync('/stocks', 'access', ref(true))
    isOpen.value = false
    await nextTick()
    await flushPromises()
    expect(router.currentRoute.value.fullPath).toBe('/stocks')
  })
})
