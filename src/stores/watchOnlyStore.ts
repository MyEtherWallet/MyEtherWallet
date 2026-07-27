import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import type { Chain, ChainType } from '@/mew_api/types'
import { isAddressChainTypeMismatch } from '@/utils/addressUtils'

interface AddressKeyValue {
  address: string
  walletName: string
  chain: Chain
  type: ChainType
  walletType: string
}

interface RecentAddress {
  [key: string]: AddressKeyValue[]
}

export const useWatchOnlyStore = defineStore('useWatchOnlyStore', () => {
  const watchOnlyAddresses = useLocalStorage<RecentAddress>(
    'watchOnlyList',
    {
      EVM: [],
      BITCOIN: [],
    },
    {
      mergeDefaults: true,
    },
  )
  // Takes address to store, chain type to store under, and wallet name
  // to allow easy opening for the popup
  const addWallet = (
    address: string,
    chain: Chain,
    walletType: string,
    type: ChainType,
    walletName: string,
  ) => {
    // Never persist an address into a bucket whose chain type its format does
    // not match (e.g. an EVM `0x` address under BITCOIN). Such a pair is later
    // rebuilt into a watch-only wallet that hits an invalid balance endpoint
    // (MEW-2043). This is the write-side root-cause guard.
    if (isAddressChainTypeMismatch(address, type, chain.name)) {
      return
    }
    const addressKeyMap: AddressKeyValue = {
      walletType,
      walletName,
      chain,
      address,
      type,
    }

    if (watchOnlyAddresses.value[chain.type]) {
      // Check if address already exists
      const existingIndex = watchOnlyAddresses.value[chain.type].findIndex(
        item => item.address === address,
      )

      if (existingIndex !== -1) {
        // Remove existing entry and add to front (end of array = most recent)
        watchOnlyAddresses.value[chain.type].splice(existingIndex, 1)
        watchOnlyAddresses.value[chain.type].push(addressKeyMap)
      } else {
        // Remove oldest element if there are already 2 or more
        if (watchOnlyAddresses.value[chain.type].length >= 2) {
          watchOnlyAddresses.value[chain.type].shift()
        }
        watchOnlyAddresses.value[chain.type].push(addressKeyMap)
      }
    } else {
      watchOnlyAddresses.value[chain.type] = [addressKeyMap]
    }
  }

  const removeWallet = (address: string, chain: Chain) => {
    if (watchOnlyAddresses.value[chain.type]) {
      watchOnlyAddresses.value[chain.type] = watchOnlyAddresses.value[
        chain.type
      ].filter(item => item.address !== address)
    }
  }

  return { addWallet, removeWallet, watchOnlyAddresses }
})
