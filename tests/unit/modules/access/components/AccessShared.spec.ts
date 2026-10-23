import { describe, it, expect, afterEach, vi } from 'vitest'
import { mount, flushPromises, type VueWrapper } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import AccessStepIndicator from '@/modules/access/components/AccessStepIndicator.vue'
import AccessDropdown from '@/modules/access/components/AccessDropdown.vue'
import AccessCell from '@/modules/access/components/AccessCell.vue'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  missingWarn: false,
  fallbackWarn: false,
  messages: { en: {} },
})

let wrapper: VueWrapper | undefined
afterEach(() => wrapper?.unmount())

describe('AccessStepIndicator', () => {
  it('fills one segment per completed step', () => {
    wrapper = mount(AccessStepIndicator, {
      props: { step: 1 },
      global: { plugins: [i18n] },
    })
    const segments = wrapper.findAll('[data-testid="step-segment"]')
    expect(segments).toHaveLength(2)
    expect(segments.map(s => s.classes('bg-background-brand'))).toEqual([
      true,
      false,
    ])
    expect(wrapper.attributes('aria-valuenow')).toBe('1')
  })
})

const ITEMS = [
  { id: 'eth', label: 'Ethereum' },
  { id: 'etc', label: 'Ethereum Classic' },
  { id: 'btc', label: 'Bitcoin' },
]

const mountDropdown = (modelValue = ITEMS[0]) => {
  wrapper = mount(AccessDropdown, {
    props: {
      label: 'Network',
      items: ITEMS,
      modelValue,
      searchPlaceholder: 'Search',
      emptyText: 'Nothing',
      itemKey: (item: (typeof ITEMS)[number]) => item.id,
      searchText: (item: (typeof ITEMS)[number]) => item.label,
    },
    slots: {
      selected: '<template #selected="{ item }">{{ item?.label }}</template>',
      item: '<template #item="{ item }">{{ item.label }}</template>',
    },
    attachTo: document.body,
    global: { plugins: [i18n], stubs: { teleport: true } },
  })
  return wrapper
}
const options = (w: VueWrapper) =>
  w.findAll('[data-testid="dropdown-option"]').map(o => o.text())

describe('AccessDropdown', () => {
  it('shows the label and the selected item', () => {
    const w = mountDropdown()
    expect(w.text()).toContain('Network')
    expect(w.get('[data-testid="dropdown-trigger"]').text()).toBe('Ethereum')
  })

  it('opens, filters by search, emits the pick and closes', async () => {
    const w = mountDropdown()
    await w.get('[data-testid="dropdown-trigger"]').trigger('click')
    expect(options(w)).toEqual(['Ethereum', 'Ethereum Classic', 'Bitcoin'])
    await w.get('[data-testid="dropdown-menu"] input').setValue('classic')
    expect(options(w)).toEqual(['Ethereum Classic'])
    await w.get('[data-testid="dropdown-option"]').trigger('click')
    expect(w.emitted('update:modelValue')?.[0]).toEqual([ITEMS[1]])
    // AppPopUpMenu hides with v-show, so the menu stays mounted but invisible.
    expect(w.get('[data-testid="dropdown-menu"]').isVisible()).toBe(false)
  })

  it('marks the selected option and scrolls it into view on open', async () => {
    const scrollIntoView = vi.fn()
    Element.prototype.scrollIntoView = scrollIntoView
    const w = mountDropdown(ITEMS[2])
    await w.get('[data-testid="dropdown-trigger"]').trigger('click')
    await flushPromises()
    const [eth, , btc] = w.findAll('[data-testid="dropdown-option"]')
    expect(btc.attributes('aria-selected')).toBe('true')
    expect(btc.classes()).toContain('bg-background-default')
    expect(btc.find('svg').exists()).toBe(true)
    expect(eth.classes()).not.toContain('bg-background-default')
    expect(eth.find('svg').exists()).toBe(false)
    expect(scrollIntoView.mock.contexts[0]).toBe(btc.element)
  })

  it('shows the empty text when nothing matches', async () => {
    const w = mountDropdown()
    await w.get('[data-testid="dropdown-trigger"]').trigger('click')
    await w.get('[data-testid="dropdown-menu"] input').setValue('zzz')
    expect(options(w)).toEqual([])
    expect(w.get('[data-testid="dropdown-menu"]').text()).toContain('Nothing')
  })
})

describe('AccessCell', () => {
  it('sets a semibold title and truncates only when asked', () => {
    wrapper = mount(AccessCell, {
      props: { title: 'Extensión de navegador', description: 'Browser' },
    })
    const title = wrapper.get('[data-testid="cell-title"]')
    expect(title.classes()).toContain('font-semibold')
    expect(title.classes()).not.toContain('truncate')
    wrapper.unmount()
    wrapper = mount(AccessCell, {
      props: { title: 'UTC--2026-09-02.json', truncate: true },
    })
    expect(wrapper.get('[data-testid="cell-title"]').classes()).toContain(
      'truncate',
    )
  })
})
