<template>
  <div class="relative flex flex-col h-full">
    <purchase-unsupported-network
      v-if="showUnsupportedNetwork"
      :title="t('purchase.sell.network_not_supported')"
      :description="
        t('purchase.sell.network_not_available', {
          network:
            walletChain?.nameLong ?? walletChain?.name ?? t('common.network'),
        })
      "
      :chains="supportedNetworkChains"
      :default-chain="defaultSupportedChain"
      class="mb-3"
    />

    <div :class="['flex flex-col gap-3 h-full', blockedClass]">
    <purchase-token-select-card
      v-if="displayChain"
      :chain="displayChain"
      :token="selectedToken"
      @click="showTokenModal = true"
    />
    <purchase-amount-input
      :label="t('purchase.sell.youre_selling')"
      :currency="selectedFiat"
      :amount-symbol="tokenSymbol"
      symbol-position="suffix"
      :amount="cryptoAmount"
      :estimate="formattedFiatEstimate"
      :is-loading="isFetchingSellQuote"
      :balance="balanceDisplay"
      :quick-buttons="[]"
      :error-message="amountError"
      :helper-message="amountHelper"
      @update:amount="onCryptoAmountChange"
      @open-currency="showCurrencyModal = true"
      @focus="isInputFocused = true"
      @blur="isInputFocused = false"
    />

    <!-- Network fee -->
    <div class="flex items-center h-16 px-4 rounded-20 bg-bgBase border border-transparent">
      <span class="flex items-center gap-1.5 text-s-12 text-info leading-[18px] flex-none">
        {{ t('purchase.sell.network_fee') }}
        <span
          ref="infoIconRef"
          class="flex items-center cursor-default"
          @mouseenter="onInfoIconEnter"
          @mouseleave="onInfoIconLeave"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <circle cx="7" cy="7" r="6.5" stroke="currentColor"/>
            <path d="M7 6.5V10" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
            <circle cx="7" cy="4.5" r="0.75" fill="currentColor"/>
          </svg>
        </span>
      </span>

      <button
        v-if="networkFeeDisplay"
        type="button"
        class="flex-1 h-full flex items-center justify-end gap-1 text-s-12 leading-[18px]"
        @click="feeSelector?.openFeeModal()"
      >
        <span class="text-info font-normal">≈</span>
        <span class="text-black font-semibold tracking-[-0.24px]">{{ networkFeeDisplay }}</span>
        <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="text-info">
          <path d="M1 1L5 5L1 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <span v-else class="flex-1 text-right text-s-12 text-info leading-[18px]">---</span>
    </div>

    <teleport to="#app">
      <div
        v-if="showNetworkFeeTooltip"
        class="pointer-events-none fixed z-[200] whitespace-nowrap rounded-12 bg-white px-3 py-2 shadow-[0_0_1px_0_rgba(0,0,0,0.25),0_1.5px_4px_0_rgba(0,0,0,0.12)]"
        :style="{ left: `${tooltipPos.left}px`, top: `${tooltipPos.top}px`, transform: 'translate(-50%, calc(-100% - 9px))' }"
      >
        <p class="text-s-12 font-semibold text-black leading-[18px] tracking-[-0.24px] text-center">
          {{ t('purchase.sell.network_fee_tooltip', { symbol: displayChain?.currencyName ?? '', chain: displayChain?.nameLong ?? '' }) }}
        </p>
        <div class="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[7px] border-t-white" />
      </div>
    </teleport>

    <app-base-button
      class="w-full h-12 text-s-16 font-semibold tracking-[-0.32px]"
      :disabled="ctaDisabled && !ctaIsLoading"
      :is-loading="ctaIsLoading"
      @click="onSubmit"
    >
      {{ ctaLabel }}
    </app-base-button>

    <a
      href="https://help.myetherwallet.com/"
      target="_blank"
      rel="noopener"
      class="mt-auto self-center text-s-12 font-semibold text-primary tracking-[-0.24px] hover:underline"
    >
      {{ t('purchase.sell.need_help') }}
    </a>

    <div class="hidden">
      <app-select-tx-fee ref="feeSelector" />
    </div>
    </div>

    <purchase-token-modal
      v-model:is-open="showTokenModal"
      :networks="sellNetworks"
      :default-chain-code="purchaseChainCode"
      :selected-token="selectedToken"
      :compatible-chains="compatibleChainCodes"
      :incompatible-chains="incompatibleChainCodes"
      :is-loading="isFetching"
      @update:selected="selectedToken = $event"
    />
    <purchase-currency-modal
      v-model:is-open="showCurrencyModal"
      :currencies="currencyOptions"
      :selected="selectedFiat"
      :is-loading="isFetching"
      @update:selected="selectedFiat = $event"
    />
    <sell-provider-modal
      v-model:is-open="showProviderModal"
      :quote="sellQuote"
      :crypto-amount="cryptoAmount"
      :crypto-symbol="tokenSymbol"
      :is-loading="isFetchingSellQuote"
      :error="sellQuoteError"
      :analytics-payload="sellPayload"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useDebounceFn } from '@vueuse/core'

