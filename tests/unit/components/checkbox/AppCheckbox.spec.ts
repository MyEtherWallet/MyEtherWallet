import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppCheckbox from '@/components/checkbox/AppCheckbox.vue'

const input = () => 'input[type="checkbox"]'
// Heroicons glyphs only inherit `class`, so find the check by its svg.
const check = () => 'svg'
const bar = () => '[data-testid="checkbox-bar"]'

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

  it('disables the input and does not emit when clicked', async () => {
    const wrapper = mount(AppCheckbox, {
      props: { modelValue: false, disabled: true },
    })
    const el = wrapper.get(input()).element as HTMLInputElement
    expect(el.disabled).toBe(true)

    await wrapper.get(input()).trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
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
