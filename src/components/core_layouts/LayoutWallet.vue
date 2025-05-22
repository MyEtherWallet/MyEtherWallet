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
import TheWalletHeader from './wallet/TheWalletHeader.vue'
import { useWalletStore } from '@/stores/walletStore'
import { storeToRefs } from 'pinia'
import { type TokenBalancesRaw } from '@/mew_api/types'

const store = useWalletStore()
const { wallet } = storeToRefs(store)
const { setTokens, setIsLoadingBalances } = store

wallet.value?.getBalance().then((balances: TokenBalancesRaw) => {
  setTokens(balances.result)
  setIsLoadingBalances(false)
})
</script>

<style scoped></style>
