import { describe, it, expect, vi } from 'vitest'
import { ref } from 'vue'
import { mount } from '@vue/test-utils'
import AppInputNaked from '@/components/input_naked/AppInputNaked.vue'
import AppSpinner from '@/components/AppSpinner.vue'

// jsdom has no layout or canvas: fix the root at 200px, 10px per character per 16px of font
const rootWidth = ref(200)
vi.mock('@vueuse/core', async importOriginal => ({
  ...(await importOriginal<typeof import('@vueuse/core')>()),
  useElementSize: () => ({ width: rootWidth, height: ref(0) }),
}))
vi.mock('@/utils/measureText', () => ({
  measureTextWidth: (text: string, font: string) =>
    text.length * 10 * (Number(font.match(/(\d+)px/)?.[1]) / 16),
}))

const input = () => '[data-testid="input-naked-input"]'
const currency = () => '[data-testid="input-naked-currency"]'
const info = () => '[data-testid="input-naked-info"]'

const mountInput = (props: Record<string, unknown> = {}, attrs = {}) =>
  mount(AppInputNaked, {
    props: { modelValue: '', label: 'Amount', ...props },
    attrs,
  })

describe('AppInputNaked', () => {
  it('renders a labelled decimal text input', () => {
    const el = mountInput().get(input()).element as HTMLInputElement
    expect(el.type).toBe('text')
    expect(el.getAttribute('inputmode')).toBe('decimal')
    expect(el.getAttribute('aria-label')).toBe('Amount')
    expect(el.placeholder).toBe('0')
  })

  it('shows the currency prefix unless hidden', () => {
    expect(mountInput().get(currency()).text()).toBe('$')
    expect(mountInput({ currency: 'ETH' }).get(currency()).text()).toBe('ETH')
    expect(mountInput({ showCurrency: false }).find(currency()).exists()).toBe(
      false,
    )
  })

  it('shows infoMessage while empty and conversion once filled', async () => {
    const wrapper = mountInput({
      infoMessage: 'Info message',
      conversion: '≈ 0.0513 ETH',
    })
    expect(wrapper.get(info()).text()).toBe('Info message')
    await wrapper.setProps({ modelValue: '24' })
    expect(wrapper.get(info()).text()).toBe('≈ 0.0513 ETH')
  })

  it('omits the info row when there is nothing to show', () => {
    expect(mountInput().find(info()).exists()).toBe(false)
  })

  it('turns currency, value and info red on error', () => {
    const wrapper = mountInput({ error: true, infoMessage: 'Info message' })
    expect(wrapper.get(currency()).classes()).toContain('text-text-error')
    expect(wrapper.get(input()).classes()).toContain('text-text-error')
    expect(wrapper.get(info()).classes()).toContain('text-text-error')
    expect(wrapper.get(input()).attributes('aria-invalid')).toBe('true')
  })

  it('uses the disabled colours and disables the input', () => {
    const wrapper = mountInput({
      disabled: true,
      error: true,
      infoMessage: 'Info message',
    })
    expect((wrapper.get(input()).element as HTMLInputElement).disabled).toBe(
      true,
    )
    expect(wrapper.get(currency()).classes()).toContain('text-text-disabled')
    expect(wrapper.get(info()).classes()).toContain('text-text-disabled')
  })

  it('swaps the info row for a spinner while loading', () => {
    const wrapper = mountInput({
      modelValue: '24',
      loading: true,
      conversion: '≈ 0.0513 ETH',
    })
    expect(wrapper.findComponent(AppSpinner).exists()).toBe(true)
    expect(wrapper.get(info()).text()).toBe('')
    expect(wrapper.attributes('aria-busy')).toBe('true')
    expect((wrapper.get(input()).element as HTMLInputElement).disabled).toBe(
      false,
    )
  })

  it('emits the sanitised value', async () => {
    const wrapper = mountInput({ maxDecimals: 2 })
    const field = wrapper.get(input())
    await field.setValue('$1,234.567')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['1234.56'])
    expect((field.element as HTMLInputElement).value).toBe('1234.56')
  })

  it('sends class to the root and other attrs to the input', () => {
    const wrapper = mountInput({}, { class: 'mt-4', readonly: true })
    expect(wrapper.classes()).toContain('mt-4')
    expect(wrapper.get(input()).classes()).not.toContain('mt-4')
    expect(wrapper.get(input()).attributes('readonly')).toBeDefined()
  })

  describe('autoScale', () => {
    const valueClass = (wrapper: ReturnType<typeof mountInput>) =>
      wrapper
        .get(input())
        .classes()
        .find(c => c.startsWith('text-heading-'))

    it('keeps the Figma sizes while the value fits', () => {
      const wrapper = mountInput({ modelValue: '24' })
      expect(valueClass(wrapper)).toBe('text-heading-2xl')
      expect(wrapper.get(currency()).classes()).toContain('text-heading-xl')
    })

    it('steps value and currency down the heading scale as the value grows', () => {
      // 10 chars + currency: ~207px at 32px (over the 192px budget), ~181px at 28px
      const wrapper = mountInput({ modelValue: '1234567890' })
      expect(valueClass(wrapper)).toBe('text-heading-xl')
      expect(wrapper.get(currency()).classes()).toContain('text-heading-lg')
    })

    it('bottoms out at heading/base when nothing fits', () => {
      const wrapper = mountInput({ modelValue: '1'.repeat(40) })
      expect(valueClass(wrapper)).toBe('text-heading-base')
      expect(wrapper.get(currency()).classes()).toContain('text-heading-base')
    })

    it('never scales with autoScale off', () => {
      const wrapper = mountInput({
        modelValue: '1'.repeat(40),
        autoScale: false,
      })
      expect(valueClass(wrapper)).toBe('text-heading-2xl')
    })
  })
})
