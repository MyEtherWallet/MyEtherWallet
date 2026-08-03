import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppNewListingCard from '@/components/AppNewListingCard.vue'

describe('AppNewListingCard', () => {
  const mountIt = (props = {}) =>
    mount(AppNewListingCard, {
      // AppTokenLogo pulls in stocksStore (Pinia) internally — irrelevant to
      // this card's own behavior, so it's stubbed rather than wiring a store.
      global: { stubs: { AppTokenLogo: true } },
      props: {
        symbol: 'AAPL',
        name: 'Apple',
        price: '$100',
        marketCapLabel: 'Mkt cap',
        marketCap: '$1.2B',
        changeLabel: '24h',
        change: 1.2,
        volumeLabel: '24h vol',
        volume: '$5M',
        tradeLabel: 'Trade',
        ...props,
      },
    })

  it('renders symbol, name, price, market cap, volume', () => {
    const w = mountIt()
    expect(w.text()).toContain('AAPL')
    expect(w.text()).toContain('Apple')
    expect(w.text()).toContain('$100')
    expect(w.text()).toContain('$1.2B')
    expect(w.text()).toContain('$5M')
  })

  it('renders success color and an up arrow when change >= 0', () => {
    const w = mountIt({ change: 2 })
    expect(w.find('.text-success').exists()).toBe(true)
    expect(w.find('.text-error').exists()).toBe(false)
  })

  it('renders error color and a down arrow when change < 0', () => {
    const w = mountIt({ change: -2 })
    expect(w.find('.text-error').exists()).toBe(true)
    expect(w.find('.text-success').exists()).toBe(false)
  })

  it('does not render change column contents when change is unset', () => {
    const w = mountIt({ change: undefined })
    expect(w.find('.text-success').exists()).toBe(false)
    expect(w.find('.text-error').exists()).toBe(false)
  })

  it('emits trade (and not select) when the trade button is clicked', async () => {
    const w = mountIt()
    await w.get('[data-test="listing-trade"]').trigger('click')
    expect(w.emitted('trade')).toHaveLength(1)
    expect(w.emitted('select')).toBeUndefined()
  })

  it('emits select when the card root is clicked', async () => {
    const w = mountIt()
    await w.get('[data-test="listing-card"]').trigger('click')
    expect(w.emitted('select')).toHaveLength(1)
  })

  it('emits toggle-favorite (and not select) when the favorite button is clicked', async () => {
    const w = mountIt()
    await w.get('[data-test="listing-favorite"]').trigger('click')
    expect(w.emitted('toggle-favorite')).toHaveLength(1)
    expect(w.emitted('select')).toBeUndefined()
  })
})
