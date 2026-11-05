<template>
  <app-modal
    v-model="isOpen"
    :title="t('purchase.select_provider.review_title')"
  >
    <div class="flex flex-col gap-6 p-6">
      <div
        v-if="isLoading"
        class="flex items-center justify-center py-16"
        aria-live="polite"
      >
        <app-spinner />
      </div>

      <p
        v-else-if="error"
        class="py-8 text-center text-text-sm text-text-error"
      >
        {{ error }}
      </p>

      <template v-else-if="quotes.length">
        <div class="flex flex-col gap-8 pb-6">
          <div class="flex flex-col gap-3">
            <p class="text-label-base text-text-default">
              {{ t('purchase.select_provider.provider') }}
            </p>
            <app-dropdown :title="providerLabel(selectedQuote)" bordered>
              <template #avatar="{ size }">
                <app-avatar
                  type="cryptoAsset"
                  :size="size"
                  :url="getProviderIcon(selectedQuote?.provider)"
                  :symbol="providerLabel(selectedQuote)"
                />
              </template>
              <template v-if="selectedIndex === 0" #suffix>
                <app-tag
                  type="success"
                  variant="contrast"
                  leading-icon="check-badge"
                  :label="t('purchase.select_provider.best_value')"
                />
              </template>
              <app-cell
                v-for="(quote, index) in quotes"
                :key="quote.provider"
                size="small"
                inset
                role="option"
                :aria-selected="selectedIndex === index"
                :selected="selectedIndex === index"
                :title="providerLabel(quote)"
                :right-accessory="{
                  kind: 'balance',
                  primary: `${formattedCryptoAmount(quote)} ${quote.crypto_currency}`,
                  secondary: `≈ ${formattedFiatReceive(quote)}`,
                }"
                @click="selectedIndex = index"
              >
                <template #avatar="{ size }">
                  <app-avatar
                    type="cryptoAsset"
                    :size="size"
                    :url="getProviderIcon(quote.provider)"
                    :symbol="providerLabel(quote)"
                  />
                </template>
              </app-cell>
            </app-dropdown>
          </div>

          <div class="flex flex-col gap-3">
            <p class="text-label-base text-text-default">
              {{ t('purchase.select_provider.summary') }}
            </p>
            <div
              class="flex w-full flex-col gap-4 overflow-hidden rounded-16 bg-background-default p-4"
            >
              <div class="flex items-center gap-3">
                <app-content-group
                  :title="t('purchase.select_provider.youre_paying')"
                  class="flex-1"
                />
                <app-content-group
                  :title="formattedFiatAmount"
                  align="right"
                  class="flex-1"
                />
                <app-token-logo
                  :url="getFiatIcon(fiatCurrency)"
                  :symbol="fiatCurrency"
                  cover
                  width="w-10"
                  height="h-10"
                  no-shadow
                />
              </div>
              <app-divider variant="alternative" class="-my-1" />
              <div v-if="selectedQuote" class="flex items-center gap-3">
                <app-content-group
                  :title="t('purchase.select_provider.expected_to_receive')"
                  class="flex-1"
                />
                <app-content-group
                  :title="`${formattedCryptoAmount(selectedQuote)} ${selectedQuote.crypto_currency}`"
                  :description="`≈ ${formattedFiatReceive(selectedQuote)}`"
                  align="right"
                  class="flex-1"
                />
                <app-token-logo
                  :url="tokenIcon"
                  :symbol="cryptoCurrency"
                  width="w-10"
                  height="h-10"
                  no-shadow
                />
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-col items-center gap-4">
          <app-base-button
            class="w-full"
            :disabled="quoteExpired"
            @click="onContinue"
          >
            {{ t('purchase.select_provider.confirm') }}
          </app-base-button>
          <purchase-quote-status
            :quote-countdown="quoteCountdown"
            :quote-expired="quoteExpired"
            :cooldown-seconds="cooldownSeconds"
          />
        </div>
      </template>
    </div>
  </app-modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import AppTag from '@/components/tag/AppTag.vue'
