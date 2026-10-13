import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppSlider from '@/components/slider/AppSlider.vue'

const input = () => '[data-testid="slider-input"]'
const fill = () => '[data-testid="slider-fill"]'
const thumb = () => '[data-testid="slider-thumb"]'
const track = () => '[data-testid="slider-track"]'

const mountSlider = (props: Record<string, unknown> = {}, attrs = {}) =>
  mount(AppSlider, {
    props: { modelValue: 50, label: 'Amount', ...props },
    attrs,
  })

describe('AppSlider', () => {
  it('renders a native range input with min, max, step and labels', () => {
    const wrapper = mountSlider({
      min: 1,
      max: 50,
      step: 5,
      modelValue: 10,
      ariaValueText: (value: number) => `${value}x`,
    })
    const el = wrapper.get(input()).element as HTMLInputElement
    expect(el.type).toBe('range')
    expect(el.min).toBe('1')
    expect(el.max).toBe('50')
    expect(el.step).toBe('5')
    expect(el.value).toBe('10')
    expect(el.getAttribute('aria-label')).toBe('Amount')
    expect(el.getAttribute('aria-valuetext')).toBe('10x')
  })

  it('emits update:modelValue as a number on input', async () => {
    const wrapper = mountSlider()
    const el = wrapper.get(input())
    ;(el.element as HTMLInputElement).value = '75'
    await el.trigger('input')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([75])
  })

  it('keeps the thumb inside the track and ends the fill at its right edge', () => {
    const style = (value: number, selector: string) =>
      mountSlider({ modelValue: value }).get(selector).attributes('style')

    expect(style(0, thumb())).toContain('calc(10px + 0 * (100% - 20px))')
    expect(style(0, fill())).toContain('calc(20px + 0 * (100% - 20px))')
    expect(style(50, thumb())).toContain('calc(10px + 0.5 * (100% - 20px))')
    expect(style(100, fill())).toContain('calc(20px + 1 * (100% - 20px))')
  })

  it('clamps the drawn position for out-of-range values', () => {
    const below = mountSlider({ modelValue: -20 })
    const above = mountSlider({ modelValue: 140 })
    expect(below.get(thumb()).attributes('style')).toContain('0 * (100%')
    expect(above.get(thumb()).attributes('style')).toContain('1 * (100%')
  })

  it('applies disabled tokens and disables the input', () => {
    const wrapper = mountSlider({ disabled: true })
    expect((wrapper.get(input()).element as HTMLInputElement).disabled).toBe(
      true,
    )
    expect(wrapper.get(track()).classes()).toContain('bg-background-disabled')
    expect(wrapper.get(fill()).classes()).toContain(
      'bg-background-brand-disabled',
    )
    expect(wrapper.get(thumb()).classes()).toContain('border-border-disabled')
  })

  it('uses the Figma tokens when enabled', () => {
    const wrapper = mountSlider()
    expect(wrapper.get(track()).classes()).toContain(
      'bg-background-alternative',
    )
    expect(wrapper.get(fill()).classes()).toContain('bg-background-brand')
    expect(wrapper.get(thumb()).classes()).toContain('border-border-brand')
  })

  it('forwards attrs to the input', () => {
    const wrapper = mountSlider({}, { 'aria-describedby': 'hint', name: 'pct' })
    const el = wrapper.get(input())
    expect(el.attributes('aria-describedby')).toBe('hint')
    expect(el.attributes('name')).toBe('pct')
  })
})
