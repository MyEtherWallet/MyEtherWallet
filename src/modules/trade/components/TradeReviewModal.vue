<template>
  <app-dialog
    v-model:is-open="model"
    close-class="top-6 right-6"
    class="w-full sm:w-[480px] sm:mx-auto !rounded-20"
  >
    <template #title>
      <h1
        id="dialogTitle"
        class="w-full text-center text-s-20 font-bold leading-[22px] tracking-[-0.4px] px-12 pt-[29px] pb-[21px]"
      >
        {{ $t('trade.review_modal.title') }}
      </h1>
    </template>
    <template #content>
      <div class="flex flex-col gap-6 p-6">
        <div class="flex flex-col gap-8">
          <div class="flex flex-col gap-3">
            <p class="text-s-16 font-semibold leading-[22px] tracking-[-0.32px]">
              {{ $t('trade.review_modal.trade_provider') }}
            </p>
            <div class="flex items-center gap-2 h-[52px] px-4 rounded-16 bg-bgBase">
              <img :src="oneInchLogo" alt="" class="w-6 h-6 rounded-full" />
              <span
                class="text-s-14 font-semibold leading-[20px] tracking-[-0.28px]"
              >
                {{ $t('trade.review_modal.provider_1inch') }}
              </span>
            </div>
          </div>

          <div class="flex flex-col items-center gap-3">
            <p
              class="w-full text-s-16 font-semibold leading-[22px] tracking-[-0.32px]"
            >
              {{ $t('trade.review_modal.estimated_summary') }}
            </p>
            <div class="w-full flex flex-col gap-4 p-4 rounded-16 bg-bgBase">
              <div class="flex items-center gap-3">
                <p
                  class="flex-1 text-s-16 font-semibold leading-[22px] tracking-[-0.32px]"
                >
                  {{ $t('trade.review_modal.you_pay') }}
                </p>
                <div class="flex flex-col items-end min-w-0">
                  <p
                    class="text-s-16 font-semibold leading-[22px] tracking-[-0.32px] flex items-center gap-1"
                  >
                    {{ fromAmount }}
                    <app-token-symbol
                      :symbol="fromToken?.symbol || 'UNKNOWN'"
                      :address="tokenAddress(fromToken)"
                      class="!text-s-16 !font-semibold !leading-[22px]"
                    />
                  </p>
                  <p class="text-s-14 leading-[20px] text-info">
                    ≈ {{ currencySymbol }}{{ fromAmountFiat }}
                  </p>
                </div>
                <app-token-logo
                  :url="fromToken?.logoURI"
                  :symbol="fromToken?.symbol"
                  :address="tokenAddress(fromToken)"
                  width="w-10"
                  height="h-10"
                  no-shadow
                />
              </div>

              <div class="h-px w-full bg-grey-divider"></div>

              <div class="flex items-center gap-3">
                <div class="flex-1 flex flex-col">
                  <p
                    class="text-s-16 font-semibold leading-[22px] tracking-[-0.32px]"
                  >
                    {{ $t('trade.review_modal.you_receive') }}
                  </p>
                  <p class="text-s-14 leading-[20px] text-info">
                    {{ $t('trade.review_modal.value_estimated') }}
                  </p>
                </div>
                <div class="flex flex-col items-end min-w-0">
                  <p
                    class="text-s-16 font-semibold leading-[22px] tracking-[-0.32px] flex items-center gap-1"
                  >
                    {{ toAmountFormatted }}
                    <app-token-symbol
                      :symbol="toToken?.symbol || 'UNKNOWN'"
                      :address="tokenAddress(toToken)"
                      class="!text-s-16 !font-semibold !leading-[22px]"
                    />
                  </p>
                  <p class="text-s-14 leading-[20px] text-info">
                    ≈ {{ currencySymbol }}{{ toAmountFiat }}
                  </p>
                </div>
                <app-token-logo
                  :url="toToken?.logoURI"
                  :symbol="toToken?.symbol"
                  :address="tokenAddress(toToken)"
                  width="w-10"
                  height="h-10"
                  no-shadow
                />
              </div>

              <expand-transition>
                <div v-if="isBreakdownOpen">
                  <div class="flex flex-col gap-4">
                    <div class="h-px w-full bg-grey-divider"></div>
                    <div class="flex items-center gap-2">
                      <p class="flex-1 text-s-16 leading-[22px] text-info">
                        {{ $t('trade.review_modal.min_receive') }}
                      </p>
                      <p
                        class="text-s-16 font-semibold leading-[22px] tracking-[-0.32px]"
                      >
                        {{ minReceive }} {{ toToken?.symbol }}
                      </p>
                      <app-token-logo
                        :url="toToken?.logoURI"
                        :symbol="toToken?.symbol"
                        :address="tokenAddress(toToken)"
                        width="w-[18px]"
                        height="h-[18px]"
                        no-shadow
                      />
                    </div>
                    <div
                      v-for="row in breakdownRows"
                      :key="row.label"
                      class="flex items-center gap-2"
                    >
                      <p class="flex-1 text-s-16 leading-[22px] text-info">
                        {{ row.label }}
                      </p>
                      <p
                        class="text-s-16 font-semibold leading-[22px] tracking-[-0.32px]"
                      >
                        {{ row.value }}
                      </p>
                    </div>
                  </div>
                </div>
              </expand-transition>
            </div>

            <app-btn-text
              class="!text-black text-s-14 font-semibold tracking-[-0.28px]"
              @click="isBreakdownOpen = !isBreakdownOpen"
            >
              <span class="flex items-center gap-1">
                {{
                  isBreakdownOpen
                    ? $t('trade.review_modal.close_breakdown')
                    : $t('trade.review_modal.expand_breakdown')
                }}
                <chevron-down-icon
                  class="w-4 h-4 transition-transform"
                  :class="{ 'rotate-180': isBreakdownOpen }"
                />
              </span>
            </app-btn-text>
          </div>
        </div>

        <rewards-trade-confirmation-banner
          :trade-amount="toAmountFiat"
          :is-cashout="isCashout ?? false"
        />

        <div class="flex flex-col items-center gap-4">
          <app-base-button
            class="w-full !font-semibold !py-[13px] text-s-16 leading-[22px] tracking-[-0.32px]"
            :disabled="loading || isQuoteExpired"
            @click="proceedWithTrade"
          >
            <span
              v-if="loading"
              class="flex items-center gap-2 justify-center"
            >
              <app-spinner />
              <span>{{ $t('common.processing') }}</span>
            </span>
            <span v-else>{{ $t('trade.review_modal.confirm_trade') }}</span>
          </app-base-button>
          <i18n-t
            v-if="expiresAt"
            keypath="trade.review_modal.quote_refreshes_in"
            tag="p"
            class="text-s-14 leading-[20px] text-info"
          >
            <template #time>
              <span
                class="font-semibold text-black tracking-[-0.28px] tabular-nums"
              >
                {{ countdownLabel }}
              </span>
            </template>
          </i18n-t>
        </div>
      </div>
    </template>
  </app-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ChevronDownIcon } from '@heroicons/vue/24/solid'
