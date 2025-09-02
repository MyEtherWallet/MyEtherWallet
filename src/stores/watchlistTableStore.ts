import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

export const useWatchlistStore = defineStore(
  'useWatchlistStore',
  () => {
    const watchListedTokens = useLocalStorage<string[]>('watchListedTokens', [], {
      mergeDefaults: true,
    })

    const addTokenToWatchList = (coinId: string) => {
      const watchListArray = watchListedTokens.value;
      watchListArray.push(coinId);
    }

    const removeTokenWatchList = (coinId: string) => {
      const filteredWatchListArray = watchListedTokens.value.filter((sCoinId: string) => {
        return sCoinId !== coinId;
      });
      watchListedTokens.value = filteredWatchListArray
    }

    const isWatchListed = (coinId: string) => {
      const isStored = watchListedTokens.value.find((sCoinId: string) => {
        if (coinId === sCoinId) return sCoinId
      })

      return !!isStored;
    }


    return {
      addTokenToWatchList, removeTokenWatchList, watchListedTokens, isWatchListed
    }
  },
)
