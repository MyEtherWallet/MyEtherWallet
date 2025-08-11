import { computed } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import { useGlobalStore } from './globalStore'
import { useChainsStore } from './chainsStore'

interface Address {
  address: string
  name: string
  chainName: string
}
// This interface represents the structure of the address book, where each key is a network type and the value is an array of addresses associated with that network.
interface AddressBook {
  [key: string]: Address[]
}
// This interface represents the structure of the  recent addresses, where each key is a network identifier and the value is an array of addresses associated with that network.
interface RecentAddress {
  [key: string]: string[]
}

export const useAddressBookStore = defineStore('addressBookStore', () => {
  const globalStore = useGlobalStore()
  const { selectedNetwork: currentNetworkName } = storeToRefs(globalStore)
  const chainsStore = useChainsStore()
  const { selectedChain } = storeToRefs(chainsStore)
  const storeAdrObject: Record<string, Address[]> = {}
  storeAdrObject[currentNetworkName.value] = []

  const storeObject: Record<string, string[]> = {}
  storeObject[currentNetworkName.value] = []

  const addressBook = useLocalStorage<AddressBook>(
    'addressBook',
    storeAdrObject,
    {
      mergeDefaults: true,
    },
  )

  const recentAddresses = useLocalStorage<RecentAddress>(
    'RecentAddress',
    storeObject,
    { mergeDefaults: true },
  )

  const recentLength = computed(
    () => recentAddresses.value[currentNetworkName.value]?.length || 0,
  )

  const currentAddressBook = computed<Address[]>(
    () => addressBook.value[selectedChain.value?.type || ''],
  )

  const isAdrAdded = (address: string, chainType: string) => {
    return (
      addressBook.value[chainType]?.some(entry => entry.address === address) ||
      false
    )
  }

  const isNameAdded = (name: string, chainType: string) => {
    return (
      addressBook.value[chainType]?.some(entry => entry.name === name) || false
    )
  }

  const otherAddressBook = computed(() => {
    const keys = Object.keys(addressBook.value).filter(
      key => key !== selectedChain.value?.type,
    )

    return keys.flatMap(key => addressBook.value[key])
  })

  const addAddress = (address: Address, chainType: string) => {
    if (currentAddressBook.value.length > 0) {
      const index = addressBook.value[chainType].findIndex(
        (_address: Address) => _address.address === address.address,
      )
      if (index === -1) {
        const currentArray = addressBook.value[chainType]
        currentArray.push(address)
        addressBook.value[chainType] = currentArray
      }
    } else {
      addressBook.value[chainType] = [address]
    }
  }
  const removeAddress = (index: number, chainType: string) => {
    addressBook.value[chainType].splice(index, 1)
  }

  const addRecentAddress = (address: string) => {
    if (recentLength.value > 0) {
      const index =
        recentAddresses.value[currentNetworkName.value].indexOf(address)
      //not found
      if (index === -1) {
        recentAddresses.value[currentNetworkName.value].unshift(address)
      } else {
        //if found, remove it from the array
        recentAddresses.value[currentNetworkName.value].splice(index, 1)
        //and add it to the beginning of the array
        recentAddresses.value[currentNetworkName.value].unshift(address)
      }
    } else {
      recentAddresses.value[currentNetworkName.value] = [address]
    }
  }
  const removeRecentAddress = (index: number) => {
    recentAddresses.value[currentNetworkName.value].splice(index, 1)
  }
  return {
    /** AddressBook */
    addressBook,
    currentAddressBook,
    otherAddressBook,
    isAdrAdded,
    isNameAdded,
    addAddress,
    removeAddress,
    /** RecentAddress */
    recentAddresses,
    addRecentAddress,
    removeRecentAddress,
  }
})
