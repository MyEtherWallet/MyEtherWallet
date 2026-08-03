import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppNewsCard from '@/components/AppNewsCard.vue'

describe('AppNewsCard', () => {
  it('renders title and opens href in a new tab', () => {
    const w = mount(AppNewsCard, {
      props: { title: 'Big news', source: 'Reuters', href: 'https://x.test/a' },
    })
    expect(w.get('[data-test="news-title"]').text()).toBe('Big news')
    const a = w.get('a')
    expect(a.attributes('href')).toBe('https://x.test/a')
    expect(a.attributes('target')).toBe('_blank')
    expect(a.attributes('rel')).toContain('noopener')
  })

  it('renders the whole card behind data-test="news-card"', () => {
    const w = mount(AppNewsCard, { props: { title: 'Big news' } })
    expect(w.find('[data-test="news-card"]').exists()).toBe(true)
  })
})
