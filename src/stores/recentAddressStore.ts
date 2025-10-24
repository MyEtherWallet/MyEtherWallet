import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import type { Chain } from '@/mew_api/types'


interface AddressKeyMap {
  [key: string]: string
}
type ChainType = 'EVM' | 'BITCOIN' | 'SOLANA' | 'POLKADOT' | 'KADENA'
type RecentAddresses = Record<ChainType, AddressKeyMap[]>
export const useRecentAddressStore = defineStore(
  'useRecentAddressStore',
  () => {
    const recentAddresses = useLocalStorage<RecentAddresses>(
      'recentAddresses',
      {
        EVM: [],
        BITCOIN: [],
        SOLANA: [],
        POLKADOT: [],
        KADENA: [],
      },
      {
        mergeDefaults: true,
      },
    )

    // Takes address to store, chain type to store under, and wallet name
    // to allow easy opening for the popup
    const addWallet = (address: string, chain: Chain, walletName: string) => {
      const addressKeyMap: AddressKeyMap = {};
      addressKeyMap[address] = walletName;


      const key = chain.type as ChainType
      if (recentAddresses.value[key]) {
        recentAddresses.value[key].push(addressKeyMap)
      } else {
        recentAddresses.value[key] = [addressKeyMap]
      }
    }

    const removeWallet = (address: string, chain: Chain) => {
      const key = chain.type as ChainType
      if (recentAddresses.value[key]) {
        recentAddresses.value[key] = recentAddresses.value[key].filter(
          (item) => !item[address]
        )
      }
    }

    return { addWallet, removeWallet, recentAddresses }
  },
)
