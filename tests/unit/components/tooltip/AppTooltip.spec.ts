import { describe, it, expect, afterEach } from 'vitest'
import { nextTick } from 'vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import AppTooltip from '@/components/tooltip/AppTooltip.vue'

const trigger = () => '[data-testid="tooltip-trigger"]'
const bubble = () => document.querySelector('[data-testid="tooltip"]')

let wrapper: VueWrapper | null = null
const mountTip = (props: Record<string, unknown> = {}) => {
  wrapper = mount(AppTooltip, {
    props: { text: 'Info', ...props },
    slots: { default: '<button>trigger</button>' },
    attachTo: document.body,
  })
  return wrapper
}

afterEach(() => {
  wrapper?.unmount()
  wrapper = null
})

describe('AppTooltip', () => {
  it('is hidden until the trigger fires', () => {
    mountTip()
    expect(bubble()).toBeNull()
  })

  it('shows on focus with role=tooltip and links the trigger via aria-describedby', async () => {
    const w = mountTip()
    await w.get(trigger()).trigger('focusin')
    await nextTick()
    const tip = bubble()
    expect(tip).not.toBeNull()
    expect(tip?.getAttribute('role')).toBe('tooltip')
    expect(w.get(trigger()).attributes('aria-describedby')).toBe(
      tip?.getAttribute('id') ?? '',
    )
  })

  it('hides on Escape', async () => {
    const w = mountTip()
    await w.get(trigger()).trigger('focusin')
    await nextTick()
    expect(bubble()).not.toBeNull()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()
    expect(bubble()).toBeNull()
  })

  it('never shows while disabled', async () => {
    const w = mountTip({ disabled: true })
    await w.get(trigger()).trigger('focusin')
    await nextTick()
    expect(bubble()).toBeNull()
  })

  it('only reacts to the configured triggers', async () => {
    const w = mountTip({ trigger: ['click'] })
    await w.get(trigger()).trigger('focusin')
    await nextTick()
    expect(bubble()).toBeNull()

    await w.get(trigger()).trigger('click')
    await nextTick()
    expect(bubble()).not.toBeNull()
  })

  it('closes when disabled while open and stays closed once re-enabled', async () => {
    const w = mountTip()
    await w.get(trigger()).trigger('focusin')
    await nextTick()
    expect(bubble()).not.toBeNull()

    await w.setProps({ disabled: true })
    await nextTick()
    expect(bubble()).toBeNull()

    await w.setProps({ disabled: false })
    await nextTick()
    expect(bubble()).toBeNull()
  })

  it('keeps a focus-opened tooltip open through the click of the same gesture', async () => {
    const w = mountTip({ trigger: ['focus', 'click'] })
    await w.get(trigger()).trigger('focusin')
    await w.get(trigger()).trigger('click')
    await nextTick()
    expect(bubble()).not.toBeNull()

    // A later, separate click toggles it closed.
    await w.get(trigger()).trigger('click')
    await nextTick()
    expect(bubble()).toBeNull()
  })

  it('renders a focusable info icon when no trigger is slotted and forwards attrs', async () => {
    wrapper = mount(AppTooltip, {
      props: { text: 'Hint' },
      attrs: { class: 'flex-1' },
      attachTo: document.body,
    })
    const fallback = wrapper.get('[data-testid="tooltip-default-trigger"]')
    expect(fallback.attributes('tabindex')).toBe('0')
    expect(fallback.find('svg').exists()).toBe(true)
    expect(wrapper.get(trigger()).classes()).toContain('flex-1')

    await wrapper.get(trigger()).trigger('focusin')
    await nextTick()
    expect(bubble()?.textContent).toContain('Hint')
  })

  it('reflects the placement on the bubble', async () => {
    // jsdom gives the trigger a 0×0 rect at (0,0), so a bottom placement keeps its
    // room and does not flip (top/left would, against the viewport edge).
    const w = mountTip({ placement: 'bottom' })
    await w.get(trigger()).trigger('focusin')
    await nextTick()
    expect(bubble()?.getAttribute('data-placement')).toBe('bottom')
  })
})