import AppModal from '@/components/modal/AppModal.vue'
import AppBaseButton from '@components/AppBaseButton.vue'
import AppDropdown from '@/components/dropdown/AppDropdown.vue'
import AppCell from '@/components/cell/AppCell.vue'
import AppContentGroup from '@/components/content_group/AppContentGroup.vue'
import AppAvatar from '@/components/avatar/AppAvatar.vue'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import AppSpinner from '@/components/spinner/AppSpinner.vue'
import PurchaseQuoteStatus from './PurchaseQuoteStatus.vue'
import { getFiatIcon } from '../helpers/purchaseIcons'
import {
  formatFloatingPointValue,
  formatFiatValue,
} from '@/utils/numberFormatHelper'
import { getCurrencySymbol } from '@/utils/currencySymbols'
import {
  formatProviderName,
  getProviderIcon,
} from '../helpers/purchaseProviders'
import type { BuyQuote } from '@/types/buyToken'
import { analytics, BuyOfferEvent, BuyEventError } from '@/analytics'
import type {
  BuyPayloadShared,
  BuyOfferPayloadShared,
  ProviderName,
} from '@/analytics'
import AppDivider from '@/components/divider/AppDivider.vue'

const props = defineProps<{
  quotes: BuyQuote[]
  fiatAmount: string
  fiatCurrency: string
  cryptoCurrency: string
  tokenIcon?: string
  isLoading: boolean
  error: string
  analyticsPayload: BuyPayloadShared
  quoteCountdown: string
  quoteExpired: boolean
  cooldownSeconds: number | null
}>()

const isOpen = defineModel('isOpen', { type: Boolean, required: true })

const { t } = useI18n()
const selectedIndex = ref(0)

// On a silent refresh, keep the provider the user selected; fall back to the
// best-value quote when it is no longer offered (or on a fresh quote set).
watch(
  () => props.quotes,
  (quotes, oldQuotes) => {
    const previous = oldQuotes?.[selectedIndex.value]?.provider
    const index = previous ? quotes.findIndex(q => q.provider === previous) : -1
    selectedIndex.value = index >= 0 ? index : 0
  },
)

const buildOfferPayload = (): BuyOfferPayloadShared => {
  const rateOf = (name: string) =>
    props.quotes.find(q => q.provider.toLowerCase() === name)?.crypto_amount
  const best = props.quotes[0]
  const selected = selectedQuote.value
  return {
    ...props.analyticsPayload,
    MoonpayRate: rateOf('moonpay'),
    SimplexRate: rateOf('simplex'),
    TopperRate: rateOf('topper'),
    CoinbaseRate: rateOf('coinbase'),
    bestProviderRate: best?.provider.toLowerCase() ?? '',
    selectedRate: selected?.crypto_amount ?? '',
    selectedProvider: (selected?.provider.toLowerCase() ??
      'moonpay') as ProviderName,
  }
}

const offerShown = ref(false)
const errorTracked = ref(false)
const proceeded = ref(false)

watch(
  () => [isOpen.value, props.isLoading, props.quotes.length, props.error],
  () => {
    if (!isOpen.value || props.isLoading) return
    if (props.quotes.length && !offerShown.value) {
      offerShown.value = true
      analytics.trackBuyEvent(BuyOfferEvent.OFFER_SHOWN, buildOfferPayload())
    } else if (props.error && !errorTracked.value) {
      errorTracked.value = true
      analytics.trackBuyEventError(BuyEventError.OFFER_ERROR, {
        ...props.analyticsPayload,
        errorMsg: props.error,
      })
    }
  },
)

watch(isOpen, (open, wasOpen) => {
  if (wasOpen && !open) {
    if (offerShown.value && !proceeded.value) {
      analytics.trackBuyEvent(BuyOfferEvent.OFFER_CANCELED, buildOfferPayload())
    }
    offerShown.value = false
    errorTracked.value = false
    proceeded.value = false
  }
})

const selectedQuote = computed(() =>
  props.quotes.length ? props.quotes[selectedIndex.value] : null,
)

const formattedFiatAmount = computed(() => {
  const symbol = getCurrencySymbol(props.fiatCurrency)
  return `${symbol}${props.fiatAmount}`
})

const formattedCryptoAmount = (quote: BuyQuote) =>
  formatFloatingPointValue(quote.crypto_amount).value

const formattedFiatReceive = (quote: BuyQuote) => {
  const symbol = getCurrencySymbol(quote.fiat_currency)
  return `${symbol}${formatFiatValue(quote.fiat_amount).value}`
}

const onContinue = () => {
  if (props.quoteExpired || !selectedQuote.value?.url) return
  proceeded.value = true
  analytics.trackBuyEvent(BuyOfferEvent.OFFER_PROCEED, buildOfferPayload())
  window.open(selectedQuote.value.url, '_blank')
  isOpen.value = false
}
const providerLabel = (quote: BuyQuote | null) =>
  quote ? formatProviderName(quote.provider) : ''
</script>
