import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppHomeSection from '@/components/AppHomeSection.vue'

const mountIt = (props = {}) =>
  mount(AppHomeSection, {
    props: { title: 'Market news', subtitle: 'sub', ...props },
    slots: { default: '<div data-test="content">body</div>' },
  })

describe('AppHomeSection', () => {
  it('renders title, subtitle and content by default', () => {
    const w = mountIt()
    expect(w.get('[data-test="section-title"]').text()).toBe('Market news')
    expect(w.find('[data-test="content"]').exists()).toBe(true)
  })
  it('shows skeleton and hides content when loading', () => {
    const w = mountIt({ loading: true })
    expect(w.find('[data-test="section-skeleton"]').exists()).toBe(true)
    expect(w.find('[data-test="content"]').exists()).toBe(false)
  })
  it('shows empty state when empty', () => {
    const w = mountIt({ empty: true })
    expect(w.find('[data-test="section-empty"]').exists()).toBe(true)
    expect(w.find('[data-test="content"]').exists()).toBe(false)
  })
})
