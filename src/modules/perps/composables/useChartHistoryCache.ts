type Entry = {
  labels: number[]
  points: number[]
  fetchedAt: number
}

const TTL_MS = 60_000

const cache = new Map<string, Entry>()

export function useChartHistoryCache() {
  return {
    get(key: string): { labels: number[]; points: number[] } | undefined {
      const entry = cache.get(key)
      if (!entry) return undefined
      if (Date.now() - entry.fetchedAt > TTL_MS) {
        cache.delete(key)
        return undefined
      }
      return { labels: entry.labels, points: entry.points }
    },
    set(key: string, value: { labels: number[]; points: number[] }) {
      cache.set(key, { ...value, fetchedAt: Date.now() })
    },
    clearAll() {
      cache.clear()
    },
  }
}

// Test-only helper. Production code must not call this.
export function _resetChartHistoryCacheForTests() {
  cache.clear()
}
