import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import { createI18n } from 'vue-i18n'
import GlobalSearchInput from '@/modules/global_search/components/GlobalSearchInput.vue'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import AppSearchbar from '@/components/AppSearchbar.vue'

const isBelowXl = ref(false)
const query = ref('')
const open = vi.fn()

vi.mock('@/composables/useAppBreakpoints', () => ({
  useAppBreakpoints: () => ({
    breakpoints: {
      smaller: (bp: string) => ref(bp === 'xl' && isBelowXl.value),
    },
  }),
}))
// The real popover pulls in the wallet stores (and Ledger) — not under test here.
vi.mock('@/modules/global_search/components/GlobalSearchPopover.vue', () => ({
  default: { template: '<div />' },
}))
vi.mock('@/modules/global_search/composables/useGlobalSearch', () => ({
  useGlobalSearch: () => ({ query, open, isOpen: ref(false), close: vi.fn() }),
}))

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: { en: { search: { placeholder: 'Search' }, common: {} } },
})

const mountInput = () =>
  mount(GlobalSearchInput, {
    global: { plugins: [i18n] },
  })

describe('GlobalSearchInput (navbar trigger, MEW-2463)', () => {
  beforeEach(() => {
    query.value = ''
  })

  it('renders the 240px Searchbar on desktop, bound to the search query', async () => {
    isBelowXl.value = false
    const wrapper = mountInput()
    expect(wrapper.classes()).toContain('w-60')
    // Navbar uses the 40px Default Searchbar, not the 48px Outline default.
    expect(wrapper.getComponent(AppSearchbar).props('variant')).toBe('default')
    // AppSearchbar's own clear button is an AppBtnIcon too; no search button.
    const icons = wrapper
      .findAllComponents(AppBtnIcon)
      .map(b => b.props('icon'))
    expect(icons).not.toContain('magnifying-glass')
    await wrapper.get('input').setValue('eth')
    expect(query.value).toBe('eth')
    await wrapper.findComponent(AppSearchbar).trigger('focusin')
    expect(open).toHaveBeenCalled()
  })

  it('collapses to a 40px filled search button below 1280', async () => {
    isBelowXl.value = true
    const wrapper = mountInput()
    expect(wrapper.classes()).not.toContain('w-60')
    expect(wrapper.findComponent(AppSearchbar).exists()).toBe(false)
    const btn = wrapper.getComponent(AppBtnIcon)
    expect(btn.props()).toMatchObject({ size: 'l', variant: 'filled' })
    await btn.trigger('click')
    expect(open).toHaveBeenCalled()
  })
})
