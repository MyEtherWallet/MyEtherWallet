<template>
  <app-sheet :is-elivated="false" sheet-class="!p-4 sm:!p-6 lg:!w-[300px]">
    <div class="flex flex-col sm:flex-row lg:flex-col sm:justify-between">
      <div>
        <p class="text-info font-bold tracking-sp-06 uppercase text-s-12">
          Perpetuals account balance
        </p>
        <p class="font-bold text-s-32 lg:text-s-40 mt-1">
          {{ walletBalance }}
        </p>
        <p
          class="text-info font-bold tracking-sp-06 uppercase text-s-11 mt-3 mb-2"
        >
          Realized PnL
        </p>
        <p class="text-s-16 leading-none" :class="pnlColorClass">
          {{ formattedRealizedPnl }}
          <span class="text-s-13 ml-2 leading-[16px]">({{ pnlPercent }})</span>
        </p>
        <p
          class="text-info font-bold tracking-sp-06 uppercase text-s-11 mt-5 mb-2"
        >
          Unrealized PnL
        </p>
        <p class="text-s-16 leading-none" :class="uPnlColorClass">
          {{ formattedUPnl }}
          <span class="text-s-13 ml-2 leading-[16px]">({{ uPnlPercent }})</span>
        </p>
        <div class="flex items-center gap-3 justify-start mt-5 -mx-1">
          <AppBaseButton @click="$emit('deposit')" class="w-full" size="medium">
            Deposit
          </AppBaseButton>
          <AppBaseButton
            is-outline
            @click="$emit('withdraw')"
            class="w-full"
            size="medium"
          >
            Withdraw
          </AppBaseButton>
        </div>
      </div>
      <hr class="my-5 border-t-1 border-grey-5 sm:hidden lg:flex" />
      <div class="flex flex-col gap-4 w-full max-w-[300px] lg:max-w-none">
        <div class="flex items-center justify-between gap-4 w-full">
          <p class="text-info font-bold tracking-sp-06 uppercase text-s-11">
            Total Cross-Margin
          </p>
          <p class="ml-2 font-medium">{{ marginBalance }}</p>
        </div>
        <div class="flex items-center justify-between gap-4 w-full">
          <p class="text-info font-bold tracking-sp-06 uppercase text-s-11">
            Available Margin
          </p>
          <p class="ml-2 font-medium">{{ availableMargin }}</p>
        </div>
        <div class="flex items-center justify-between gap-4 w-full">
          <p class="text-info font-bold tracking-sp-06 uppercase text-s-11">
            Used Margin
          </p>
          <p class="ml-2 font-medium">{{ usedMargin }}</p>
        </div>
        <div class="flex items-center justify-between gap-4 w-full">
          <p class="text-info font-bold tracking-sp-06 uppercase text-s-11">
            Margin Ratio
          </p>
          <p :class="marginRatioColorClass" class="ml-2 font-medium">
            {{ marginRatio }}
          </p>
        </div>
        <app-btn-text
          class="mt-1 text-s-13 text-primary mr-auto -ml-3"
          @click="showBalanceDialog = true"
        >
          View More
        </app-btn-text>
      </div>
    </div>
  </app-sheet>
  <perps-balance-details-dialog
    :visible="showBalanceDialog"
    @close="showBalanceDialog = false"
  />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppBtnText from '@/components/AppBtnText.vue'
import AppSheet from '@/components/AppSheet.vue'
import PerpsBalanceDetailsDialog from './PerpsBalanceDetailsDialog.vue'
import { usePerpsBalance } from '../composables/usePerpsAuth'
import {
  pnlColor,
  marginRatioColor,
  formatPnlPercent,
  formatPnl,
} from '../utils/formatters'
import { formatFiatValue } from '@/utils/numberFormatHelper'

defineEmits<{
  deposit: []
  withdraw: []
}>()

const showBalanceDialog = ref(false)

const { balance } = usePerpsBalance()
const marginBalance = computed(
  () => `$${formatFiatValue(balance.value?.marginBalance ?? '0').value}`,
)
const realizedPnl = computed(() => balance.value?.realizedPnl ?? '0')
const formattedRealizedPnl = computed(() =>
  formatPnl(balance.value?.realizedPnl ?? '0'),
)
const walletBalance = computed(
  () => `$${formatFiatValue(balance.value?.walletBalance ?? '0').value}`,
)
const availableMargin = computed(
  () =>
    `$${formatFiatValue(parseFloat(balance.value?.availableMargin ?? '0')).value}`,
)
const usedMargin = computed(
  () =>
    `$${formatFiatValue(parseFloat(balance.value?.usedMargin ?? '0')).value}`,
)
const marginRatio = computed(() => balance.value?.marginRatio ?? '0')

const pnlPercent = computed(() =>
  formatPnlPercent(realizedPnl.value, balance.value?.walletBalance),
)

const pnlColorClass = computed(() => pnlColor(realizedPnl.value))

const uPnlColorClass = computed(() =>
  pnlColor(balance.value?.unrealizedPnl ?? '0'),
)
const formattedUPnl = computed(() =>
  formatPnl(balance.value?.unrealizedPnl ?? '0'),
)
const uPnlPercent = computed(() =>
  formatPnlPercent(
    balance.value?.unrealizedPnl ?? '0',
    balance.value?.walletBalance,
  ),
)
const marginRatioColorClass = computed(() =>
  marginRatioColor(marginRatio.value),
)
</script>
