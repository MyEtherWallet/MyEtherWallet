import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ref } from 'vue'

// Controllable stand-in for the useMEWFetch response the composable
// destructures (data / isFetching / execute). Tests push into `data` to
// simulate the API without hitting the network — same pattern as
// useGlobalSearch.spec / HomeNewListings.spec.
const data = ref<unknown>(null)
const isFetching = ref(false)
const execute = vi.fn()

vi.mock('@/composables/useFetchMewApi', () => ({
  useFetchMewApi: () => ({
    useMEWFetch: () => ({
      get: () => ({
        json: () => ({ data, isFetching, execute }),
      }),
    }),
  }),
}))

const { useCryptoTrending } = await import(
  '@/modules/home/composables/useCryptoTrending'
)

describe('useCryptoTrending (MEW-2094)', () => {
  beforeEach(() => {
    data.value = null
    isFetching.value = false
    execute.mockClear()
  })

  it('starts empty before data arrives', () => {
    expect(useCryptoTrending().trending.value).toEqual([])
  })

  it('maps the response `items` onto `trending`', () => {
    const items = [
      { coinId: 'btc', symbol: 'BTC', name: 'Bitcoin' },
      { coinId: 'eth', symbol: 'ETH', name: 'Ethereum' },
    ]
    data.value = { items }
    expect(useCryptoTrending().trending.value).toEqual(items)
  })

  it('exposes execute as fetchTrending and isFetching as isLoading', () => {
    const { fetchTrending, isLoading } = useCryptoTrending()
    fetchTrending()
    expect(execute).toHaveBeenCalled()
    isFetching.value = true
    expect(isLoading.value).toBe(true)
  })
})
