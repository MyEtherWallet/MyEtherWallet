<template>
  <div class="relative flex flex-col h-full">
    <purchase-unsupported-network
      v-if="showUnsupportedNetwork"
      :title="t('purchase.buy.network_not_supported')"
      :description="
        t('purchase.buy.network_not_available', {
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
        <purchase-token-picker
          v-if="displayChain"
          :chain="displayChain"
          :token="selectedToken"
          @click="showTokenModal = true"
        />
        <app-transaction-input-card
          :model-value="fiatAmount"
          :title="t('purchase.buy.you_are_paying')"
          :input-label="t('common.amount')"
          :conversion="`≈ ${formattedCryptoEstimate}`"
          :info-message="amountHelper || `≈ ${formattedCryptoEstimate}`"
          :error="!!amountError"
          :loading="isFetchingEstimate"
          :max-decimals="MAX_FIAT_DECIMALS"
          :quick-actions="quickActions"
          @update:model-value="onFiatAmountChange"
          @quick-action="onQuickAction"
          @focus="isInputFocused = true"
          @blur="isInputFocused = false"
        >
          <template #picker>
            <purchase-currency-picker
              :currency="selectedFiat"
              @click="showCurrencyModal = true"
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

      <div class="mt-auto pt-5 flex flex-col items-center gap-5">
        <purchase-footer />
      </div>
    </div>

    <purchase-token-modal
      v-model:is-open="showTokenModal"
      side="buy"
      :networks="buyNetworks"
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
    <buy-provider-modal
      v-model:is-open="showProviderModal"
      :quotes="buyQuotes"
      :fiat-amount="fiatAmount"
      :fiat-currency="selectedFiat"
      :crypto-currency="tokenSymbol"
      :token-icon="tokenIcon"
      :is-loading="isFetchingQuotes && !buyQuotes.length"
      :error="buyQuotesError"
      :analytics-payload="buyPayload"
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
import BigNumber from 'bignumber.js'

import PurchaseTokenPicker from './components/PurchaseTokenPicker.vue'
import PurchaseCurrencyPicker from './components/PurchaseCurrencyPicker.vue'
import PurchaseTokenModal from './components/PurchaseTokenModal.vue'
import PurchaseCurrencyModal from './components/PurchaseCurrencyModal.vue'
import BuyProviderModal from './components/BuyProviderModal.vue'
import { getSelectedTokenIcon } from './helpers/purchaseIcons'
import PurchaseFooter from './components/PurchaseFooter.vue'
import PurchaseUnsupportedNetwork from './components/PurchaseUnsupportedNetwork.vue'
import AppBaseButton from '@components/AppBaseButton.vue'
import AppTransactionInputCard from '@components/AppTransactionInputCard.vue'

import { usePurchaseStore } from '@/stores/purchaseStore'
import { useWalletStore } from '@/stores/walletStore'
import { useChainsStore } from '@/stores/chainsStore'
import { useGlobalStore } from '@/stores/globalStore'
import { useAccessStore } from '@/stores/accessStore'
import { useWalletMenuStore } from '@/stores/walletMenuStore'

import { formatFloatingPointValue } from '@/utils/numberFormatHelper'
import { getCurrencySymbol } from '@/utils/currencySymbols'
import { v7ToPurchaseChain, purchaseChainToChain } from './helpers/chainMapping'
import { usePurchaseAmount } from './composables/usePurchaseAmount'
import { usePurchaseCompatibility } from './composables/usePurchaseCompatibility'
import { useQuoteCountdown } from './composables/useQuoteCountdown'
import { useBlockedContent } from '@/composables/useBlockedContent'

import { type PurchaseAsset } from '@/types/buyToken'
import type { Chain } from '@/mew_api/types'
import { analytics, BuyEvent, BuyEventError } from '@/analytics'
import type { BuyPayloadShared } from '@/analytics'

const { t } = useI18n()

const purchaseStore = usePurchaseStore()
const {
  purchaseInfo,
  isFetching,
  buyNetworks,
  buyFiats,
  buyQuotes,
  isFetchingQuotes,
  buyQuotesError,
  buyQuotesExpiresAt,
  cryptoEstimate,
  isFetchingEstimate,
  exchangeRates,
  rateLimitedUntil,
  coinImages,
} = storeToRefs(purchaseStore)
const {
  fetchPurchaseInfo,
  fetchBuyQuotes,
  clearBuyQuotes,
  fetchBuyEstimate,
  clearBuyEstimate,
} = purchaseStore

const walletStore = useWalletStore()
const { isWalletConnected, isWatchOnly, walletAddress } =
  storeToRefs(walletStore)

const isReady = computed(() => isWalletConnected.value && !isWatchOnly.value)

const chainsStore = useChainsStore()
const { selectedChain: walletChain, chains } = storeToRefs(chainsStore)
const globalStore = useGlobalStore()

const { compatibleChainCodes, incompatibleChainCodes } =
  usePurchaseCompatibility(buyNetworks, walletChain, chains)

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

const DEFAULT_BUY_CHAIN = 'ETH'
const DEFAULT_FIAT = 'USD'
const MAX_FIAT_DECIMALS = 6

const fiatAmount = ref('')
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
    DEFAULT_BUY_CHAIN,
)

const tokenSymbol = computed<string>(
  () =>
    selectedToken.value?.symbol ?? displayChain.value?.currencyName ?? 'ETH',
)

const tokenIcon = computed(() =>
  getSelectedTokenIcon(
    selectedToken.value,
    displayChain.value,
    coinImages.value,
  ),
)

const walletMenu = useWalletMenuStore()

// Pre-populate the token when opened from a "Buy" button on the crypto/balance
// tables, which set the coingecko id in the wallet menu store. Prefers the
// asset on the wallet's chain; clears the id once applied.
const applyPreselectedToken = () => {
  const coinId = walletMenu.selectedPurchaseCoinId
  if (!coinId || !buyNetworks.value.length) return
  const candidates = buyNetworks.value
    .flatMap(network => network.tokens)
    .filter(token => token.coingecko_id === coinId)
    .filter(token => compatibleChainCodes.value.includes(token.chain))
  if (candidates.length) {
    const preferredChain = v7ToPurchaseChain(walletChain.value?.name)
    selectedToken.value =
      candidates.find(token => token.chain === preferredChain) ?? candidates[0]
  }
  walletMenu.setSelectedPurchaseCoinId(null)
}

onMounted(() => {
  fetchPurchaseInfo()
  applyPreselectedToken()
  analytics.trackBuyEvent(BuyEvent.SHOWN, buyPayload.value)
})

watch(
  [() => walletMenu.selectedPurchaseCoinId, buyNetworks],
  applyPreselectedToken,
)

const currencyOptions = computed(() => {
  const tokenProviders = selectedToken.value?.providers
  if (!tokenProviders?.length || !purchaseInfo.value?.providers) {
    return Array.from(buyFiats.value.keys())
  }
  const supportedFiats = new Set<string>()
  purchaseInfo.value.providers
    .filter(p => tokenProviders.includes(p.provider))
    .forEach(p => p.fiats_list.forEach(f => supportedFiats.add(f)))
  return Array.from(supportedFiats).filter(f => buyFiats.value.has(f))
})

// Providers that can quote the asset being bought (the chain's native token
// when none was picked), so limits only come from providers that support it.
const assetProviders = computed<string[]>(
  () =>
    selectedToken.value?.providers ??
    buyNetworks.value
      .find(network => network.chain === purchaseChainCode.value)
      ?.tokens.find(token => token.symbol === tokenSymbol.value)?.providers ??
    [],
)

const fiatLimits = computed(() => {
  const fallback = buyFiats.value.get(selectedFiat.value)?.limits ?? {
    min: 0,
    max: 0,
  }
  if (!assetProviders.value.length || !purchaseInfo.value?.providers) {
    return fallback
  }
  const limits = purchaseInfo.value.providers
    .filter(p => assetProviders.value.includes(p.provider))
    .flatMap(p => p.fiats)
    .filter(f => f.fiat_currency === selectedFiat.value)
    .map(f => f.limits)
  if (!limits.length) return fallback
  return {
    min: Math.min(...limits.map(l => l.min)),
    max: Math.max(...limits.map(l => l.max)),
  }
})

const USD_AMOUNTS = [25, 50, 100, 250]

const currencyRate = computed(() => exchangeRates.value.get(selectedFiat.value))

const formatAmount = (value: number): string => {
  const symbol = getCurrencySymbol(selectedFiat.value)
  const amount = value.toLocaleString('en-US')
  return symbol ? `${symbol}${amount}` : `${amount} ${selectedFiat.value}`
}

const minMaxButtons = (min: number, max: number) => [
  { label: t('purchase.min'), value: min, usdValue: min },
  { label: t('purchase.max'), value: max, usdValue: max },
]

const roundToStep = (value: number): number => {
  const step = value < 100 ? 5 : value < 1000 ? 10 : 50
  return Math.round(value / step) * step
}

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value))

