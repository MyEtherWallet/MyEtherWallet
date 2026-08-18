import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  missingWarn: false,
  fallbackWarn: false,
  messages: { en: {} },
})

const push = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({ push }),
}))

vi.mock('@/composables/useCurrency', () => ({
  useCurrency: () => ({
    formatFiat: (value: number | string) => ({ display: `$${value}` }),
  }),
}))

import HeroTrendingCard from '@/modules/home/components/HeroTrendingCard.vue'
import type { TrendingRowItem } from '@/modules/home/components/heroTrending'

// Stub the row so we test the card's mapping/wiring, not the row internals
// (covered in AppTokenListRow.spec).
const AppTokenListRowStub = {
  props: ['symbol', 'change', 'priceDisplay'],
  emits: ['select'],
  template:
    '<div data-test="row" @click="$emit(\'select\')">{{ symbol }} {{ priceDisplay }}</div>',
}

const items: TrendingRowItem[] = Array.from({ length: 5 }, (_, i) => ({
  symbol: `S${i}`,
  name: `Name ${i}`,
  isStock: false,
  price: i + 1,
  change: i % 2 === 0 ? 1 : -1,
  to: { name: 'detail', params: { id: String(i) } },
}))

const seeAllTo = { name: 'Crypto' }

const mountCard = (props: Record<string, unknown> = {}) =>
  mount(HeroTrendingCard, {
    props: { title: 'Trending crypto', seeAllTo, items, ...props },
    global: {
      plugins: [i18n],
      stubs: { AppTokenListRow: AppTokenListRowStub },
    },
  })

describe('HeroTrendingCard (MEW-2094)', () => {
  beforeEach(() => push.mockClear())

  it('renders the title and one row per item', () => {
    const w = mountCard()
    expect(w.text()).toContain('Trending crypto')
    expect(w.findAll('[data-test="row"]').length).toBe(5)
  })

  it('formats each row price through useCurrency', () => {
    const rows = mountCard().findAll('[data-test="row"]')
    expect(rows[0].text()).toContain('$1')
  })

  it('shows skeletons and no rows while loading', () => {
    const w = mountCard({ isLoading: true })
    expect(w.findAll('[data-test="trending-skeleton"]').length).toBe(5)
    expect(w.findAll('[data-test="row"]').length).toBe(0)
  })

  it('shows an empty state when there are no items and not loading', () => {
    const w = mountCard({ items: [] })
    expect(w.find('[data-test="trending-empty"]').exists()).toBe(true)
    expect(w.findAll('[data-test="row"]').length).toBe(0)
  })

  it('navigates to seeAllTo when the header link is clicked', async () => {
    const w = mountCard()
    await w.get('[data-test="trending-see-all"]').trigger('click')
    expect(push).toHaveBeenCalledWith(seeAllTo)
  })

  it('navigates to the item route when a row is selected', async () => {
    const w = mountCard()
    await w.findAll('[data-test="row"]')[2].trigger('click')
    expect(push).toHaveBeenCalledWith(items[2].to)
  })
})
