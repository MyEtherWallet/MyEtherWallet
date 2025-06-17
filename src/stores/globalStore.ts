import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
// import {
//   getPriorityFeeBasedOnType,
//   getBaseFeeBasedOnType,
// } from '@/modules/access/common/helpers'
// import { toBigInt } from 'web3-utils'
import { useLocalStorage } from '@vueuse/core'
import type { FeePriority } from '@/mew_api/types'
interface SelectedNetwork {
  selectedNetwork: string
}

export const useGlobalStore = defineStore('global', () => {
  /** --------------------
 * NETWORK
 --------------------*/
  const storage = useLocalStorage<SelectedNetwork>(
    'selectedNetwork',
    {
      selectedNetwork: 'ETHEREUM', // default network
    },
    { mergeDefaults: true },
  )

  const selectedNetwork = computed(() => {
    return storage.value.selectedNetwork
  })
  const isEIP1559SupportedNetwork = ref(true) // change to computed in the future
  const setSelectedNetwork = (network: string) => {
    storage.value.selectedNetwork = network
  }
  /**--------------------
   * GAS
   --------------------*/
  const eip1559 = ref({
    baseFeePerGas: '0',
    maxFeePerGas: '0',
  })
  const gasPriceType = ref<FeePriority>('REGULAR') // default gas price type

  return {
    isEIP1559SupportedNetwork,
    eip1559,
    gasPriceType,
    selectedNetwork,
    setSelectedNetwork,
  }
})
