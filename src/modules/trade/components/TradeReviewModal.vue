<template>
  <app-modal v-model="model" :title="$t('trade.review_modal.title')">
    <div class="flex flex-col gap-6 p-6">
      <div class="flex flex-col gap-8">
        <div class="flex flex-col gap-3">
          <p class="text-label-base text-text-default">
            {{ $t('trade.review_modal.trade_provider') }}
          </p>
          <!-- 1inch Fusion is the only provider, so it's the only option. -->
          <app-dropdown
            :title="$t('trade.review_modal.provider_1inch')"
            bordered
          >
            <template #avatar="{ size }">
              <app-avatar
                type="cryptoAsset"
                :size="size"
                :url="oneInchLogo"
                :symbol="$t('trade.review_modal.provider_1inch')"
              />
            </template>
            <template #suffix>
              <app-tag
                type="success"
                variant="contrast"
                leading-icon="check-badge"
                :label="$t('trade.review_modal.best_value')"
              />
            </template>
            <app-cell
              size="small"
              inset
              role="option"
              aria-selected="true"
              selected
              :title="$t('trade.review_modal.provider_1inch')"
            >
              <template #avatar="{ size }">
                <app-avatar
                  type="cryptoAsset"
                  :size="size"
                  :url="oneInchLogo"
                  :symbol="$t('trade.review_modal.provider_1inch')"
                />
              </template>
            </app-cell>
          </app-dropdown>
        </div>

        <div class="flex flex-col items-center gap-3">
          <p class="w-full text-label-base text-text-default">
            {{ $t('trade.review_modal.summary') }}
          </p>
          <div
            class="flex w-full flex-col overflow-hidden rounded-16 bg-background-default p-4"
          >
            <div class="flex flex-col gap-4">
              <div class="flex items-center gap-3">
                <app-content-group
                  :title="$t('trade.review_modal.you_pay')"
                  class="flex-1"
                />
                <app-content-group
                  :title="fromAmountDisplay"
                  :description="`≈ ${currencySymbol}${fromAmountFiat}`"
                  align="right"
                  class="flex-1"
                >
                  <template #title>
                    <span class="inline-flex gap-1">
                      {{ fromAmountDisplay }}
                      <app-token-symbol
                        :symbol="fromToken?.symbol || 'UNKNOWN'"
                        :address="tokenAddress(fromToken)"
                        class="!text-label-base !font-semibold"
                      />
                    </span>
                  </template>
                  <template v-if="isFromAmountTruncated" #title-icon="{ size }">
                    <app-tooltip :text="fromAmountFull">
                      <AppIcon
                        name="information-circle"
                        :size="size"
                        class="cursor-pointer text-icon-default"
                      />
                    </app-tooltip>
                  </template>
                </app-content-group>
                <app-token-logo
                  :url="fromToken?.logoURI"
                  :symbol="fromToken?.symbol"
                  :address="tokenAddress(fromToken)"
                  width="w-10"
                  height="h-10"
                  no-shadow
                />
              </div>

              <app-divider variant="alternative" class="-my-1" />

              <div class="flex items-center gap-3">
                <app-content-group
                  :title="$t('trade.review_modal.you_receive')"
                  :description="$t('trade.review_modal.value_estimated')"
                  class="flex-1"
                />
                <app-content-group
                  :title="toAmountFormatted"
                  :description="`≈ ${currencySymbol}${toAmountFiat}`"
                  align="right"
                  class="flex-1"
                >
                  <template #title>
                    <span class="inline-flex gap-1">
                      {{ toAmountFormatted }}
                      <app-token-symbol
                        :symbol="toToken?.symbol || 'UNKNOWN'"
                        :address="tokenAddress(toToken)"
                        class="!text-label-base !font-semibold"
                      />
                    </span>
                  </template>
                </app-content-group>
                <app-token-logo
                  :url="toToken?.logoURI"
                  :symbol="toToken?.symbol"
                  :address="tokenAddress(toToken)"
                  width="w-10"
                  height="h-10"
                  no-shadow
                />
              </div>
            </div>

            <expand-transition>
              <div v-if="isBreakdownOpen" class="flex flex-col gap-4 pt-4">
                <app-divider variant="alternative" class="-my-1" />
                <div class="flex items-center gap-2">
                  <p class="flex-1 truncate text-text-base text-text-subtle">
                    {{ $t('trade.review_modal.min_receive') }}
                  </p>
                  <p class="text-label-base text-text-default">
                    {{ minReceive }} {{ toToken?.symbol ?? '' }}
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
                  <p class="flex-1 truncate text-text-base text-text-subtle">
                    {{ row.label }}
                  </p>
                  <p class="text-label-base text-text-default">
                    {{ row.value }}
                  </p>
                </div>
              </div>
            </expand-transition>
          </div>

          <app-base-button
            type="tertiary"
            surface="alternative"
            size="small"
            @click="isBreakdownOpen = !isBreakdownOpen"
          >
            {{
              isBreakdownOpen
                ? $t('trade.review_modal.close_breakdown')
                : $t('trade.review_modal.expand_breakdown')
            }}
            <template #trailing>
              <AppIcon
                name="chevron-down"
                size="xxs"
                class="transition-transform"
                :class="{ 'rotate-180': isBreakdownOpen }"
              />
            </template>
          </app-base-button>
        </div>
      </div>

      <rewards-trade-confirmation-banner
        :trade-amount="toAmountUsd"
        :is-cashout="isCashout ?? false"
      />

      <div class="flex flex-col items-center gap-4">
        <app-base-button
          class="w-full"
          :disabled="isQuoteExpired"
          :is-loading="loading"
          @click="proceedWithTrade"
        >
          {{ $t('trade.review_modal.confirm_trade') }}
        </app-base-button>
        <i18n-t
          v-if="expiresAt"
          keypath="trade.review_modal.quote_refreshes_in"
          tag="p"
          class="text-text-sm text-text-subtle"
        >
          <template #time>
            <span class="text-label-sm text-text-default">
              {{ countdownLabel }}
            </span>
          </template>
        </i18n-t>
      </div>
    </div>
  </app-modal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { formatUnits } from 'viem'
