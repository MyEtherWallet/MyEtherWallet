<template>
  <div class="relative max-w-[478px] mx-auto">
    <div class="bg-white rounded-[20px] !px-4 pt-3 pb-4 max-w-[478px] mx-auto">
      <p class="text-s-16 mb-2">From</p>
      <app-select-chain />
      <app-enter-amount
        v-model:amount="amount"
        v-model:selected-token="tokenSelected"
        v-model:error="amountError"
        :validate-input="checkAmountForError"
        :external-loading="swapLoaded && supportedNetwork"
        class="mt-4"
      />
    </div>
    <div
      class="bg-white border border-solid border-grey-10 rounded-[12px] h-[40px] w-[40px] mx-auto flex justify-center items-center absolute shadow-lg right-[45%]"
      :class="{
        'top-[41%]': isWalletConnected,
        'top-[38%]': !isWalletConnected,
      }"
    >
      <arrows-up-down-icon class="w-6 h-6" />
    </div>
    <div class="pt-2"></div>
    <div class="bg-white rounded-[20px] !px-4 pt-3 pb-4 max-w-[478px] mx-auto">
      <p class="text-s-16 mb-2">To</p>
      <app-select-chain :can-store="false" :passed-chains="toChains" />
      <app-enter-amount
        v-model:amount="toAmount"
        v-model:selected-token="toTokenSelected"
        v-model:error="toAmountError"
        :validate-input="checkToAmountForError"
        :external-loading="swapLoaded && supportedNetwork"
        class="mt-4"
      />
    </div>
    <div class="pt-4"></div>
    <div v-if="swapLoaded && !supportedNetwork" class="text-error text-center">
      <p class="text-s-16">
        The selected from network does not support swaps. Please select a
        different network.
      </p>
    </div>
    <app-base-button
      class="w-full"
      v-if="isWalletConnected"
      :disabled="swapLoaded && !supportedNetwork"
      @click="swapButton"
    >
      Swap</app-base-button
    >
    <div class="w-full max-w-[478px] mx-auto" v-else>
      <router-link
        :to="{ name: ROUTES_ACCESS.ACCESS.NAME }"
        class="w-full max-w-[478px]"
      >
        <app-base-button
          class="w-full"
          :disabled="swapLoaded && !supportedNetwork"
        >
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
import { toWei } from 'web3-utils'
import { ref, onMounted, Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { ArrowsUpDownIcon } from '@heroicons/vue/24/solid' // Importing the arrowsUpDown icon from Heroicons
import AppBaseButton from '@/components/AppBaseButton.vue'
import BestOfferModal from './components/BestOfferModal.vue'
import SwapOfferModal from './components/SwapOfferModal.vue'
import SwapInitiatedModal from './components/SwapInitiatedModal.vue'
import { useWalletStore } from '@/stores/walletStore'
import { ROUTES_ACCESS } from '@/router/routeNames'
import { TokenBalance } from '@/types/TokenBalance'
import { useSwap } from '@/composables/useSwap'

import AppSelectChain from '@/components/AppSelectChain.vue'
import AppEnterAmount from '@/components/AppEnterAmount.vue'

const walletStore = useWalletStore()

const { isWalletConnected } = storeToRefs(walletStore)
const { initSwapper, supportedNetwork, swapLoaded, toChains } = useSwap()

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

// From tokens models
const amount = ref<number | string>('0')
const tokenSelected: Ref<TokenBalance> = ref({} as TokenBalance) // TODO: Implement token selection
const amountError = ref('')

// copied from send
// TODO: consider moving to a shared utility file
const checkAmountForError = () => {
  const baseAmount = amount.value ? toWei(amount.value, 'ether') : 0
  const tokenSelectedBalance = tokenSelected.value.balance
    ? tokenSelected.value.balance
    : '0'
  const baseTokenBalance = toWei(tokenSelectedBalance, 'ether')

  // model.value = amount.value
  if (amount.value === undefined || amount.value === '')
    amountError.value = 'Amount is required' // amount is blank
  else if (BigInt(baseAmount) < 0)
    amountError.value = 'Amount must be greater than 0' // amount less than 0
  else if (BigInt(baseTokenBalance) < BigInt(baseAmount))
    amountError.value = 'Insufficient balance' // amount greater than selected balance
  else amountError.value = ''
}

// To Token models
const toAmount = ref<number | string>('0')
const toTokenSelected: Ref<TokenBalance> = ref({} as TokenBalance) // TODO: Implement token selection
const toAmountError = ref('')

// copied from send
// TODO: consider moving to a shared utility file
const checkToAmountForError = () => {
  const baseAmount = amount.value ? toWei(amount.value, 'ether') : 0
  const tokenSelectedBalance = tokenSelected.value.balance
    ? tokenSelected.value.balance
    : '0'
  const baseTokenBalance = toWei(tokenSelectedBalance, 'ether')

  // model.value = amount.value
  if (amount.value === undefined || amount.value === '')
    amountError.value = 'Amount is required' // amount is blank
  else if (BigInt(baseAmount) < 0)
    amountError.value = 'Amount must be greater than 0' // amount less than 0
  else if (BigInt(baseTokenBalance) < BigInt(baseAmount))
    amountError.value = 'Insufficient balance' // amount greater than selected balance
  else amountError.value = ''
}
</script>
