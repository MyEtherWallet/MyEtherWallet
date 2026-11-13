<template>
  <app-modal v-model="isOpen" :title="dialogTitle">
    <div class="flex flex-col gap-6 px-6 pb-6">
      <div class="flex flex-col items-center gap-3">
        <div
          class="flex w-full flex-col overflow-hidden rounded-16 bg-background-default p-4"
        >
          <div class="flex flex-col gap-4">
            <div
              v-for="row in priceRows"
              :key="row.label"
              class="flex items-center gap-3"
            >
              <p class="flex-1 truncate text-label-base text-text-default">
                {{ row.label }}
              </p>
              <p class="text-label-base text-text-default">{{ row.value }}</p>
            </div>
            <template v-if="protectionRows.length">
              <app-divider class="-my-1" />
              <div
                v-for="row in protectionRows"
                :key="row.label"
                class="flex items-center gap-3"
              >
                <p class="flex-1 truncate text-label-base text-text-default">
                  {{ row.label }}
                </p>
                <p class="text-label-base text-text-default">
                  {{ row.value }}
                </p>
              </div>
            </template>
            <app-divider class="-my-1" />
            <div
              v-for="row in positionRows"
              :key="row.label"
              class="flex items-center gap-3"
            >
              <p class="flex-1 truncate text-label-base text-text-default">
                {{ row.label }}
              </p>
              <p class="text-label-base text-text-default">{{ row.value }}</p>
            </div>
          </div>
          <expand-transition>
            <div v-if="isBreakdownOpen" class="flex flex-col gap-4 pt-4">
              <app-divider class="-my-1" />
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
              ? $t('perps.confirm.close-breakdown')
              : $t('perps.confirm.expand-breakdown')
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

      <AppBanner
        v-if="orderError || leverageError || limitPriceOutOfTolerance"
        type="alert"
        :description="
          orderError || leverageError || $t('perps.errors.out-of-tolerance')
        "
      />

      <app-base-button
        :tone="orderSide === 'buy' ? 'success' : 'danger'"
        :disabled="!!orderError || !!leverageError || limitPriceOutOfTolerance"
        :is-loading="isSubmitting"
        class="w-full"
        @click="$emit('confirm')"
      >
        {{
          orderSide === 'buy'
            ? $t('perps.confirm.confirm-long')
            : $t('perps.confirm.confirm-short')
        }}
      </app-base-button>
    </div>
  </app-modal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import AppModal from '@/components/modal/AppModal.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppBanner from '@/components/banner/AppBanner.vue'
import AppDivider from '@/components/divider/AppDivider.vue'
import AppIcon from '@/components/icon/AppIcon.vue'
import ExpandTransition from '@/components/transitions/ExpandTransition.vue'
import { formatUsd } from '../utils/formatters'

const { t } = useI18n()

const isOpen = defineModel<boolean>('isOpen', { default: false })

const props = defineProps<{
  orderSide: 'buy' | 'sell'
  orderType: 'market' | 'limit'
  displaySymbol: string
  currentPrice: number
  limitPrice: string
  inputAmount: string
  leverage: number
  positionSizeUsd: number
  orderSize: string
  estimatedLiquidation: number | null
  takeProfitPrice: number | null
  stopLossPrice: number | null
  orderError: string | null
  isSubmitting: boolean
  leverageError: string | null
  limitPriceOutOfTolerance: boolean
  makerFee?: string
  takerFee?: string
}>()

defineEmits<{
  confirm: []
}>()

const isBreakdownOpen = ref(false)
watch(isOpen, open => {
  if (open) isBreakdownOpen.value = false
})

const dialogTitle = computed(() =>
  props.orderSide === 'buy'
    ? t('perps.confirm.review-long', { symbol: props.displaySymbol })
    : t('perps.confirm.review-short', { symbol: props.displaySymbol }),
)

// Per-ticket maker/taker rules: market orders are always taker; limit orders
// classify by whether they would rest on the book (maker) or cross it (taker).
const isMaker = computed(() => {
  if (props.orderType !== 'limit') return false
  const limit = parseFloat(props.limitPrice)
  if (!Number.isFinite(limit) || !props.currentPrice) return false
  return props.orderSide === 'buy'
    ? limit < props.currentPrice
    : limit > props.currentPrice
})

const estimatedFee = computed(() => {
  const rate = parseFloat(
    (isMaker.value ? props.makerFee : props.takerFee) ?? '',
  )
  const size = parseFloat(props.orderSize)
  const price =
    props.orderType === 'limit'
      ? parseFloat(props.limitPrice)
      : props.currentPrice
  if (
    !Number.isFinite(rate) ||
    !Number.isFinite(size) ||
    !Number.isFinite(price)
  )
    return 0
  return size * price * rate
})

type Row = { label: string; value: string }

const priceRows = computed<Row[]>(() => [
  {
    label: t('perps.confirm.order-type-label'),
    value:
      props.orderType === 'market'
        ? t('perps.confirm.market')
        : t('perps.confirm.limit'),
  },
  {
    label: t('perps.confirm.market-price'),
    value: formatUsd(props.currentPrice),
  },
  ...(props.orderType === 'limit'
    ? [
        {
          label: t('perps.confirm.place-order-at'),
          value: formatUsd(props.limitPrice),
        },
      ]
    : []),
])

const protectionRows = computed<Row[]>(() => [
  ...(props.takeProfitPrice !== null
    ? [
        {
          label: t('perps.confirm.take-profit-at'),
          value: formatUsd(props.takeProfitPrice),
        },
      ]
    : []),
  ...(props.stopLossPrice !== null
    ? [
        {
          label: t('perps.confirm.stop-loss-at'),
          value: formatUsd(props.stopLossPrice),
        },
      ]
    : []),
])

const positionRows = computed<Row[]>(() => [
  {
    label: t('perps.confirm.margin'),
    value: formatUsd(parseFloat(props.inputAmount) || 0),
  },
  { label: t('perps.confirm.leverage'), value: `${props.leverage}x` },
  {
    label: t('perps.confirm.position-size'),
    value: formatUsd(props.positionSizeUsd),
  },
  {
    label: t('perps.confirm.order-size'),
    value: `${props.orderSize} ${props.displaySymbol}`,
  },
])

const breakdownRows = computed<Row[]>(() => [
  {
    label: t('perps.confirm.est-liquidation-price'),
    value: props.estimatedLiquidation
      ? formatUsd(props.estimatedLiquidation)
      : '$0.00',
  },
  // Figma shows the fee in $; keep formatUsdc's 6-decimal precision.
  {
    label: t('perps.confirm.tx-fee'),
    value: `$${(Number(estimatedFee.value) || 0).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    })}`,
  },
])
</script>
