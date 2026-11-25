import { describe, it, expect, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { ref } from 'vue'

const h = vi.hoisted(() => ({ swapModule: {} as Record<string, unknown> }))

// The module only lays out what useSwapModule returns, and its children read
// stores of their own (walletStore pulls in Ledger, which can't load here).
vi.mock('@/modules/swap/composables/useSwapModule', () => ({
  useSwapModule: () => h.swapModule,
}))
vi.mock('@/components/AppSwapForm.vue', () => ({
  default: {
    name: 'AppSwapForm',
    props: ['showQuickActions'],
    template: '<div />',
  },
}))
vi.mock('@/components/address_book/AddressInput.vue', () => ({ default: {} }))
vi.mock('@/components/select_chain/SelectChainForApp.vue', () => ({
  default: {},
}))
vi.mock('@/components/AppNoChainBalance.vue', () => ({ default: {} }))
vi.mock('@/modules/swap/components/SwapOfferModal.vue', () => ({
  default: {},
}))
vi.mock('@/modules/swap/components/SwapInitiatedModal.vue', () => ({
  default: {},
}))
vi.mock('vue-i18n', async importOriginal => {
  const actual = await importOriginal<typeof import('vue-i18n')>()
  return { ...actual, useI18n: () => ({ t: (k: string) => k }) }
})

import ModuleSwap from '@/modules/swap/ModuleSwap.vue'

const mountSwap = (state: { connected: boolean; watchOnly: boolean }) => {
  h.swapModule = {
    isWalletConnected: ref(state.connected),
    isWatchOnly: ref(state.watchOnly),
    fromTokenSelected: ref({ address: '0xtoken', symbol: 'USDC' }),
    toTokenSelected: ref(null),
    isSwapView: ref(false),
    fromAmount: ref(''),
    canUseMax: () => true,
    bindWatchers: vi.fn(),
    initialize: vi.fn(),
  }
  return shallowMount(ModuleSwap, {
    global: { mocks: { $t: (k: string) => k } },
  })
}

const quickActionsShown = (w: ReturnType<typeof mountSwap>) =>
  w.findComponent({ name: 'AppSwapForm' }).props('showQuickActions')

describe('ModuleSwap % quick actions', () => {
  // MEW-2699: a watch-only wallet still has a balance to size the swap from.
  it('shows them for a watch-only wallet', () => {
    expect(
      quickActionsShown(mountSwap({ connected: true, watchOnly: true })),
    ).toBe(true)
  })

  it('hides them with no wallet connected', () => {
    expect(
      quickActionsShown(mountSwap({ connected: false, watchOnly: false })),
    ).toBe(false)
  })
})
