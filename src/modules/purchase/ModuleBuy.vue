<template>
  <div class="flex flex-col gap-3 h-full">
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
      @update:amount="onFiatAmountChange"
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
      {{ t('purchase.buy.need_help') }}
    </a>

    <purchase-footer class="pt-2" />

    <purchase-token-modal
      v-model:is-open="showTokenModal"
      :networks="buyNetworks"
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
    <buy-provider-modal
      v-model:is-open="showProviderModal"
      :quotes="buyQuotes"
      :fiat-amount="fiatAmount"
      :fiat-currency="selectedFiat"
      :crypto-currency="tokenSymbol"
      :is-loading="isFetchingQuotes"
      :error="buyQuotesError"
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

import { usePurchaseStore } from '@/stores/purchaseStore'
import { useWalletStore } from '@/stores/walletStore'
import { useChainsStore } from '@/stores/chainsStore'
import { useAccessStore } from '@/stores/accessStore'

import { formatFloatingPointValue } from '@/utils/numberFormatHelper'
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
  buyNetworks,
  buyFiats,
  buyQuotes,
  isFetchingQuotes,
  buyQuotesError,
  cryptoEstimate,
  isFetchingEstimate,
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

onMounted(() => {
  fetchPurchaseInfo()
})

const currencyOptions = computed(() => Array.from(buyFiats.value.keys()))

const fiatLimits = computed(() => {
  const fiat = buyFiats.value.get(selectedFiat.value)
  return fiat?.limits ?? { min: 0, max: 0 }
})

const formattedCryptoEstimate = computed(() => {
  if (!cryptoEstimate.value) return `0.00 ${tokenSymbol.value}`.trim()
  return `${formatFloatingPointValue(cryptoEstimate.value).value} ${tokenSymbol.value}`.trim()
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

const amountError = computed(() => {
  if (!amountViolation.value) return ''
  const { type, value } = amountViolation.value
  return t(`purchase.buy.error.${type}`, { [type]: limitText(value) })
})

const amountHelper = computed(() =>
  amountMinHint.value === null
    ? ''
    : t('purchase.buy.error.min', { min: limitText(amountMinHint.value) }),
)

const ctaIsPrimary = computed(
  () => !isReady.value || amountIsValid.value,
)

const ctaDisabled = computed(
  () =>
    isReady.value &&
    (!amountIsValid.value || isFetchingEstimate.value || isFetchingQuotes.value),
)

const ctaIsLoading = computed(
  () => isReady.value && amountIsValid.value && isFetchingQuotes.value,
)

const ctaLabel = computed(() => {
  if (!isReady.value) return t('purchase.buy.connect_wallet')
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
}

const debouncedFetchEstimate = useDebounceFn(fetchEstimate, 500)

const onFiatAmountChange = (value: string) => {
  fiatAmount.value = value
  isFetchingEstimate.value = numericAmount.value > 0 && !amountError.value
  debouncedFetchEstimate()
}

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
  if (!isReady.value) {
    accessStore.openAccessDialog()
    return
  }
  if (!amountIsValid.value) return

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
