import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import { StoreConfigs } from './configs'
export const useWatchlistStore = defineStore('useWatchlistStore', () => {
  /**--------------------------
   * WATCHLIST LOCAL STORAGE
   * 1. watchListedTokens: An array of coin IDs representing the tokens that the user has added to their watchlist.
   * 2. watchListedStocks: An array of stock symbols representing the stocks that the user has added to their watchlist.
   * 3. setWatchlistItem: A function that adds or removes a token/stock to/from the watchlist based on isStock parameter.
   * 4. isWatchListed: A function that checks if a given coin ID or stock symbol is present in the respective watchlist and returns a boolean value.
   --------------------------*/
  const watchListedTokens = useLocalStorage<string[]>(
    StoreConfigs.LOCAL_STORAGE_KEYS.watchListedTokens,
    [],
    {
      mergeDefaults: true,
    },
  )

  const watchListedStocks = useLocalStorage<string[]>(
    StoreConfigs.LOCAL_STORAGE_KEYS.watchListedStocks,
    [],
    {
      mergeDefaults: true,
    },
  )

  const setWatchlistItem = (
    id: string,
    isStock: boolean | null | undefined = true,
  ) => {
    const targetList = isStock ? watchListedStocks : watchListedTokens
    const isAlreadyListed = targetList.value.includes(id)

    if (isAlreadyListed) {
      targetList.value = targetList.value.filter(item => item !== id)
    } else {
      targetList.value = [...targetList.value, id]
    }
  }

  const isWatchListed = (coinId: string) => {
    const isStoredToken = watchListedTokens.value.find((sCoinId: string) => {
      if (coinId === sCoinId) return sCoinId
    })

    const isStoredStock = watchListedStocks.value.find((sSymbol: string) => {
      if (coinId === sSymbol) return sSymbol
    })

    const isStored = isStoredToken || isStoredStock

    return !!isStored
  }

  return {
    setWatchlistItem,
    watchListedTokens,
    isWatchListed,
    watchListedStocks,
  }
})
