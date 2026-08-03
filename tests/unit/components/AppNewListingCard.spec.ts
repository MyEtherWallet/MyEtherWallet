import { describe, it, expect } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import AppNewListingCard from '@/components/AppNewListingCard.vue'

describe('AppNewListingCard', () => {
  const mountIt = (props = {}) =>
    mount(AppNewListingCard, {
      props: {
        name: 'Apple',
        symbol: 'AAPL',
        price: '$100',
        change: 1.2,
        to: '/stocks/AAPL',
        ...props,
      },
      global: { stubs: { RouterLink: RouterLinkStub } },
    })

  it('renders name, symbol, price', () => {
    const w = mountIt()
    expect(w.get('[data-test="listing-name"]').text()).toBe('Apple')
    expect(w.get('[data-test="listing-symbol"]').text()).toBe('AAPL')
    expect(w.get('[data-test="listing-price"]').text()).toBe('$100')
  })

  it('marks positive change', () => {
    expect(
      mountIt({ change: 2 })
        .get('[data-test="listing-change"]')
        .attributes('data-dir'),
    ).toBe('up')
  })

  it('marks negative change', () => {
    expect(
      mountIt({ change: -2 })
        .get('[data-test="listing-change"]')
        .attributes('data-dir'),
    ).toBe('down')
  })

  it('marks zero change as up (change >= 0)', () => {
    expect(
      mountIt({ change: 0 })
        .get('[data-test="listing-change"]')
        .attributes('data-dir'),
    ).toBe('up')
  })

  it('marks flat change when unset', () => {
    expect(
      mountIt({ change: undefined })
        .get('[data-test="listing-change"]')
        .attributes('data-dir'),
    ).toBe('flat')
  })

  it('renders as RouterLink when `to` is set', () => {
    const w = mountIt()
    expect(w.findComponent(RouterLinkStub).exists()).toBe(true)
  })
})
