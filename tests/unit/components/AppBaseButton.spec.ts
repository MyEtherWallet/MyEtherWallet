import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppBaseButton from '@/components/AppBaseButton.vue'
import { BTN_SIZE_SPEC } from '@/components/buttonSizes'

const ripple = { mounted: () => {}, updated: () => {} }
const mountIt = (props = {}, slots = {}) =>
  mount(AppBaseButton, {
    props,
    slots,
    global: { directives: { ripple } },
  })

describe('AppBaseButton', () => {
  it('defaults to a primary large button', () => {
    const cls = mountIt().classes()
    expect(cls).toContain('bg-primary')
    expect(cls).toContain('text-white')
    expect(cls).toContain(BTN_SIZE_SPEC.large.padding.split(' ')[0])
  })

  it('pins the native button type so it can never act as a submit', () => {
    // The `type` prop is the design variant, not the DOM attribute.
    expect(mountIt({ type: 'secondary' }).attributes('type')).toBe('button')
  })

  it('renders secondary on the default surface as grey with a brand label', () => {
    const cls = mountIt({ type: 'secondary' }).classes()
    expect(cls).toContain('bg-bgBase')
    expect(cls).toContain('text-primary')
  })

  it('renders secondary on the alternative surface as white', () => {
    const cls = mountIt({ type: 'secondary', surface: 'alternative' }).classes()
    expect(cls).toContain('bg-white')
    expect(cls).toContain('text-primary')
  })

  it('renders tertiary transparent, brand on default and black on alternative', () => {
    expect(mountIt({ type: 'tertiary' }).classes()).toContain('text-primary')
    expect(
      mountIt({ type: 'tertiary', surface: 'alternative' }).classes(),
    ).toContain('text-black')
  })

  it('drops padding for the link type', () => {
    const cls = mountIt({ type: 'link' }).classes()
    expect(cls).toContain('text-primary')
    expect(cls).not.toContain(BTN_SIZE_SPEC.large.padding.split(' ')[0])
  })

  it('applies the danger tone per type', () => {
    expect(mountIt({ tone: 'danger' }).classes()).toContain('bg-error')
    expect(mountIt({ type: 'secondary', tone: 'danger' }).classes()).toContain(
      'bg-error-subtle',
    )
    expect(mountIt({ type: 'link', tone: 'danger' }).classes()).toContain(
      'text-error',
    )
  })

  it('keeps the success tone for the perps long/short pairing', () => {
    expect(mountIt({ tone: 'success' }).classes()).toContain('bg-success')
  })

  it.each(['small', 'medium', 'large', 'xlarge'] as const)(
    'applies the centralized %s size spec',
    size => {
      const cls = mountIt({ size }).classes()
      for (const c of BTN_SIZE_SPEC[size].padding.split(' ')) {
        expect(cls).toContain(c)
      }
    },
  )

  it('emits click when enabled', async () => {
    const w = mountIt()
    await w.trigger('click')
    expect(w.emitted('click')).toHaveLength(1)
  })

  it('does not emit click when disabled or loading', async () => {
    const disabled = mountIt({ disabled: true })
    await disabled.trigger('click')
    expect(disabled.emitted('click')).toBeUndefined()

    const loading = mountIt({ isLoading: true })
    await loading.trigger('click')
    expect(loading.emitted('click')).toBeUndefined()
  })

  it('marks itself busy and hides the label while loading', () => {
    const w = mountIt({ isLoading: true }, { default: 'Confirm' })
    expect(w.attributes('aria-busy')).toBe('true')
    expect(w.attributes('disabled')).toBeDefined()
    expect(w.find('span.opacity-0').exists()).toBe(true)
  })

  it('dims danger less than other tones when disabled, per the design', () => {
    expect(mountIt({ disabled: true }).classes()).toContain('!opacity-40')
    expect(mountIt({ disabled: true, tone: 'danger' }).classes()).toContain(
      '!opacity-50',
    )
  })

  it('renders leading and trailing slots only when provided', () => {
    expect(mountIt().findAll('span').length).toBe(1)
    const w = mountIt({}, { leading: '+', default: 'Add', trailing: '>' })
    expect(w.findAll('span').length).toBe(3)
    expect(w.text()).toContain('Add')
  })
})
