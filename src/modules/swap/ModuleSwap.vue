<template>
  <div class="relative max-w-[478px] mx-auto">
    <div class="bg-white rounded-[20px] !px-4 pt-3 pb-4 max-w-[478px] mx-auto">
      <p class="text-s-16 mb-2">From</p>
      <app-select-chain />
      <app-swap-enter-amount
        v-model:amount="fromAmount"
        v-model:selected-token="fromTokenSelected"
        v-model:error="fromAmountError"
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
        :has-custom-validator="true"
        :custom-validator="toTokenSelected?.networkInfo.isAddress"
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
        !(
          fromAmount !== '' &&
          fromAmount !== '0' &&
          fromAmountError === '' &&
          toAmount !== '0'
        ) ||
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
    v-model:selected-quote="selectedQuote"
    @update:proceedWithSwap="proceedWithSwap"
    :quotes="providers"
    :amount="fromAmount"
    :to-chain="selectedToChain"
    :swap-info="swapInfo || undefined"
  />
  <swap-initiated-modal
    v-model:swap-initiated-open="swapInitiatedOpen"
    :from-chain="selectedChain"
    :to-chain="selectedToChain"
    :selected-quote="selectedQuote"
    :tx-hash="txHash"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, type Ref, computed, watch, nextTick } from 'vue'
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
import { supportedSwapEnums } from '@/providers/ethereum/chainToEnum'
import { useChainsStore } from '@/stores/chainsStore'
import { useGlobalStore } from '@/stores/globalStore'
import AppSelectChain from '@/components/AppSelectChain.vue'
import AppSwapEnterAmount from '@/components/AppSwapEnterAmount.vue'
import BigNumber from 'bignumber.js'
import { type NewTokenInfo } from '@/composables/useSwap'
import {
  type ProviderQuoteResponse,
  type ProviderSwapResponse,
  type EVMTransaction,
  type TokenType,
} from '@enkryptcom/swap'
import { fromBase } from '@/utils/unit'
import { useInputStore } from '@/stores/inputStore'
import { useRouter } from 'vue-router'
import { toBase } from '@/utils/unit'
import BN from 'bn.js'
import { GasPriceType } from '@/providers/types'
import { WalletType, type HexPrefixedString } from '@/providers/types'
import { useToastStore } from '@/stores/toastStore'
import { ToastType } from '@/types/notification'
import { useI18n } from 'vue-i18n'
import { useDebounceFn } from '@vueuse/core'

const walletStore = useWalletStore()
const globalStore = useGlobalStore()
const chainsStore = useChainsStore()
const inputStore = useInputStore()
const toastStore = useToastStore()
const { t } = useI18n()
const router = useRouter()

const { gasPriceType } = storeToRefs(globalStore)
const { isWalletConnected, walletAddress, wallet } = storeToRefs(walletStore)
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
const selectedToChain: Ref<Chain | undefined> = ref(undefined)
const localToTokens = ref<NewTokenInfo[] | null>(null)
const providers = ref<ProviderQuoteResponse[]>([])
const isLoadingQuotes = ref(false)
const txHash = ref<HexPrefixedString>('0x')

const swapInfo: Ref<ProviderSwapResponse | null> = ref(null)
const selectedQuote = ref<ProviderQuoteResponse | undefined>(undefined)

const setToToken = () => {
  if (!selectedToChain.value) {
    toastStore.addToastMessage({
      type: ToastType.Error,
      text: t('swap.toast.select-chain'), // TODO: add to i18n
      duration: 5000,
    })
    return
  }
  const enkryptEnum = supportedSwapEnums[selectedToChain.value?.name]
  if (!enkryptEnum) {
    toastStore.addToastMessage({
      type: ToastType.Error,
      text: t('swap.toast.unsupported-chain'), // TODO: add to i18n
      duration: 5000,
    })
    return
  }
  const allToTokens =
    toTokens.value?.all[enkryptEnum as keyof typeof toTokens.value.all]
  if (!hasSwapValues.value) {
    localToTokens.value = allToTokens?.map((token: TokenType) => ({
      ...token,
      balance: fromBase(token?.balance?.toString() ?? '0', token.decimals),
    })) as NewTokenInfo[]
    if (toTokens.value && allToTokens && allToTokens.length > 0) {
      const allToTrending =
        toTokens.value?.trending[
          enkryptEnum as keyof typeof toTokens.value.trending
        ]
      const sameNetworks =
        selectedToChain.value?.name === selectedChain.value?.name ? 1 : 0
      const tokenFromNetwork =
        allToTrending.length > 0
          ? allToTrending[sameNetworks]
          : allToTokens[sameNetworks]
      const defaultToken = {
        ...tokenFromNetwork,
        balance: fromBase(
          tokenFromNetwork?.balance?.toString() ?? '0',
          tokenFromNetwork.decimals,
        ),
      } as NewTokenInfo
      toTokenSelected.value = defaultToken
    }
  } else {
    // check if swapValue to token is in toTokens
    const toToken = allToTokens
      ?.map(
        (token: TokenType) =>
          ({
            ...token,
            balance: fromBase(
              token?.balance?.toString() ?? '0',
              token.decimals,
            ),
          }) as NewTokenInfo,
      )
      .find(
        (token: NewTokenInfo) =>
          token.address === swapValues.value.toToken.address,
      )
    if (toToken) {
      toTokenSelected.value = toToken
    } else {
      // If not found, default to the first token
      toTokenSelected.value = (
        allToTokens && allToTokens?.length > 0
          ? {
              ...allToTokens[0],
              balance: fromBase(
                allToTokens[0]?.balance?.toString() ?? '0',
                allToTokens[0]?.decimals,
              ),
            }
          : undefined
      ) as NewTokenInfo
    }
  }
}

