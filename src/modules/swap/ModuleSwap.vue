<template>
  <div class="relative max-w-[478px] mx-auto">
    <div class="bg-white rounded-[20px] !px-4 pt-3 pb-4 max-w-[478px] mx-auto">
      <p class="text-s-16 mb-2">From</p>
      <app-select-chain />
      <app-swap-enter-amount
        v-model:amount="fromAmount"
        v-model:selected-token="fromTokenSelected"
        v-model:error="fromAmountError"
        :validate-input="checkAmountForError"
        :external-loading="swapLoaded && supportedNetwork"
        class="mt-4"
        :tokens="fromTokens"
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
      <app-select-chain
        :can-store="false"
        :passed-chains="toChains"
        @update:selected-chain="setToChain"
      />
      <app-swap-enter-amount
        v-model:amount="toAmount"
        v-model:selected-token="toTokenSelected"
        v-model:error="toAmountError"
        :validate-input="checkToAmountForError"
        :external-loading="swapLoaded && supportedNetwork"
        :show-balance="false"
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
import { useWalletStore, MAIN_TOKEN_CONTRACT } from '@/stores/walletStore'
import { ROUTES_ACCESS } from '@/router/routeNames'

import { useSwap } from '@/composables/useSwap'
import { type Chain } from '@/mew_api/types'
import { chainToEnum } from '@/providers/ethereum/chainToEnum.ts'
import { useChainsStore } from '@/stores/chainsStore'
import AppSelectChain from '@/components/AppSelectChain.vue'
import AppSwapEnterAmount from '@/components/AppSwapEnterAmount.vue'

import { type NewTokenInfo } from '@/composables/useSwap'

const walletStore = useWalletStore()
const chainsStore = useChainsStore()

const { isWalletConnected } = storeToRefs(walletStore)
const { selectedChain } = storeToRefs(chainsStore)
const {
  initSwapper,
  supportedNetwork,
  swapLoaded,
  toChains,
  fromTokens,
  toTokens,
} = useSwap()

const bestSwapLoadingOpen = ref(false)
const bestOfferSelectionOpen = ref(false)
const swapInitiatedOpen = ref(false)
const selectedToChain: Ref<Chain | null> = ref(null)

onMounted(async () => {
  await initSwapper()
  setFromToken()
  setToToken()
})

const setToToken = () => {
  const enkryptEnum = chainToEnum[selectedToChain.value?.name || '']
  if (toTokens.value && toTokens.value.all[enkryptEnum].length > 0) {
    const sameNetworks =
      selectedToChain.value?.name === selectedChain.value?.name
    toTokenSelected.value =
      toTokens.value.trending.length > 0
        ? toTokens.value.trending[enkryptEnum][sameNetworks ? 1 : 0]
        : toTokens.value.all[enkryptEnum][sameNetworks ? 1 : 0] // Default to first token
  }
}

const setFromToken = () => {
  if (fromTokens.value && fromTokens.value.length > 0) {
    const findFirstToken = fromTokens.value.find(
      (token: NewTokenInfo) => token.address === MAIN_TOKEN_CONTRACT,
    )
    if (findFirstToken) {
      fromTokenSelected.value = findFirstToken // Default to MEW token if available
    } else {
      fromTokenSelected.value = fromTokens.value[0] // Default to first token
    }
    fromTokenSelected.value = fromTokens.value[0] // Default to first token
  }
}

const setToChain = (chain: Chain) => {
  // Logic to set the selected chain for the "To" section
  selectedToChain.value = chain
  setToToken()
}

const swapButton = () => {
  // bestSwapLoadingOpen.value = true
  // bestOfferSelectionOpen.value = true
  swapInitiatedOpen.value = false
}

// From tokens models
const fromAmount = ref<number | string>('0')
const fromTokenSelected: Ref<NewTokenInfo> = ref({} as NewTokenInfo) // TODO: Implement token selection
const fromAmountError = ref('')

// copied from send
// TODO: consider moving to a shared utility file
const checkAmountForError = () => {
  const baseAmount = fromAmount.value ? toWei(fromAmount.value, 'ether') : 0
  const tokenSelectedBalance = fromTokenSelected.value.balance
    ? fromTokenSelected.value.balance
    : '0'
  const baseTokenBalance = toWei(tokenSelectedBalance, 'ether')

  // model.value = amount.value
  if (fromAmount.value === undefined || fromAmount.value === '')
    fromAmountError.value = 'Amount is required' // amount is blank
  else if (BigInt(baseAmount) < 0)
    fromAmountError.value = 'Amount must be greater than 0' // amount less than 0
  else if (BigInt(baseTokenBalance) < BigInt(baseAmount))
    fromAmountError.value = 'Insufficient balance' // amount greater than selected balance
  else fromAmountError.value = ''
}

// To Token models
const toAmount = ref<number | string>('0')
const toTokenSelected: Ref<NewTokenInfo | null> = ref(null)
const toAmountError = ref('')

// copied from send
// TODO: consider moving to a shared utility file
const checkToAmountForError = () => {
  const baseAmount = toAmount.value ? toWei(toAmount.value, 'ether') : 0
  const tokenSelectedBalance = fromTokenSelected.value.balance
    ? fromTokenSelected.value.balance
    : '0'
  const baseTokenBalance = toWei(tokenSelectedBalance, 'ether')

  // model.value = amount.value
  if (toAmount.value === undefined || toAmount.value === '')
    toAmountError.value = 'Amount is required' // amount is blank
  else if (BigInt(baseAmount) < 0)
    toAmountError.value = 'Amount must be greater than 0' // amount less than 0
  else if (BigInt(baseTokenBalance) < BigInt(baseAmount))
    toAmountError.value = 'Insufficient balance' // amount greater than selected balance
  else toAmountError.value = ''
}
</script>
