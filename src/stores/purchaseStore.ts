import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useFetchMewApi } from '@/composables/useFetchMewApi'
import type { PurchaseInfo } from '@/types/buyToken'
import configs from '@/configs'
const isDevMode = configs.IS_DEV_MODE

export const usePurchaseStore = defineStore('purchase', () => {
  const purchaseInfo = ref<PurchaseInfo | null>(null)
  const isFetching = ref(false)

  const buyableCoinIds = computed(() => {
    if (!purchaseInfo.value) return new Set<string>()
    const ids = new Set<string>()
    purchaseInfo.value.assets.forEach(chain => {
      chain.assets.forEach(asset => {
        if (asset.coingecko_id) {
          ids.add(asset.coingecko_id)
        }
      })
    })
    return ids
  })

  const fetchPurchaseInfo = async () => {
    if (purchaseInfo.value || isFetching.value) return
    isFetching.value = true
    const { useMEWFetch } = useFetchMewApi()
    try {
      const { data } = await useMEWFetch(configs.MEW_PURCHASE_API)
        .get()
        .json<PurchaseInfo>()
      purchaseInfo.value = data.value
    } catch (error) {
      if (isDevMode) {
        console.error('Failed to fetch purchase info:', error)
      }
    } finally {
      isFetching.value = false
    }
  }

  const isBuyable = (coinId: string | undefined): boolean => {
    if (!coinId) return false
    return buyableCoinIds.value.has(coinId)
  }

  return {
    purchaseInfo,
    isFetching,
    buyableCoinIds,
    fetchPurchaseInfo,
    isBuyable,
  }
})
