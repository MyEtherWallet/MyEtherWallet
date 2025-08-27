<template>
  <div class="relative">
    <the-app-layout v-if="isLoadingComplete" />
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
import { onMounted, watch, ref } from 'vue'
import { useWalletStore } from '@/stores/walletStore'
import { storeToRefs } from 'pinia'
import { type TokenBalancesRaw } from '@/mew_api/types'

const store = useWalletStore()
const { wallet, walletAddress, isWalletConnected } = storeToRefs(store)
const { setTokens, setIsLoadingBalances } = store
const isLoadingComplete = ref(false)

const fetchBalances = () => {
  setIsLoadingBalances(true)
  wallet.value?.getBalance().then((balances: TokenBalancesRaw) => {
    setTokens(balances.result)
    setIsLoadingBalances(false)
  })
}

watch(
  () => walletAddress.value,
  newWallet => {
    if (newWallet) {
      fetchBalances()
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
const { selectedChain } = storeToRefs(chainStore)

const { useMEWFetch } = useFetchMewApi()
const { data, onFetchResponse } = useMEWFetch<ChainsRaw>('/chains').get().json()

onFetchResponse(() => {
  setChainData(data.value.result || [])
  isLoadingComplete.value = true
  return data.value.result
})

onMounted(() => {
  window.addEventListener('eip6963:announceProvider', (event: Event) => {
    const customEvent = event as CustomEvent
    const provider = customEvent.detail
    addProvider(provider)
  })
})

watch(
  () => selectedChain.value,
  newChain => {
    if (newChain && isWalletConnected.value) {
      if (newChain.chainID) {
        wallet.value?.updateChainId(newChain.chainID)
      }
      fetchBalances()
    } else {
      setTokens([])
      setIsLoadingBalances(false)
    }
  },
  { immediate: true },
)
</script>
