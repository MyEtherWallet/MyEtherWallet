<template>
  <app-dialog
    v-model:is-open="isOpen"
    has-content-gutter
    class="sm:max-w-[480px] sm:mx-auto w-full"
  >
    <template #content>
      <div class="flex flex-col gap-8 pt-8 pb-8">
        <!-- Header (close button is rendered by AppDialog at top-4 right-4) -->
        <div class="flex flex-col gap-1 pr-10">
          <h2
            id="dialogTitle"
            class="text-s-28 font-bold leading-[32px] tracking-[-0.84px]"
          >
            {{ t('purchase.select_provider.title', { amount: formattedFiatAmount }) }}
          </h2>
          <p class="text-s-16 text-info leading-[22px]">
            {{ t('purchase.select_provider.subtitle', { crypto: cryptoCurrency }) }}
          </p>
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

        <!-- Quotes + summary + CTA -->
        <template v-else-if="quotes.length">
          <!-- Provider cards (pt-3 reserves room for the "Best value" badge that overflows -14px) -->
          <div class="flex flex-col gap-2 pt-3">
            <div
              v-for="(quote, index) in quotes"
              :key="quote.provider"
              class="relative"
            >
              <span
                v-if="index === 0"
                class="absolute -top-[14px] left-1/2 -translate-x-1/2 bg-success text-white text-s-14 font-semibold leading-[20px] tracking-[-0.28px] px-1.5 py-0.5 rounded-[5px] whitespace-nowrap z-10"
              >
                {{ t('purchase.select_provider.best_value') }}
              </span>
              <button
                type="button"
                :class="[
                  'w-full flex items-center gap-4 p-4 rounded-16 bg-bgBase transition-colors hoverNoBG',
                  selectedIndex === index
                    ? 'border-2 border-black'
                    : 'border-2 border-transparent',
                ]"
                @click="selectedIndex = index"
              >
                <!-- Amounts -->
                <div
                  class="flex flex-col gap-1 items-start flex-1 min-w-0 text-left"
                >
                  <p
                    class="text-s-16 font-semibold leading-[22px] tracking-[-0.32px] text-black"
                  >
                    {{ formattedCryptoAmount(quote) }} {{ quote.crypto_currency }}
                  </p>
                  <p
                    class="text-s-16 font-semibold leading-[22px] tracking-[-0.32px] text-info"
                  >
                    ≈ {{ formattedFiatReceive(quote) }}
                  </p>
                </div>

                <!-- Right: payment methods + provider logo -->
                <div class="flex flex-col gap-3 items-end flex-none">
                  <div class="flex items-center gap-0.5">
                    <div
                      v-for="method in getPaymentMethodIcons(quote.payment_methods)"
                      :key="method.alt"
                      class="bg-white border border-grey-10 rounded-[3px] w-[27px] h-[18px] overflow-hidden flex items-center justify-center"
                    >
                      <img
                        :src="method.src"
                        :alt="method.alt"
                        class="max-w-[19px] max-h-[14px] object-contain"
                      />
                    </div>
                  </div>
                  <img
                    v-if="getProviderLogo(quote.provider)"
                    :src="getProviderLogo(quote.provider)"
                    :alt="quote.provider"
                    class="h-[18px] w-auto object-contain"
                  />
                </div>
              </button>
            </div>
          </div>

          <!-- Summary -->
          <div class="flex flex-col gap-2">
            <div class="flex items-center justify-between">
              <span class="text-s-12 text-info leading-[18px]">
                {{ t('purchase.select_provider.youll_pay') }}
              </span>
              <span class="text-s-12 font-semibold tracking-[-0.24px]">
                {{ formattedFiatAmount }}
              </span>
            </div>
            <div class="h-px bg-grey-10" />
            <div class="flex items-center justify-between">
              <span class="text-s-12 text-info leading-[18px]">
                {{ t('purchase.select_provider.youll_receive') }}
              </span>
              <span class="text-s-12 font-semibold tracking-[-0.24px]">
                {{
                  selectedQuote
                    ? `${formattedCryptoAmount(selectedQuote)} ${selectedQuote.crypto_currency}`
                    : ''
                }}
                <span class="text-info font-normal">
                  {{
                    selectedQuote
                      ? `(≈ ${formattedFiatReceive(selectedQuote)})`
                      : ''
                  }}
                </span>
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
            {{ t('purchase.select_provider.continue') }}
            <arrow-top-right-on-square-icon class="w-[22px] h-[22px] flex-none" />
          </button>
        </template>
      </div>
    </template>
  </app-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/solid'
import AppDialog from '@/components/AppDialog.vue'
import { formatFloatingPointValue, formatFiatValue } from '@/utils/numberFormatHelper'
import { getCurrencySymbol } from '@/utils/currencySymbols'
import {
  getProviderLogo,
  getPaymentMethodIcons,
} from '../helpers/purchaseProviders'
import type { BuyQuote } from '@/types/buyToken'

const props = defineProps<{
  quotes: BuyQuote[]
  fiatAmount: string
  fiatCurrency: string
  cryptoCurrency: string
  isLoading: boolean
  error: string
}>()

const isOpen = defineModel('isOpen', { type: Boolean, required: true })

const { t } = useI18n()
const selectedIndex = ref(0)

watch(
  () => props.quotes,
  () => { selectedIndex.value = 0 },
)

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
  if (!selectedQuote.value?.url) return
  window.open(selectedQuote.value.url, '_blank', 'noopener,noreferrer')
  isOpen.value = false
}
</script>
