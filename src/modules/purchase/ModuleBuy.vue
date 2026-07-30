<template>
  <div class="relative flex flex-col h-full">
    <div :class="['flex flex-col gap-3 h-full', blurClass]">
      <purchase-token-select-card
        v-if="displayChain"
        :chain="displayChain"
        :token="selectedToken"
        @click="showTokenModal = true"
      />
      <purchase-amount-input
        :label="t('purchase.buy.youre_buying')"
        :currency="selectedFiat"
        :amount="fiatAmount"
        :estimate="formattedCryptoEstimate"
        :is-loading="isFetchingEstimate"
        :error-message="amountError"
        :helper-message="amountHelper"
        :quick-buttons="quickButtons"
        @update:amount="onFiatAmountChange"
        @open-currency="showCurrencyModal = true"
        @focus="isInputFocused = true"
        @blur="isInputFocused = false"
      />

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
        {{ t('purchase.buy.need_help') }}
      </a>

      <purchase-footer class="pt-2" />
    </div>

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
      class="absolute inset-x-2 top-[88px] z-20"
    />

    <purchase-token-modal
      v-model:is-open="showTokenModal"
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
      :is-loading="isFetchingQuotes"
      :error="buyQuotesError"
      :analytics-payload="buyPayload"
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
import BuyProviderModal from './components/BuyProviderModal.vue'
import PurchaseFooter from './components/PurchaseFooter.vue'
import PurchaseUnsupportedNetwork from './components/PurchaseUnsupportedNetwork.vue'
import AppBaseButton from '@components/AppBaseButton.vue'

import { usePurchaseStore } from '@/stores/purchaseStore'
import { useWalletStore } from '@/stores/walletStore'
import { useChainsStore } from '@/stores/chainsStore'
import { useGlobalStore } from '@/stores/globalStore'
import { useAccessStore } from '@/stores/accessStore'
import { useWalletMenuStore } from '@/stores/walletMenuStore'

import { formatFloatingPointValue } from '@/utils/numberFormatHelper'
import { getCurrencySymbol } from '@/utils/currencySymbols'
import {
  v7ToPurchaseChain,
  purchaseChainToChain,
} from './helpers/chainMapping'
import { usePurchaseAmount } from './composables/usePurchaseAmount'
import { usePurchaseCompatibility } from './composables/usePurchaseCompatibility'

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
  cryptoEstimate,
  isFetchingEstimate,
  exchangeRates,
} = storeToRefs(purchaseStore)
const {
  fetchPurchaseInfo,
  fetchBuyQuotes,
  clearBuyQuotes,
  fetchBuyEstimate,
  clearBuyEstimate,
} = purchaseStore

const walletStore = useWalletStore()
const { isWalletConnected, isWatchOnly, walletAddress } = storeToRefs(walletStore)

const isReady = computed(() => isWalletConnected.value && !isWatchOnly.value)

const chainsStore = useChainsStore()
const { selectedChain: walletChain, chains } = storeToRefs(chainsStore)
const globalStore = useGlobalStore()

const { compatibleChainCodes, incompatibleChainCodes } = usePurchaseCompatibility(buyNetworks, walletChain, chains)

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

const blurClass = computed(() =>
  showUnsupportedNetwork.value ? 'blur-sm pointer-events-none opacity-60' : '',
)

const accessStore = useAccessStore()

const DEFAULT_BUY_CHAIN = 'ETH'
const DEFAULT_FIAT = 'USD'

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

watch([() => walletMenu.selectedPurchaseCoinId, buyNetworks], applyPreselectedToken)

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

const fiatLimits = computed(() => {
  const fiat = buyFiats.value.get(selectedFiat.value)
  return fiat?.limits ?? { min: 0, max: 0 }
})

const USD_AMOUNTS = [15, 50, 100, 250]
const MIN_USD = 2
const MAX_USD = 250

const currencyRate = computed(() => exchangeRates.value.get(selectedFiat.value))

const formatLocalizedAmount = (usd: number, rate: number): string => {
  const value = Math.round(usd * rate)
  const symbol = getCurrencySymbol(selectedFiat.value)
  return `${symbol}${value.toLocaleString('en-US')}`
}

const quickButtons = computed(() => {
  const rate = currencyRate.value
  if (!rate) return []
  if (Math.round(15 * rate) >= 1) {
    return USD_AMOUNTS.map(usd => ({
      label: formatLocalizedAmount(usd, rate),
      value: Math.round(usd * rate),
      usdValue: usd,
    }))
  }
  return [
    {
      label: t('purchase.min'),
      value: Math.round(MIN_USD * rate),
      usdValue: MIN_USD,
    },
    {
      label: t('purchase.max'),
      value: Math.round(MAX_USD * rate),
      usdValue: MAX_USD,
    },
  ]
})

const formattedCryptoEstimate = computed(() => {
  if (!cryptoEstimate.value) return `0.00 ${tokenSymbol.value}`.trim()
  return `${formatFloatingPointValue(cryptoEstimate.value).value} ${tokenSymbol.value}`.trim()
})

const buyPayload = computed<BuyPayloadShared>(() => {
  const rate = currencyRate.value
  const amountUSD =
    rate && rate > 0 ? (Number(fiatAmount.value) / rate).toFixed(2) : fiatAmount.value
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
  if (hasNoQuotes.value) return t('purchase.buy.no_quotes')
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
    selectedFiat.value = options.includes(DEFAULT_FIAT) ? DEFAULT_FIAT : options[0]
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

  await fetchBuyQuotes({
    address: walletAddress.value ?? '',
    fiatCurrency: selectedFiat.value,
    amount: fiatAmount.value,
    cryptoCurrency: tokenSymbol.value,
    chain: purchaseChainCode.value,
  })
}
</script>
