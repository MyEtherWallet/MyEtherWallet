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

    <div :class="['flex flex-col h-full', blockedClass]">
      <div class="flex flex-col gap-2">
        <purchase-currency-picker
          :currency="selectedFiat"
          size="l"
          @click="showCurrencyModal = true"
        />
        <app-transaction-input-card
          :model-value="cryptoAmount"
          :title="t('purchase.sell.you_are_selling')"
          :input-label="t('common.amount')"
          :conversion="`≈ ${formattedFiatEstimate}`"
          :info-message="amountHelper || `≈ ${formattedFiatEstimate}`"
          :error="!!amountError"
          :loading="isFetchingSellQuote"
          :max-decimals="SELL_MAX_DECIMALS"
          :balance="balanceText"
          :balance-error="isInsufficientBalance"
          :quick-actions="quickActions"
          @update:model-value="onCryptoAmountChange"
          @quick-action="onQuickAction"
          @focus="isInputFocused = true"
          @blur="isInputFocused = false"
        >
          <template #picker>
            <purchase-token-picker
              v-if="displayChain"
              :chain="displayChain"
              :token="selectedToken"
              size="s"
              @click="showTokenModal = true"
            />
          </template>
        </app-transaction-input-card>
      </div>

      <app-base-button
        class="w-full mt-5"
        :disabled="ctaDisabled && !ctaIsLoading"
        :is-loading="ctaIsLoading"
        @click="onSubmit"
      >
        {{ ctaLabel }}
      </app-base-button>

      <div class="mt-auto pt-5 flex justify-center">
        <app-base-button type="link" size="small" @click="openHelpCenter">
          {{ t('purchase.sell.need_help') }}
        </app-base-button>
      </div>

      <div class="hidden">
        <app-select-tx-fee
          ref="feeSelector"
          v-model:selected-fee-native-value="selectedFeeNativeValue"
        />
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
      :is-loading="isFetchingSellQuote && !sellQuote"
      :error="sellQuoteError"
      :analytics-payload="sellPayload"
      :quote-countdown="quoteCountdown"
      :quote-expired="quoteExpired"
      :cooldown-seconds="quoteCooldownSeconds"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useDebounceFn } from '@vueuse/core'

import PurchaseTokenPicker from './components/PurchaseTokenPicker.vue'
import PurchaseCurrencyPicker from './components/PurchaseCurrencyPicker.vue'
import PurchaseTokenModal from './components/PurchaseTokenModal.vue'
import PurchaseCurrencyModal from './components/PurchaseCurrencyModal.vue'
import SellProviderModal from './components/SellProviderModal.vue'
import PurchaseUnsupportedNetwork from './components/PurchaseUnsupportedNetwork.vue'
import AppSelectTxFee from '@/components/AppSelectTxFee.vue'
import AppBaseButton from '@components/AppBaseButton.vue'
import AppTransactionInputCard from '@components/AppTransactionInputCard.vue'

import { usePurchaseStore } from '@/stores/purchaseStore'
import { useWalletStore } from '@/stores/walletStore'
import { useChainsStore } from '@/stores/chainsStore'
import { useGlobalStore } from '@/stores/globalStore'
import { useAccessStore } from '@/stores/accessStore'

import {
  formatFloatingPointValue,
  formatFiatValue,
} from '@/utils/numberFormatHelper'
import { getCurrencySymbol } from '@/utils/currencySymbols'
import { v7ToPurchaseChain, purchaseChainToChain } from './helpers/chainMapping'
import { usePurchaseAmount } from './composables/usePurchaseAmount'
import { usePurchaseCompatibility } from './composables/usePurchaseCompatibility'
import { useQuoteCountdown } from './composables/useQuoteCountdown'
import {
  getPercentAmount,
  SELL_MAX_DECIMALS,
  SELL_PERCENT_PRESETS,
} from './helpers/percentAmount'
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
  sellQuoteExpiresAt,
  exchangeRates,
  rateLimitedUntil,
} = storeToRefs(purchaseStore)
const { fetchPurchaseInfo, fetchSellQuote, clearSellQuote } = purchaseStore

const walletStore = useWalletStore()
const {
  isWalletConnected,
  isWatchOnly,
  walletAddress,
  tokens,
  balance: nativeBalance,
  safeMainTokenBalance,
  isLoadingBalances,
} = storeToRefs(walletStore)

const isReady = computed(() => isWalletConnected.value && !isWatchOnly.value)

const chainsStore = useChainsStore()
const { selectedChain: walletChain, chains } = storeToRefs(chainsStore)
const globalStore = useGlobalStore()

