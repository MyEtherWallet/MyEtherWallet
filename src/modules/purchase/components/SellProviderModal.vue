<template>
  <app-modal v-model="isOpen" :title="t('purchase.sell.provider.review_title')">
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

      <template v-else-if="quote">
        <div class="flex flex-col gap-8 pb-6">
          <div class="flex flex-col gap-3">
            <p class="text-label-base text-text-default">
              {{ t('purchase.select_provider.provider') }}
            </p>
            <!-- Sell gets a single quote, so it's the only option. -->
            <app-dropdown :title="providerName" bordered>
              <template #avatar="{ size }">
                <app-avatar
                  type="cryptoAsset"
                  :size="size"
                  :url="getProviderIcon(quote?.provider)"
                  :symbol="providerName"
                />
              </template>
              <template #suffix>
                <app-tag
                  type="success"
                  variant="contrast"
                  leading-icon="check-badge"
                  :label="t('purchase.select_provider.best_value')"
                />
              </template>
              <app-cell
                size="small"
                inset
                role="option"
                aria-selected="true"
                selected
                :title="providerName"
                :right-accessory="{ kind: 'balance', primary: formattedFiat }"
              >
                <template #avatar="{ size }">
                  <app-avatar
                    type="cryptoAsset"
                    :size="size"
                    :url="getProviderIcon(quote?.provider)"
                    :symbol="providerName"
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
                  :title="formattedCrypto"
                  :description="cryptoFiat ? `≈ ${cryptoFiat}` : undefined"
                  align="right"
                  class="flex-1"
                />
                <app-token-logo
                  :url="tokenIcon"
                  :symbol="cryptoSymbol"
                  width="w-10"
                  height="h-10"
                  no-shadow
                />
              </div>
              <app-divider variant="alternative" class="-my-1" />
              <div class="flex items-center gap-3">
                <app-content-group
                  :title="t('purchase.select_provider.expected_to_receive')"
                  class="flex-1"
                />
                <app-content-group
                  :title="formattedFiat"
                  align="right"
                  class="flex-1"
                />
                <app-token-logo
                  :url="getFiatIcon(quote.fiat_currency)"
                  :symbol="quote.fiat_currency"
                  cover
                  width="w-10"
                  height="h-10"
                  no-shadow
                />
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-3">
            <p class="text-label-base text-text-default">
              {{ t('common.network_fee') }}
            </p>
            <app-select-tx-fee :reset-to-default="false" dropdown />
          </div>
        </div>

        <div class="flex flex-col items-center gap-4">
          <app-base-button
            class="w-full"
            :disabled="quoteExpired"
            @click="onContinue"
          >
            {{ t('purchase.sell.provider.confirm') }}
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
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import AppModal from '@/components/modal/AppModal.vue'
import AppBaseButton from '@components/AppBaseButton.vue'
import AppDropdown from '@/components/dropdown/AppDropdown.vue'
import AppCell from '@/components/cell/AppCell.vue'
import AppContentGroup from '@/components/content_group/AppContentGroup.vue'
import AppAvatar from '@/components/avatar/AppAvatar.vue'
import AppTag from '@/components/tag/AppTag.vue'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import AppSpinner from '@/components/spinner/AppSpinner.vue'
import AppSelectTxFee from '@/components/AppSelectTxFee.vue'
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
import type { SellQuote } from '@/types/buyToken'
import { analytics, SellOfferEvent, SellEventError } from '@/analytics'
import type { SellPayloadShared, SellOfferPayload } from '@/analytics'
import AppDivider from '@/components/divider/AppDivider.vue'

const props = defineProps<{
  quote: SellQuote | null
  cryptoAmount: string
  cryptoSymbol: string
  /** Market value of the crypto being sold, in the selected fiat. */
  cryptoFiat?: string
  tokenIcon?: string
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
      analytics.trackSellEvent(
        SellOfferEvent.OFFER_CANCELED,
        buildOfferPayload(),
      )
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

const onContinue = () => {
  if (props.quoteExpired || !props.quote?.url) return
  proceeded.value = true
  analytics.trackSellEvent(SellOfferEvent.OFFER_PROCEED, buildOfferPayload())
  window.open(props.quote.url, '_blank')
  isOpen.value = false
}

const providerName = computed(() =>
  props.quote ? formatProviderName(props.quote.provider) : '',
)
</script>
