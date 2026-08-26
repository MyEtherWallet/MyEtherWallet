<template>
  <app-dialog
    v-model:is-open="isOpen"
    has-content-gutter
    class="sm:max-w-[480px] sm:mx-auto w-full"
  >
    <template #content>
      <div class="flex flex-col gap-8 pt-8 pb-8">
        <!-- Header -->
        <div class="flex flex-col gap-1 pr-10">
          <h2
            id="dialogTitle"
            class="text-s-28 font-bold leading-[32px] tracking-[-0.84px]"
          >
            {{ t('purchase.sell.provider.title', { amount: formattedCrypto }) }}
          </h2>
        </div>

        <!-- Loading -->
        <div
          v-if="isLoading"
          class="flex items-center justify-center py-16"
          aria-live="polite"
        >
          <span
            class="inline-block w-8 h-8 rounded-full border-2 border-grey-10 border-t-primary animate-spin"
          />
        </div>

        <!-- Error -->
        <p v-else-if="error" class="text-error text-s-14 text-center py-8">
          {{ error }}
        </p>

        <!-- Quote summary + CTA -->
        <template v-else-if="quote">
          <!-- Provider card (mirrors a single provider entry from BuyProviderModal) -->
          <div
            class="w-full flex items-center gap-4 p-4 rounded-16 bg-bgBase border-2 border-black"
          >
            <div
              class="flex flex-col gap-1 items-start flex-1 min-w-0 text-left"
            >
              <p
                class="text-s-16 font-semibold leading-[22px] tracking-[-0.32px] text-black"
              >
                {{ formattedFiat }}
              </p>
              <p
                class="text-s-16 font-semibold leading-[22px] tracking-[-0.32px] text-info"
              >
                ≈ {{ formattedCrypto }}
              </p>
            </div>
            <img
              v-if="providerLogo"
              :src="providerLogo"
              :alt="quote.provider"
              class="h-[18px] w-auto object-contain flex-none"
            />
          </div>

          <!-- Summary -->
          <div class="flex flex-col gap-2">
            <div class="flex items-center justify-between">
              <span class="text-s-12 text-info leading-[18px]">
                {{ t('purchase.sell.provider.youll_send') }}
              </span>
              <span class="text-s-12 font-semibold tracking-[-0.24px]">
                {{ formattedCrypto }}
              </span>
            </div>
            <div class="h-px bg-grey-10" />
            <div class="flex items-center justify-between">
              <span class="text-s-12 text-info leading-[18px]">
                {{ t('purchase.sell.provider.youll_receive') }}
              </span>
              <span class="text-s-12 font-semibold tracking-[-0.24px]">
                {{ formattedFiat }}
              </span>
            </div>
            <div class="h-px bg-grey-10" />
          </div>

          <!-- Quote freshness -->
          <p
            v-if="cooldownSeconds !== null"
            class="text-error text-s-12 text-center -my-4"
            aria-live="polite"
          >
            {{ t('purchase.quote.rate_limited', { seconds: cooldownSeconds }) }}
          </p>
          <p
            v-else-if="quoteExpired"
            class="text-info text-s-12 text-center -my-4"
            aria-live="polite"
          >
            {{ t('purchase.quote.expired_refreshing') }}
          </p>
          <p
            v-else-if="quoteCountdown"
            class="text-info text-s-12 text-center -my-4"
          >
            {{ t('purchase.quote.updates_in', { time: quoteCountdown }) }}
          </p>

          <!-- Continue CTA -->
          <app-base-button
            class="w-full h-12 text-s-16 font-semibold tracking-[-0.32px]"
            :disabled="quoteExpired"
            @click="onContinue"
          >
            <span class="flex items-center justify-center gap-2">
              {{ t('purchase.sell.provider.continue') }}
              <arrow-top-right-on-square-icon
                class="w-[22px] h-[22px] flex-none"
              />
            </span>
          </app-base-button>
          <p class="text-info text-s-12 text-center -mt-5">
            {{
              t('purchase.select_provider.redirect', {
                provider: providerNameFormatted,
              })
            }}
          </p>
        </template>
      </div>
    </template>
  </app-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/solid'
import AppDialog from '@/components/AppDialog.vue'
import AppBaseButton from '@components/AppBaseButton.vue'
import {
  formatFloatingPointValue,
  formatFiatValue,
} from '@/utils/numberFormatHelper'
import { getCurrencySymbol } from '@/utils/currencySymbols'
import { getProviderLogo } from '../helpers/purchaseProviders'
import type { SellQuote } from '@/types/buyToken'
import { analytics, SellOfferEvent, SellEventError } from '@/analytics'
import type { SellPayloadShared, SellOfferPayload } from '@/analytics'

const props = defineProps<{
  quote: SellQuote | null
  cryptoAmount: string
  cryptoSymbol: string
  isLoading: boolean
  error: string
  analyticsPayload: SellPayloadShared
  quoteCountdown: string
  quoteExpired: boolean
  cooldownSeconds: number | null
}>()

const isOpen = defineModel('isOpen', { type: Boolean, required: true })

const { t } = useI18n()

const buildOfferPayload = (): SellOfferPayload => ({
  ...props.analyticsPayload,
  moonpayRate: props.quote?.fiat_amount ?? '',
})

const offerShown = ref(false)
const errorTracked = ref(false)
const proceeded = ref(false)

watch(
  () => [isOpen.value, props.isLoading, props.quote, props.error],
  () => {
    if (!isOpen.value || props.isLoading) return
    if (props.quote && !offerShown.value) {
      offerShown.value = true
      analytics.trackSellEvent(SellOfferEvent.OFFER_SHOWN, buildOfferPayload())
    } else if (props.error && !errorTracked.value) {
      errorTracked.value = true
      analytics.trackSellEventError(SellEventError.OFFER_ERROR, {
        ...props.analyticsPayload,
        errorMsg: props.error,
      })
    }
  },
)

watch(isOpen, (open, wasOpen) => {
  if (wasOpen && !open) {
    if (offerShown.value && !proceeded.value) {
      analytics.trackSellEvent(SellOfferEvent.OFFER_CANCELED, buildOfferPayload())
    }
    offerShown.value = false
    errorTracked.value = false
    proceeded.value = false
  }
})

const formattedCrypto = computed(() => {
  const amount = props.quote?.crypto_amount ?? props.cryptoAmount
  if (!amount) return `0 ${props.cryptoSymbol}`
  return `${formatFloatingPointValue(amount).value} ${props.cryptoSymbol}`
})

const formattedFiat = computed(() => {
  if (!props.quote) return ''
  const symbol = getCurrencySymbol(props.quote.fiat_currency)
  return `${symbol}${formatFiatValue(props.quote.fiat_amount).value}`
})

const providerLogo = computed(() =>
  props.quote ? getProviderLogo(props.quote.provider) : undefined,
)

const onContinue = () => {
  if (props.quoteExpired || !props.quote?.url) return
  proceeded.value = true
  analytics.trackSellEvent(SellOfferEvent.OFFER_PROCEED, buildOfferPayload())
  window.open(props.quote.url, '_blank')
  isOpen.value = false
}

const providerNameFormatted = computed(() => {
  const providerName = props.quote?.provider.toLowerCase() ?? ''
  return providerName.charAt(0).toUpperCase() + providerName.slice(1)
})
</script>
