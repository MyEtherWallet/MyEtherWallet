<template>
  <app-dialog v-model:is-open="isOpen" class="w-full max-w-[440px]">
    <template #title>
      <div class="flex items-center gap-2.5 mr-8 pt-5 pl-6">
        <app-token-logo
          :url="getLogoUrl(displaySymbol)"
          :symbol="displaySymbol"
          width="w-8"
          height="h-8"
        />
        <span class="font-bold text-s-20">{{ dialogTitle }}</span>
      </div>
    </template>
    <template #content>
      <div class="px-6 pb-6 pt-4 flex flex-col gap-5">
        <!-- Order Details -->
        <div class="bg-mewBg rounded-[20px] p-5 space-y-3">
          <div class="flex justify-between text-s-14">
            <span class="text-info font-medium">{{
              $t('perps.confirm.side-label')
            }}</span>
            <span
              class="font-bold"
              :class="orderSide === 'buy' ? 'text-success' : 'text-error'"
              >{{ orderSideLabel }}</span
            >
          </div>
          <div class="flex justify-between text-s-14">
            <span class="text-info font-medium">{{
              $t('perps.confirm.order-type-label')
            }}</span>
            <span class="font-bold">{{
              orderType === 'market'
                ? $t('perps.confirm.market')
                : $t('perps.confirm.limit')
            }}</span>
          </div>
          <div class="flex justify-between text-s-14">
            <span class="text-info font-medium">{{
              $t('perps.confirm.market-price')
            }}</span>
            <span class="font-bold">{{ formatUsd(currentPrice) }}</span>
          </div>
          <div
            v-if="orderType === 'limit'"
            class="flex justify-between text-s-14"
          >
            <span class="text-info font-medium">{{
              $t('perps.confirm.limit-price')
            }}</span>
            <span class="font-bold">${{ limitPrice }}</span>
          </div>
          <div class="flex justify-between text-s-14">
            <span class="text-info font-medium">{{
              $t('perps.confirm.margin')
            }}</span>
            <span class="font-bold">{{
              formatUsd(parseFloat(inputAmount) || 0)
            }}</span>
          </div>
          <div class="flex justify-between text-s-14">
            <span class="text-info font-medium">{{
              $t('perps.confirm.leverage')
            }}</span>
            <span class="font-bold">{{ leverage }}&times;</span>
          </div>
          <div class="flex justify-between text-s-14">
            <span class="text-info font-medium">{{
              $t('perps.confirm.position-size')
            }}</span>
            <span class="font-bold">{{ formatUsd(positionSizeUsd) }}</span>
          </div>
          <div class="flex justify-between text-s-14">
            <span class="text-info font-medium">{{
              $t('perps.confirm.size', { symbol: displaySymbol })
            }}</span>
            <span class="font-bold">{{ orderSize }}</span>
          </div>
          <div class="flex justify-between text-s-14">
            <span class="text-info font-medium">{{
              $t('perps.confirm.est-liquidation')
            }}</span>
            <span class="font-bold">{{
              estimatedLiquidation ? formatUsd(estimatedLiquidation) : '$0.00'
            }}</span>
          </div>
          <div class="flex justify-between text-s-14">
            <span class="text-info font-medium">{{
              $t('perps.confirm.est-fee', {
                type: isMaker
                  ? $t('perps.confirm.maker')
                  : $t('perps.confirm.taker'),
              })
            }}</span>
            <span class="font-bold">{{ formatUsdc(estimatedFee) }}</span>
          </div>
          <div
            v-if="takeProfitPrice !== null"
            class="flex justify-between text-s-14"
          >
            <span class="text-info font-medium">{{
              $t('perps.confirm.take-profit')
            }}</span>
            <span class="text-success font-bold">{{
              formatUsd(takeProfitPrice!)
            }}</span>
          </div>
          <div
            v-if="stopLossPrice !== null"
            class="flex justify-between text-s-14"
          >
            <span class="text-info font-medium">{{
              $t('perps.confirm.stop-loss')
            }}</span>
            <span class="text-error font-bold">{{
              formatUsd(stopLossPrice!)
            }}</span>
          </div>
        </div>

        <!-- Error -->
        <div
          v-if="orderError || leverageError || limitPriceOutOfTolerance"
          class="bg-[#fff0f0] border border-[#ffcccc] rounded-[16px] p-4"
        >
          <p class="text-error text-s-14 font-medium">
            {{
              orderError || leverageError || $t('perps.errors.out-of-tolerance')
            }}
          </p>
        </div>

        <!-- Actions -->
        <div class="flex flex-col gap-1">
          <app-base-button
            :tone="orderSide === 'buy' ? 'success' : 'danger'"
            :disabled="
              isSubmitting ||
              !!orderError ||
              !!leverageError ||
              limitPriceOutOfTolerance
            "
            :is-loading="isSubmitting"
            class="flex-1"
            @click="$emit('confirm')"
            >{{ confirmButtonLabel }}</app-base-button
          >
          <app-base-button
            type="tertiary"
            surface="alternative"
            size="large"
            :disabled="isSubmitting"
            class="mx-auto w-full"
            @click="isOpen = false"
            >{{ $t('perps.confirm.cancel') }}</app-base-button
          >
        </div>
      </div>
    </template>
  </app-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import AppDialog from '@/components/AppDialog.vue'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import { formatUsd, formatUsdc } from '../utils/formatters'
import { getLogoUrl } from '../utils/market'

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

const orderSideLabel = computed(() =>
  props.orderSide === 'buy'
    ? t('perps.confirm.long')
    : t('perps.confirm.short'),
)

const dialogTitle = computed(() =>
  t('perps.confirm.title', {
    side: orderSideLabel.value,
    symbol: props.displaySymbol,
  }),
)

const confirmButtonLabel = computed(() =>
  props.isSubmitting
    ? t('perps.confirm.processing')
    : t('perps.confirm.confirm-action', { side: orderSideLabel.value }),
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
</script>
