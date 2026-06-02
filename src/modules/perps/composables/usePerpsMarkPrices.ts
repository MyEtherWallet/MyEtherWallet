import { ref } from 'vue'
import { perpsClient } from '../configs'
import { gatedPoll } from './usePerpsActive'

const markPriceData = ref<Record<string, any>>({})
let initialized = false

async function fetchMarkPrices() {
  try {
    const res = await perpsClient.getMarkPrices()
    markPriceData.value = res.result ?? {}
  } catch (e) {
    console.error('Failed to fetch mark prices:', e)
  }
}

export function usePerpsMarkPrices() {
  if (!initialized) {
    initialized = true
    fetchMarkPrices()
    gatedPoll(fetchMarkPrices, 5_000)
  }
  return { markPriceData, refetch: fetchMarkPrices }
}
