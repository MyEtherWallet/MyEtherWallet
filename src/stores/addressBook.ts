import { computed } from 'vue'
import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import { useGlobalStore } from './globalStore'

interface AddressBook {
  [key: string]: string[];
}

export const useAddressBookStore = defineStore('addressBookStore', () => {
  const globalStore = useGlobalStore()
  const currentNetwork = globalStore.selectedNetwork;
  const storeObject: Record<string, string[]> = {};
  storeObject[currentNetwork] = []
  const addressBook = useLocalStorage<AddressBook>('addressBook', storeObject, { mergeDefaults: true })
  const addressBookLength = computed(() => addressBook.value[currentNetwork]?.length || 0)
  const currentAddressBook = computed(() => addressBook.value[currentNetwork])

  const addAddress = (address: string) => {
    if (addressBookLength.value > 0) {
      const index = addressBook.value[currentNetwork].indexOf(address)
      if (index === -1) {
        const currentArray = addressBook.value[currentNetwork]
        currentArray.push(address)
        addressBook.value[currentNetwork] = currentArray
      }
    } else {
      addressBook.value[currentNetwork] = [address]
    }
  }
  const removeAddress = (index: number) => {
    addressBook.value[currentNetwork].splice(index, 1)
  }
  return { addressBook, addressBookLength, addAddress, removeAddress, currentAddressBook }
})
