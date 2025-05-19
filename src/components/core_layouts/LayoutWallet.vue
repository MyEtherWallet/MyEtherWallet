<template>
  <div class="h-screen w-full static">
    <TheWalletHeader />
    <div
      :class="[
        'flex flex-col justify-center overflow-y-auto relative px-5 xs:px-10',
      ]"
    >
      <main
        :class="['flex-initial w-full max-w-[496px] xs:max-w-[932px] mx-auto']"
      >
        <div class="mt-[84px] xs:mt-[104px] min-h-[500px]">
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import TheWalletHeader from './wallet/TheWalletHeader.vue'
import { useWalletStore } from '@/stores/walletStore'
import { storeToRefs } from 'pinia'
import { useFetchMewApi } from '@/composables/useFetchMewApi'
import { type TokenBalancesRaw } from '@/mew_api/types'

const store = useWalletStore()
const { wallet } = storeToRefs(store)
const { setTokens, setIsLoadingBalances } = store

const urlTokenBalances = computed(() => {
  return `/balances/POLYGON/${wallet.value.getAddress()}/?noInjectErrors=false`
})
const { data, onFetchResponse } = useFetchMewApi<TokenBalancesRaw>(
  urlTokenBalances.value,
)
onFetchResponse(() => {
  setTokens(data.value?.result || [])
  setIsLoadingBalances(false)
  return data.value?.result
})
</script>

<style scoped></style>
