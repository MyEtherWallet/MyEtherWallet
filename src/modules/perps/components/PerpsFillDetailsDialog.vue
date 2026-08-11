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
              {{ $t(directionKey(fill.direction)) }}
            </span>
          </div>
        </div>
      </div>
      <div class="pb-6 pt-4">
        <div class="bg-brand-subtle rounded-2xl divide-y divide-line-strong p-2">
          <div
            v-for="row in rows"
            :key="row.label"
            class="flex items-center justify-between px-5 py-4"
          >
            <span
              class="text-s-11 uppercase text-fg-subtle tracking-sp-06 font-bold"
              >{{ row.label }}</span
            >
            <span class="text-s-14 font-medium" :class="row.colorClass ?? ''">
              {{ row.value }}
            </span>
          </div>
        </div>
        <app-base-button class="w-full mt-4" @click="$emit('close')">{{
          $t('perps.trade.tab-close')
        }}</app-base-button>
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
import type { ApiFill } from '../sdk/types'
import {
  formatUsd,
  formatPrice,
  formatPnl,
  pnlColor,
  formatDate,
  directionKey,
} from '../utils/formatters'
import { getBase, getLogoUrl } from '../utils/market'

const { t } = useI18n()

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

const rows = computed(() => [
  {
    label: t('perps.confirm.market'),
    value: base.value,
  },
  {
    label: t('perps.fill.price-label'),
    value: formatPrice(props.fill.price),
  },
  {
    label: t('perps.trade.size'),
    value: `${props.fill.size} ${base.value}`,
  },
  {
    label: t('perps.fill.cost-label'),
    value: formatUsd(props.fill.filledCost),
  },
  {
    label: t('perps.fill.fee-label'),
    value: formatUsd(props.fill.fee),
  },
  ...(props.fill.pnl
    ? [
        {
          label: t('perps.fill.realized-pnl-label'),
          value: formatPnl(props.fill.pnl),
          colorClass: pnlColor(props.fill.pnl),
        },
      ]
    : []),
  {
    label: t('perps.fill.role-label'),
    value: props.fill.isMaker
      ? t('perps.confirm.maker')
      : t('perps.confirm.taker'),
  },
  {
    label: t('perps.fill.time-label'),
    value: formatDate(props.fill.time),
  },
])
</script>
