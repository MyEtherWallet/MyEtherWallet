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

  it('renders headerless (no title header) when title is omitted', () => {
    const w = mount(AppHomeSection, {
      props: {},
      slots: { default: '<div data-test="content">body</div>' },
    })
    expect(w.find('[data-test="section-title"]').exists()).toBe(false)
    expect(w.find('[data-test="content"]').exists()).toBe(true)
  })
})
