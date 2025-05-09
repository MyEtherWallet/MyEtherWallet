import { ref } from 'vue'
import { defineStore } from 'pinia'

interface ProviderInfo {
  uuid: string
  name: string
  icon: string
  rdns: string
}

export interface Provider {
  info: ProviderInfo
  provider: object
}

export const useProviderStore = defineStore('providerStore', () => {
  const providers = ref<Provider[]>([])

  const addProvider = (_providers: Provider) => {
    const exists = providers.value.find((p) => p.info.uuid === _providers.info.uuid)
    if (!exists) {
      providers.value.push(_providers)
    }
  }

  return { providers, addProvider }
})
