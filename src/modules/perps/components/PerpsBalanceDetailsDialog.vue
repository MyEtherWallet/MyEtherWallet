<template>
  <app-dialog
    v-model:is-open="isOpen"
    has-content-gutter
    class="sm:w-[500px] sm:mx-auto"
    :title="$t('perps.balance.title')"
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
          >{{ $t('perps.trade.tab-close') }}</app-btn-text
        >
      </div>
    </template>
  </app-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import AppDialog from '@/components/AppDialog.vue'
import AppBtnText from '@/components/AppBtnText.vue'
import {
  usePerpsBalance,
  usePerpsPortfolioSummary,
} from '../composables/usePerpsAuth'
import {
  pnlColor,
  marginRatioColor,
  formatPnl,
  formatPnlPercent,
} from '../utils/formatters'
import { formatFiatValue } from '@/utils/numberFormatHelper'

const { t } = useI18n()

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
  {
    label: t('perps.balance.wallet-balance-label'),
    value: fmt(balance.value?.walletBalance),
  },
  {
    label: t('perps.balance.total-cross-margin-label'),
    value: fmt(balance.value?.marginBalance),
  },
  {
    label: t('perps.balance.available-margin-label'),
    value: fmt(balance.value?.availableMargin),
  },
  {
    label: t('perps.balance.used-margin-label'),
    value: fmt(balance.value?.usedMargin),
  },
  {
    label: t('perps.balance.margin-ratio-label'),
    value: balance.value?.marginRatio ?? '0',
    colorClass: marginRatioColor(balance.value?.marginRatio ?? '0'),
  },
  {
    label: t('perps.confirm.leverage'),
    value: `${balance.value?.leverage ?? '0'}x`,
  },
  {
    label: t('perps.balance.unrealized-pnl-label'),
    value: `${formatPnl(balance.value?.unrealizedPnl ?? '0')} (${formatPnlPercent(balance.value?.unrealizedPnl, balance.value?.marginBalance)})`,
    colorClass: pnlColor(balance.value?.unrealizedPnl ?? '0'),
  },
  {
    label: t('perps.balance.realized-pnl-label'),
    value: `${formatPnl(balance.value?.realizedPnl ?? '0')} (${formatPnlPercent(balance.value?.realizedPnl, balance.value?.marginBalance)})`,
    colorClass: pnlColor(balance.value?.realizedPnl ?? '0'),
  },
  {
    label: t('perps.balance.total-funding-payments-label'),
    value: fmt(balance.value?.totalFundingPayments),
  },
  {
    label: t('perps.balance.total-trading-fees-label'),
    value: fmt(balance.value?.totalTradingFees),
  },
  {
    label: t('perps.balance.volume-7d-label'),
    value: fmt(summary.value?.volume7d),
  },
  {
    label: t('perps.balance.volume-30d-label'),
    value: fmt(summary.value?.volume30d),
  },
])
</script>
