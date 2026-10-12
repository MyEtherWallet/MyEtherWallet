import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'

const walletStore = vi.hoisted(() => ({ isWalletConnected: false }))

vi.mock('@/stores/walletStore', async () => {
  const { reactive } = await import('vue')
  const store = reactive(walletStore)
  return { useWalletStore: () => store }
})
vi.mock('pinia', async importOriginal => {
  const actual = await importOriginal<typeof import('pinia')>()
  const { toRefs } = await import('vue')
  return {
    ...actual,
    storeToRefs: (store: Record<string, unknown>) => toRefs(store),
  }
})
vi.mock('vue-i18n', () => ({ useI18n: () => ({ t: (k: string) => k }) }))
vi.mock('vue-router', () => ({ useRoute: () => ({}) }))
vi.mock('@/router/routeHierarchy', () => ({ pageRouteName: () => 'home' }))
vi.mock('@/composables/useAppBreakpoints', async () => {
  const { ref } = await import('vue')
  return {
    useAppBreakpoints: () => ({ isXLAndUp: ref(false), isMDAndUp: ref(false) }),
  }
})
vi.mock('@/analytics', () => ({
  analytics: { trackClickMainMenuEvent: vi.fn() },
  ClickMainMenuEvent: 'click_main_menu',
}))
const stub = vi.hoisted(() => () => ({ default: { render: () => null } }))
vi.mock('@/modules/send/ModuleSend.vue', stub)
vi.mock('@/modules/swap/ModuleSwap.vue', stub)
vi.mock('@/modules/trade/ModuleTrade.vue', stub)
vi.mock('@/modules/perps/ModulePerpsTrade.vue', stub)
vi.mock('@/modules/purchase/ModulePurchase.vue', stub)
vi.mock('@/components/core_layouts/MarketingTooltip.vue', () => ({
  default: { props: ['anchor'], render: () => null },
}))
vi.mock('@/modules/rwa_rewards/RwaRewardModal.vue', stub)
vi.mock('@/components/core_layouts/wallet/TheDepositDialog.vue', () => ({
  default: {
    name: 'TheDepositDialog',
    props: ['openDialog'],
    render: () => null,
  },
}))

import LayoutWallet from '@/components/core_layouts/LayoutWallet.vue'
import AppActionBar from '@/components/action_bar/AppActionBar.vue'
import MarketingTooltip from '@/components/core_layouts/MarketingTooltip.vue'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { analytics } from '@/analytics'

const factory = () =>
  mount(LayoutWallet, { global: { mocks: { $t: (k: string) => k } } })

const ids = (w: ReturnType<typeof mount>) =>
  w.findAll('[data-action-id]').map(b => b.attributes('data-action-id'))

describe('LayoutWallet action bar wiring', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    walletStore.isWalletConnected = false
  })

  it('lists the rail items in Figma order, Deposit only when connected', async () => {
    const w = factory()
    expect(ids(w)).toEqual([
      'trade',
      'swap',
      'perps',
      'bridge',
      'send',
      'purchase',
    ])

    walletStore.isWalletConnected = true
    w.unmount()
    const connected = factory()
    expect(ids(connected)).toEqual([
      'trade',
      'swap',
      'perps',
      'bridge',
      'deposit',
      'send',
      'purchase',
    ])
  })

  it('opens the panel and tracks the click on select', async () => {
    const w = factory()
    const menu = useWalletMenuStore()
    await w.get('[data-action-id="bridge"]').trigger('click')
    expect(menu.walletPanel).toBe('bridge')
    expect(menu.isOpenSideMenu).toBe(true)
    expect(analytics.trackClickMainMenuEvent).toHaveBeenCalledWith(
      'click_main_menu',
      { button: 'bridge' },
    )
  })

  it('opens the deposit dialog instead of a panel', async () => {
    walletStore.isWalletConnected = true
    const w = factory()
    const menu = useWalletMenuStore()
    await w.get('[data-action-id="deposit"]').trigger('click')
    expect(
      w.findComponent({ name: 'TheDepositDialog' }).props('openDialog'),
    ).toBe(true)
    expect(menu.isOpenSideMenu).toBe(false)
    expect(analytics.trackClickMainMenuEvent).not.toHaveBeenCalled()
  })

  it('toggles the side menu and only marks the open panel active', async () => {
    const w = factory()
    const menu = useWalletMenuStore()
    const bar = w.findComponent(AppActionBar)
    expect(bar.props('activeId')).toBeNull()

    bar.vm.$emit('toggle')
    await nextTick()
    expect(menu.isOpenSideMenu).toBe(true)
    expect(bar.props('expanded')).toBe(true)
    expect(bar.props('activeId')).toBe('swap')

    bar.vm.$emit('toggle')
    await nextTick()
    expect(menu.isOpenSideMenu).toBe(false)
    expect(bar.props('activeId')).toBeNull()
  })

  it('anchors the marketing tooltip on the Trade button', async () => {
    const w = factory()
    // The rail's template ref is set after the first render.
    await nextTick()
    expect(w.findComponent(MarketingTooltip).props('anchor')).toBe(
      w.get('[data-action-id="trade"]').element,
    )
  })
})
