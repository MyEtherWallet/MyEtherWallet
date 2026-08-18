import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppLearnMoreLink from '@/components/AppLearnMoreLink.vue'

const HREF = 'https://help.example.test/restrictions'

const mountLink = (props: Record<string, unknown> = {}) =>
  mount(AppLearnMoreLink, {
    props: { href: HREF, label: 'Learn more', ...props },
  })

describe('AppLearnMoreLink', () => {
  it('renders as a real anchor to the given url', () => {
    const link = mountLink()
    expect(link.element.tagName).toBe('A')
    expect(link.attributes('href')).toBe(HREF)
  })

  it('renders the caller-supplied label, which owns its own i18n namespace', () => {
    expect(mountLink({ label: 'Más información' }).text()).toContain(
      'Más información',
    )
  })

  it('opens in a new tab without leaking the opener', () => {
    const link = mountLink()
    expect(link.attributes('target')).toBe('_blank')
    // rel is load-bearing: target=_blank without it hands the help page a
    // window.opener reference back into the wallet.
    expect(link.attributes('rel')).toBe('noopener noreferrer')
  })

  it('hides its decorative icon from assistive tech', () => {
    expect(mountLink().find('svg').attributes('aria-hidden')).toBe('true')
  })

  it('forwards native clicks so callers can track the interaction', async () => {
    // No `emits` is declared, so `@click` must fall through to the anchor —
    // that is how the analytics call on both Learn more links is wired.
    let clicks = 0
    const link = mount(AppLearnMoreLink, {
      props: { href: HREF, label: 'Learn more' },
      attrs: { onClick: () => (clicks += 1) },
    })

    await link.trigger('click')
    expect(clicks).toBe(1)
  })
})
