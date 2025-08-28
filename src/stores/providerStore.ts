import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { HexPrefixedString } from '@/providers/types'

interface ProviderInfo {
  uuid: string
  name: string
  icon: string
  rdns: string
}

type requestParams = {
  method: string
  params?: unknown[]
}

export interface Provider {
  info: ProviderInfo
  provider: {
    request: (
      params: requestParams,
    ) => Promise<HexPrefixedString | HexPrefixedString[]>
  }
}

export const useProviderStore = defineStore('providerStore', () => {
  const providers = ref<Provider[]>([])

  const addProvider = (_providers: Provider) => {
    const exists = providers.value.find(
      p => p.info.uuid === _providers.info.uuid,
    )
    if (!exists) {
      providers.value.push(_providers)
    }
  }

  return { providers, addProvider }
})
