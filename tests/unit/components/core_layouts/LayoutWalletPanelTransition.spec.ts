import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'

// Switching side panel modules runs through a real <transition mode="out-in">.
// A module whose template has a root-level comment (kept in dev builds) is a
// fragment root; leaving it must still let the next module mount.

vi.mock('@/stores/walletStore', async () => {
  const { reactive } = await import('vue')
  const store = reactive({ isWalletConnected: false })
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
vi.mock('vue-router', () => ({
  useRoute: () => ({ query: {}, matched: [] }),
  useRouter: () => ({
    isReady: () => Promise.resolve(),
    push: () => Promise.resolve(),
  }),
}))
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
const panel = vi.hoisted(
  () => (id: string, rootComment = false) =>
    () => ({
      default: {
        template: `${rootComment ? '<!-- root note -->' : ''}<div data-panel="${id}">${id}</div>`,
      },
    }),
)
vi.mock('@/modules/send/ModuleSend.vue', panel('send'))
vi.mock('@/modules/swap/ModuleSwap.vue', panel('swap'))
vi.mock('@/modules/trade/ModuleTrade.vue', panel('trade'))
vi.mock('@/modules/perps/ModulePerpsTrade.vue', panel('perps', true))
vi.mock('@/modules/purchase/ModulePurchase.vue', panel('purchase'))
const empty = vi.hoisted(() => () => ({ default: { render: () => null } }))
vi.mock('@/components/core_layouts/MarketingTooltip.vue', empty)
vi.mock('@/modules/rwa_rewards/RwaRewardModal.vue', empty)
vi.mock('@/components/core_layouts/wallet/TheDepositDialog.vue', empty)

import LayoutWallet from '@/components/core_layouts/LayoutWallet.vue'
import { useWalletMenuStore } from '@/stores/walletMenuStore'

// Leave/enter wait on animation frames and transition end; let them settle.
const settle = async () => {
  await nextTick()
  await new Promise(resolve => setTimeout(resolve, 100))
  await nextTick()
}

const shownPanel = (w: ReturnType<typeof mount>) =>
  w.find('[data-panel]').attributes('data-panel')

describe('LayoutWallet panel switching', () => {
  beforeEach(() => setActivePinia(createPinia()))

  const factory = () =>
    mount(LayoutWallet, {
      global: {
        mocks: { $t: (k: string) => k },
        stubs: { transition: false },
      },
    })

  it('switches between single-root modules', async () => {
    const w = factory()
    const menu = useWalletMenuStore()

    menu.openPanel('send')
    await settle()
    expect(shownPanel(w)).toBe('send')

    menu.openPanel('trade')
    await settle()
    expect(shownPanel(w)).toBe('trade')
  })

  it('mounts the next module after leaving one with a root comment', async () => {
    const w = factory()
    const menu = useWalletMenuStore()

    menu.openPanel('perps')
    await settle()
    expect(shownPanel(w)).toBe('perps')

    menu.openPanel('send')
    await settle()
    expect(w.find('[data-panel]').exists()).toBe(true)
    expect(shownPanel(w)).toBe('send')

    menu.openPanel('trade')
    await settle()
    expect(shownPanel(w)).toBe('trade')
  })
})
