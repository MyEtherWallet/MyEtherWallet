import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest'
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

  describe('when the tabs outgrow the bar', () => {
    // jsdom has no layout: 60px tabs, 12px apart, after the list's 6px ring
    // padding, in a 150px-wide list. The last tab ends at 360px.
    const FIVE = [
      ...ITEMS,
      { id: 'nft', label: 'NFT' },
      { id: 'more', label: 'More' },
    ]
    beforeEach(() => {
      vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(60)
      vi.spyOn(HTMLElement.prototype, 'offsetLeft', 'get').mockImplementation(
        function (this: HTMLElement) {
          const siblings = Array.from(this.parentElement?.children ?? [])
          return 6 + siblings.indexOf(this) * 72
        },
      )
      vi.spyOn(Element.prototype, 'clientWidth', 'get').mockReturnValue(150)
    })
    afterEach(() => vi.restoreAllMocks())

    const list = (w: VueWrapper) => w.get('[role="tablist"]').element

    it('scrolls sideways without a scrollbar', () => {
      expect(
        mountBar({ items: FIVE }).get('[role="tablist"]').classes(),
      ).toEqual(expect.arrayContaining(['overflow-x-auto', 'no-scrollbar']))
    })

    it('scrolls the selected tab into view on mount, ring included', () => {
      expect(
        list(mountBar({ items: FIVE, modelValue: 'more' })).scrollLeft,
      ).toBe(360 - 150)
    })

    it('scrolls to a newly selected tab and leaves visible ones alone', async () => {
      const w = mountBar({ items: FIVE })
      await w.setProps({ modelValue: 'crypto' })
      expect(list(w).scrollLeft).toBe(0)
      await w.setProps({ modelValue: 'more' })
      expect(list(w).scrollLeft).toBe(360 - 150)
    })

    it('scrolls back to a tab focused with the keyboard', async () => {
      const w = mountBar({ items: FIVE, modelValue: 'more' })
      list(w).scrollLeft = 360 - 150
      ;(tabs(w)[4].element as HTMLElement).focus()
      await w.get('[role="tablist"]').trigger('keydown', { key: 'Home' })
      expect(list(w).scrollLeft).toBe(0)
    })
  })

  it('falls back to the first enabled tab when nothing matches the v-model', () => {
    const w = mountBar({
      modelValue: 'missing',
      items: [{ ...ITEMS[0], disabled: true }, ITEMS[1]],
    })
    expect(tabs(w)[1].attributes('tabindex')).toBe('0')
  })
})
