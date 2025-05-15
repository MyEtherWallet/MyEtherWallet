<template>
  <div>
    <router-view />
    <module-toast />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import ModuleToast from './modules/toast/ModuleToast.vue'
import { useFetchMewApi } from '@/composables/useFetchMewApi'
import { type ChainsRaw } from '@/mew_api/types'
import { useChainsStore } from '@/stores/chainsStore'
import { useProviderStore } from '@/stores/providerStore'
import { onMounted } from 'vue'

const providerStore = useProviderStore()
const { addProvider } = providerStore
const store = useChainsStore()
const { setChainData } = store

const { data, onFetchResponse } = useFetchMewApi<ChainsRaw>('/chains')
onFetchResponse(() => {
  setChainData(data.value?.result || [])
  return data.value?.result
})

onMounted(() => {
  window.addEventListener('eip6963:announceProvider', (event: Event) => {
    const customEvent = event as CustomEvent
    const provider = customEvent.detail
    addProvider(provider)
  })
})
</script>
