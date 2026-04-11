<template>
  <app-dialog
    v-model:is-open="isOpen"
    has-content-gutter
    class="sm:w-[440px] sm:mx-auto"
    @close-dialog="$emit('close')"
  >
    <template #content>
      <div class="flex items-center gap-3 w-full mt-5 px-4">
        <div class="flex items-center gap-3">
          <app-token-logo
            :url="getLogoUrl(base)"
            :symbol="base"
            width="w-12"
            height="h-12"
            class="rounded-full"
          />
          <div>
            <p class="font-bold text-s-24 leading-p-110">{{ base }}</p>
            <span
              :class="[
                'font-medium text-s-16 leading-p-100',
                position.direction === 'long' ? 'text-success' : 'text-error',
              ]"
            >
              {{ position.direction === 'long' ? 'Long' : 'Short' }}
              {{ position.leverage }}x
            </span>
          </div>
        </div>
      </div>
      <div class="pb-6 pt-4">
        <div class="bg-mewBg rounded-2xl divide-y divide-grey-outline p-2">
          <div
            v-for="row in rows"
            :key="row.label"
            class="flex items-center justify-between px-5 py-4"
          >
            <span
              class="text-s-11 uppercase text-info tracking-sp-06 font-bold"
              >{{ row.label }}</span
            >
            <span class="text-s-14 font-medium" :class="row.colorClass ?? ''">
              {{ row.value }}
            </span>
          </div>
        </div>
        <app-base-button class="w-full mt-4" @click="$emit('close')"
          >Manage</app-base-button
        >
        <app-btn-text
          class="w-full mt-2 text-primary"
          is-large
          @click="$emit('close')"
          >Close</app-btn-text
        >
      </div>
    </template>
  </app-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AppDialog from '@/components/AppDialog.vue'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppBtnText from '@/components/AppBtnText.vue'
import type { Position } from '../sdk/types'
import {
  formatUsd,
  formatPrice,
  formatPnl,
  formatRoe,
  pnlColor,
} from '../utils/formatters'
import { getBase, getLogoUrl } from '../utils/market'

const props = defineProps<{
  visible: boolean
  position: Position
}>()

const emit = defineEmits<{
  close: []
}>()

const isOpen = computed({
  get: () => props.visible,
  set: () => emit('close'),
})

const base = computed(() => getBase(props.position.market))

const tpSl = computed(() => {
  const tp = props.position.takeProfitTriggerPrice
  const sl = props.position.stopLossTriggerPrice
  const tpStr = tp ? formatPrice(tp) : '-'
  const slStr = sl ? formatPrice(sl) : '-'
  return `${tpStr} / ${slStr}`
})

const rows = computed(() => [
  {
    label: 'Position Size',
    value: `${props.position.netQuantity} ${base.value}`,
  },
  {
    label: 'Position Value',
    value: formatUsd(props.position.notionalValue),
  },
  {
    label: 'Entry Price',
    value: formatPrice(props.position.averageEntryPrice),
  },
  {
    label: 'Mark Price',
    value: formatPrice(props.position.markPrice),
  },
  {
    label: 'Est. Liquidation Price',
    value:
      parseFloat(props.position.liquidationPrice) > 0
        ? formatPrice(props.position.liquidationPrice)
        : 'N/A',
  },
  {
    label: 'unrealized PnL ',
    value: `${formatPnl(props.position.unrealizedPnl)} (${formatRoe(props.position.returnOnEquity)})`,
    colorClass: pnlColor(props.position.unrealizedPnl),
  },
  {
    label: 'Take Profit / Stop Loss',
    value: tpSl.value,
  },
  {
    label: 'Net Funding',
    value: formatPnl(props.position.netFundingSinceNeutral),
    colorClass: pnlColor(props.position.netFundingSinceNeutral),
  },
])
</script>