const buildButtons = (ideal: number[], min: number, max: number) => {
  const rounded = ideal.map(v => clamp(roundToStep(v), min, max))
  const increasing = rounded.every((v, i) => i === 0 || v > rounded[i - 1])
  const values = increasing
    ? rounded
    : ideal.map(v => clamp(Math.round(v), min, max))
  // A narrow limit window can round several presets to the same amount.
  return [...new Set(values)].map(value => ({
    label: formatAmount(value),
    value,
    usdValue: value,
  }))
}

// Provider limits can carry more decimals than the input accepts: keep the
// presets inside the limits at that precision (min up, max down).
const limitAtPrecision = (value: number, roundUp: boolean): number =>
  new BigNumber(value)
    .decimalPlaces(
      MAX_FIAT_DECIMALS,
      roundUp ? BigNumber.ROUND_UP : BigNumber.ROUND_DOWN,
    )
    .toNumber()

const quickButtons = computed(() => {
  const rate = currencyRate.value
  const min = limitAtPrecision(fiatLimits.value.min, true)
  const max = limitAtPrecision(fiatLimits.value.max, false)
  if (!rate || max <= 0) return []

  const raw = USD_AMOUNTS.map(usd => Math.round(usd * rate))
  const largest = raw[raw.length - 1]

  if (largest >= 1000) return minMaxButtons(min, max)

  if (raw[0] >= min && largest <= max) return buildButtons(raw, min, max)

  const lower = Math.max(min, raw[0])
  const upper = Math.min(max, largest)
  if (upper <= lower) return minMaxButtons(min, max)

  const step = (upper - lower) / 3
  const ideal = [0, 1, 2, 3].map(i => (i === 3 ? upper : lower + step * i))
  return buildButtons(ideal, min, max)
})

