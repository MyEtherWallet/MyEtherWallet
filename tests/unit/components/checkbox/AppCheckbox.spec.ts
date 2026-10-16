import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppCheckbox from '@/components/checkbox/AppCheckbox.vue'

const input = () => 'input[type="checkbox"]'
// Heroicons glyphs only inherit `class`, so find the check by its svg.
const check = () => 'svg'
const bar = () => '[data-testid="checkbox-bar"]'
const box = () => 'label > span[aria-hidden="true"]'

describe('AppCheckbox', () => {
  it('renders a native checkbox inside its label, with id, name and value on the input', () => {
    const wrapper = mount(AppCheckbox, {
      props: { label: 'Remember me' },
      attrs: { id: 'remember', name: 'remember', value: 'yes' },
    })
    const label = wrapper.get('label').element as HTMLLabelElement
    const el = wrapper.get(input()).element as HTMLInputElement

    expect(label.contains(el)).toBe(true)
    expect(el.id).toBe('remember')
    expect(el.name).toBe('remember')
    expect(el.value).toBe('yes')
    expect(wrapper.text()).toContain('Remember me')
  })

  it('renders rich label content from the default slot', () => {
    const wrapper = mount(AppCheckbox, {
      slots: { default: 'I accept the <a href="/terms">terms</a>' },
    })
    expect(wrapper.get('a').attributes('href')).toBe('/terms')
  })

  it('reflects modelValue in checked and emits the new value on change', async () => {
    const wrapper = mount(AppCheckbox, { props: { modelValue: false } })
    const el = wrapper.get(input()).element as HTMLInputElement
    expect(el.checked).toBe(false)
    expect(wrapper.find(check()).exists()).toBe(false)

    await wrapper.get(input()).setValue(true)
    expect(wrapper.emitted('update:modelValue')).toEqual([[true]])

    await wrapper.setProps({ modelValue: true })
    expect(el.checked).toBe(true)
    expect(wrapper.find(check()).exists()).toBe(true)
  })

  it('sets the native indeterminate property and draws the bar instead of the check', () => {
    const wrapper = mount(AppCheckbox, {
      props: { modelValue: true, indeterminate: true },
    })
    const el = wrapper.get(input()).element as HTMLInputElement
    expect(el.indeterminate).toBe(true)
    expect(wrapper.find(bar()).exists()).toBe(true)
    expect(wrapper.find(check()).exists()).toBe(false)
  })

  it('puts checked and indeterminate back when the parent keeps its state after a click', async () => {
    const wrapper = mount(AppCheckbox, {
      props: {
        modelValue: false,
        indeterminate: true,
        'onUpdate:modelValue': () => {},
      },
      // The native click only fires `change` on a connected input.
      attachTo: document.body,
    })
    const el = wrapper.get(input()).element as HTMLInputElement

    // A native click toggles checked and clears indeterminate.
    await wrapper.get(input()).trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[true]])
    expect(el.checked).toBe(false)
    expect(el.indeterminate).toBe(true)
    wrapper.unmount()
  })

  it('disables the input with the disabled fills and no hover halo', () => {
    const off = mount(AppCheckbox, { props: { disabled: true } })
    expect((off.get(input()).element as HTMLInputElement).disabled).toBe(true)
    expect(off.get(box()).classes()).toContain('bg-background-disabled')
    expect(off.get(box()).classes()).toContain('border-border-disabled')

    const on = mount(AppCheckbox, {
      props: { modelValue: true, disabled: true },
    })
    const classes = on.get(box()).classes()
    expect(classes).toContain('bg-background-brand-disabled')
    expect(classes.some(c => c.includes('hover'))).toBe(false)
  })

  it('scopes the hover halo to its own row, not to an outer group', () => {
    const wrapper = mount(AppCheckbox)
    expect(wrapper.get('label').classes()).toContain('group/checkbox')
    expect(wrapper.get(box()).classes()).toContain(
      'group-hover/checkbox:ring-4',
    )
  })

  it('falls attrs through to the input but keeps class on the label', () => {
    const wrapper = mount(AppCheckbox, {
      attrs: { 'aria-describedby': 'hint', required: true, class: 'mt-2' },
    })
    const el = wrapper.get(input())
    expect(el.attributes('aria-describedby')).toBe('hint')
    expect(el.attributes('required')).toBeDefined()
    expect(el.classes()).not.toContain('mt-2')
    expect(wrapper.get('label').classes()).toContain('mt-2')
  })
})
