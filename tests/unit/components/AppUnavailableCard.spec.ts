import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppUnavailableCard from '@/components/AppUnavailableCard.vue'

const mountCard = (
  props: Record<string, unknown> = {},
  slots: Record<string, string> = {},
) =>
  mount(AppUnavailableCard, {
    props: { title: 'Perpetuals isn’t available', ...props },
    slots,
  })

describe('AppUnavailableCard', () => {
  it('renders the title', () => {
    expect(mountCard().text()).toContain('Perpetuals isn’t available')
  })

  it('renders the description when given', () => {
    const card = mountCard({ description: 'Not allowed in your jurisdiction.' })
    expect(card.text()).toContain('Not allowed in your jurisdiction.')
  })

  it('omits the description paragraph entirely when not given', () => {
    // Two <p> only when there is a description; one otherwise.
    expect(mountCard().findAll('p')).toHaveLength(1)
  })

  it('is announced to assistive tech', () => {
    expect(mountCard().attributes('role')).toBe('alert')
  })

  describe('shell', () => {
    // Regression guard: the shell inherited `shadow-button shadow-button-elevated`
    // from the overlay cards it replaced. The design is a flat 1px border —
    // sampling either edge showed pure white immediately outside it, no shadow.
    it('has no shadow', () => {
      const classes = mountCard().classes().join(' ')
      expect(classes).not.toContain('shadow')
    })

    it('uses a neutral 1px border', () => {
      const classes = mountCard().classes()
      expect(classes).toContain('border')
      expect(classes).toContain('border-line')
    })

    // Sits in normal document flow; the `overlay`/absolute-positioning variant
    // was removed once every caller stacked the card above its form.
    it('is not absolutely positioned', () => {
      const classes = mountCard().classes().join(' ')
      expect(classes).not.toContain('absolute')
    })
  })

  describe('accent', () => {
    it('defaults to error, colouring the title', () => {
      expect(mountCard().find('p').classes()).toContain('text-error')
    })

    it('honours the primary accent for informational states', () => {
      // Market-closed-with-a-countdown is not a failure, so it must not read red.
      const title = mountCard({ accent: 'primary' }).find('p')
      expect(title.classes()).toContain('text-brand')
      expect(title.classes()).not.toContain('text-error')
    })

    it('keeps the shell neutral regardless of accent', () => {
      const classes = mountCard({ accent: 'primary' }).classes()
      expect(classes).toContain('border-line')
      expect(classes).not.toContain('border-brand')
    })
  })

  describe('slots', () => {
    it('renders a default icon when none is supplied', () => {
      expect(mountCard().find('svg').exists()).toBe(true)
    })

    it('lets callers replace the icon, as the perps globe-and-badge does', () => {
      const card = mountCard({}, { icon: '<span class="custom-icon" />' })
      expect(card.find('.custom-icon').exists()).toBe(true)
      expect(card.find('svg').exists()).toBe(false)
    })

    it('renders action content when supplied', () => {
      const card = mountCard({}, { action: '<a href="#x">Learn more</a>' })
      expect(card.find('a').text()).toBe('Learn more')
    })

    it('omits the action container when no action is supplied', () => {
      // Otherwise every card without an action carries a stray 32px gap.
      const card = mountCard()
      expect(card.html()).not.toContain('mt-8')
    })
  })

  describe('attribute passthrough', () => {
    it('merges caller classes onto the card, which callers rely on for flow spacing', () => {
      const card = mountCard({ class: 'mb-3' })
      expect(card.classes()).toContain('mb-3')
      // Still the card's own shell, not a wrapper element.
      expect(card.classes()).toContain('rounded-16')
    })
  })
})