import PurchaseTokenSelectCard from './components/PurchaseTokenSelectCard.vue'
import PurchaseAmountInput from './components/PurchaseAmountInput.vue'
import PurchaseTokenModal from './components/PurchaseTokenModal.vue'
import PurchaseCurrencyModal from './components/PurchaseCurrencyModal.vue'
import SellProviderModal from './components/SellProviderModal.vue'
import PurchaseUnsupportedNetwork from './components/PurchaseUnsupportedNetwork.vue'
import AppSelectTxFee from '@/components/AppSelectTxFee.vue'
import AppBaseButton from '@components/AppBaseButton.vue'

import { usePurchaseStore } from '@/stores/purchaseStore'
import { useWalletStore } from '@/stores/walletStore'
import { useChainsStore } from '@/stores/chainsStore'
import { useGlobalStore } from '@/stores/globalStore'
import { useAccessStore } from '@/stores/accessStore'

import { formatFloatingPointValue, formatFiatValue } from '@/utils/numberFormatHelper'
import { getCurrencySymbol } from '@/utils/currencySymbols'
import {
  v7ToPurchaseChain,
  purchaseChainToChain,
} from './helpers/chainMapping'
import { usePurchaseAmount } from './composables/usePurchaseAmount'
import { usePurchaseCompatibility } from './composables/usePurchaseCompatibility'
import { useBlockedContent } from '@/composables/useBlockedContent'

import { type PurchaseAsset } from '@/types/buyToken'
import type { Chain } from '@/mew_api/types'
import { analytics, SellEvent, SellEventError } from '@/analytics'
import type { SellPayloadShared } from '@/analytics'

const { t } = useI18n()

const purchaseStore = usePurchaseStore()
const {
  purchaseInfo,
  isFetching,
  sellNetworks,
  sellFiats,
  sellQuote,
  isFetchingSellQuote,
  sellQuoteError,
  exchangeRates,
} = storeToRefs(purchaseStore)
const { fetchPurchaseInfo, fetchSellQuote, clearSellQuote } = purchaseStore

const walletStore = useWalletStore()
const {
  isWalletConnected,
  isWatchOnly,
  walletAddress,
  tokens,
  balance: nativeBalance,
  isLoadingBalances,
} = storeToRefs(walletStore)

const isReady = computed(() => isWalletConnected.value && !isWatchOnly.value)

const chainsStore = useChainsStore()
const { selectedChain: walletChain, chains } = storeToRefs(chainsStore)
const globalStore = useGlobalStore()

const { compatibleChainCodes, incompatibleChainCodes } = usePurchaseCompatibility(sellNetworks, walletChain, chains)

const supportedNetworkChains = computed<Chain[]>(() =>
  compatibleChainCodes.value
    .map(code => purchaseChainToChain(code, chains.value))
    .filter((c): c is Chain => !!c),
)

const supportedNetwork = computed(() => {
  const code = v7ToPurchaseChain(walletChain.value?.name)
  return !!code && compatibleChainCodes.value.includes(code)
})

