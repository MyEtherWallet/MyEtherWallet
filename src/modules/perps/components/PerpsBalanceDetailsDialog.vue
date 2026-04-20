<template>
  <app-dialog
    v-model:is-open="isOpen"
    has-content-gutter
    class="sm:w-[500px] sm:mx-auto"
    title="Perpetuals Portfolio"
    @close-dialog="$emit('close')"
  >
    <template #content>
      <div class="pb-6 pt-4">
        <div class="bg-mewBg rounded-2xl divide-y divide-grey-outline p-2">
          <div
            v-for="row in balanceRows"
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

        <app-btn-text
          class="w-full mt-4 text-primary"
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
import AppBtnText from '@/components/AppBtnText.vue'
import {
  usePerpsBalance,
  usePerpsPortfolioSummary,
} from '../composables/usePerpsAuth'
import { pnlColor, marginRatioColor } from '../utils/formatters'
import { formatFiatValue } from '@/utils/numberFormatHelper'

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const isOpen = computed({
  get: () => props.visible,
  set: () => emit('close'),
})

const { balance } = usePerpsBalance()
const { summary } = usePerpsPortfolioSummary()

const fmt = (val: string | undefined) => `$${formatFiatValue(val ?? '0').value}`

const balanceRows = computed(() => [
  { label: 'Wallet Balance', value: fmt(balance.value?.walletBalance) },
  { label: 'Total Cross-Margin', value: fmt(balance.value?.marginBalance) },
  { label: 'Available Margin', value: fmt(balance.value?.availableMargin) },
  { label: 'Used Margin', value: fmt(balance.value?.usedMargin) },
  {
    label: 'Margin Ratio',
    value: balance.value?.marginRatio ?? '0',
    colorClass: marginRatioColor(balance.value?.marginRatio ?? '0'),
  },
  { label: 'Leverage', value: `${balance.value?.leverage ?? '0'}x` },
  {
    label: 'Unrealized PnL',
    value: fmt(balance.value?.unrealizedPnl),
    colorClass: pnlColor(balance.value?.unrealizedPnl ?? '0'),
  },
  {
    label: 'Realized PnL',
    value: fmt(balance.value?.realizedPnl),
    colorClass: pnlColor(balance.value?.realizedPnl ?? '0'),
  },
  {
    label: 'Total Funding Payments',
    value: fmt(balance.value?.totalFundingPayments),
  },
  { label: 'Total Trading Fees', value: fmt(balance.value?.totalTradingFees) },
  { label: 'Volume (7d)', value: fmt(summary.value?.volume7d) },
  { label: 'Volume (30d)', value: fmt(summary.value?.volume30d) },
  { label: 'Volume (All Time)', value: fmt(summary.value?.volumeAllTime) },
])
</script>
