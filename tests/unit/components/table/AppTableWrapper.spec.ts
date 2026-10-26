import { describe, it, expect } from 'vitest'
import { defineComponent, h, inject } from 'vue'
import { mount } from '@vue/test-utils'
import AppTableWrapper from '@/components/table/AppTableWrapper.vue'
import { TABLE_WRAPPER } from '@/components/table/types'

const SizeProbe = defineComponent({
  setup() {
    const wrapper = inject(TABLE_WRAPPER)
    return () => h('i', { 'data-test': 'probe' }, wrapper?.size.value)
  },
})

const factory = (
  props: Record<string, unknown> = {},
  slots: Record<string, unknown> = {},
) =>
  mount(AppTableWrapper, {
    props: { title: 'Explore crypto', size: 'l', ...props },
    slots: { default: () => h(SizeProbe), ...slots },
  })

const ACTION = {
  action: () => h('button', { 'data-test': 'action' }, 'Add asset'),
}

describe('AppTableWrapper', () => {
  it('is a section named by its title alone', () => {
    const w = factory({ description: 'Top assets' })
    expect(w.element.tagName).toBe('SECTION')
    expect(w.attributes('aria-label')).toBe('Explore crypto')
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

  it('renders the toolbar slot with the size', () => {
    const w = factory(
      { size: 's' },
      { toolbar: ({ size }: { size: string }) => h('b', size) },
    )
    expect(w.get('[data-test="table-toolbar"]').text()).toBe('s')
  })
})