import BigNumber from 'bignumber.js'
import AppModal from '@/components/modal/AppModal.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppTooltip from '@/components/tooltip/AppTooltip.vue'
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

import AppIcon from '@/components/icon/AppIcon.vue'
import AppDivider from '@/components/divider/AppDivider.vue'
import AppDropdown from '@/components/dropdown/AppDropdown.vue'
import AppCell from '@/components/cell/AppCell.vue'
import AppContentGroup from '@/components/content_group/AppContentGroup.vue'
import AppAvatar from '@/components/avatar/AppAvatar.vue'
import AppTag from '@/components/tag/AppTag.vue'
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
  /**
   * Set by the parent while it force-closes the modal (the expiry re-quote
   * failed): that close is not a user decision, so OFFER_DECLINED is skipped.
   */
  suppressDeclineTracking?: boolean
}>()

const emit = defineEmits<{
  confirm: []
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

// Plain USD number for the rewards banner, which does arithmetic on it.
// `toAmountFiat` is a display string — grouped and converted to the display
// currency — and `Number("1,500.00")` is NaN, so qualifying trades over 1,000
// units read as not qualifying when fed the formatted value.
const toAmountUsd = computed(() => {
  if (!toAmountRaw.value) return '0'
  return new BigNumber(toAmountRaw.value)
    .multipliedBy(props.toToken?.price || 0)
    .toFixed(2)
})

// Display capped at 6 decimals (rounded down); full value lives in the tooltip.
const FROM_AMOUNT_MAX_DECIMALS = 6

const fromAmountFull = computed(() =>
  props.fromAmount ? new BigNumber(props.fromAmount).toFormat() : '0',
)

const isFromAmountTruncated = computed(
  () =>
    !!props.fromAmount &&
    (new BigNumber(props.fromAmount).decimalPlaces() ?? 0) >
      FROM_AMOUNT_MAX_DECIMALS,
)

const fromAmountDisplay = computed(() =>
  props.fromAmount
    ? new BigNumber(props.fromAmount)
        .decimalPlaces(FROM_AMOUNT_MAX_DECIMALS, BigNumber.ROUND_DOWN)
        .toFormat()
    : '0',
)

const fromAmountFiat = computed(() => {
  if (!props.fromAmount) return '0.00'
  const fiat = new BigNumber(props.fromAmount).multipliedBy(
    props.fromToken?.price || 0,
  )
  return formatFiat(fiat.toString()).value
})

const { minReceive, rate, txFee, priceImpact, maxSlippage } = useTradeBreakdown(
  {
    quote: computed(() => props.quote),
    fromToken: computed(() => props.fromToken),
    toToken: computed(() => props.toToken),
    fromAmount: computed(() => props.fromAmount),
  },
)

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
      // Fresh open, fresh state: collapse the breakdown and re-arm the one-shot
      // expiry emitter (the previous session's timestamp must not block it).
      isBreakdownOpen.value = false
      lastExpiredTimestamp = null
      return
    }
    if (!isProcessing.value && !props.suppressDeclineTracking) {
      analytics.trackTradeEvent(TradeEvent.OFFER_DECLINED)
    }
  },
)
</script>