import { formatUnits } from 'viem'
import BigNumber from 'bignumber.js'
import AppDialog from '@/components/AppDialog.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppBtnText from '@/components/AppBtnText.vue'
import AppSpinner from '@/components/AppSpinner.vue'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import AppTokenSymbol from '@/components/AppTokenSymbol.vue'
import ExpandTransition from '@/components/transitions/ExpandTransition.vue'
import RewardsTradeConfirmationBanner from '@/modules/rewards/RewardsTradeConfirmationBanner.vue'
import oneInchLogo from '@/assets/images/trade/oneinch-logo.png'
import { formatFloatingPointValue } from '@/utils/numberFormatHelper'
import { useCurrency } from '@/composables/useCurrency'
import { useCountdown } from '@/composables/useCountdown'
import type { NewTokenInfo } from '@/stores/swapStore'
import type { Chain } from '@/mew_api/types'
import type { QuoteOutputType } from '@/modules/trade/providers/oneinch_fusion/oneInchTypes'
import { useTradeBreakdown } from '@/modules/trade/composables/useTradeBreakdown'
import { analytics, TradeEvent } from '@/analytics'

const { t } = useI18n()
const { formatFiat, currencySymbol } = useCurrency()
const model = defineModel<boolean>('isOpen', { default: false })

