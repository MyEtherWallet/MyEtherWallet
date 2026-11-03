import { computed } from 'vue'
import type { DerivationPath } from './../modules/access/common/configs/configPaths'
import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

import { ethereum } from '@/modules/access/common/configs/configPaths'

// TODO: export type from enkrypt package
export interface PathType {
  path: string
  label: string
  basePath: string
}
interface DerivationStore {
  selectedDerivation: DerivationPath
  customDerivations: DerivationPath[]
  trezorSelectedDerivation?: PathType
  ledgerSelectedDerivation?: PathType
}

export const useDerivationStore = defineStore('derivationStore', () => {
  const storeObject = {
    selectedDerivation: {
      label: ethereum.label,
      path: ethereum.path,
      type: 'EVM',
    },
    customDerivations: [],
    trezorSelectedDerivation: { path: '', label: '', basePath: '' },
    ledgerSelectedDerivation: { path: '', label: '', basePath: '' },
  }
  const store = useLocalStorage<DerivationStore>(
    'derivationStore',
    storeObject,
    { mergeDefaults: true },
  )

  const setSelectedDerivation = (derivationPath: DerivationPath) => {
    store.value.selectedDerivation = derivationPath
  }

  const setSelectedTrezorDerivation = (derivationPath: PathType) => {
    store.value.trezorSelectedDerivation = derivationPath
  }

  const setSelectedLedgerDerivation = (derivationPath: PathType) => {
    store.value.ledgerSelectedDerivation = derivationPath
  }

  const selectedDerivation = computed(() => {
    return store.value.selectedDerivation
  })

  const trezorSelectedDerivation = computed(() => {
    return store.value.trezorSelectedDerivation
  })

  const ledgerSelectedDerivation = computed(() => {
    return store.value.ledgerSelectedDerivation
  })

  const customDerivations = computed(() => {
    return store.value.customDerivations
  })

  // Validated by the Add form (AccessDerivationPath) before it gets here.
  const addCustomDerivation = (derivationPath: DerivationPath) => {
    store.value.customDerivations.push(derivationPath)
  }
  return {
    selectedDerivation,
    customDerivations,
    ledgerSelectedDerivation,
    trezorSelectedDerivation,
    setSelectedDerivation,
    addCustomDerivation,
    setSelectedTrezorDerivation,
    setSelectedLedgerDerivation,
  }
})
