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
      class="bg-white border border-solid border-grey-10 rounded-[12px] h-[40px] w-[40px] mx-auto flex justify-center items-center absolute shadow-lg right-[45%] top-[41%]"
      :class="{
        'top-[34%]': isCrossChain,
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
        :preselected-chain="swapValues?.toChain"
        @update:selected-chain="setToChain"
      />
      <app-swap-enter-amount
        v-model:amount="toAmount"
        v-model:selected-token="toTokenSelected"
        v-model:error="toAmountError"
        :validate-input="checkToAmountForError"
        :external-loading="swapLoaded && supportedNetwork && !isLoadingQuotes"
        :show-balance="false"
        :tokens="localToTokens"
        :readonly="true"
        class="mt-4"
      />
      <div class="pt-4" v-if="isCrossChain"></div>
      <app-address-book
        v-model="userToAddress"
        class="mb-[2px]"
        v-if="isCrossChain"
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
      :disabled="
        (swapLoaded && !supportedNetwork) ||
        !(fromAmount !== '' && fromAmount !== '0' && fromAmountError === '') ||
        (isCrossChain && userToAddress === '')
      "
      @click="swapButton"
    >
      Swap</app-base-button
    >
    <div class="w-full max-w-[478px] mx-auto" v-else>
      <app-base-button
        class="w-full"
        :disabled="swapLoaded && !supportedNetwork"
        @click="connectWalletForSwap"
      >
        Connect Wallet</app-base-button
      >
    </div>
  </div>
  <best-offer-modal v-model:best-offer-open="bestSwapLoadingOpen" />
  <swap-offer-modal
    v-model:swap-offer-open="bestOfferSelectionOpen"
    v-model:selected-quote="selectedQuote as ProviderQuoteResponse"
    @update:proceedWithSwap="proceedWithSwap"
    :quotes="providers"
    :amount="fromAmount as number"
    :to-chain="selectedToChain as Chain"
    :swap-info="swapInfo as ProviderSwapResponse"
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
import AppAddressBook from '@/components/AppAddressBook.vue'

import { useSwap } from '@/composables/useSwap'
import { type Chain } from '@/mew_api/types'
import { chainToEnum } from '@/providers/ethereum/chainToEnum.ts'
import { useChainsStore } from '@/stores/chainsStore'
import AppSelectChain from '@/components/AppSelectChain.vue'
import AppSwapEnterAmount from '@/components/AppSwapEnterAmount.vue'
import BigNumber from 'bignumber.js'
import { type NewTokenInfo } from '@/composables/useSwap'
import {
  type ProviderQuoteResponse,
  type ProviderSwapResponse,
} from '@enkryptcom/swap'
import { fromBase } from '@/utils/unit'
import { useInputStore } from '@/stores/inputStore'
import { useRouter } from 'vue-router'
import { toBase } from '@/utils/unit'
import BN from 'bn.js'

const walletStore = useWalletStore()
const chainsStore = useChainsStore()
const inputStore = useInputStore()
const router = useRouter()

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
  getSwap,
} = useSwap()
const { hasSwapValues, swapValues } = storeToRefs(inputStore)
const { storeSwapValues, clearSwapValues } = inputStore

const userToAddress = ref<string>('')
const bestSwapLoadingOpen = ref(false)
const bestOfferSelectionOpen = ref(false)
const swapInitiatedOpen = ref(false)
const selectedToChain: Ref<Chain | null> = ref(null)
const localToTokens = ref<NewTokenInfo[] | null>(null)
const providers = ref<ProviderQuoteResponse[]>([])
const isLoadingQuotes = ref(false)

const swapInfo: Ref<ProviderSwapResponse | null> = ref(null)
const selectedQuote = ref<ProviderQuoteResponse | null>(null)

const setToToken = () => {
  if (!hasSwapValues.value) {
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
  } else {
    // check if swapValue to token is in toTokens
    const enkryptEnum = chainToEnum[selectedToChain.value?.name || '']
    const toToken = toTokens.value?.all[enkryptEnum]?.find(
      (token: NewTokenInfo) =>
        token.address === swapValues.value.toToken.address,
    )
    if (toToken) {
      toTokenSelected.value = toToken
    } else {
      // If not found, default to the first token
      toTokenSelected.value =
        toTokens.value?.all[enkryptEnum]?.length > 0
          ? toTokens.value.all[enkryptEnum][0]
          : undefined
    }
  }
}

const proceedWithSwap = async () => {
  // Proceed with the swap using the selected quote
  console.log('Proceeding with swap:', swapInfo.value)
}

const setFromToken = () => {
  if (!hasSwapValues.value) {
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
  } else {
    // check if swapValue from token is in fromTokens
    const fromToken = fromTokens.value?.find(
      (token: NewTokenInfo) =>
        token.address === swapValues.value.fromToken.address,
    )
    if (fromToken) {
      fromTokenSelected.value = fromToken
    } else {
      // If not found, default to the first token
      fromTokenSelected.value = fromTokens.value?.[0] as NewTokenInfo
    }
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

  return userToAddress.value || '0x'
})

const setToChain = (chain: Chain) => {
  if (hasSwapValues.value) {
    selectedToChain.value = swapValues.value.toChain
    return
  }
  // Logic to set the selected chain for the "To" section
  selectedToChain.value = chain
  setToToken()
}