const defaultSupportedChain = computed<Chain | null>(
  () =>
    supportedNetworkChains.value.find(c => c.name === 'ETHEREUM') ??
    supportedNetworkChains.value[0] ??
    null,
)

const showUnsupportedNetwork = computed(
  () => !!purchaseInfo.value && !supportedNetwork.value,
)

const { blockedClass } = useBlockedContent(showUnsupportedNetwork)

const accessStore = useAccessStore()

const DEFAULT_SELL_CHAIN = 'ETH'
const DEFAULT_FIAT = 'USD'

const cryptoAmount = ref('')
const isInputFocused = ref(false)
const selectedToken = ref<PurchaseAsset | null>(null)
const selectedFiat = ref<string>(DEFAULT_FIAT)

const showTokenModal = ref(false)
const showCurrencyModal = ref(false)
const showProviderModal = ref(false)

const displayChain = computed<Chain | undefined>(() => {
  if (selectedToken.value) {
    return purchaseChainToChain(selectedToken.value.chain, chains.value)
  }
  if (walletChain.value && v7ToPurchaseChain(walletChain.value.name)) {
    return walletChain.value
  }
  return chains.value.find(c => c.name === 'ETHEREUM')
})

const purchaseChainCode = computed<string>(
  () =>
    selectedToken.value?.chain ??
    v7ToPurchaseChain(displayChain.value?.name) ??
    DEFAULT_SELL_CHAIN,
)

const tokenSymbol = computed<string>(
  () =>
    selectedToken.value?.symbol ?? displayChain.value?.currencyName ?? 'ETH',
)

onMounted(() => {
  fetchPurchaseInfo()
  analytics.trackSellEvent(SellEvent.SHOWN, sellPayload.value)
})

const currencyOptions = computed(() => Array.from(sellFiats.value.keys()))

/* ------------------------------------------------------------------ *
 * Limits: API returns fiat limits; for Sell we validate the typed
 * crypto amount against the crypto-equivalent of those limits, using
 * the token's market price.
 * ------------------------------------------------------------------ */

const fiatLimits = computed(() => {
  const fiat = sellFiats.value.get(selectedFiat.value)
  return fiat?.limits ?? { min: 0, max: 0 }
})

const tokenPrice = computed(() => {
  if (selectedToken.value?.market_data?.price) {
    return Number(selectedToken.value.market_data.price)
  }
  return displayChain.value?.price ?? 0
})

// USD → selected fiat rate. Limits and balance fiat values come in the
// selected fiat, while market_data prices are always in USD.
const fiatRate = computed(() => exchangeRates.value.get(selectedFiat.value))

const cryptoLimits = computed(() => {
  const rate = fiatRate.value
  if (tokenPrice.value <= 0 || !rate) return { min: 0, max: 0 }
  return {
    min: fiatLimits.value.min / rate / tokenPrice.value,
    max: fiatLimits.value.max / rate / tokenPrice.value,
  }
})

const limitText = (value: number) =>
  `${formatFloatingPointValue(String(value)).value} ${tokenSymbol.value}`

/* ------------------------------------------------------------------ *
 * Balance — native of the selected chain → walletStore's `balance`,
 * otherwise → look up the ERC-20 in `tokens`. The fiat equivalent
 * uses the token's market price.
 * ------------------------------------------------------------------ */

const tokenBalance = computed<string | null>(() => {
  if (!isReady.value) return null
  // No token explicitly selected: show the wallet's native balance if the
  // displayed chain matches the wallet's current chain.
  if (!selectedToken.value) {
    if (walletChain.value?.name === displayChain.value?.name) {
      return nativeBalance.value
    }
    return null
  }
  // Token selected: if it's the native currency of the wallet's chain, use
  // the native balance. Otherwise look it up in the ERC-20 list.
  const isNativeOfWalletChain =
    walletChain.value?.currencyName === selectedToken.value.symbol
  if (isNativeOfWalletChain) return nativeBalance.value
  const found = tokens.value.find(
    t => t.contract.toLowerCase() === selectedToken.value?.contract_address.toLowerCase(),
  )
  if (found) return found.balance
  if (isLoadingBalances.value) return null
  // Not in the balance list: 0 if it's the wallet's chain, unknown otherwise.
  const tokenChain = purchaseChainToChain(selectedToken.value.chain, chains.value)
  return tokenChain?.name === walletChain.value?.name ? '0' : null
})

