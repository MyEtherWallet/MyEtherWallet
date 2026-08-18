import { describe, it, expect, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import { setActivePinia, createPinia } from 'pinia'
import { useWatchlistStore } from '@/stores/watchlistTableStore'
import { StoreConfigs } from '@/stores/configs'

describe('watchlistTableStore — perps bucket (MEW-2130)', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('defaults perps watchlist to empty', () => {
    expect(useWatchlistStore().watchListedPerps).toEqual([])
  })

  it('setWatchlistPerp toggles a market in and out by base currency', () => {
    const store = useWatchlistStore()
    store.setWatchlistPerp('BTC')
    expect(store.watchListedPerps).toEqual(['BTC'])
    expect(store.isWatchListedPerp('BTC')).toBe(true)
    store.setWatchlistPerp('BTC')
    expect(store.watchListedPerps).toEqual([])
    expect(store.isWatchListedPerp('BTC')).toBe(false)
  })

  it('persists the perps watchlist to localStorage', async () => {
    const store = useWatchlistStore()
    store.setWatchlistPerp('ETH')
    await nextTick()
    expect(
      localStorage.getItem(StoreConfigs.LOCAL_STORAGE_KEYS.watchListedPerps),
    ).toContain('ETH')
  })

  it('keeps token/stock watchlists independent from perps', () => {
    const store = useWatchlistStore()
    store.setWatchlistItem('bitcoin', false)
    store.setWatchlistItem('AAPL', true)
    store.setWatchlistPerp('BTC')
    expect(store.watchListedTokens).toEqual(['bitcoin'])
    expect(store.watchListedStocks).toEqual(['AAPL'])
    expect(store.watchListedPerps).toEqual(['BTC'])
  })
})
