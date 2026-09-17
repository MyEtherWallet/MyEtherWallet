import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import AppToggle from '@/components/AppToggle.vue'

const mountToggle = (props: Record<string, unknown> = {}) =>
  mount(AppToggle, {
    props: {
      modelValue: false,
      ...props,
    },
  })

describe('AppToggle', () => {
  it('renders one switch control whose aria state reflects its v-model value', async () => {
    const wrapper = mountToggle()

    expect(wrapper.findAll('button')).toHaveLength(1)
    expect(wrapper.get('[role="switch"]').attributes('aria-checked')).toBe('false')

    await wrapper.setProps({ modelValue: true })
    expect(wrapper.get('[role="switch"]').attributes('aria-checked')).toBe('true')
  })

  it('updates v-model and emits the new value when clicked', async () => {
    const wrapper = mountToggle()

    await wrapper.get('[role="switch"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([[true]])
    expect(wrapper.emitted('change')).toEqual([[true]])
  })

  it.each([
    ['Enter', 'Enter'],
    ['Space', ' '],
  ])('updates v-model when activated with %s', async (_name, key) => {
    const wrapper = mountToggle()

    await wrapper.get('[role="switch"]').trigger('keydown', { key })

    expect(wrapper.emitted('update:modelValue')).toEqual([[true]])
    expect(wrapper.emitted('change')).toEqual([[true]])
  })

  it('does not change or emit when disabled', async () => {
    const wrapper = mountToggle({ disabled: true })
    const toggle = wrapper.get('[role="switch"]')

    expect(toggle.attributes('disabled')).toBeDefined()
    await toggle.trigger('click')
    await toggle.trigger('keydown', { key: 'Enter' })
    await toggle.trigger('keydown', { key: ' ' })

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.emitted('change')).toBeUndefined()
  })

  it('uses token-backed state, motion, and focus-ring classes', async () => {
    const wrapper = mountToggle()
    const toggle = wrapper.get('[role="switch"]')

    expect(toggle.classes()).toContain('bg-background-toggle')
    expect(toggle.classes()).toContain('hover:bg-background-default-hover')
    expect(toggle.classes()).toContain('focus-visible:ring-focus')
    expect(wrapper.get('span').classes()).not.toContain('translate-x-[19px]')

    await wrapper.setProps({ modelValue: true })
    expect(toggle.classes()).toContain('bg-background-brand')
    expect(toggle.classes()).toContain('hover:bg-background-brand-hover')
    expect(wrapper.get('span').classes()).toContain('translate-x-[19px]')
  })
})
