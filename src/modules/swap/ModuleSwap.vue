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
        :tokens="fromTokens"
        :show-balance="isWalletConnected"
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
        :tokens="localToTokens"
        :readonly="true"
        class="mt-4"
      />
    </div>
    <div class="pt-4"></div>
    <div v-if="isCrossChain">
      <app-address-book v-model="userToAddress" class="mb-[2px]" />
    </div>
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
import { ref, onMounted, type Ref, computed, watch } from 'vue'
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
import AppAddressBook from '@/components/AppAddressBook.vue'
import BigNumber from 'bignumber.js'
import { type NewTokenInfo } from '@/composables/useSwap'
import { type ProviderQuoteResponse } from '@enkryptcom/swap'
import { fromBase } from '@/utils/unit'

const walletStore = useWalletStore()
const chainsStore = useChainsStore()

const { isWalletConnected, walletAddress } = storeToRefs(walletStore)
const { selectedChain } = storeToRefs(chainsStore)
const {
  initSwapper,
  supportedNetwork,
  swapLoaded,
  toChains,
  fromTokens,
  toTokens,
  getQuote,
} = useSwap()

const bestSwapLoadingOpen = ref(false)
const bestOfferSelectionOpen = ref(false)
const swapInitiatedOpen = ref(false)
const selectedToChain: Ref<Chain | null> = ref(null)
const localToTokens = ref<NewTokenInfo[] | null>(null)
const userToAddress = ref<string>('')
const providers = ref<ProviderQuoteResponse[]>([])

onMounted(async () => {
  await initSwapper()
  setFromToken()
  setToToken()
})

const setToToken = () => {
  const enkryptEnum = chainToEnum[selectedToChain.value?.name || '']
  localToTokens.value = toTokens.value?.all[enkryptEnum]
  if (toTokens.value && toTokens.value.all[enkryptEnum]?.length > 0) {
    const sameNetworks =
      selectedToChain.value?.name === selectedChain.value?.name
    toTokenSelected.value =
      toTokens.value.trending?.length > 0
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

const isCrossChain = computed(() => {
  return (
    selectedChain.value?.type === 'EVM' && selectedToChain.value?.type !== 'EVM'
  )
})

const userAddress = computed(() => {
  return walletAddress.value || '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D'
})

const toAddress = computed(() => {
  if (selectedToChain.value?.type === 'EVM') {
    return userAddress.value
  }

  return userToAddress.value || '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D'
})

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
  else if (
    isWalletConnected.value &&
    BigInt(baseTokenBalance) < BigInt(baseAmount)
  )
    fromAmountError.value = 'Insufficient balance' // amount greater than selected balance
  else fromAmountError.value = ''
}

// To Token models
const toAmount = ref<number | string>('0')
const toTokenSelected: Ref<NewTokenInfo | undefined> = ref(undefined)
const toAmountError = ref('')

// copied from send
// TODO: consider moving to a shared utility file
const checkToAmountForError = () => {
  const baseAmount = toAmount.value ? toWei(toAmount.value, 'ether') : 0

  // model.value = amount.value
  if (toAmount.value === undefined || toAmount.value === '')
    toAmountError.value = 'Amount is required' // amount is blank
  else if (BigInt(baseAmount) < 0)
    toAmountError.value = 'Amount must be greater than 0' // amount less than 0
  else toAmountError.value = ''
}

// set to values
watch(
  () => providers.value,
  () => {
    if (providers.value.length > 0) {
      // Set the toTokenSelected based on the first provider's toTokenAmount
      toAmount.value = fromBase(
        providers.value[0].toTokenAmount,
        toTokenSelected.value?.decimals || 18,
      )
    }
  },
)

// Watch for changes in fromAmount, fromTokenSelected, userAddress, and toAddress
watch(
  () => [
    fromAmount.value,
    fromTokenSelected.value,
    userAddress.value,
    toAddress.value,
  ],
  async () => {
    if (
      !BigNumber(fromAmount.value).isNaN() &&
      !BigNumber(fromAmount.value).isZero() &&
      toTokenSelected.value
    ) {
      // fetch quotes only if fromTokenSelected.value is defined
      const quotes = await getQuote({
        fromToken: fromTokenSelected.value,
        toToken: toTokenSelected.value,
        amount: fromAmount.value,
        fromAddress: userAddress.value,
        toAddress: toAddress.value,
      })

      // Combine sorting logic into a single sort function
      const combinedSort = (
        a: ProviderQuoteResponse,
        b: ProviderQuoteResponse,
      ) => {
        // Then by lowest additionalNativeFees
        const feeDiff = new BigNumber(a.additionalNativeFees)
          .minus(new BigNumber(b.additionalNativeFees))
          .toNumber()
        if (feeDiff !== 0) return feeDiff

        // Then by lowest totalGaslimit
        const totalGasLimitDiff = new BigNumber(a.totalGaslimit)
          .minus(new BigNumber(b.totalGaslimit))
          .toNumber()
        if (totalGasLimitDiff !== 0) return totalGasLimitDiff

        // Sort by highest toTokenAmount first
        return new BigNumber(b.toTokenAmount)
          .minus(new BigNumber(a.toTokenAmount))
          .toNumber()
      }

      providers.value =
        quotes && quotes.length > 0 ? quotes.sort(combinedSort) : []
    }
  },
)
</script>
