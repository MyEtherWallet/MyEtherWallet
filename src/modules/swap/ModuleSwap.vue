<template>
  <div>
    <div
      :class="[
        'static w-full flex flex-col items-center justify-items-stretch gap-1',
      ]"
    >
      <div class="mb-3">
        <p class="font-bold text-s-28 ml-5 mb-4">
          {{ walletPanel === 'swap' ? 'Swap' : 'Bridge' }}
        </p>
        <div class="relative">
          <div class="absolute -top-8 right-4">
            <app-btn-text class="text-primary ml-auto">Clear all</app-btn-text>
          </div>
          <!-- From Section -->
          <div
            class="bg-mewBg rounded-[20px] !px-4 pt-2 pb-4 max-w-[478px] mx-auto"
          >
            <p class="text-s-12 mb-2 ml-2 font-bold">You are selling</p>
            <select-chain-for-app :filter-chain-type="true" />
            <app-swap-enter-amount
              v-model:amount="fromAmount"
              v-model:selected-token="fromTokenSelected"
              v-model:error="fromAmountError"
              :external-loading="fromLoadingState"
              :tokens="parsedFromTokens"
              :show-balance="isWalletConnected"
              class="mt-3"
            />
          </div>
          <div
            class="bg-white border border-solid border-grey-10 rounded-[12px] h-[36px] w-[36px] mx-auto flex justify-center items-center absolute shadow-lg right-[45%]"
            :class="{
              'top-[calc(50%-67px)]': isCrossChain,
              'top-[calc(50%-18px)]': !isCrossChain,
            }"
          >
            <arrows-up-down-icon class="w-5 h-5" />
          </div>
          <div class="pt-2"></div>
          <!-- To Section -->
          <div
            class="bg-mewBg rounded-[20px] !px-4 pt-2 pb-4 max-w-[478px] mx-auto"
          >
            <p class="text-s-12 mb-2 ml-2 font-bold">You are buying</p>
            <select-chain-for-app
              :can-store="false"
              :passed-chains="toChains"
              :preselected-chain="selectedToChain"
              :filter-chain-type="true"
              @update:selected-chain="setToChain"
            />
            <app-swap-enter-amount
              v-model:amount="toAmount"
              v-model:selected-token="toTokenSelected"
              v-model:error="toAmountError"
              :external-loading="toLoadingState"
              :show-balance="false"
              :tokens="parsedToTokens"
              :readonly="true"
              :is-estimate="true"
              class="mt-4"
            />
            <div class="pt-4" v-if="isCrossChain"></div>
            <address-input
              v-model:adr-input="userToAddress"
              :resolved-address="toAddress"
              :address-error-messages="toAddressError"
              @validate:address="validateToAddress"
              v-if="isCrossChain"
            />
          </div>
        </div>
      </div>
      <div
        v-if="swapLoaded && !supportedNetwork"
        class="text-error text-center"
      >
        <p class="text-s-16">
          {{ t('swap.not-supported-network') }}
        </p>
      </div>
      <app-base-button
        class="w-[70%]"
        v-if="isWalletConnected"
        :disabled="
          (swapLoaded && !supportedNetwork) ||
          !(
            fromAmount !== '' &&
            fromAmount !== '0' &&
            fromAmountError === '' &&
            toAmount !== '0'
          ) ||
          (isCrossChain && toAddressError !== '')
        "
        @click="swapButton"
      >
        {{ t('common.swap') }}</app-base-button
      >
      <div class="mx-auto w-[70%]" v-else>
        <app-base-button
          class="w-full"
          :disabled="swapLoaded && !supportedNetwork"
          @click="connectWalletForSwap"
        >
          {{ t('connect_wallet') }}</app-base-button
        >
      </div>
      <app-need-help
        :title="$t('send.need-help')"
        help-link="https://help.myetherwallet.com/en/article/what-is-gas"
        class="mt-4 mx-auto"
      />
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
      :swap-gas-fee-quote="swapGasFeeQuote || undefined"
    />
    <swap-initiated-modal
      v-model:swap-initiated-open="swapInitiatedOpen"
      :from-chain="selectedChain"
      :to-chain="selectedToChain"
      :selected-quote="selectedQuote"
      :tx-hash="txHash"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, type Ref, computed, watch, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { ArrowsUpDownIcon } from '@heroicons/vue/24/solid' // Importing the arrowsUpDown icon from Heroicons
