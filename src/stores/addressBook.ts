import { defineStore, storeToRefs } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import { useGlobalStore } from './globalStore'

export interface Address {
  address: string
  name: string
  chainName: string
  chainType: string
}
// This interface represents the structure of the address book, where each key is a network type and the value is an array of addresses associated with that network.
interface AddressBook {
  saved: { [key: string]: Address[] }
  recent: { [key: string]: Address[] }
}
export const useAddressBookStore = defineStore('addressBookStore', () => {
  const globalStore = useGlobalStore()
  const { selectedNetwork: currentNetworkName } = storeToRefs(globalStore)
  const storeAdrObject: AddressBook = {
    saved: {},
    recent: {},
  }

  const addressBook = useLocalStorage<AddressBook>(
    'addressBook',
    storeAdrObject,
    {
      mergeDefaults: true,
    },
  )

  const isAdrAdded = (address: string, chainType: string) => {
    return (
      addressBook.value.saved[chainType]?.some(
        entry => entry.address === address,
      ) || false
    )
  }

  const isNameAdded = (name: string, chainType: string) => {
    return (
      addressBook.value.saved[chainType]?.some(entry => entry.name === name) ||
      false
    )
  }

  const addAddress = (address: Address, chainType: string) => {
    if (!addressBook.value.saved[chainType]) {
      addressBook.value.saved[chainType] = []
    }

    const index = addressBook.value.saved[chainType].findIndex(
      (_address: Address) => _address.address === address.address,
    )
    if (index === -1) {
      addressBook.value.saved[chainType].push(address)
    } else {
      addressBook.value.saved[chainType][index] = address
    }
  }

  const removeAddress = (adr: Address, chainType: string) => {
    if (!addressBook.value.saved[chainType]) return
    const index = addressBook.value.saved[chainType].findIndex(
      (_address: Address) => _address.address === adr.address,
    )
    if (index !== -1) {
      addressBook.value.saved[chainType].splice(index, 1)
    }
  }

  const editAddress = (address: Address, chainType: string) => {
    addAddress(address, chainType)
  }

  const addRecentAddress = (adr: Address, networkName?: string) => {
    const netName = networkName || currentNetworkName.value
    if (!addressBook.value.recent[netName]) {
      addressBook.value.recent[netName] = []
    }

    const index = addressBook.value.recent[netName].findIndex(
      item => item.address.toLowerCase() === adr.address.toLowerCase(),
    )
    //not found
    if (index === -1) {
      addressBook.value.recent[netName].unshift(adr)
    } else {
      //if found, remove it from the array
      addressBook.value.recent[netName].splice(index, 1)
      //and add it to the beginning of the array
      addressBook.value.recent[netName].unshift(adr)
    }

    // Optional: limit to 20 recent addresses
    if (addressBook.value.recent[netName].length > 20) {
      addressBook.value.recent[netName].pop()
    }
  }

  const removeRecentAddress = (adr: Address, networkName?: string) => {
    const netName = networkName || currentNetworkName.value
    if (!addressBook.value.recent[netName]) return
    const index = addressBook.value.recent[netName].findIndex(
      item => item.address.toLowerCase() === adr.address.toLowerCase(),
    )
    if (index !== -1) {
      addressBook.value.recent[netName].splice(index, 1)
    }
  }

  const inAddressBook = (
    address: string,
    chainType: string,
  ): Address | string => {
    const found = addressBook.value.saved[chainType]?.find(
      entry => entry.address === address,
    )
    return found || ''
  }
  return {
    /** AddressBook */
    addressBook,
    isAdrAdded,
    isNameAdded,
    addAddress,
    removeAddress,
    editAddress,
    inAddressBook,
    /** RecentAddress */
    addRecentAddress,
    removeRecentAddress,
  }
})
