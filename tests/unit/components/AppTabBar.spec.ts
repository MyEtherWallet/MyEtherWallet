import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppTabBar from '@/components/AppTabBar.vue'

describe('AppTabBar', () => {
  const mountIt = (modelValue = 0) =>
    mount(AppTabBar, { props: { modelValue, tabs: ['Stocks', 'Crypto'] } })

  it('renders a tab per label', () => {
    const tabs = mountIt().findAll('[data-test="tab-bar-item"]')
    expect(tabs.length).toBe(2)
    expect(tabs[0].text()).toBe('Stocks')
    expect(tabs[1].text()).toBe('Crypto')
  })

  it('marks the active tab as selected', () => {
    const tabs = mountIt(1).findAll('[data-test="tab-bar-item"]')
    expect(tabs[0].attributes('aria-selected')).toBe('false')
    expect(tabs[1].attributes('aria-selected')).toBe('true')
  })

  it('emits update:modelValue with the clicked index', async () => {
    const w = mountIt(0)
    await w.findAll('[data-test="tab-bar-item"]')[1].trigger('click')
    expect(w.emitted('update:modelValue')?.[0]).toEqual([1])
  })
})
