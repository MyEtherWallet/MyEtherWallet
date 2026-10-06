import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppBaseButton from '@/components/AppBaseButton.vue'

const factory = (props: Record<string, unknown>) =>
  mount(AppBaseButton, {
    props,
    slots: { default: 'Go' },
    global: { directives: { ripple: {} } },
  })

describe('AppBaseButton disabled state', () => {
  it('tints a disabled primary with the brand colour and keeps the white label', () => {
    const classes = factory({ disabled: true }).classes()
    expect(classes).toContain('!bg-background-brand/40')
    expect(classes).toContain('text-white')
    expect(classes).not.toContain('!bg-background-disabled')
  })

  it('keeps the grey fill for other themes', () => {
    const classes = factory({ disabled: true, theme: 'neutral' }).classes()
    expect(classes).toContain('!bg-background-disabled')
    expect(classes).not.toContain('!bg-background-brand/40')
  })

  it('keeps the full brand fill while loading', () => {
    const classes = factory({ isLoading: true }).classes()
    expect(classes).toContain('bg-background-brand')
    expect(classes).not.toContain('!bg-background-brand/40')
  })
})
