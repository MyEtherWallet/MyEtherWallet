import type { DerivationPath } from './../modules/access/common/configs/configPaths';
import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

import { ethereum } from '@/modules/access/common/configs/configPaths.ts';

export const useDerivationStore = defineStore('derivationStore', () => {
  const storeObject: DerivationPath = {
    label: ethereum.label,
    path: ethereum.path
  };
  const selectedDerivation = useLocalStorage<DerivationPath>('selectedDerivation', storeObject, { mergeDefaults: true })

  const setSelectedDerivation = (derivationPath: DerivationPath) => {
    selectedDerivation.value = derivationPath
  }
  return {
    selectedDerivation,
    setSelectedDerivation
  }
})
