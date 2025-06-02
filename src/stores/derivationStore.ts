import { computed } from 'vue'
import type { DerivationPath } from './../modules/access/common/configs/configPaths';
import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

import { useToastStore } from '@/stores/toastStore'
import { ToastType } from '@/types/notification/index'


import { ethereum } from '@/modules/access/common/configs/configPaths';
import { checkCustomPath } from '@/utils/customPathHelpers';


// TODO: export type from enkrypt package
export interface PathType {
  path: string
  label: string
  basePath?: string
}
interface DerivationStore {
  selectedDerivation: DerivationPath
  customDerivations: DerivationPath[]
  trezorSelectedDerivation?: PathType
}


export const useDerivationStore = defineStore('derivationStore', () => {
  const storeObject = {
    selectedDerivation: {
      label: ethereum.label,
      path: ethereum.path
    },
    customDerivations: [],
    trezorSelectedDerivation: { path: '', label: '', basePath: '' }
  }
  const store = useLocalStorage<DerivationStore>('derivationStore', storeObject, { mergeDefaults: true })

  const setSelectedDerivation = (derivationPath: DerivationPath) => {
    store.value.selectedDerivation = derivationPath
  }

  const setSelectedTrezorDerivation = (derivationPath: PathType) => {
    store.value.trezorSelectedDerivation = derivationPath
  }

  const selectedDerivation = computed(() => {
    return store.value.selectedDerivation
  })

  const trezorSelectedDerivation = computed(() => {
    return store.value.trezorSelectedDerivation
  })

  const addCustomDerivation = (derivationPath: DerivationPath) => {
    const toastStore = useToastStore()
    const { addToastMessage } = toastStore
    const existingDerivation = store.value.customDerivations.find(
      (derivation) => derivation.label === derivationPath.label
    )

    if (existingDerivation) {
      addToastMessage({
        text: "Derivation label already exists!",
        type: ToastType.Error,
        duration: 5000
      })
    }

    if (checkCustomPath(derivationPath.path)) {
      store.value.customDerivations.push(derivationPath)
      addToastMessage({
        text: "Custom Derivation Path added successfully!",
        type: ToastType.Success,
        duration: 5000
      })
    } else {
      addToastMessage({
        text: "Invalid Derivation Path!",
        type: ToastType.Error,
        duration: 5000
      })
    }
  }
  return {
    selectedDerivation,
    setSelectedDerivation,
    addCustomDerivation,
    setSelectedTrezorDerivation,
    trezorSelectedDerivation
  }
})
