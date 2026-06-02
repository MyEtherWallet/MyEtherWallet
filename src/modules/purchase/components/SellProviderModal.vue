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
        <p
          v-else-if="error"
          class="text-error text-s-14 text-center py-8"
        >
          {{ error }}
        </p>

        <!-- Quote summary + CTA -->
        <template v-else-if="quote">
          <!-- Provider card (mirrors a single provider entry from BuyProviderModal) -->
          <div
            class="w-full flex items-center gap-4 p-4 rounded-16 bg-bgBase border-2 border-black"
          >
            <div class="flex flex-col gap-1 items-start flex-1 min-w-0 text-left">
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

          <!-- Continue CTA -->
          <button
            type="button"
            class="h-12 w-full rounded-24 px-4 bg-primary text-white flex items-center justify-center gap-2 font-semibold text-s-16 tracking-[-0.32px] hoverOpacityHasBG transition-colors"
            @click="onContinue"
          >
            {{ t('purchase.sell.provider.continue') }}
            <arrow-top-right-on-square-icon class="w-[22px] h-[22px] flex-none" />
          </button>
        </template>
      </div>
    </template>
  </app-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/solid'
import AppDialog from '@/components/AppDialog.vue'
import { formatFloatingPointValue, formatFiatValue } from '@/utils/numberFormatHelper'
import { getCurrencySymbol } from '@/utils/currencySymbols'
import { getProviderLogo } from '../helpers/purchaseProviders'
import type { SellQuote } from '@/types/buyToken'

const props = defineProps<{
  quote: SellQuote | null
  cryptoAmount: string
  cryptoSymbol: string
  isLoading: boolean
  error: string
}>()

const isOpen = defineModel('isOpen', { type: Boolean, required: true })

const { t } = useI18n()

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
  if (!props.quote?.url) return
  window.open(props.quote.url, '_blank', 'noopener,noreferrer')
  isOpen.value = false
}
</script>