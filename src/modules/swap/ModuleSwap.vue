<template>
  <div class="relative max-w-[478px] mx-auto">
    <app-swap-input :is-loading="supportedNetwork" />
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
    <app-swap-input :is-loading="supportedNetwork" label="To" />
    <div class="pt-4"></div>
    <div v-if="!supportedNetwork" class="text-error text-center">
      <p class="text-s-16">
        The selected from network does not support swaps. Please select a
        different network.
      </p>
    </div>
    <app-base-button
      class="w-full"
      v-if="isWalletConnected"
      :disabled="!supportedNetwork"
      @click="swapButton"
    >
      Swap</app-base-button
    >
    <div class="w-full max-w-[478px] mx-auto" v-else>
      <router-link
        :to="{ name: ROUTES_ACCESS.ACCESS.NAME }"
        class="w-full max-w-[478px]"
      >
        <app-base-button class="w-full" :disabled="!supportedNetwork">
          Connect Wallet</app-base-button
        >
      </router-link>
    </div>
  </div>
  <best-offer-modal v-model:best-offer-open="bestSwapLoadingOpen" />
  <swap-offer-modal
    v-model:swap-offer-open="bestOfferSelectionOpen"
    @update:proceedWithSwap="swapInitiatedOpen = true"
  />
  <swap-initiated-modal v-model:swap-initiated-open="swapInitiatedOpen" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import AppSwapInput from '@/components/AppSwapInput.vue'
import { ArrowsUpDownIcon } from '@heroicons/vue/24/solid' // Importing the arrowsUpDown icon from Heroicons
import AppBaseButton from '@/components/AppBaseButton.vue'
import BestOfferModal from './components/BestOfferModal.vue'
import SwapOfferModal from './components/SwapOfferModal.vue'
import SwapInitiatedModal from './components/SwapInitiatedModal.vue'
import { useWalletStore } from '@/stores/walletStore'
import { ROUTES_ACCESS } from '@/router/routeNames'

import { useSwap } from '@/composables/useSwap'

const walletStore = useWalletStore()

const { isWalletConnected } = storeToRefs(walletStore)
const { initSwapper, supportedNetwork } = useSwap()

const bestSwapLoadingOpen = ref(false)
const bestOfferSelectionOpen = ref(false)
const swapInitiatedOpen = ref(false)

onMounted(async () => {
  await initSwapper()
})

const swapButton = () => {
  // bestSwapLoadingOpen.value = true
  // bestOfferSelectionOpen.value = true
  swapInitiatedOpen.value = false
}
</script>