const { compatibleChainCodes, incompatibleChainCodes } =
  usePurchaseCompatibility(sellNetworks, walletChain, chains)

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
const HELP_CENTER_URL = 'https://help.myetherwallet.com/'

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
 * otherwise → look up the ERC-20 in `tokens`.
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
    t =>
      t.contract.toLowerCase() ===
      selectedToken.value?.contract_address.toLowerCase(),
  )
  if (found) return found.balance
  if (isLoadingBalances.value) return null
  // Not in the balance list: 0 if it's the wallet's chain, unknown otherwise.
  const tokenChain = purchaseChainToChain(
    selectedToken.value.chain,
    chains.value,
  )
  return tokenChain?.name === walletChain.value?.name ? '0' : null
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

const balanceText = computed(() =>
  tokenBalance.value
    ? t('purchase.sell.balance', {
        amount: `${formatFloatingPointValue(tokenBalance.value).value} ${tokenSymbol.value}`,
      })
    : '',
)

/* ------------------------------------------------------------------ *
 * Quick actions — % of the balance. At 100% of the native token the
 * estimated network fee is reserved so the transfer can pay for gas.
 * ------------------------------------------------------------------ */

const feeSelector = ref<InstanceType<typeof AppSelectTxFee> | null>(null)
const selectedFeeNativeValue = ref('0')

// The native 100% preset reserves the fee, so it waits until the fee is known.
const isFeeLoaded = computed(
  () => !!feeSelector.value?.hasFees && selectedFeeNativeValue.value !== '0',
)

// Same lookup as `tokenBalance`, in base units so the share stays exact.
const rawTokenBalance = computed<{
  value: bigint
  decimals: number
  isNative: boolean
} | null>(() => {
  if (tokenBalance.value === null) return null
  const isNative =
    !selectedToken.value ||
    walletChain.value?.currencyName === selectedToken.value.symbol
  if (isNative) {
    const main = safeMainTokenBalance.value
    if (!main) return null
    return {
      value: BigInt(main.balanceWei || '0'),
      decimals: main.decimals ?? 18,
      isNative: true,
    }
  }
  const found = tokens.value.find(
    tok =>
      tok.contract.toLowerCase() ===
      selectedToken.value?.contract_address.toLowerCase(),
  )
  if (!found || found.decimals === undefined) return null
  return {
    value: BigInt(found.balanceWei || '0'),
    decimals: found.decimals,
    isNative: false,
  }
})

const quickActions = computed(() =>
  SELL_PERCENT_PRESETS.map(percent => ({
    key: percent,
    label: `${percent}%`,
    disabled:
      !rawTokenBalance.value ||
      rawTokenBalance.value.value === 0n ||
      (percent === 100 && rawTokenBalance.value.isNative && !isFeeLoaded.value),
  })),
)

const onQuickAction = (percent: string | number) => {
  const raw = rawTokenBalance.value
  if (!raw) return
  onCryptoAmountChange(
    getPercentAmount({
      balance: raw.value,
      decimals: raw.decimals,
      percent: Number(percent),
      fee: BigInt(selectedFeeNativeValue.value || '0'),
      isNative: raw.isNative,
    }),
  )
}

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

const sellQuoteParams = () => ({
  address: walletAddress.value || ESTIMATE_FALLBACK_ADDRESS,
  fiatCurrency: selectedFiat.value,
  amount: cryptoAmount.value,
  cryptoCurrency: tokenSymbol.value,
  chain: purchaseChainCode.value,
})

const fetchEstimate = async () => {
  if (isAmountEmpty.value || Number(cryptoAmount.value) <= 0) {
    clearSellQuote()
    return
  }
  await fetchSellQuote(sellQuoteParams())
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
 * Quote expiration — the sell estimate is the actual quote used for
 * the Moonpay redirect, so it silently refreshes while it is on screen.
 * ------------------------------------------------------------------ */

const {
  isExpired: quoteExpired,
  cooldownSecondsLeft: quoteCooldownSeconds,
  countdownText: quoteCountdown,
} = useQuoteCountdown({
  expiresAt: sellQuoteExpiresAt,
  rateLimitedUntil,
  enabled: computed(() => !!sellQuote.value && amountIsValid.value),
  onExpire: () => {
    if (isFetchingSellQuote.value) return
    fetchSellQuote(sellQuoteParams(), { silent: true })
  },
})

/* ------------------------------------------------------------------ *
 * CTA state
 * ------------------------------------------------------------------ */

const ctaDisabled = computed(
  () =>
    showUnsupportedNetwork.value ||
    (isReady.value &&
      (!amountIsValid.value ||
        isFetchingSellQuote.value ||
        quoteExpired.value)),
)

const ctaIsLoading = computed(
  () => isReady.value && amountIsValid.value && isFetchingSellQuote.value,
)

const ctaLabel = computed(() => {
  if (!isReady.value) return t('purchase.sell.connect_wallet')
  if (quoteExpired.value && quoteCooldownSeconds.value !== null) {
    return t('purchase.quote.rate_limited', {
      seconds: quoteCooldownSeconds.value,
    })
  }
  if (amountError.value) return amountError.value
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

const openHelpCenter = () => {
  window.open(HELP_CENTER_URL, '_blank', 'noopener')
}

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
