import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppTabItem from '@/components/tabs/AppTabItem.vue'

const root = () => '[data-testid="tab-item"]'

describe('AppTabItem', () => {
  it('renders a tab button with the label', () => {
    const wrapper = mount(AppTabItem, { props: { label: 'Stocks' } })
    const el = wrapper.get(root())
    expect(el.element.tagName).toBe('BUTTON')
    expect(el.attributes('type')).toBe('button')
    expect(el.attributes('role')).toBe('tab')
    expect(el.text()).toBe('Stocks')
  })

  it('lets the default slot override the label', () => {
    const wrapper = mount(AppTabItem, {
      props: { label: 'Stocks' },
      slots: { default: 'Crypto · 3' },
    })
    expect(wrapper.get(root()).text()).toBe('Crypto · 3')
  })

  it('reflects selected in aria-selected and uses the selected tokens', () => {
    const wrapper = mount(AppTabItem, {
      props: { label: 'Stocks', selected: true },
    })
    const el = wrapper.get(root())
    expect(el.attributes('aria-selected')).toBe('true')
    expect(el.classes()).toContain('border-border-selected')
    expect(el.classes()).toContain('text-text-default')
    expect(el.classes()).not.toContain('hover:border-border-hover')
  })

  it('is muted with a transparent border and a hover underline when unselected', () => {
    const wrapper = mount(AppTabItem, { props: { label: 'Stocks' } })
    const el = wrapper.get(root())
    expect(el.attributes('aria-selected')).toBe('false')
    expect(el.classes()).toEqual(
      expect.arrayContaining([
        'border-b',
        'border-transparent',
        'text-text-muted',
        'hover:border-border-hover',
        'hover:text-text-default',
      ]),
    )
  })

  it('disables the button and drops the hover state', () => {
    const wrapper = mount(AppTabItem, {
      props: { label: 'Stocks', disabled: true },
    })
    const el = wrapper.get(root())
    expect((el.element as HTMLButtonElement).disabled).toBe(true)
    expect(el.classes()).toContain('text-text-disabled')
    expect(el.classes()).not.toContain('hover:border-border-hover')
  })

  it('forwards attrs and native clicks', async () => {
    const wrapper = mount(AppTabItem, {
      props: { label: 'Stocks' },
      attrs: { tabindex: '-1', 'aria-controls': 'panel' },
    })
    const el = wrapper.get(root())
    expect(el.attributes('tabindex')).toBe('-1')
    expect(el.attributes('aria-controls')).toBe('panel')
    await el.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })
})
