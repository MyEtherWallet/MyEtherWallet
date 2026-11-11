import { describe, it, expect, afterEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import AppTabBar from '@/components/tabs/AppTabBar.vue'

const ITEMS = [
  { id: 'stocks', label: 'Stocks' },
  { id: 'crypto', label: 'Crypto' },
  { id: 'perps', label: 'Perps' },
]

let wrapper: VueWrapper | undefined

const mountBar = (props: Record<string, unknown> = {}) => {
  wrapper = mount(AppTabBar, {
    props: { items: ITEMS, modelValue: 'stocks', label: 'Assets', ...props },
    attachTo: document.body,
  })
  return wrapper
}

const tabs = (w: VueWrapper) => w.findAll('[role="tab"]')

afterEach(() => wrapper?.unmount())

describe('AppTabBar', () => {
  it('renders a labelled tablist with one tab per item', () => {
    const w = mountBar()
    const list = w.get('[role="tablist"]')
    expect(list.attributes('aria-label')).toBe('Assets')
    expect(tabs(w).map(tab => tab.text())).toEqual([
      'Stocks',
      'Crypto',
      'Perps',
    ])
  })

  it('uses border/default on alternative and border/strong on default', () => {
    expect(mountBar().get('[data-testid="tab-bar"]').classes()).toContain(
      'border-border-default',
    )
    wrapper?.unmount()
    expect(
      mountBar({ surface: 'default' }).get('[data-testid="tab-bar"]').classes(),
    ).toContain('border-border-strong')
  })

  it('marks the v-model item selected and makes only it reachable with Tab', () => {
    const w = mountBar({ modelValue: 'crypto' })
    const [stocks, crypto] = tabs(w)
    expect(crypto.attributes('aria-selected')).toBe('true')
    expect(crypto.attributes('tabindex')).toBe('0')
    expect(stocks.attributes('aria-selected')).toBe('false')
    expect(stocks.attributes('tabindex')).toBe('-1')
  })

  it('emits update:modelValue on click', async () => {
    const w = mountBar()
    await tabs(w)[2].trigger('click')
    expect(w.emitted('update:modelValue')?.[0]).toEqual(['perps'])
  })

  it('moves focus with arrows (wrapping) and Home/End without selecting', async () => {
    const w = mountBar()
    const elements = tabs(w).map(tab => tab.element as HTMLElement)
    const list = w.get('[role="tablist"]')

    elements[0].focus()
    await list.trigger('keydown', { key: 'ArrowLeft' })
    expect(document.activeElement).toBe(elements[2])
    await list.trigger('keydown', { key: 'ArrowRight' })
    expect(document.activeElement).toBe(elements[0])
    await list.trigger('keydown', { key: 'End' })
    expect(document.activeElement).toBe(elements[2])
    await list.trigger('keydown', { key: 'Home' })
    expect(document.activeElement).toBe(elements[0])
    expect(w.emitted('update:modelValue')).toBeUndefined()
  })

  it('skips disabled items when moving focus', async () => {
    const w = mountBar({
      items: [ITEMS[0], { ...ITEMS[1], disabled: true }, ITEMS[2]],
    })
    const elements = tabs(w).map(tab => tab.element as HTMLElement)
    elements[0].focus()
    await w.get('[role="tablist"]').trigger('keydown', { key: 'ArrowRight' })
    expect(document.activeElement).toBe(elements[2])
  })

  it('falls back to the first enabled tab when nothing matches the v-model', () => {
    const w = mountBar({
      modelValue: 'missing',
      items: [{ ...ITEMS[0], disabled: true }, ITEMS[1]],
    })
    expect(tabs(w)[1].attributes('tabindex')).toBe('0')
  })
})
