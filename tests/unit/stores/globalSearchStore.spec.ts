import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

const { trackGlobalSearchEvent } = vi.hoisted(() => ({
  trackGlobalSearchEvent: vi.fn(),
}))
vi.mock('@/analytics', () => ({
  analytics: { trackGlobalSearchEvent },
  GlobalSearchEvent: { SHOWN: 'shown' },
}))
vi.mock('@/composables/useFetchMewApi', async () => {
  const { ref } = await import('vue')
  const json = () => ({ data: ref(null), isFetching: ref(false), execute: vi.fn() })
  return { useFetchMewApi: () => ({ useMEWFetch: () => ({ get: () => ({ json }) }) }) }
})

import { useGlobalSearchStore } from '@/stores/globalSearchStore'

beforeEach(() => {
  setActivePinia(createPinia())
  trackGlobalSearchEvent.mockClear()
})

describe('globalSearchStore', () => {
  it('tracks SHOWN once per opening, not on every open() while open', () => {
    const store = useGlobalSearchStore()
    // A click into the searchbar fires focusin and click, both calling open().
    store.open()
    store.open()
    expect(store.isOpen).toBe(true)
    expect(trackGlobalSearchEvent).toHaveBeenCalledTimes(1)

    store.close()
    store.open()
    expect(trackGlobalSearchEvent).toHaveBeenCalledTimes(2)
  })
})
