import { describe, it, expect } from 'vitest'
import { defineComponent, h, inject } from 'vue'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import AppTableWrapper from '@/components/table/AppTableWrapper.vue'
import { TABLE_WRAPPER } from '@/components/table/types'

const SizeProbe = defineComponent({
  setup() {
    const wrapper = inject(TABLE_WRAPPER)
    return () => h('i', { 'data-test': 'probe' }, wrapper?.size.value)
  },
})

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: { en: { common: { search: 'Search', clear_icon: 'Clear' } } },
})

const factory = (
  props: Record<string, unknown> = {},
  slots: Record<string, unknown> = {},
) =>
  mount(AppTableWrapper, {
    props: { title: 'Explore crypto', size: 'l', ...props },
    slots: { default: () => h(SizeProbe), ...slots },
    global: { plugins: [i18n] },
  })

const ACTION = {
  action: () => h('button', { 'data-test': 'action' }, 'Add asset'),
}

describe('AppTableWrapper', () => {
  it('is a section named by its heading', () => {
    const w = factory({ description: 'Top assets' })
    const heading = w.get('h2')
    expect(w.element.tagName).toBe('SECTION')
    expect(heading.text()).toBe('Explore crypto')
    expect(w.attributes('aria-labelledby')).toBe(heading.attributes('id'))
    expect(w.text()).toContain('Top assets')
  })

  it('renders the title as the requested heading level', () => {
    expect(factory({ titleTag: 'h1' }).find('h1').text()).toBe('Explore crypto')
  })

  it('pads 24 at L/M and 16 at S', () => {
    expect(factory().classes()).toContain('p-6')
    expect(factory({ size: 'm' }).classes()).toContain('p-6')
    expect(factory({ size: 's' }).classes()).toContain('p-4')
  })

  it('hands its size to the table inside', () => {
    expect(factory({ size: 'm' }).get('[data-test="probe"]').text()).toBe('m')
  })

  it('measures itself when no size is forced', () => {
    // jsdom has no layout: width 0 → S.
    expect(factory({ size: undefined }).get('[data-test="probe"]').text()).toBe(
      's',
    )
  })

  it('puts the action at the end of the toolbar at L/M', () => {
    const w = factory({}, ACTION)
    expect(
      w
        .get('[data-test="table-toolbar"]')
        .find('[data-test="action"]')
        .exists(),
    ).toBe(true)
  })

  it('moves the action next to the title at S', () => {
    const w = factory({ size: 's' }, ACTION)
    expect(
      w
        .get('[data-test="table-heading"]')
        .find('[data-test="action"]')
        .exists(),
    ).toBe(true)
    expect(w.find('[data-test="table-toolbar"]').exists()).toBe(false)
  })

  it('shows the searchbar when search is bound, then the filters with the size', async () => {
    expect(factory().find('input').exists()).toBe(false)
    const w = factory(
      { search: '', searchPlaceholder: 'Search tokens', size: 's' },
      { filters: ({ size }: { size: string }) => h('b', size) },
    )
    const toolbar = w.get('[data-test="table-toolbar"]')
    const input = toolbar.get('input')
    expect(input.attributes('placeholder')).toBe('Search tokens')
    expect(toolbar.get('b').text()).toBe('s')
    // search first, filters right after it
    expect(
      input.element.compareDocumentPosition(toolbar.get('b').element),
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING)
    await input.setValue('eth')
    expect(w.emitted('update:search')).toEqual([['eth']])
  })
})