const quickActions = computed(() =>
  quickButtons.value.map(btn => ({ key: btn.usdValue, label: btn.label })),
)

const onQuickAction = (usdValue: string | number) => {
  const btn = quickButtons.value.find(b => b.usdValue === usdValue)
  if (btn) onFiatAmountChange(String(btn.value))
}

const formattedCryptoEstimate = computed(() => {
  if (!cryptoEstimate.value) return `0.00 ${tokenSymbol.value}`.trim()
  return `${formatFloatingPointValue(cryptoEstimate.value).value} ${tokenSymbol.value}`.trim()
})

const buyPayload = computed<BuyPayloadShared>(() => {
  const rate = currencyRate.value
  const amountUSD =
    rate && rate > 0
      ? (Number(fiatAmount.value) / rate).toFixed(2)
      : fiatAmount.value
  return {
    network: displayChain.value?.name,
    token: tokenSymbol.value,
    currency: selectedFiat.value,
    amountUSD,
    amountOriginalCurrency: fiatAmount.value,
  }
})

const limitText = (value: number) =>
  `${getCurrencySymbol(selectedFiat.value)}${value}`

const {
  numericAmount,
  isEmpty: isAmountEmpty,
  violation: amountViolation,
  minHint: amountMinHint,
  isValid: amountIsValid,
} = usePurchaseAmount({
  amount: fiatAmount,
  limits: fiatLimits,
  isFocused: isInputFocused,
})

const hasNoQuotes = computed(
  () =>
    !isAmountEmpty.value &&
    amountIsValid.value &&
    !isFetchingEstimate.value &&
    !cryptoEstimate.value,
)

const amountError = computed(() => {
  if (hasNoQuotes.value) return t('purchase.buy.error.no_quotes')
  if (!amountViolation.value) return ''
  const { type, value } = amountViolation.value
  return t(`purchase.buy.error.${type}`, { [type]: limitText(value) })
})

const amountHelper = computed(() =>
  amountMinHint.value === null
    ? ''
    : t('purchase.buy.error.min', { min: limitText(amountMinHint.value) }),
)

