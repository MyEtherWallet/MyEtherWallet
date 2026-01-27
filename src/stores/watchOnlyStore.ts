import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import type { Chain } from '@/mew_api/types'

interface AddressKeyValue {
  walletName: string
  chain: Chain
}

interface AddressKey {
  [key: string]: AddressKeyValue
}
interface RecentAddress {
  [key: string]: AddressKey
}
export const useWatchOnlyStore = defineStore('useWatchOnlyStore', () => {
  const watchOnlyAddresses = useLocalStorage<RecentAddress>(
    'watchOnly',
    {
      EVM: {},
      BITCOIN: {},
      SOLANA: {},
      POLKADOT: {},
      KADENA: {},
    },
    {
      mergeDefaults: true,
    },
  )

  // Takes address to store, chain type to store under, and wallet name
  // to allow easy opening for the popup
  const addWallet = (address: string, chain: Chain, walletName: string) => {
    const addressKeyMap: AddressKeyValue = { walletName, chain }

    if (watchOnlyAddresses.value[chain.type]) {
      watchOnlyAddresses.value[chain.type][address] = addressKeyMap
    } else {
      watchOnlyAddresses.value[chain.type] = {
        [address]: addressKeyMap,
      }
    }
  }

  const removeWallet = (address: string, chain: Chain) => {
    if (watchOnlyAddresses.value[chain.type]) {
      delete watchOnlyAddresses.value[chain.type][address]
    }
  }

  return { addWallet, removeWallet, watchOnlyAddresses }
})
