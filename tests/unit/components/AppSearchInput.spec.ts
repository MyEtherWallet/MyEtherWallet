import { describe, it, expect } from 'vitest'
import { mount, shallowMount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import AppSearchInput from '@/components/AppSearchInput.vue'
import AppIcon from '@/components/icon/AppIcon.vue'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: { common: { search: 'Search', clear_icon: 'Clear' } },
    zh: { common: { search: '搜索', clear_icon: '清除' } },
  },
})

const mountInput = (props: Record<string, unknown> = {}) =>
  shallowMount(AppSearchInput, {
    props,
    global: { plugins: [i18n] },
  })

describe('AppSearchInput placeholder localization (MEW-2047)', () => {
  it('falls back to the localized common.search when no placeholder is passed (en)', () => {
    i18n.global.locale.value = 'en'
    const input = mountInput().find('input')
    expect(input.attributes('placeholder')).toBe('Search')
  })

  it('localizes the default placeholder when the locale changes (zh)', () => {
    i18n.global.locale.value = 'zh'
    const input = mountInput().find('input')
    // Regression guard: before the fix the hardcoded default 'Search' leaked here.
    expect(input.attributes('placeholder')).toBe('搜索')
  })

  it('uses an explicit placeholder prop verbatim, overriding the default', () => {
    i18n.global.locale.value = 'zh'
    const input = mountInput({ placeholder: 'Custom placeholder' }).find(
      'input',
    )
    expect(input.attributes('placeholder')).toBe('Custom placeholder')
  })

  it('mirrors the resolved placeholder onto aria-label', () => {
    i18n.global.locale.value = 'zh'
    const input = mountInput().find('input')
    expect(input.attributes('aria-label')).toBe('搜索')
  })
})

describe('AppSearchInput — design-library Searchbar (MEW-1971)', () => {
  const mountFull = (props: Record<string, unknown> = {}) => {
    i18n.global.locale.value = 'en'
    return mount(AppSearchInput, { props, global: { plugins: [i18n] } })
  }

  it('defaults to the Figma Default fill (background/formfield)', () => {
    expect(mountFull().get('input').classes()).toContain(
      'bg-background-formfield',
    )
  })

  it('keeps the search icon icon/subtle while focused', async () => {
    const w = mountFull()
    await w.get('input').trigger('focus')
    const icon = w.get('svg')
    expect(icon.classes()).toContain('text-icon-subtle')
    expect(icon.classes()).not.toContain('text-text-brand')
  })

  it('clears with a bare black cross (x-mark), not a circled one', () => {
    const w = mountFull({ modelValue: 'eth' })
    const clear = w.get('[aria-label="Clear"]').findComponent(AppIcon)
    expect(clear.props('name')).toBe('x-mark')
    expect(clear.classes()).toContain('text-icon-default')
  })
})