const proceedWithSwap = async () => {
  let txPromise
  // Proceed with the swap using the selected quote
  // Filter transactions to only include EVMTransaction type
  const transactions = (swapInfo.value?.transactions || []).filter(
    (tx): tx is EVMTransaction => 'gasLimit' in tx && 'data' in tx,
  )

  console.log(transactions)
  const getApiQuotes = await Promise.all(
    transactions.map(async tx => {
      const newTxData = {
        address: tx.from,
        to: tx.to,
        data: tx.data,
        value: tx.value,
      }
      return await wallet.value?.getGasFee(newTxData)
    }),
  )

  const signableTx = await Promise.all(
    getApiQuotes.map(async apiQuote => {
      if (!apiQuote) return null
      const signableTx = await wallet.value?.getSignableTransaction({
        priority: gasPriceType.value as GasPriceType,
        quoteId: apiQuote?.quoteId,
      })

      return signableTx
    }),
  )

  if (
    wallet.value?.getWalletType() !== WalletType.WAGMI &&
    wallet.value?.getWalletType() !== WalletType.INJECTED
  ) {
    for (const tx of signableTx) {
      if (tx) {
        try {
          const signedTx = await wallet.value?.SignTransaction?.(
            tx.serialized as HexPrefixedString,
          )
          txPromise = wallet.value?.broadcastTransaction(
            signedTx as unknown as HexPrefixedString,
          )
        } catch {
          toastStore.addToastMessage({
            type: ToastType.Error,
            text: t('send.toast.tx-sign-failed'),
            duration: 10000,
          })
          return
        }
      }
    }
  } else {
    for (const tx of signableTx) {
      if (tx) {
        txPromise = wallet.value?.SendTransaction?.(
          tx.serialized as HexPrefixedString,
        )
      }
    }
  }

  await txPromise?.then(hash => {
    txHash.value = hash as HexPrefixedString
    bestOfferSelectionOpen.value = false
    swapInitiatedOpen.value = true
    toastStore.addToastMessage({
      type: ToastType.Success,
      text: t('send.toast.tx-send-success'),
      duration: 10000,
    })
  })
}

// Reset values when swap initiated closes
// tx is already broadcasted at this point
watch(
  () => swapInitiatedOpen.value,
  (value: boolean) => {
    if (!value) {
      txHash.value = '0x'
      providers.value = []
      selectedQuote.value = undefined
      fromAmount.value = '0'
      toAmount.value = '0'
      userToAddress.value = ''
      setToToken()
      setFromToken()
    }
  },
)

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
  return selectedChain.value?.type !== selectedToChain.value?.type
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
  await debounceFetchQuotes()
  bestSwapLoadingOpen.value = false
  bestOfferSelectionOpen.value = true
}

// From tokens models
const fromAmount = ref<number | string>('0')
const fromTokenSelected: Ref<NewTokenInfo> = ref({} as NewTokenInfo) // TODO: Implement token selection

const fromAmountError = computed(() => {
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
    return 'Amount is required' // amount is blank
  else if (BigInt(baseAmount) < 0)
    return 'Amount must be greater than 0' // amount less than 0
  else if (isWalletConnected.value && BigInt(baseBalance) < BigInt(baseAmount))
    return 'Insufficient balance' // amount greater than selected balance
  else if (
    providers.value.length === 0 &&
    fromAmount.value !== '0' &&
    !isLoadingQuotes.value
  )
    return 'No quotes available' // no quotes available
  return ''
})

// To Token models
const toAmount = ref<number | string>('0')
const toTokenSelected: Ref<NewTokenInfo | undefined> = ref(undefined)

const toAmountError = computed(() => {
  const baseAmount = toAmount.value
    ? toBase(toAmount.value, toTokenSelected.value?.decimals || 18)
    : 0

  // model.value = amount.value
  if (toAmount.value === undefined || toAmount.value === '')
    return 'Amount is required' // amount is blank
  else if (BigInt(baseAmount) < 0) return 'Amount must be greater than 0' // amount less than 0
  return ''
})

const fetchQuotes = async () => {
  providers.value = []
  selectedQuote.value = undefined
  isLoadingQuotes.value = true
  // fetch quotes only if fromTokenSelected.value is defined
  try {
    const quotes = await getQuote({
      fromToken: fromTokenSelected.value,
      toToken: toTokenSelected.value as NewTokenInfo,
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
                BigNumber(provider.minMax.minimumFrom.toString()).gt(
                  fromAmount.value,
                )
              )
                return false
              return true
            })
        : []
    selectedQuote.value = providers.value[0] || undefined
    isLoadingQuotes.value = false
  } catch (e) {
    console.log(e)
    console.info('Error fetching quotes:', e)
  }
}

const debounceFetchQuotes = useDebounceFn(fetchQuotes, 500)

// Watch for changes in selectedQuote and update swapInfo
watch(
  () => selectedQuote.value,
  async (provider: ProviderQuoteResponse | undefined) => {
    if (provider) {
      swapInfo.value = await getSwap(provider)
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
      ).substring(0, toTokenSelected.value?.decimals || 18)
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
    toTokenSelected.value,
  ],
  async () => {
    if (
      !BigNumber(fromAmount.value).isNaN() &&
      !BigNumber(fromAmount.value).isZero() &&
      toTokenSelected.value
    ) {
      debounceFetchQuotes()
    }
  },
)

onMounted(async () => {
  await initSwapper()

  await nextTick()
  setFromToken()
  setToToken()

  if (hasSwapValues.value) {
    fromAmount.value = swapValues.value.fromAmount
  }
  clearSwapValues()
})
</script>
