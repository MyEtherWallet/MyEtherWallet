import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, shallowMount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import AppSearchbar from '@/components/AppSearchbar.vue'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
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
  shallowMount(AppSearchbar, {
    props,
    global: { plugins: [i18n] },
  })

describe('AppSearchbar placeholder localization (MEW-2047)', () => {
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

describe('AppSearchbar — design-library Searchbar (MEW-1976)', () => {
  const mountFull = (props: Record<string, unknown> = {}, attrs = {}) => {
    i18n.global.locale.value = 'en'
    return mount(AppSearchbar, {
      props,
      attrs,
      global: { plugins: [i18n] },
      attachTo: document.body,
    })
  }

  afterEach(() => {
    vi.useRealTimers()
    document.body.innerHTML = ''
  })

  it('renders a native search field with the browser cancel button hidden', () => {
    const input = mountFull().get('input')
    expect(input.attributes('type')).toBe('search')
    expect(input.attributes('autocomplete')).toBe('off')
    expect(input.classes()).toContain(
      '[&::-webkit-search-cancel-button]:appearance-none',
    )
  })

  it('defaults to Outline: 48px white field with a 4px border, text/base', () => {
    const w = mountFull()
    expect(w.classes()).toEqual(
      expect.arrayContaining([
        'h-12',
        'border-4',
        'border-border-default',
        'bg-background-alternative',
      ]),
    )
    expect(w.get('input').classes()).toContain('text-text-base')
    expect(w.findComponent(AppIcon).props('size')).toBe('s')
  })

  it('Default style: 40px formfield fill, no border, text/sm', () => {
    const w = mountFull({ variant: 'default' })
    expect(w.classes()).toEqual(
      expect.arrayContaining(['h-10', 'bg-background-formfield']),
    )
    expect(w.classes()).not.toContain('border-4')
    expect(w.get('input').classes()).toContain('text-text-sm')
    expect(w.findComponent(AppIcon).props('size')).toBe('s')
  })

  it('layout classes fall through to the root, not the input', () => {
    const w = mountFull({}, { class: 'grow' })
    expect(w.classes()).toContain('grow')
    expect(w.get('input').classes()).not.toContain('grow')
  })

  it('emits v-model on every input when debounce is 0', async () => {
    const w = mountFull({ modelValue: '' })
    await w.get('input').setValue('e')
    await w.get('input').setValue('et')
    expect(w.emitted('update:modelValue')).toEqual([['e'], ['et']])
  })

  it('debounces v-model to one trailing emit', async () => {
    vi.useFakeTimers()
    const w = mountFull({ modelValue: '', debounce: 250 })
    await w.get('input').setValue('e')
    await w.get('input').setValue('eth')
    expect(w.emitted('update:modelValue')).toBeUndefined()
    vi.advanceTimersByTime(250)
    expect(w.emitted('update:modelValue')).toEqual([['eth']])
  })

  it('Enter flushes a pending debounce and emits submit', async () => {
    vi.useFakeTimers()
    const w = mountFull({ modelValue: '', debounce: 250 })
    await w.get('input').setValue('eth')
    await w.get('input').trigger('keydown', { key: 'Enter' })
    expect(w.emitted('update:modelValue')).toEqual([['eth']])
    expect(w.emitted('submit')).toEqual([['eth']])
    vi.advanceTimersByTime(250)
    expect(w.emitted('update:modelValue')).toHaveLength(1)
  })

  it('Esc clears a filled field', async () => {
    const w = mountFull({ modelValue: 'eth' })
    await w.get('input').trigger('keydown', { key: 'Escape' })
    expect(w.emitted('update:modelValue')).toEqual([['']])
    expect(w.emitted('clear')).toHaveLength(1)
  })

  it('follows the parent model', async () => {
    const w = mountFull({ modelValue: 'eth' })
    await w.setProps({ modelValue: 'btc' })
    expect((w.get('input').element as HTMLInputElement).value).toBe('btc')
  })

  it('shows the clear button (Button Icon S, x-mark) only while there is a value', async () => {
    const w = mountFull({ modelValue: '' })
    expect(w.findComponent(AppBtnIcon).exists()).toBe(false)
    await w.setProps({ modelValue: 'eth' })
    const btn = w.getComponent(AppBtnIcon)
    expect(btn.props()).toMatchObject({
      icon: 'x-mark',
      size: 's',
      variant: 'naked',
      label: 'Clear',
    })
  })

  it('clear button empties the field, emits clear and refocuses the input', async () => {
    const w = mountFull({ modelValue: 'eth' })
    await w.get('button').trigger('click')
    expect(w.emitted('update:modelValue')).toEqual([['']])
    expect(w.emitted('clear')).toHaveLength(1)
    expect(document.activeElement).toBe(w.get('input').element)
  })

  it('a custom actionIcon emits action with the value instead of clearing', async () => {
    const w = mountFull({
      modelValue: 'eth',
      actionIcon: 'qr-code',
      actionLabel: 'Scan',
    })
    const btn = w.getComponent(AppBtnIcon)
    expect(btn.props()).toMatchObject({ icon: 'qr-code', label: 'Scan' })
    await w.get('button').trigger('click')
    expect(w.emitted('action')).toEqual([['eth']])
    expect(w.emitted('update:modelValue')).toBeUndefined()
    expect(w.emitted('clear')).toBeUndefined()
  })

  it('search icon turns brand on focus and stays brand while there is a value', async () => {
    const empty = mountFull({ modelValue: '' }).findComponent(AppIcon)
    expect(empty.classes()).toEqual(
      expect.arrayContaining([
        'text-icon-subtle',
        'group-focus-within:text-icon-brand',
      ]),
    )
    const filled = mountFull({ modelValue: 'eth' }).findComponent(AppIcon)
    expect(filled.classes()).toContain('text-icon-brand')
  })

  it('lightens the placeholder on focus', () => {
    expect(mountFull().get('input').classes()).toEqual(
      expect.arrayContaining([
        'placeholder:text-text-muted',
        'focus:placeholder:text-text-placeholder',
      ]),
    )
  })

  it('draws the Checkbox focus ring on keyboard focus only', async () => {
    const RING = 'outline-border-focus'
    const w = mountFull({ modelValue: '' })
    await w.get('input').trigger('focus') // Tab in
    expect(w.classes()).toContain(RING)
    await w.get('input').setValue('e') // typing → no ring
    expect(w.classes()).not.toContain(RING)

    const clicked = mountFull({ modelValue: '' })
    await clicked.trigger('pointerdown')
    await clicked.get('input').trigger('focus') // click in → no ring
    expect(clicked.classes()).not.toContain(RING)
  })
})
