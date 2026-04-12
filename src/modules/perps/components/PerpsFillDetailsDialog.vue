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
                'font-medium text-s-16 leading-p-100 capitalize',
                fill.direction?.toLowerCase().includes('long')
                  ? 'text-success'
                  : 'text-error',
              ]"
            >
              {{ formatDirection(fill.direction) }}
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
          >Close</app-base-button
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
import type { ApiFill } from '../sdk/types'
import {
  formatUsd,
  formatPrice,
  formatPnl,
  pnlColor,
  formatDate,
} from '../utils/formatters'
import { getBase, getLogoUrl } from '../utils/market'

const props = defineProps<{
  visible: boolean
  fill: ApiFill
}>()

const emit = defineEmits<{
  close: []
}>()

const isOpen = computed({
  get: () => props.visible,
  set: () => emit('close'),
})

const base = computed(() => getBase(props.fill.market))

function formatDirection(direction: string | undefined) {
  return direction?.replace(/([A-Z])/g, ' $1').trim() ?? ''
}

const rows = computed(() => [
  {
    label: 'Market',
    value: props.fill.market,
  },
  {
    label: 'Price',
    value: formatPrice(props.fill.price),
  },
  {
    label: 'Size',
    value: `${props.fill.size} ${base.value}`,
  },
  {
    label: 'Cost',
    value: formatUsd(props.fill.filledCost),
  },
  {
    label: 'Fee',
    value: formatUsd(props.fill.fee),
  },
  ...(props.fill.pnl
    ? [
        {
          label: 'Realized PnL',
          value: formatPnl(props.fill.pnl),
          colorClass: pnlColor(props.fill.pnl),
        },
      ]
    : []),
  {
    label: 'Role',
    value: props.fill.isMaker ? 'Maker' : 'Taker',
  },
  {
    label: 'Time',
    value: formatDate(props.fill.time),
  },
])
</script>
