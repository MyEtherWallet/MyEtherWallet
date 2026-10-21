import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

vi.mock('@/stores/createStore', () => ({
  useCreateStore: () => ({ closeCreateDialog: vi.fn() }),
}))
vi.mock('@/stores/accessStore', () => ({
  useAccessStore: () => ({
    openAccessDialog: vi.fn(),
    setCurrentView: vi.fn(),
  }),
}))
vi.mock('@/composables/useAppBreakpoints', () => ({
  useAppBreakpoints: () => ({ isMobile: { value: false } }),
}))
vi.mock('@/analytics', () => ({
  analytics: {
    trackCreateWalletEvent: vi.fn(),
    trackConnectWalletEvent: vi.fn(),
  },
  ConnectWalletEvent: { CLICKED: 'clicked' },
  CreateWalletEvent: { SUCCESS: 'success' },
}))
vi.mock('vue-i18n', async importOriginal => {
  const actual = await importOriginal<typeof import('vue-i18n')>()
  return { ...actual, useI18n: () => ({ t: (k: string) => k }) }
})

import ModuleCreateMnemonic from '@/modules/create/ModuleCreateMnemonic.vue'

const factory = () =>
  mount(ModuleCreateMnemonic, {
    global: {
      stubs: {
        AppStepper: { template: '<div><slot /></div>' },
        AppSheet: { template: '<div><slot /></div>' },
        AppStepDescription: true,
        AppNotRecommended: true,
        AppSelect: true,
        AppIcon: true,
        AppSegmentedControl: { template: '<div data-quiz />' },
        AppBaseButton: { template: '<button><slot /></button>' },
      },
      mocks: { $t: (k: string) => k },
    },
  })

describe('ModuleCreateMnemonic', () => {
  // APP-MEW-WEB-1Q3: the quiz-reset watcher evaluated generatedVerifySamples
  // during setup, before `mnemonic` was declared -> TDZ ReferenceError.
  it('mounts and shows a 12-word phrase', async () => {
    const wrapper = factory()
    await nextTick()
    expect(wrapper.findAll('[data-private] .font-medium')).toHaveLength(12)
  })

  it('builds three verify questions on the verify step', async () => {
    const wrapper = factory()
    await nextTick()
    const next = wrapper.findAll('button').find(b => b.text() === 'common.next')
    await next!.trigger('click')
    expect(wrapper.findAll('[data-quiz]')).toHaveLength(3)
  })
})