import AppBaseButton from '@/components/AppBaseButton.vue'
import BestOfferModal from './components/BestOfferModal.vue'
import SwapOfferModal from './components/SwapOfferModal.vue'
import SwapInitiatedModal from './components/SwapInitiatedModal.vue'
import AppNeedHelp from '@/components/AppNeedHelp.vue'
import AppBtnText from '@/components/AppBtnText.vue'
import { useWalletStore, MAIN_TOKEN_CONTRACT } from '@/stores/walletStore'
import { useSwap } from '@/composables/useSwap'
import { type Chain } from '@/mew_api/types'
import { supportedSwapEnums } from '@/providers/ethereum/chainToEnum'
import { useChainsStore } from '@/stores/chainsStore'
import { useGlobalStore } from '@/stores/globalStore'
import SelectChainForApp from '@/components/select_chain/SelectChainForApp.vue'
import AppSwapEnterAmount from '@/components/AppSwapEnterAmount.vue'
import BigNumber from 'bignumber.js'
import { type NewTokenInfo } from '@/composables/useSwap'
import type { EvmTransactionAction, QuotesResponse } from '@/mew_api/types'
import {
  type ProviderQuoteResponse,
  type ProviderSwapResponse,
  type EVMTransaction,
  type TokenType,
} from '@enkryptcom/swap'
import { fromBase } from '@/utils/unit'
import { useInputStore } from '@/stores/inputStore'
import { toBase } from '@/utils/unit'
import { GasPriceType } from '@/providers/types'
import { WalletType, type HexPrefixedString } from '@/providers/types'
import { useToastStore } from '@/stores/toastStore'
import { ToastType } from '@/types/notification'
import { useI18n } from 'vue-i18n'
import { useDebounceFn } from '@vueuse/core'
import dataTxAction from '@/utils/dataTxAction'
import AddressInput from '@/components/address_book/AddressInput.vue'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { useAccessStore } from '@/stores/accessStore'
import { formatFloatingPointValue } from '@/utils/numberFormatHelper'
const walletMenu = useWalletMenuStore()
const { walletPanel } = storeToRefs(walletMenu)

const walletStore = useWalletStore()
const globalStore = useGlobalStore()
const chainsStore = useChainsStore()
const inputStore = useInputStore()
const toastStore = useToastStore()
const { t } = useI18n()

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

const toAddressError = ref<string>('')
const userToAddress = ref<string>('')
const bestSwapLoadingOpen = ref(false)
const bestOfferSelectionOpen = ref(false)
const swapInitiatedOpen = ref(false)
const selectedToChain: Ref<Chain | undefined> = ref(undefined)
const localToTokens = ref<NewTokenInfo[] | null>(null)
const providers = ref<ProviderQuoteResponse[]>([])
const isLoadingQuotes = ref(false)
const txHash = ref<HexPrefixedString>('0x')
const swapGasFeeQuote = ref<QuotesResponse | undefined>(undefined)

const swapInfo: Ref<ProviderSwapResponse | null> = ref(null)
const selectedQuote = ref<ProviderQuoteResponse | undefined>(undefined)

