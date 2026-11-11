import { describe, it, expect } from 'vitest'
import { defineComponent, ref } from 'vue'
import { mount } from '@vue/test-utils'
import AppRadio from '@/components/radio/AppRadio.vue'
import AppIcon from '@/components/icon/AppIcon.vue'

const circle = () => '[data-testid="radio-circle"]'

const mountRadio = (props: Record<string, unknown> = {}, slots = {}) =>
  mount(AppRadio, {
    props: { name: 'network', value: 'eth', modelValue: 'btc', ...props },
    slots,
  })

describe('AppRadio', () => {
  it('renders a native radio input wired to its label', () => {
    const wrapper = mountRadio({ id: 'net-eth', label: 'Ethereum' })
    const input = wrapper.get('input').element as HTMLInputElement
    expect(input.type).toBe('radio')
    expect(input.id).toBe('net-eth')
    expect(input.name).toBe('network')
    expect(input.value).toBe('eth')
    expect(wrapper.get('label').attributes('for')).toBe('net-eth')
    expect(wrapper.text()).toContain('Ethereum')
  })

  it('generates an id when none is passed', () => {
    const wrapper = mountRadio()
    const id = wrapper.get('input').attributes('id')
    expect(id).toBeTruthy()
    expect(wrapper.get('label').attributes('for')).toBe(id)
  })

  it('is checked and shows the check only when modelValue equals value', () => {
    const off = mountRadio()
    expect((off.get('input').element as HTMLInputElement).checked).toBe(false)
    expect(off.findComponent(AppIcon).exists()).toBe(false)

    const on = mountRadio({ modelValue: 'eth' })
    expect((on.get('input').element as HTMLInputElement).checked).toBe(true)
    expect(on.findComponent(AppIcon).exists()).toBe(true)
  })

  it('emits its value on change, keeping the value type', async () => {
    const wrapper = mountRadio({ value: 2, modelValue: 1 })
    await wrapper.get('input').trigger('change')
    expect(wrapper.emitted('update:modelValue')).toEqual([[2]])
  })

  it('selecting one radio of a group unchecks the other', async () => {
    const Group = defineComponent({
      components: { AppRadio },
      setup: () => ({ picked: ref('a') }),
      template: `
        <AppRadio v-model="picked" name="g" value="a" />
        <AppRadio v-model="picked" name="g" value="b" />
      `,
    })
    const wrapper = mount(Group)
    const [a, b] = wrapper.findAll('input')
    await b.trigger('change')
    expect((wrapper.vm as unknown as { picked: string }).picked).toBe('b')
    expect((a.element as HTMLInputElement).checked).toBe(false)
    expect((b.element as HTMLInputElement).checked).toBe(true)
  })

  it('disabled: sets the attribute, never emits, uses explicit disabled colours and no hover halo', async () => {
    const off = mountRadio({ disabled: true })
    expect(off.get('input').attributes('disabled')).toBeDefined()
    await off.get('input').trigger('change')
    expect(off.emitted('update:modelValue')).toBeUndefined()
    expect(off.get(circle()).classes()).toContain('bg-background-disabled')
    expect(off.get(circle()).classes()).not.toContain(
      'group-hover/radio:ring-4',
    )

    const on = mountRadio({ disabled: true, modelValue: 'eth' })
    expect(on.get(circle()).classes()).toContain('bg-background-brand-disabled')
  })

  it('shows the hover halo only on an enabled, unselected radio', () => {
    expect(mountRadio().get(circle()).classes()).toContain(
      'group-hover/radio:ring-4',
    )
    expect(
      mountRadio({ modelValue: 'eth' }).get(circle()).classes(),
    ).not.toContain('group-hover/radio:ring-4')
  })

  it('forwards attrs to the input, but class to the row', () => {
    const wrapper = mount(AppRadio, {
      props: { name: 'n', value: 'x' },
      attrs: { 'aria-describedby': 'hint', required: true, class: 'ml-auto' },
    })
    expect(wrapper.get('input').attributes('aria-describedby')).toBe('hint')
    expect(wrapper.get('input').attributes('required')).toBeDefined()
    expect(wrapper.get('label').attributes('aria-describedby')).toBeUndefined()
    expect(wrapper.get('label').classes()).toContain('ml-auto')
    expect(wrapper.get('input').classes()).not.toContain('ml-auto')
  })

  it('renders rich label content from the default slot', () => {
    const wrapper = mountRadio({}, { default: '<strong>Rich</strong> label' })
    expect(wrapper.find('strong').text()).toBe('Rich')
  })
})
