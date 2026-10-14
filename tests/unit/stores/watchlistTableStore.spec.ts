import { describe, it, expect, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import { setActivePinia, createPinia } from 'pinia'
import { useWatchlistStore, WATCHLIST_MAX } from '@/stores/watchlistTableStore'
import { StoreConfigs } from '@/stores/configs'
import { useToastStore } from '@/stores/toastStore'
import { ToastType } from '@/types/notification/index'

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

describe('watchlistTableStore — 25-item cap (MEW-2360)', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('caps crypto at WATCHLIST_MAX and rejects extras', () => {
    const store = useWatchlistStore()
    for (let i = 0; i < WATCHLIST_MAX + 5; i++) {
      store.setWatchlistItem(`coin-${i}`, false)
    }
    expect(store.watchListedTokens.length).toBe(WATCHLIST_MAX)
    expect(store.watchListedTokens).not.toContain(`coin-${WATCHLIST_MAX}`)
  })

  it('caps stocks at WATCHLIST_MAX and rejects extras', () => {
    const store = useWatchlistStore()
    for (let i = 0; i < WATCHLIST_MAX + 5; i++) {
      store.setWatchlistItem(`STK-${i}`, true)
    }
    expect(store.watchListedStocks.length).toBe(WATCHLIST_MAX)
  })

  it('caps perps at WATCHLIST_MAX and rejects extras', () => {
    const store = useWatchlistStore()
    for (let i = 0; i < WATCHLIST_MAX + 5; i++) {
      store.setWatchlistPerp(`P${i}`)
    }
    expect(store.watchListedPerps.length).toBe(WATCHLIST_MAX)
  })

  it('caps each bucket independently (home can hold 25 crypto + 25 stocks)', () => {
    const store = useWatchlistStore()
    for (let i = 0; i < WATCHLIST_MAX + 3; i++) {
      store.setWatchlistItem(`coin-${i}`, false)
      store.setWatchlistItem(`STK-${i}`, true)
      store.setWatchlistPerp(`P${i}`)
    }
    expect(store.watchListedTokens.length).toBe(WATCHLIST_MAX)
    expect(store.watchListedStocks.length).toBe(WATCHLIST_MAX)
    expect(store.watchListedPerps.length).toBe(WATCHLIST_MAX)
  })

  it('frees a slot when an item is removed, allowing a new add', () => {
    const store = useWatchlistStore()
    for (let i = 0; i < WATCHLIST_MAX; i++) {
      store.setWatchlistItem(`coin-${i}`, false)
    }
    // Full: a brand-new id is rejected.
    store.setWatchlistItem('coin-new', false)
    expect(store.watchListedTokens).not.toContain('coin-new')
    // Toggle one off, then the new id fits.
    store.setWatchlistItem('coin-0', false)
    store.setWatchlistItem('coin-new', false)
    expect(store.watchListedTokens.length).toBe(WATCHLIST_MAX)
    expect(store.watchListedTokens).toContain('coin-new')
    expect(store.watchListedTokens).not.toContain('coin-0')
  })
})

describe('watchlistTableStore — limit toast (MEW-2374)', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('surfaces the limit toast once for a batch overflow, as a warning', () => {
    const store = useWatchlistStore()
    // Reject several adds in one run (mirrors the onboarding batch).
    for (let i = 0; i < WATCHLIST_MAX + 5; i++) {
      store.setWatchlistItem(`coin-${i}`, false)
    }
    const toasts = useToastStore().messages
    expect(toasts).toHaveLength(1)
    expect(toasts[0].type).toBe(ToastType.Warning)
  })

  it('shows the toast again after the earlier one is dismissed', () => {
    const store = useWatchlistStore()
    const toast = useToastStore()
    for (let i = 0; i < WATCHLIST_MAX + 1; i++) {
      store.setWatchlistItem(`coin-${i}`, false)
    }
    expect(toast.messages).toHaveLength(1)
    // Once the previous toast clears, a new rejection surfaces a fresh one.
    toast.removeToastMessage(0)
    store.setWatchlistItem('coin-extra', false)
    expect(toast.messages).toHaveLength(1)
  })
})
