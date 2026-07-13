import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import { StoreConfigs } from './configs'
import { computed } from 'vue'

/**
 * Interface for recently viewed tokens
 */
export interface RecentlyViewedToken {
  id: string
  symbol: string
  name: string
  icon?: string
  isStock?: boolean
}

export const useRecentlyViewedTokensStore = defineStore(
  'recentlyViewedTokens',
  () => {
    /**
     * Recently viewed tokens stored in local storage
     */
    const recentlyViewedTokens = useLocalStorage<RecentlyViewedToken[]>(
      StoreConfigs.LOCAL_STORAGE_KEYS.recentlyViewedTokens,
      [],
    )

    /**
     * Returns recently viewed stocks only
     */
    const recentlyViewedStocks = computed<RecentlyViewedToken[]>(() => {
      return recentlyViewedTokens.value.filter(token => token.isStock)
    })

    /**
     * Returns recently viewed crypto tokens only (non-stocks).
     */
    const recentlyViewedCrypto = computed<RecentlyViewedToken[]>(() => {
      return recentlyViewedTokens.value.filter(token => !token.isStock)
    })

    /**
     * Add a token to the recently viewed list.
     * Keeps up to 10 tokens and 10 stocks separately (20 items max) and ensures no duplicates.
     */
    const addToken = (token: RecentlyViewedToken) => {
      const index = recentlyViewedTokens.value.findIndex(t => t.id === token.id)

      // If token already exists, remove it to move it to the front
      if (index !== -1) {
        recentlyViewedTokens.value.splice(index, 1)
      }

      // Add to the beginning of the list
      recentlyViewedTokens.value.unshift(token)

      // Limit to 10 items per category (Stock or Token)
      const LIMIT = 10
      let stockCount = 0
      let tokenCount = 0

      recentlyViewedTokens.value = [
        ...recentlyViewedTokens.value.filter(t => {
          if (t.isStock) {
            stockCount++
            return stockCount <= LIMIT
          } else {
            tokenCount++
            return tokenCount <= LIMIT
          }
        }),
      ]
    }

    /**
     * Clear the list of recently viewed tokens
     */
    const clearRecentlyViewed = () => {
      recentlyViewedTokens.value = []
    }

    return {
      recentlyViewedTokens,
      recentlyViewedStocks,
      recentlyViewedCrypto,
      addToken,
      clearRecentlyViewed,
    }
  },
)
