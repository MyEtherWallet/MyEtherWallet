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

const store = useChainsStore()
const { setChainData } = store

const { data, onFetchResponse } = useFetchMewApi<ChainsRaw>('/chains')
onFetchResponse(() => {
  setChainData(data.value?.result || [])
  console.log('Chains data:', data.value?.result)
  return data.value?.result
})
</script>