const setToToken = () => {
  if (!selectedToChain.value) {
    toastStore.addToastMessage({
      type: ToastType.Error,
      text: t('swap.toast.select-chain'),
      duration: 5000,
    })
    return
  }
  const enkryptEnum = supportedSwapEnums[selectedToChain.value?.name]
  if (!enkryptEnum) {
    toastStore.addToastMessage({
      type: ToastType.Error,
      text: t('swap.toast.unsupported-chain'),
      duration: 5000,
    })
    return
  }
  const allToTokens =
    toTokens.value?.all[enkryptEnum as keyof typeof toTokens.value.all]
  localToTokens.value = allToTokens?.map((token: TokenType) => ({
    ...token,
    balance: fromBase(token?.balance?.toString() ?? '0', token.decimals),
  })) as NewTokenInfo[]
  if (!hasSwapValues.value) {
    if (toTokens.value && allToTokens && allToTokens.length > 0) {
      const allToTrending =
        toTokens.value?.trending[
          enkryptEnum as keyof typeof toTokens.value.trending
        ]

      const trendingOrAllToTokens =
        allToTrending && allToTrending.length > 0 ? allToTrending : allToTokens

      const sameNetworks =
        selectedToChain.value?.chainID === selectedChain.value?.chainID

      // Find a token from the network that is not the selected fromToken
      const tokenFromNetwork = sameNetworks
        ? trendingOrAllToTokens.find(
            (token: TokenType) =>
              token.address.toLowerCase() !==
              fromTokenSelected.value?.address.toLowerCase(),
          )
        : trendingOrAllToTokens[0]
      const defaultToken = {
        ...tokenFromNetwork,
        balance: fromBase(
          tokenFromNetwork?.balance?.toString() ?? '0',
          tokenFromNetwork?.decimals ?? 18,
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
// removes the selected to token from the from tokens list
const parsedFromTokens = computed(() => {
  const toToken = toTokenSelected.value as NewTokenInfo
  return fromTokens.value?.filter(
    (token: NewTokenInfo) => token.address !== toToken?.address,
  )
})
// removes the selected to token from the from tokens list
const parsedToTokens = computed(() => {
  const fromToken = fromTokenSelected.value as NewTokenInfo
  if (!localToTokens.value) return []
  return localToTokens?.value.filter(
    (token: NewTokenInfo) => token.address !== fromToken.address,
  )
})

const validateToAddress = async () => {
  const address = userToAddress.value
  const validAddress =
    await toTokenSelected.value?.networkInfo.isAddress(address)
  if (!address) toAddressError.value = 'address is required'
  if (!validAddress) toAddressError.value = 'invalid address'
}

const proceedWithSwap = async (quoteId: string) => {
  let txPromise
  // Proceed with the swap using the selected quote

  const getSignableTransactions =
    await wallet.value?.getMultipleSignableTransactions?.({
      priority: gasPriceType.value as GasPriceType,
      quoteId: quoteId,
    })

  if (
    getSignableTransactions?.serialized.length &&
    getSignableTransactions?.serialized.length > 0
  ) {
    for (let i = 0; i < getSignableTransactions?.serialized.length; i++) {
      const tx = getSignableTransactions?.serialized[i]
      const indexAtTheEnd = i === getSignableTransactions?.serialized.length - 1
      if (tx) {
        try {
          if (
            wallet.value?.getWalletType() === WalletType.WAGMI ||
            wallet.value?.getWalletType() === WalletType.INJECTED
          ) {
            const broadcast = wallet.value?.SendTransaction?.(
              tx as HexPrefixedString,
            )
            // only assign txPromise if it's the last transaction
            if (indexAtTheEnd) {
              txPromise = broadcast
            }
          } else {
            const signedTx = await wallet.value?.SignTransaction?.(
              tx as HexPrefixedString,
            )

            const broadcast = wallet.value?.broadcastTransaction(
              signedTx?.signed as unknown as HexPrefixedString,
            )
            // assign last transaction to txPromise
            if (indexAtTheEnd) {
              txPromise = broadcast
            }
          }
        } catch {
          toastStore.addToastMessage({
            type: ToastType.Error,
            text: t('swap.toast.tx-sign-failed'),
            duration: 10000,
          })
          return
        }
      }
    }
  }

  await txPromise
    ?.then(hash => {
      txHash.value = hash as HexPrefixedString
      bestOfferSelectionOpen.value = false
      swapInitiatedOpen.value = true
      toastStore.addToastMessage({
        type: ToastType.Success,
        text: t('swap.toast.tx-send-success'),
        duration: 10000,
      })
    })
    .catch(e => {
      const errorMsg =
        e?.message || t('swap.toast.tx-sign-failed') || 'Transaction failed'
      bestOfferSelectionOpen.value = false
      toastStore.addToastMessage({
        type: ToastType.Error,
        text: errorMsg,
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
        (token: NewTokenInfo) =>
          token.address.toLowerCase() === MAIN_TOKEN_CONTRACT,
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

const toLoadingState = computed(() => {
  if (isLoadingQuotes.value) {
    return true
  }
  return !swapLoaded.value && supportedNetwork.value
})

const fromLoadingState = computed(() => {
  return !swapLoaded.value && supportedNetwork.value
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

const accessStore = useAccessStore()
const connectWalletForSwap = () => {
  storeSwapValues({
    fromToken: fromTokenSelected.value as NewTokenInfo,
    toToken: toTokenSelected.value as NewTokenInfo,
    toChain: selectedToChain.value as Chain,
    fromAmount: fromAmount.value as string,
  })
  accessStore.openAccessDialog()
}

const swapButton = async () => {
  bestSwapLoadingOpen.value = true
  await debounceFetchQuotes()
  const transactions = (swapInfo.value?.transactions || []).filter(
    (tx): tx is EVMTransaction => 'gasLimit' in tx && 'data' in tx,
  )

  // format transactions to match api
  const parsedTransactions = transactions.map(tx => {
    const action = dataTxAction(tx) as EvmTransactionAction
    return {
      address: tx.from,
      to: tx.to,
      data: tx.data,
      value: tx.value || '0x0',
      action: action,
    }
  })

  const signableTransaction =
    await wallet.value?.getMultipleGasFees?.(parsedTransactions)
  swapGasFeeQuote.value = signableTransaction || undefined
  bestSwapLoadingOpen.value = false
  bestOfferSelectionOpen.value = true
}

// From tokens models
const fromAmount = ref<number | string>('0')
const fromTokenSelected: Ref<NewTokenInfo> = ref({} as NewTokenInfo) // TODO: Implement token selection

const fromAmountError = computed(() => {
  if (fromAmount.value === undefined || fromAmount.value === '')
    return t('swap.error.amount-required') // amount is blank
  if (
    BigNumber(fromAmount.value).toFixed().length >
    fromTokenSelected.value?.decimals
  ) {
    return t('swap.error.too-many-decimals', {
      decimal: fromTokenSelected.value?.decimals,
    })
  }
  const baseNetworkBalance = toBase(
    walletStore.getTokenBalance(MAIN_TOKEN_CONTRACT)?.balance || '0',
    18,
  )
  const baseBalance =
    fromTokenSelected.value?.address === MAIN_TOKEN_CONTRACT
      ? baseNetworkBalance
      : toBase(
          fromTokenSelected.value?.balance || '0',
          fromTokenSelected.value?.decimals || 18,
        )
  const baseAmount = fromAmount.value
    ? toBase(
        BigNumber(fromAmount.value).toFixed(),
        fromTokenSelected.value?.decimals || 18,
      )
    : 0
  const remainingBalance = BigNumber(
    fromTokenSelected.value?.address === MAIN_TOKEN_CONTRACT &&
      isWalletConnected.value
      ? baseNetworkBalance
      : toBase(
          fromTokenSelected.value?.balance || '0',
          fromTokenSelected.value?.decimals || 18,
        ),
  ).minus(baseAmount)

  if (BigInt(baseAmount) < 0)
    return t('swap.error.more-than-zero') // amount less than 0
  else if (
    providers.value.length === 0 &&
    fromAmount.value !== '0' &&
    !isLoadingQuotes.value
  ) {
    return t('swap.error.no-quotes')
  } else if (selectedQuote.value) {
    if (
      isWalletConnected.value &&
      BigInt(selectedQuote.value?.additionalNativeFees?.toString()) >
        BigInt(remainingBalance.toString())
    )
      return t('swap.error.insufficient-balance-for-fees', {
        symbol: selectedChain.value?.name,
      }) // insufficient native token balance for gas
    if (selectedQuote.value.minMax) {
      if (
        BigInt(baseAmount) <
        BigInt(selectedQuote.value.minMax.minimumFrom.toString())
      )
        return t('swap.error.minimum-amount') // amount less than min amount
      if (
        BigInt(baseAmount) >
        BigInt(selectedQuote.value.minMax.maximumFrom.toString())
      )
        return t('swap.error.maximum-amount') // amount less than min amount
    }
  } else if (
    isWalletConnected.value &&
    BigInt(baseBalance) < BigInt(baseAmount)
  )
    return t('swap.error.insufficient-native', {
      symbol: fromTokenSelected.value.symbol,
    })
  // amount greater than selected balance
  return ''
})

// To Token models
const toAmount = ref<number | string>('0')
const toTokenSelected: Ref<NewTokenInfo | undefined> = ref(undefined)

const toAmountError = computed(() => {
  return ''
})

const fetchQuotes = async () => {
  providers.value = []
  selectedQuote.value = undefined
  isLoadingQuotes.value = true
  toAmount.value = '0'
  // fetch quotes only if fromTokenSelected.value is defined
  try {
    const quotes = await getQuote({
      fromToken: fromTokenSelected.value,
      toToken: toTokenSelected.value as NewTokenInfo,
      amount: BigNumber(fromAmount.value).toFixed(),
      fromAddress: userAddress.value,
      toAddress: toAddress.value,
    })

    // sort quotes by lowest minimum
    providers.value =
      quotes && quotes.length > 0
        ? quotes.sort((a: ProviderQuoteResponse, b: ProviderQuoteResponse) => {
            const aFees = BigNumber(a.minMax.minimumFrom.toString() || 0)
            const bFees = BigNumber(b.minMax.minimumFrom.toString() || 0)
            return aFees.gt(bFees) ? 1 : bFees.gt(aFees) ? -1 : 0
          })
        : []
    selectedQuote.value = providers.value[0] || undefined
    isLoadingQuotes.value = false
  } catch {
    // TODO: add sentry to catch actual error
    toastStore.addToastMessage({
      type: ToastType.Error,
      text: t('swap.error.fetching-quotes'),
    })
  }
}

const debounceFetchQuotes = useDebounceFn(fetchQuotes, 750)

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
    if (providers.value.length > 0 && fromAmountError.value === '') {
      const value = fromBase(
        providers.value[0].toTokenAmount.toString(),
        toTokenSelected.value?.decimals || 18,
      )
      // Set the toTokenSelected based on the first provider's toTokenAmount
      toAmount.value = `≈ ${formatFloatingPointValue(value).value}`
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
      fromTokenSelected.value.address === toTokenSelected.value?.address &&
      selectedChain.value?.chainID === selectedToChain.value?.chainID
    ) {
      setToToken()
    }
    if (
      !BigNumber(fromAmount.value).isNaN() &&
      !BigNumber(fromAmount.value).isZero() &&
      toTokenSelected.value
    ) {
      if (isCrossChain.value && toAddress.value === '') return
      debounceFetchQuotes()
    }
  },
)

watch(
  () => fromTokens.value,
  () => {
    setFromToken()
  },
  { deep: true },
)

onBeforeMount(async () => {
  await initSwapper()

  await nextTick()
  setToToken()
  setFromToken()

  if (hasSwapValues.value) {
    fromAmount.value = swapValues.value.fromAmount
  }
  clearSwapValues()
})
</script>