const connectWalletForSwap = () => {
  storeSwapValues({
    fromToken: fromTokenSelected.value as NewTokenInfo,
    toToken: toTokenSelected.value as NewTokenInfo,
    toChain: selectedToChain.value as Chain,
    fromAmount: fromAmount.value as string,
  })
  router.push({
    name: ROUTES_ACCESS.ACCESS.NAME,
  })
}

const swapButton = async () => {
  bestSwapLoadingOpen.value = true
  await fetchQuotes()
  bestSwapLoadingOpen.value = false
  bestOfferSelectionOpen.value = true
}

// From tokens models
const fromAmount = ref<number | string>('0')
const fromTokenSelected: Ref<NewTokenInfo> = ref({} as NewTokenInfo) // TODO: Implement token selection
const fromAmountError = ref('')

// copied from send
const checkAmountForError = () => {
  const baseBalance =
    fromTokenSelected.value?.address === MAIN_TOKEN_CONTRACT
      ? toBase(
          walletStore.getTokenBalance(MAIN_TOKEN_CONTRACT)?.balance || '0',
          fromTokenSelected.value?.decimals || 18,
        )
      : toBase(
          fromTokenSelected.value?.balance || '0',
          fromTokenSelected.value?.decimals || 18,
        )
  const baseAmount = fromAmount.value
    ? toBase(fromAmount.value, fromTokenSelected.value.decimals)
    : 0

  if (fromAmount.value === undefined || fromAmount.value === '')
    fromAmountError.value = 'Amount is required' // amount is blank
  else if (BigInt(baseAmount) < 0)
    fromAmountError.value = 'Amount must be greater than 0' // amount less than 0
  else if (isWalletConnected.value && BigInt(baseBalance) < BigInt(baseAmount))
    fromAmountError.value = 'Insufficient balance' // amount greater than selected balance
  else fromAmountError.value = ''
}

// To Token models
const toAmount = ref<number | string>('0')
const toTokenSelected: Ref<NewTokenInfo | undefined> = ref(undefined)
const toAmountError = ref('')

// copied from send
const checkToAmountForError = () => {
  const baseAmount = toAmount.value ? toWei(toAmount.value, 'ether') : 0

  // model.value = amount.value
  if (toAmount.value === undefined || toAmount.value === '')
    toAmountError.value = 'Amount is required' // amount is blank
  else if (BigInt(baseAmount) < 0)
    toAmountError.value = 'Amount must be greater than 0' // amount less than 0
  else if (providers.value.length === 0)
    toAmountError.value = 'No quotes available' // no quotes available
  else toAmountError.value = ''
}

const fetchQuotes = async () => {
  providers.value = []
  selectedQuote.value = null
  isLoadingQuotes.value = true
  // fetch quotes only if fromTokenSelected.value is defined
  const quotes = await getQuote({
    fromToken: fromTokenSelected.value,
    toToken: toTokenSelected.value,
    amount: fromAmount.value,
    fromAddress: userAddress.value,
    toAddress: toAddress.value,
  })
  const fromAmountBase = toBase(
    fromAmount.value.toString(),
    fromTokenSelected.value?.decimals || 18,
  )

  const remainingBalance = BigNumber(
    fromTokenSelected.value?.address === MAIN_TOKEN_CONTRACT
      ? toBase(
          walletStore.getTokenBalance(MAIN_TOKEN_CONTRACT)?.balance || '0',
          fromTokenSelected.value?.decimals || 18,
        )
      : toBase(
          fromTokenSelected.value?.balance || '0',
          fromTokenSelected.value?.decimals || 18,
        ),
  ).minus(fromAmountBase)

  providers.value =
    quotes && quotes.length > 0
      ? quotes
          .filter(q => {
            // Must be swapping enough tokens
            const firstCheck =
              q.minMax.minimumFrom.lte(new BN(fromAmountBase)) &&
              // Must not be swapping too many tokens
              q.minMax.maximumFrom.gte(new BN(fromAmountBase))

            if (!isWalletConnected.value) {
              return firstCheck
            }
            return (
              firstCheck &&
              // Must be able to afford the fees
              q.additionalNativeFees.lte(new BN(remainingBalance.toString()))
            )
          })
          .filter((provider: ProviderQuoteResponse) => {
            // Filter out providers where fromAmount is less than minimumFrom
            // which means its an invalid qupte
            if (
              BigNumber(provider.minMax.minimumFrom.toString()).lt(
                fromAmount.value,
              )
            )
              return false
            return true
          })
      : []
  selectedQuote.value = providers.value[0] || null
  isLoadingQuotes.value = false
}

// Watch for changes in selectedQuote and update swapInfo
watch(
  () => selectedQuote.value,
  async (provider: ProviderQuoteResponse | null) => {
    if (provider) {
      swapInfo.value = await getSwap(provider.quote)
    }
  },
  { deep: true },
)

// set to values
watch(
  () => providers.value,
  () => {
    if (providers.value.length > 0) {
      // Set the toTokenSelected based on the first provider's toTokenAmount
      toAmount.value = fromBase(
        providers.value[0].toTokenAmount.toString(),
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
      fetchQuotes()
    }
  },
)

onMounted(async () => {
  await initSwapper()
  setFromToken()
  setToToken()

  if (hasSwapValues.value) {
    fromAmount.value = swapValues.value.fromAmount
  }
  clearSwapValues()
})
</script>
