import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppDivider from '@/components/divider/AppDivider.vue'

const slot = () => '[data-testid="divider"]'

describe('AppDivider', () => {
  it('renders a 1px rule centred in an 8px slot', () => {
    const wrapper = mount(AppDivider)
    expect(wrapper.get(slot()).classes()).toEqual(
      expect.arrayContaining(['flex', 'h-2', 'w-full', 'items-center']),
    )
    expect(wrapper.get('hr').classes()).toContain('border-t')
  })

  it('uses border/default by default and border/strong for alternative', () => {
    expect(mount(AppDivider).get('hr').classes()).toContain(
      'border-border-default',
    )
    expect(
      mount(AppDivider, { props: { variant: 'alternative' } })
        .get('hr')
        .classes(),
    ).toContain('border-border-strong')
  })

  it('puts attrs on the slot, not on the rule', () => {
    const wrapper = mount(AppDivider, {
      attrs: { class: 'my-1', 'aria-hidden': 'true' },
    })
    const root = wrapper.get(slot())
    expect(root.classes()).toContain('my-1')
    expect(root.attributes('aria-hidden')).toBe('true')
    expect(wrapper.get('hr').attributes('aria-hidden')).toBeUndefined()
  })
})
