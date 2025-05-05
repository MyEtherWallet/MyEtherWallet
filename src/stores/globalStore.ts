import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {
  getPriorityFeeBasedOnType,
  getBaseFeeBasedOnType,
} from '@/modules/access/common/helpers'
import { toBigInt } from 'web3-utils'
import { useLocalStorage } from '@vueuse/core'

interface SelectedNetwork {
  selectedNetwork: string;
}


export const useGlobalStore = defineStore('global', () => {
  /** --------------------
 * NETWORK
 --------------------*/
  const storage = useLocalStorage<SelectedNetwork>('selectedNetwork', {
    selectedNetwork: 'ETHEREUM', // default network
  }, { mergeDefaults: true })
  const network = ref({ type: { chainID: 1 } }) // temp network
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
  const gasPriceType = ref('regular')
  const gasFeeMarketInfo = () => {
    const priorityFeePerGas = getPriorityFeeBasedOnType(
      toBigInt(eip1559.value.baseFeePerGas),
      gasPriceType.value,
    )
    const maxPriorityFeePerGas = getPriorityFeeBasedOnType(
      toBigInt(eip1559.value.maxFeePerGas),
      gasPriceType.value,
    )
    const baseFeePerGas = getBaseFeeBasedOnType(
      toBigInt(eip1559.value.baseFeePerGas),
      gasPriceType.value,
    )
    const maxFeePerGas = baseFeePerGas + priorityFeePerGas

    return {
      priorityFeePerGas,
      maxPriorityFeePerGas,
      baseFeePerGas,
      maxFeePerGas,
    }
  }
  return {
    network,
    isEIP1559SupportedNetwork,
    gasFeeMarketInfo,
    eip1559,
    gasPriceType,
    selectedNetwork,
    setSelectedNetwork,
  }
})
