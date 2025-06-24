<template>
  <div class="relative max-w-[478px] mx-auto">
    <app-swap-input />
    <div
      class="bg-white border border-solid border-grey-10 rounded-[12px] h-[40px] w-[40px] mx-auto flex justify-center items-center absolute shadow-lg right-[45%]"
      :class="{
        'top-[45%]': !isWalletConnected,
        'top-[41%]': isWalletConnected,
      }"
    >
      <arrows-up-down-icon class="w-6 h-6" />
    </div>
    <div class="pt-2"></div>
    <app-swap-input />
    <div class="pt-4"></div>
    <app-base-button class="w-full" v-if="isWalletConnected">
      Swap</app-base-button
    >
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import AppSwapInput from '@/components/AppSwapInput.vue'
import { ArrowsUpDownIcon } from '@heroicons/vue/24/solid' // Importing the arrowsUpDown icon from Heroicons
import AppBaseButton from '@/components/AppBaseButton.vue'
import { useWalletStore } from '@/stores/walletStore'

const walletStore = useWalletStore()
const { isWalletConnected } = storeToRefs(walletStore)
</script>
