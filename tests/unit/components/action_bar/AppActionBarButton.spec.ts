import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AppActionBarButton from '@/components/action_bar/AppActionBarButton.vue'

describe('AppActionBarButton', () => {
  it('renders a button with the label', () => {
    const wrapper = mount(AppActionBarButton, {
      props: { icon: 'chart-bar', label: 'Trade' },
    })
    const el = wrapper.get('button').element as HTMLButtonElement
    expect(el.type).toBe('button')
    expect(wrapper.text()).toContain('Trade')
    expect(el.getAttribute('aria-label')).toBe('Trade')
  })

  it('reflects active in aria-pressed', () => {
    const on = mount(AppActionBarButton, {
      props: { icon: 'chart-bar', label: 'Trade', active: true },
    })
    expect(on.get('button').attributes('aria-pressed')).toBe('true')

    const off = mount(AppActionBarButton, {
      props: { icon: 'chart-bar', label: 'Trade' },
    })
    expect(off.get('button').attributes('aria-pressed')).toBe('false')
  })

  it('keeps the active background on hover instead of the hover background', () => {
    const active = mount(AppActionBarButton, {
      props: { icon: 'chart-bar', label: 'Trade', active: true },
    }).get('button')
    expect(active.classes()).toContain('bg-background-brand-subtle')
    expect(active.classes()).not.toContain('hover:bg-background-default')

    const resting = mount(AppActionBarButton, {
      props: { icon: 'chart-bar', label: 'Trade' },
    }).get('button')
    expect(resting.classes()).toContain('hover:bg-background-default')
    expect(resting.classes()).not.toContain('bg-background-brand-subtle')
  })

  it('blocks clicks when disabled', async () => {
    const onClick = vi.fn()
    const wrapper = mount(AppActionBarButton, {
      props: { icon: 'chart-bar', label: 'Trade', disabled: true },
      attrs: { onClick },
    })
    expect((wrapper.get('button').element as HTMLButtonElement).disabled).toBe(
      true,
    )
    await wrapper.get('button').trigger('click')
    expect(onClick).not.toHaveBeenCalled()
  })

  it('names an icon-only button with ariaLabel and is not a toggle', () => {
    const wrapper = mount(AppActionBarButton, {
      props: { icon: 'chevron-double-left', ariaLabel: 'Open side menu' },
    })
    const btn = wrapper.get('button')
    expect(btn.attributes('aria-label')).toBe('Open side menu')
    expect(btn.attributes('aria-pressed')).toBeUndefined()
    expect(wrapper.text()).toBe('')
  })

  it('warns when an icon-only button has no ariaLabel', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    mount(AppActionBarButton, { props: { icon: 'chevron-double-left' } })
    expect(warn).toHaveBeenCalled()
    expect(String(warn.mock.calls[0][0])).toContain('ariaLabel')
    warn.mockRestore()
  })
})
