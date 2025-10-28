import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import type { Chain } from '@/mew_api/types'

interface AddressKeyValue {
  walletName: string;
  chain: Chain;
}

interface AddressKey {
  [key: string]: AddressKeyValue;
}
interface RecentAddress {
  [key: string]: AddressKey;
}
export const useRecentAddressStore = defineStore(
  'useRecentAddressStore',
  () => {
    const recentAddresses = useLocalStorage<RecentAddress>('recentAddresses', {
      EVM: {},
      BITCOIN: {},
      SOLANA: {},
      POLKADOT: {},
      KADENA: {},
    }, {
      mergeDefaults: true,
    })

    // Takes address to store, chain type to store under, and wallet name
    // to allow easy opening for the popup
    const addWallet = (address: string, chain: Chain, walletName: string) => {
      const addressKeyMap: AddressKeyValue = { walletName, chain };


      if (recentAddresses.value[chain.type]) {
        recentAddresses.value[chain.type][address] = addressKeyMap
      } else {
        recentAddresses.value[chain.type] = {
          [address]: addressKeyMap
        }
      }
    }

    const removeWallet = (address: string, chain: Chain) => {
      if (recentAddresses.value[chain.type]) {
        delete recentAddresses.value[chain.type][address]
      }
    }

    return { addWallet, removeWallet, recentAddresses }
  },
)
