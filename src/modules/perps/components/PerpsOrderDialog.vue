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
              {{ order.side === 'buy' ? $t('perps.order.buy') : order.side === 'sell' ? $t('perps.order.sell') : order.side }}
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
          {{
            cancelling
              ? $t('perps.order.cancelling')
              : $t('perps.order.cancel-order-button')
          }}
        </button>
        <app-btn-text
          class="w-full mt-2 text-primary"
          is-large
          @click="$emit('close')"
          >{{ $t('perps.trade.tab-close') }}</app-btn-text
        >
      </div>
    </template>
  </app-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import AppDialog from '@/components/AppDialog.vue'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import AppBtnText from '@/components/AppBtnText.vue'
import AppTooltip from '@/components/AppTooltip.vue'
import type { ApiOrder } from '../sdk/types'
import { perpsClient } from '../configs'
import { capturePerps } from '../sentry'
import { PERPS_FEATURE } from '@/sentry/constants'
import {
  formatUsdc,
  formatPrice,
  formatPnl,
  pnlColor,
  formatDate,
  getOrderPrice,
} from '../utils/formatters'
import { getBase, getLogoUrl } from '../utils/market'

const { t } = useI18n()

const orderTypeLabels = computed<Record<string, string>>(() => ({
  limit: t('perps.confirm.limit'),
  market: t('perps.confirm.market'),
  stopMarket: t('perps.confirm.stop-loss'),
  takeProfitMarket: t('perps.confirm.take-profit'),
}))

const orderStatusLabels = computed<Record<string, string>>(() => ({
  open: t('perps.order.status-open'),
  fullyfilled: t('perps.order.status-fully-filled'),
  canceled: t('perps.order.status-canceled'),
  pending: t('perps.order.status-pending'),
  untriggered: t('perps.order.status-untriggered'),
}))

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

const fetchedFee = ref<string | null>(null)
const currentFetchToken = ref(0)

watch(
  () => [props.visible, props.order?.orderId] as const,
  async ([visible, orderId]) => {
    const token = ++currentFetchToken.value
    if (!visible || !orderId) {
      fetchedFee.value = null
      return
    }
    try {
      const res = await perpsClient.getOrder(orderId)
      if (token !== currentFetchToken.value) return
      if (res?.success) {
        fetchedFee.value = res.result.fee
      } else {
        fetchedFee.value = null
      }
    } catch (e) {
      if (token !== currentFetchToken.value) return
      fetchedFee.value = null
      capturePerps(PERPS_FEATURE.ORDER, e, {
        title: 'PERPS: Error fetching order detail',
      })
    }
  },
  { immediate: true },
)

const displayFee = computed(() => fetchedFee.value ?? props.order.fee)

const rows = computed(() => {
  const items: Row[] = [
    {
      label: t('perps.confirm.market'),
      value: base.value,
    },
    {
      label: t('perps.confirm.side-label'),
      value:
        props.order.side === 'buy'
          ? t('perps.order.buy')
          : t('perps.order.sell'),
      colorClass: props.order.side === 'buy' ? 'text-success' : 'text-error',
    },
    {
      label: t('perps.order.type-label'),
      value: orderTypeLabels.value[props.order.type] ?? props.order.type,
    },
    {
      label: t('perps.order.status-label'),
      value: orderStatusLabels.value[props.order.status] ?? props.order.status,
      colorClass:
        props.order.status === 'open' || props.order.status === 'pending'
          ? 'text-primary'
          : props.order.status === 'fullyfilled'
            ? 'text-success'
            : 'text-info',
    },
    {
      label: t('perps.order.price-label'),
      value: formatPrice(getOrderPrice(props.order)),
    },
    {
      label: t('perps.trade.size'),
      value: `${props.order.size} ${base.value}`,
    },
    {
      label: t('perps.order.filled-label'),
      value: `${props.order.filledSize} ${base.value}`,
    },
    {
      label: t('perps.order.fee-label'),
      value: formatUsdc(displayFee.value),
    },
  ]

  if (props.order.realizedPnl) {
    items.push({
      label: t('perps.order.realized-pnl-label'),
      value: formatPnl(props.order.realizedPnl),
      colorClass: pnlColor(props.order.realizedPnl),
    })
  }

  if (props.order.timeInForce) {
    items.push({
      label: t('perps.order.time-in-force-label'),
      value: props.order.timeInForce,
      tooltip: t('perps.order.time-in-force-tooltip'),
    })
  }

  if (props.order.reduceOnly) {
    items.push({
      label: t('perps.order.reduce-only-label'),
      value: t('perps.order.yes'),
    })
  }

  items.push({
    label: t('perps.order.created-label'),
    value: formatDate(props.order.createdAt),
  })

  if (props.order.filledAt) {
    items.push({
      label: t('perps.order.filled-at-label'),
      value: formatDate(props.order.filledAt),
    })
  }

  if (props.order.canceledAt) {
    items.push({
      label: t('perps.order.canceled-at-label'),
      value: formatDate(props.order.canceledAt),
    })
  }

  if (props.order.cancelReason) {
    items.push({
      label: t('perps.order.cancel-reason-label'),
      value: props.order.cancelReason,
    })
  }

  return items
})
</script>
