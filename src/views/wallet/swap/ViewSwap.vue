<template>
  <div>
    <p class="text-s-80 my-8 text-center">Simple and Secure Token Swap</p>
    <p class="my-4 text-s-20 text-center">
      Instant crypto exchange with minimal fees
    </p>
    <div class="relative max-w-[478px] mx-auto">
      <app-swap-input />
      <div
        class="bg-white border border-solid border-grey-10 rounded-[12px] h-[40px] w-[40px] mx-auto flex justify-center items-center absolute shadow-lg"
        style="top: 40%; right: 45%;"
      >
        <arrows-up-down-icon class="w-6 h-6" />
      </div>
      <div class="pt-2"></div>
      <app-swap-input />
      <div class="pt-4"></div>
      <app-base-button class="w-full">
        {{ connectButtonText }}
      </app-base-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'

import AppSwapInput from '@/components/AppSwapInput.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import { ArrowsUpDownIcon } from '@heroicons/vue/24/solid' // Importing the arrowsUpDown icon from Heroicons
import { useWalletStore } from '@/stores/walletStore'

const walletStore = useWalletStore()
const { wallet } = storeToRefs(walletStore)

const connectButtonText = computed(() => {
  return wallet.value ? 'Proceed to Swap' : 'Connect Wallet'
})
</script>