const tokenBalanceFiat = computed<number | null>(() => {
  if (!tokenBalance.value || tokenPrice.value <= 0 || !fiatRate.value) return null
  return Number(tokenBalance.value) * tokenPrice.value * fiatRate.value
})

/* ------------------------------------------------------------------ *
 * Validation: min/max from API limits + insufficient balance.
 * ------------------------------------------------------------------ */

const {
  isEmpty: isAmountEmpty,
  violation: amountViolation,
  minHint: amountMinHint,
  isValid: limitsAreValid,
} = usePurchaseAmount({
  amount: cryptoAmount,
  limits: cryptoLimits,
  isFocused: isInputFocused,
})

const isInsufficientBalance = computed(() => {
  if (isAmountEmpty.value || !tokenBalance.value) return false
  return Number(cryptoAmount.value) > Number(tokenBalance.value)
})

const amountIsValid = computed(
  () => limitsAreValid.value && !isInsufficientBalance.value,
)

const amountError = computed(() => {
  if (isInsufficientBalance.value) {
    return t('purchase.sell.error.insufficient', { symbol: tokenSymbol.value })
  }
  if (!amountViolation.value) return ''
  const { type, value } = amountViolation.value
  return t(`purchase.sell.error.${type}`, { [type]: limitText(value) })
})

const amountHelper = computed(() =>
  amountMinHint.value === null
    ? ''
    : t('purchase.sell.error.min', { min: limitText(amountMinHint.value) }),
)

const balanceDisplay = computed(() => {
  if (!tokenBalance.value) return null
  const fiatPart =
    tokenBalanceFiat.value !== null
      ? `${getCurrencySymbol(selectedFiat.value)}${formatFiatValue(String(tokenBalanceFiat.value)).value}`
      : '—'
  return {
    value: `${formatFloatingPointValue(tokenBalance.value).value} ${tokenSymbol.value}`,
    fiat: fiatPart,
    hasError: isInsufficientBalance.value,
  }
})

/* ------------------------------------------------------------------ *
 * Live fiat estimate — debounce-fetches `/v5/purchase/sell` (same call
 * used on submit). Reads `sellQuote.fiat_amount` for the estimate
 * display and `sellQuote.url` later for the Moonpay redirect.
 * ------------------------------------------------------------------ */

const feeSelector = ref<InstanceType<typeof AppSelectTxFee> | null>(null)

const infoIconRef = ref<HTMLElement | null>(null)
const showNetworkFeeTooltip = ref(false)
const tooltipPos = ref({ left: 0, top: 0 })

const onInfoIconEnter = () => {
  if (infoIconRef.value) {
    const rect = infoIconRef.value.getBoundingClientRect()
    tooltipPos.value = { left: rect.left + rect.width / 2, top: rect.top }
  }
  showNetworkFeeTooltip.value = true
}

const onInfoIconLeave = () => {
  showNetworkFeeTooltip.value = false
}

const networkFeeDisplay = computed(() => {
  if (isAmountEmpty.value || !amountIsValid.value || isFetchingSellQuote.value) return null
  const sel = feeSelector.value
  if (!sel || !sel.hasFees) return null
  const native = sel.selectedFeeNative as string
  if (!native) return null
  if (sel.hasFiatEstimates) {
    const fiat = (sel.selectedFeeFiat as string).trim()
    return `${native} (${fiat})`
  }
  return native
})

const formattedFiatEstimate = computed(() => {
  const symbol = getCurrencySymbol(selectedFiat.value)
  const amount = sellQuote.value?.fiat_amount
  if (!amount) return `${symbol}0.00`
  return `${symbol}${formatFiatValue(amount).value}`
})

