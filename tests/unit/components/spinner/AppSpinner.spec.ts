import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import AppSpinner from '@/components/spinner/AppSpinner.vue'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: { en: { common: { loading: 'Loading' } } },
})

const mountSpinner = (props: Record<string, unknown> = {}, attrs = {}) =>
  mount(AppSpinner, { props, attrs, global: { plugins: [i18n] } })

const svg = () => '[data-testid="spinner"]'

describe('AppSpinner', () => {
  it('renders a status svg with the default label and 32px size', () => {
    const el = mountSpinner().get(svg())
    expect(el.attributes('role')).toBe('status')
    expect(el.attributes('aria-label')).toBe('Loading')
    expect(el.attributes('width')).toBe('32')
    expect(el.attributes('height')).toBe('32')
    expect(el.attributes('viewBox')).toBe('0 0 32 32')
    expect(el.classes()).toContain('animate-spin')
  })

  it('scales with size while keeping the viewBox', () => {
    const el = mountSpinner({ size: 18 }).get(svg())
    expect(el.attributes('width')).toBe('18')
    expect(el.attributes('viewBox')).toBe('0 0 32 32')
  })

  it('lets label override the accessible name', () => {
    const el = mountSpinner({ label: 'Fetching quote' }).get(svg())
    expect(el.attributes('aria-label')).toBe('Fetching quote')
  })

  it('draws a 20% track and a quarter arc with the Figma geometry', () => {
    const wrapper = mountSpinner()
    const track = wrapper.get('circle')
    expect(track.attributes('stroke-opacity')).toBe('0.2')
    expect(track.attributes('stroke-width')).toBe('5')
    expect(wrapper.get('[data-testid="spinner-arc"]').attributes('d')).toBe(
      'M16 2.5A13.5 13.5 0 0 1 29.5 16',
    )
  })

  it.each([
    ['default', 'text-background-info'],
    ['inverted', 'text-text-inverted'],
    ['placeholder', 'text-text-placeholder'],
  ])('uses the %s color token', (color, className) => {
    expect(mountSpinner({ color }).get(svg()).classes()).toContain(className)
  })

  it('forwards attrs such as aria-hidden', () => {
    const el = mountSpinner({}, { 'aria-hidden': 'true' }).get(svg())
    expect(el.attributes('aria-hidden')).toBe('true')
  })
})
