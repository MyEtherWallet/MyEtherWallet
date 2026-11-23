<template>
  <app-modal
    v-model="isOpen"
    :title="$t('perps.balance.title')"
    @close="$emit('close')"
  >
    <div class="px-4 sm:px-6">
      <app-card surface="alternative">
        <div class="flex flex-col gap-4 p-4">
          <template v-for="(row, index) in balanceRows" :key="row.label">
            <app-divider v-if="index" variant="alternative" class="-my-1" />
            <div class="flex items-center gap-3">
              <app-content-group
                :title="row.label"
                inverted
                wrap-title
                class="flex-1"
              />
              <!-- Capped so the label keeps >=40% of the row; long values wrap. -->
              <app-content-group
                :title="row.value"
                align="right"
                wrap-title
                class="max-w-[60%]"
              >
                <template #title>
                  <span :class="row.colorClass">{{ row.value }}</span>
                </template>
              </app-content-group>
            </div>
          </template>
        </div>
      </app-card>
    </div>

    <template #footer>
      <app-base-button
        type="link"
        size="large"
        class="w-full"
        @click="$emit('close')"
        >{{ $t('perps.trade.tab-close') }}</app-base-button
      >
    </template>
  </app-modal>
</template>

<script setup lang="ts">
import AppBaseButton from '@/components/AppBaseButton.vue'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import AppModal from '@/components/modal/AppModal.vue'
import AppCard from '@/components/card/AppCard.vue'
import AppContentGroup from '@/components/content_group/AppContentGroup.vue'
import AppDivider from '@/components/divider/AppDivider.vue'
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
