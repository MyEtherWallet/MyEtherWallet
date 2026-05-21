<template>
  <div class="flex flex-col gap-3 h-full">
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
      :preset-amounts="[]"
      :error-message="amountError"
      :helper-message="amountHelper"
      @update:amount="onCryptoAmountChange"
      @open-currency="showCurrencyModal = true"
      @focus="isInputFocused = true"
      @blur="isInputFocused = false"
    />

    <button
      type="button"
      :class="[
        'h-12 w-full rounded-24 px-4 flex items-center justify-center gap-2 font-semibold text-s-16 tracking-[-0.32px] transition-colors',
        ctaIsPrimary
          ? 'bg-primary text-white hoverOpacityHasBG'
          : 'bg-bgBase text-grey-50 cursor-not-allowed',
      ]"
      :disabled="ctaDisabled"
      @click="onSubmit"
    >
      <span
        v-if="ctaIsLoading"
        class="inline-block w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin"
      />
      <span v-else>{{ ctaLabel }}</span>
    </button>

    <a
      href="https://help.myetherwallet.com/"
      target="_blank"
      rel="noopener"
      class="mt-auto self-center text-s-12 font-semibold text-primary tracking-[-0.24px] hover:underline"
    >
      {{ t('purchase.sell.need_help') }}
    </a>

    <purchase-token-modal
      v-model:is-open="showTokenModal"
      :networks="sellNetworks"
      :default-chain-code="purchaseChainCode"
      :selected-token="selectedToken"
      @update:selected="selectedToken = $event"
    />
    <purchase-currency-modal
      v-model:is-open="showCurrencyModal"
      :currencies="currencyOptions"
      :selected="selectedFiat"
      @update:selected="selectedFiat = $event"
    />
    <sell-provider-modal
      v-model:is-open="showProviderModal"
      :quote="sellQuote"
      :crypto-amount="cryptoAmount"
      :crypto-symbol="tokenSymbol"
      :is-loading="isFetchingSellQuote"
      :error="sellQuoteError"
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

import { usePurchaseStore } from '@/stores/purchaseStore'
import { useWalletStore } from '@/stores/walletStore'
import { useChainsStore } from '@/stores/chainsStore'
import { useAccessStore } from '@/stores/accessStore'

import { formatFloatingPointValue, formatFiatValue } from '@/utils/numberFormatHelper'
import { getCurrencySymbol } from '@/utils/currencySymbols'
import {
  v7ToPurchaseChain,
  purchaseChainToChain,
} from './helpers/chainMapping'
import { usePurchaseAmount } from './composables/usePurchaseAmount'

import { type PurchaseAsset } from '@/types/buyToken'
import type { Chain } from '@/mew_api/types'

const { t } = useI18n()

const purchaseStore = usePurchaseStore()
const {
  sellNetworks,
  sellFiats,
  sellQuote,
  isFetchingSellQuote,
  sellQuoteError,
} = storeToRefs(purchaseStore)
const { fetchPurchaseInfo, fetchSellQuote, clearSellQuote } = purchaseStore

const walletStore = useWalletStore()
const {
  isWalletConnected,
  isWatchOnly,
  walletAddress,
  tokens,
  balance: nativeBalance,
} = storeToRefs(walletStore)

const isReady = computed(() => isWalletConnected.value && !isWatchOnly.value)

const chainsStore = useChainsStore()
const { selectedChain: walletChain, chains } = storeToRefs(chainsStore)

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

const cryptoLimits = computed(() => {
  if (tokenPrice.value <= 0) return { min: 0, max: 0 }
  return {
    min: fiatLimits.value.min / tokenPrice.value,
    max: fiatLimits.value.max / tokenPrice.value,
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
    t => t.symbol === selectedToken.value?.symbol,
  )
  return found?.balance ?? null
})

const tokenBalanceFiat = computed<number | null>(() => {
  if (!tokenBalance.value || tokenPrice.value <= 0) return null
  return Number(tokenBalance.value) * tokenPrice.value
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

const formattedFiatEstimate = computed(() => {
  const symbol = getCurrencySymbol(selectedFiat.value)
  const amount = sellQuote.value?.fiat_amount
  if (!amount) return `${symbol}0.00`
  return `${symbol}${formatFiatValue(amount).value}`
})

const fetchEstimate = async () => {
  if (isAmountEmpty.value || !isReady.value || !amountIsValid.value) {
    clearSellQuote()
    return
  }
  await fetchSellQuote({
    address: walletAddress.value ?? '',
    fiatCurrency: selectedFiat.value,
    amount: cryptoAmount.value,
    cryptoCurrency: tokenSymbol.value,
    chain: purchaseChainCode.value,
  })
}

const debouncedFetchEstimate = useDebounceFn(fetchEstimate, 500)

/* ------------------------------------------------------------------ *
 * CTA state
 * ------------------------------------------------------------------ */

const ctaIsPrimary = computed(() => !isReady.value || amountIsValid.value)

const ctaDisabled = computed(
  () =>
    isReady.value && (!amountIsValid.value || isFetchingSellQuote.value),
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
  if (isReady.value) {
    isFetchingSellQuote.value = Number(value) > 0 && !amountError.value
  }
  debouncedFetchEstimate()
}

watch(
  () => [
    purchaseChainCode.value,
    tokenSymbol.value,
    selectedFiat.value,
    isReady.value,
  ],
  () => {
    clearSellQuote()
    if (!isAmountEmpty.value && isReady.value) {
      isFetchingSellQuote.value = Number(cryptoAmount.value) > 0
      debouncedFetchEstimate()
    }
  },
)

const onSubmit = () => {
  if (!isReady.value) {
    accessStore.openAccessDialog()
    return
  }
  if (!amountIsValid.value) return
  showProviderModal.value = true
}
</script>