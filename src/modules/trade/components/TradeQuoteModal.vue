<template>
  <app-dialog
    v-model:is-open="model"
    :title="$t('trade.quote_modal.title')"
    class="sm:max-w-[500px] sm:mx-auto sm:min-w-[460px]"
  >
    <template #content>
      <div class="mx-4 mb-1 pb-2">
        <div
          class="p-4 flex flex-col border border-solid border-grey-10 rounded-20 mb-2"
        >
          <h3 class="font-bold text-s-17 lg:text-s-20 ml-2">
            {{ $t('trade.quote_modal.quote_from') }}
          </h3>
          <div
            class="font-normal text-s-17 lg:text-s-20 my-2 mb-2 ml-2 flex flex-wrap items-center gap-2"
          >
            <span> {{ $t('trade.quote_modal.for') }}</span>

            <app-token-logo
              :url="fromToken?.logoURI"
              :symbol="fromToken?.symbol"
              :address="
                fromToken && chain
                  ? { address: fromToken?.address, network: chain.name }
                  : undefined
              "
              width="w-6 lg:w-8"
              height="h-6 lg:h-8"
            />
            <div class="flex items-center font-bold">
              <span>{{ fromAmount }}</span>
              <app-token-symbol
                :symbol="fromToken?.symbol || 'UNKNOWN'"
                :address="
                  fromToken && chain
                    ? { address: fromToken.address, network: chain.name }
                    : undefined
                "
                class="!text-s-17 lg:!text-s-20 !font-bold ml-[2px]"
              />
            </div>
            <span> {{ $t('trade.quote_modal.you_will_get') }}</span>
          </div>
          <div class="flex items-center bg-mewBg rounded-20 p-4 my-2">
            <div class="relative flex-none overflow-visible">
              <app-token-logo
                :url="toToken?.logoURI"
                :symbol="toToken?.symbol"
                :address="
                  toToken && chain
                    ? { address: toToken.address, network: chain.name }
                    : undefined
                "
                width="w-8 lg:w-[64px]"
                height="h-8 lg:h-[64px]"
              />
            </div>
            <div class="ml-5 min-w-0">
              <div
                class="font-bold text-s-20 lg:text-s-24 flex items-center gap-1 min-w-0"
              >
                <span class="flex-none">≈</span>
                <span class="truncate">{{ toAmountFormatted }}</span>
                <app-token-symbol
                  :symbol="toToken?.symbol || 'UNKNOWN'"
                  :address="
                    toToken && chain
                      ? { address: toToken.address, network: chain.name }
                      : undefined
                  "
                  class="text-s-20 lg:text-s-24 !font-bold !leading-p-100 flex-none"
                />
              </div>
              <div class="text-s-12 text-info">
                ≈ {{ currencySymbol }}{{ toAmountFiat }}
              </div>
            </div>
          </div>

          <!-- Quote Details -->
          <div class="mt-4 space-y-2 px-2">
            <div class="flex justify-between text-s-14">
              <p class="text-info">
                {{ $t('trade.quote_modal.estimated_amount') }}
                <app-tooltip
                  :text="$t('trade.quote_modal.limit_order_warning')"
                  class="inline-flex align-middle"
                />
              </p>
              <div>
                <p class="font-medium flex items-center gap-1">
                  {{ toAmountFormatted }}
                  <app-token-symbol
                    :symbol="toToken?.symbol || 'UNKNOWN'"
                    :address="
                      toToken && chain
                        ? { address: toToken.address, network: chain.name }
                        : undefined
                    "
                    class="!text-s-14 !font-medium !leading-p-100"
                  />
                </p>
                <p class="text-info font-normal text-right text-s-12">
                  ${{ toAmountFiat }}
                </p>
              </div>
            </div>
            <div v-if="quote?.endAmount" class="flex justify-between text-s-14">
              <span class="text-info">{{
                $t('trade.quote_modal.min_amount')
              }}</span>
              <div>
                <p class="font-medium flex items-center gap-1">
                  {{ minAmountFormatted }}
                  <app-token-symbol
                    :symbol="toToken?.symbol || 'UNKNOWN'"
                    :address="
                      toToken && chain
                        ? { address: toToken.address, network: chain.name }
                        : undefined
                    "
                    class="!text-s-14 !font-medium !leading-p-100"
                  />
                </p>
                <p class="text-info font-normal text-right text-s-12">
                  ${{ minAmountFiat }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Rewards eligibility banner -->
        <rewards-trade-confirmation-banner
          :trade-amount="toAmountFiat"
          :is-cashout="isCashout ?? false"
        />

        <!-- Actions -->
        <div class="flex flex-col gap-3 mt-4">
          <app-base-button
            class="flex-1"
            :disabled="loading"
            @click="proceedWithTrade"
          >
            <div v-if="loading" class="flex items-center gap-2 justify-center">
              <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                  fill="none"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>{{ $t('common.processing') }}</span>
            </div>
            <span v-else>{{ $t('trade.quote_modal.confirm_trade') }}</span>
          </app-base-button>
          <app-btn-text
            :disabled="loading"
            is-large
            class="text-error"
            @click="$emit('cancel')"
          >
            {{ $t('common.cancel') }}
          </app-btn-text>
        </div>
      </div>
    </template>
  </app-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import AppDialog from '@/components/AppDialog.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppBtnText from '@/components/AppBtnText.vue'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import AppTokenSymbol from '@/components/AppTokenSymbol.vue'
import AppTooltip from '@/components/AppTooltip.vue'
import RewardsTradeConfirmationBanner from '@/modules/rewards/RewardsTradeConfirmationBanner.vue'
import { formatUnits } from 'viem'
import { formatFloatingPointValue } from '@/utils/numberFormatHelper'
import { useCurrency } from '@/composables/useCurrency'
import type { NewTokenInfo } from '@/stores/swapStore'
import type { Chain } from '@/mew_api/types'
import { analytics, TradeEvent } from '@/analytics'

const { formatFiat, currencySymbol } = useCurrency()
const model = defineModel<boolean>('isOpen', { default: false })

const props = defineProps<{
  quote: {
    startAmount: bigint
    endAmount?: bigint
    avgAmount?: bigint
  } | null
  fromToken: NewTokenInfo | null
  toToken: NewTokenInfo | null
  fromAmount: string
  loading?: boolean
  chain?: Chain
  isCashout?: boolean
}>()

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const toAmountFormatted = computed(() => {
  if (!props.quote || !props.toToken) return '0'
  const amount = props.quote.avgAmount || props.quote.startAmount
  const formatted = formatUnits(amount, props.toToken.decimals || 18)
  return formatFloatingPointValue(formatted).value
})

const minAmountFormatted = computed(() => {
  if (!props.quote?.endAmount || !props.toToken) return '0'
  const formatted = formatUnits(
    props.quote.endAmount,
    props.toToken.decimals || 18,
  )
  return formatFloatingPointValue(formatted).value
})

const toAmountFiat = computed(() => {
  if (!props.quote || !props.toToken) return '0.00'
  const amount = props.quote.avgAmount || props.quote.startAmount
  const formatted = formatUnits(amount, props.toToken.decimals || 18)
  const price = props.toToken.price || 0
  const fiat = parseFloat(formatted) * price
  return formatFiat(fiat.toString()).value
})

const minAmountFiat = computed(() => {
  if (!props.quote?.endAmount || !props.toToken) return '0.00'
  const formatted = formatUnits(
    props.quote.endAmount,
    props.toToken.decimals || 18,
  )
  const price = props.toToken.price || 0
  const fiat = parseFloat(formatted) * price
  return formatFiat(fiat.toString()).value
})

const isProcessing = ref(false)

const proceedWithTrade = () => {
  isProcessing.value = true
  emit('confirm')
}
watch(
  () => model.value,
  newVal => {
    if (newVal === false && !isProcessing.value) {
      analytics.trackTradeEvent(TradeEvent.OFFER_DECLINED)
      isProcessing.value = false
    }
  },
)
</script>
