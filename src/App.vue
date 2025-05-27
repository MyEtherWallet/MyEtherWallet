<template>
  <div>
    <the-app-layout />
    <module-toast />
  </div>
</template>

<script setup lang="ts">
import TheAppLayout from '@components/core_layouts/TheAppLayout.vue'
import ModuleToast from './modules/toast/ModuleToast.vue'
import { useFetchMewApi } from '@/composables/useFetchMewApi'
import { type ChainsRaw } from '@/mew_api/types'
import { useChainsStore } from '@/stores/chainsStore'
import { useProviderStore } from '@/stores/providerStore'
import { onMounted, watch } from 'vue'
import { useWalletStore } from '@/stores/walletStore'
import { storeToRefs } from 'pinia'
import { type TokenBalancesRaw } from '@/mew_api/types'

const store = useWalletStore()
const { wallet, walletAddress } = storeToRefs(store)
const { setTokens, setIsLoadingBalances } = store

watch(
  () => walletAddress.value,
  newWallet => {
    if (newWallet) {
      wallet.value?.getBalance().then((balances: TokenBalancesRaw) => {
        setTokens(balances.result)
        setIsLoadingBalances(false)
      })
    } else {
      setTokens([])
      setIsLoadingBalances(false)
    }
  },
  { immediate: true },
)

const providerStore = useProviderStore()
const { addProvider } = providerStore
const chainStore = useChainsStore()
const { setChainData } = chainStore

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