const props = defineProps<{
  quote: QuoteOutputType | null
  fromToken: NewTokenInfo | null
  toToken: NewTokenInfo | null
  fromAmount: string
  loading?: boolean
  chain?: Chain
  isCashout?: boolean
  expiresAt?: number | null
}>()

const emit = defineEmits<{
  confirm: []
  cancel: []
  expired: []
}>()

const isBreakdownOpen = ref(false)

const tokenAddress = (token: NewTokenInfo | null) =>
  token && props.chain
    ? { address: token.address, network: props.chain.name }
    : undefined

const { remainingMs } = useCountdown(() =>
  model.value ? props.expiresAt : null,
)

const countdownLabel = computed(() => {
  const ms = remainingMs.value
  if (ms === null) return ''
  const totalSeconds = Math.ceil(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
})

const isQuoteExpired = computed(() => remainingMs.value === 0)

let lastExpiredTimestamp: number | null = null
watch([remainingMs, () => props.loading], ([ms, loading]) => {
  if (ms !== 0 || loading || !model.value) return
  if (props.expiresAt === null || props.expiresAt === undefined) return
  if (lastExpiredTimestamp === props.expiresAt) return
  lastExpiredTimestamp = props.expiresAt
  emit('expired')
})

const toAmountRaw = computed(() => {
  if (!props.quote || !props.toToken) return null
  const amount = props.quote.avgAmount || props.quote.startAmount
  return formatUnits(amount, props.toToken.decimals || 18)
})

const toAmountFormatted = computed(() =>
  toAmountRaw.value ? formatFloatingPointValue(toAmountRaw.value).value : '0',
)

const toAmountFiat = computed(() => {
  if (!toAmountRaw.value) return '0.00'
  const fiat = new BigNumber(toAmountRaw.value).multipliedBy(
    props.toToken?.price || 0,
  )
  return formatFiat(fiat.toString()).value
})

const fromAmountFiat = computed(() => {
  if (!props.fromAmount) return '0.00'
  const fiat = new BigNumber(props.fromAmount).multipliedBy(
    props.fromToken?.price || 0,
  )
  return formatFiat(fiat.toString()).value
})

const { minReceive, rate, txFee, priceImpact, maxSlippage } =
  useTradeBreakdown({
    quote: computed(() => props.quote),
    fromToken: computed(() => props.fromToken),
    toToken: computed(() => props.toToken),
    fromAmount: computed(() => props.fromAmount),
  })

const breakdownRows = computed(() => [
  { label: t('trade.review_modal.rate'), value: rate.value },
  { label: t('trade.review_modal.tx_fee'), value: txFee.value },
  { label: t('trade.review_modal.price_impact'), value: priceImpact.value },
  { label: t('trade.review_modal.max_slippage'), value: maxSlippage.value },
])

const isProcessing = ref(false)

const proceedWithTrade = () => {
  if (isQuoteExpired.value) return
  isProcessing.value = true
  emit('confirm')
}

watch(
  () => model.value,
  newVal => {
    if (newVal) {
      isProcessing.value = false
      return
    }
    if (!isProcessing.value) {
      analytics.trackTradeEvent(TradeEvent.OFFER_DECLINED)
    }
  },
)
</script>