const sellPayload = computed<SellPayloadShared>(() => {
  const price = tokenPrice.value
  const rate = fiatRate.value
  const amountUSD =
    price > 0 ? (Number(cryptoAmount.value) * price).toFixed(2) : ''
  const amountOriginalCurrency =
    sellQuote.value?.fiat_amount ??
    (price > 0 && rate
      ? (Number(cryptoAmount.value) * price * rate).toFixed(2)
      : '')
  const fee = feeSelector.value
  const networkFeeUSD =
    fee?.hasFees && fee?.hasFiatEstimates
      ? (fee.selectedFeeFiat as string).replace(/[^0-9.]/g, '') || undefined
      : undefined
  return {
    network: displayChain.value?.name,
    token: tokenSymbol.value,
    currency: selectedFiat.value,
    amountToken: cryptoAmount.value,
    amountUSD,
    amountOriginalCurrency,
    networkFeeUSD,
  }
})

const ESTIMATE_FALLBACK_ADDRESS = '0x0000000000000000000000000000000000000000'

const fetchEstimate = async () => {
  if (isAmountEmpty.value || Number(cryptoAmount.value) <= 0) {
    clearSellQuote()
    return
  }
  await fetchSellQuote({
    address: walletAddress.value || ESTIMATE_FALLBACK_ADDRESS,
    fiatCurrency: selectedFiat.value,
    amount: cryptoAmount.value,
    cryptoCurrency: tokenSymbol.value,
    chain: purchaseChainCode.value,
  })
  if (!amountIsValid.value) return
  if (sellQuote.value) {
    analytics.trackSellEvent(SellEvent.PRELIMINARY_SHOWN, sellPayload.value)
  } else {
    analytics.trackSellEventError(SellEventError.PRELIMINARY_ERROR, {
      ...sellPayload.value,
      errorMsg: sellQuoteError.value || 'no_quote',
    })
  }
}

const debouncedFetchEstimate = useDebounceFn(fetchEstimate, 500)

/* ------------------------------------------------------------------ *
 * CTA state
 * ------------------------------------------------------------------ */

const ctaDisabled = computed(
  () =>
    showUnsupportedNetwork.value ||
    (isReady.value && (!amountIsValid.value || isFetchingSellQuote.value)),
)

const ctaIsLoading = computed(
  () => isReady.value && amountIsValid.value && isFetchingSellQuote.value,
)

const ctaLabel = computed(() => {
  if (!isReady.value) return t('purchase.sell.connect_wallet')
  if (amountIsValid.value) return t('purchase.sell.continue')
  return t('purchase.sell.enter_amount')
})

const onCryptoAmountChange = (value: string) => {
  cryptoAmount.value = value
  isFetchingSellQuote.value = Number(value) > 0 && !amountError.value
  debouncedFetchEstimate()
}

watch(compatibleChainCodes, codes => {
  if (selectedToken.value && !codes.includes(selectedToken.value.chain)) {
    selectedToken.value = null
  }
})

watch(selectedToken, token => {
  if (!token) return
  const tokenChain = purchaseChainToChain(token.chain, chains.value)
  if (tokenChain && tokenChain.name !== walletChain.value?.name) {
    globalStore.setSelectedNetwork(tokenChain.name)
  }
})

watch(walletChain, chain => {
  if (
    selectedToken.value &&
    purchaseChainToChain(selectedToken.value.chain, chains.value)?.name !==
      chain?.name
  ) {
    selectedToken.value = null
  }
})

watch(
  () => [
    purchaseChainCode.value,
    tokenSymbol.value,
    selectedFiat.value,
    walletAddress.value,
  ],
  () => {
    clearSellQuote()
    if (!isAmountEmpty.value) {
      isFetchingSellQuote.value = Number(cryptoAmount.value) > 0
      debouncedFetchEstimate()
    }
  },
)

const onSubmit = () => {
  if (showUnsupportedNetwork.value) return
  if (!isReady.value) {
    accessStore.openAccessDialog()
    return
  }
  if (!amountIsValid.value) return
  analytics.trackSellEvent(SellEvent.CLICK_CONTINUE, sellPayload.value)
  showProviderModal.value = true
}
</script>
