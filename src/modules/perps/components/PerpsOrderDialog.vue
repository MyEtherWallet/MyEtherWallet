<template>
  <app-dialog
    v-model:is-open="isOpen"
    has-content-gutter
    class="sm:w-[440px] sm:mx-auto"
    @close-dialog="$emit('close')"
    z-index-overlay="z-[110]"
    z-index-container="z-[111]"
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
                'font-medium text-s-16 leading-p-100 capitalize',
                order.side === 'buy' ? 'text-success' : 'text-error',
              ]"
            >
              {{ order.side }}
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
            <div class="flex items-center gap-1">
              <span
                class="text-s-11 uppercase text-info tracking-sp-06 font-bold"
                >{{ row.label }}</span
              >
              <app-tooltip
                v-if="row.tooltip"
                :text="row.tooltip"
                position="top-right"
              />
            </div>
            <span class="text-s-14 font-medium" :class="row.colorClass ?? ''">
              {{ row.value }}
            </span>
          </div>
        </div>
        <button
          v-if="isCancellable"
          class="rounded-full w-full mt-4 py-3 text-s-14 font-medium hoverOpacity text-white bg-error disabled:opacity-50"
          :disabled="cancelling"
          @click="$emit('cancel', order)"
        >
          {{ cancelling ? 'Cancelling...' : 'Cancel Order' }}
        </button>
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
import AppBtnText from '@/components/AppBtnText.vue'
import AppTooltip from '@/components/AppTooltip.vue'
import type { ApiOrder } from '../sdk/types'
import {
  formatUsd,
  formatPrice,
  formatPnl,
  pnlColor,
  formatDate,
  getOrderPrice,
} from '../utils/formatters'
import { getBase, getLogoUrl } from '../utils/market'

const orderTypeLabels: Record<string, string> = {
  limit: 'Limit',
  market: 'Market',
  stopMarket: 'Stop Loss',
  takeProfitMarket: 'Take Profit',
}

const orderStatusLabels: Record<string, string> = {
  open: 'Open',
  fullyfilled: 'Fully Filled',
  canceled: 'Canceled',
  pending: 'Pending',
  untriggered: 'Untriggered',
}

const props = defineProps<{
  visible: boolean
  order: ApiOrder
  cancelling?: boolean
}>()

const emit = defineEmits<{
  close: []
  cancel: [order: ApiOrder]
}>()

const isOpen = computed({
  get: () => props.visible,
  set: () => emit('close'),
})

const base = computed(() => getBase(props.order.market))

const isCancellable = computed(() =>
  ['pending', 'untriggered', 'open'].includes(props.order.status),
)

type Row = {
  label: string
  value: string
  colorClass?: string
  tooltip?: string
}

const rows = computed(() => {
  const items: Row[] = [
    {
      label: 'Market',
      value: base.value,
    },
    {
      label: 'Side',
      value: props.order.side === 'buy' ? 'Buy' : 'Sell',
      colorClass: props.order.side === 'buy' ? 'text-success' : 'text-error',
    },
    {
      label: 'Type',
      value: orderTypeLabels[props.order.type] ?? props.order.type,
    },
    {
      label: 'Status',
      value: orderStatusLabels[props.order.status] ?? props.order.status,
      colorClass:
        props.order.status === 'open' || props.order.status === 'pending'
          ? 'text-primary'
          : props.order.status === 'fullyfilled'
            ? 'text-success'
            : 'text-info',
    },
    {
      label: 'Price',
      value: formatPrice(getOrderPrice(props.order)),
    },
    {
      label: 'Size',
      value: `${props.order.size} ${base.value}`,
    },
    {
      label: 'Filled',
      value: `${props.order.filledSize} ${base.value}`,
    },
    {
      label: 'Fee',
      value: formatUsd(props.order.fee),
    },
  ]

  if (props.order.realizedPnl) {
    items.push({
      label: 'Realized PnL',
      value: formatPnl(props.order.realizedPnl),
      colorClass: pnlColor(props.order.realizedPnl),
    })
  }

  if (props.order.timeInForce) {
    items.push({
      label: 'Time in Force',
      value: props.order.timeInForce,
      tooltip:
        'The order remains active until the order is completely filled or you manually cancel it.',
    })
  }

  if (props.order.reduceOnly) {
    items.push({
      label: 'Reduce Only',
      value: 'Yes',
    })
  }

  items.push({
    label: 'Created',
    value: formatDate(props.order.createdAt),
  })

  if (props.order.filledAt) {
    items.push({
      label: 'Filled At',
      value: formatDate(props.order.filledAt),
    })
  }

  if (props.order.canceledAt) {
    items.push({
      label: 'Canceled At',
      value: formatDate(props.order.canceledAt),
    })
  }

  if (props.order.cancelReason) {
    items.push({
      label: 'Cancel Reason',
      value: props.order.cancelReason,
    })
  }

  return items
})
</script>