const ctaDisabled = computed(
  () =>
    showUnsupportedNetwork.value ||
    (isReady.value &&
      (!amountIsValid.value ||
        isFetchingEstimate.value ||
        isFetchingQuotes.value ||
        hasNoQuotes.value)),
)

const ctaIsLoading = computed(
  () =>
    isReady.value &&
    amountIsValid.value &&
    (isFetchingEstimate.value || isFetchingQuotes.value),
)

const ctaLabel = computed(() => {
  if (!isReady.value) return t('purchase.buy.connect_wallet')
  if (amountError.value) return amountError.value
  if (amountIsValid.value) return t('purchase.buy.continue')
  return t('purchase.buy.enter_amount')
})

const fetchEstimate = async () => {
  if (isAmountEmpty.value || numericAmount.value <= 0) {
    clearBuyEstimate()
    return
  }
  await fetchBuyEstimate({
    fiatCurrency: selectedFiat.value,
    amount: fiatAmount.value,
    cryptoCurrency: tokenSymbol.value,
    chain: purchaseChainCode.value,
  })
  if (!amountIsValid.value) return
  if (cryptoEstimate.value) {
    analytics.trackBuyEvent(BuyEvent.PRELIMINARY_SHOWN, buyPayload.value)
  } else {
    analytics.trackBuyEventError(BuyEventError.PRELIMINARY_ERROR, {
      ...buyPayload.value,
      errorMsg: 'no_quotes',
    })
  }
}

const debouncedFetchEstimate = useDebounceFn(fetchEstimate, 500)

const onFiatAmountChange = (value: string) => {
  fiatAmount.value = value
  isFetchingEstimate.value = numericAmount.value > 0 && !amountViolation.value
  debouncedFetchEstimate()
}

watch(compatibleChainCodes, codes => {
  if (selectedToken.value && !codes.includes(selectedToken.value.chain)) {
    selectedToken.value = null
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

watch(selectedToken, token => {
  if (!token) return
  const tokenChain = purchaseChainToChain(token.chain, chains.value)
  if (tokenChain && tokenChain.name !== walletChain.value?.name) {
    globalStore.setSelectedNetwork(tokenChain.name)
  }
})

watch(currencyOptions, options => {
  if (options.length && !options.includes(selectedFiat.value)) {
    selectedFiat.value = options.includes(DEFAULT_FIAT)
      ? DEFAULT_FIAT
      : options[0]
  }
})

watch(selectedFiat, (newFiat, oldFiat) => {
  if (newFiat === oldFiat || isAmountEmpty.value) return
  const newRate = exchangeRates.value.get(newFiat)
  const oldRate = exchangeRates.value.get(oldFiat)
  if (!newRate || !oldRate) return
  const amountInUsd = Number(fiatAmount.value) / oldRate
  const converted = amountInUsd * newRate
  fiatAmount.value = converted.toFixed(2).replace(/\.?0+$/, '')
})

watch(
  () => [purchaseChainCode.value, tokenSymbol.value, selectedFiat.value],
  () => {
    cryptoEstimate.value = ''
    if (!isAmountEmpty.value) {
      isFetchingEstimate.value = numericAmount.value > 0
      debouncedFetchEstimate()
    }
  },
)

const buyQuoteParams = () => ({
  address: walletAddress.value ?? '',
  fiatCurrency: selectedFiat.value,
  amount: fiatAmount.value,
  cryptoCurrency: tokenSymbol.value,
  chain: purchaseChainCode.value,
})

const onSubmit = async () => {
  if (showUnsupportedNetwork.value) return
  if (!isReady.value) {
    accessStore.openAccessDialog()
    return
  }
  if (!amountIsValid.value) return

  analytics.trackBuyEvent(BuyEvent.CLICK_CONTINUE, buyPayload.value)

  clearBuyQuotes()
  showProviderModal.value = true

  await fetchBuyQuotes(buyQuoteParams())
}

const {
  isExpired: quoteExpired,
  cooldownSecondsLeft: quoteCooldownSeconds,
  countdownText: quoteCountdown,
} = useQuoteCountdown({
  expiresAt: buyQuotesExpiresAt,
  rateLimitedUntil,
  enabled: computed(
    () => showProviderModal.value && buyQuotes.value.length > 0,
  ),
  onExpire: () => {
    if (isFetchingQuotes.value) return
    fetchBuyQuotes(buyQuoteParams(), { silent: true })
  },
})
</script>
