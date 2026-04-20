<template>
  <app-sheet :is-elivated="false" sheet-class="!p-4 sm:!p-6 lg:!w-[300px]">
    <div class="flex flex-col sm:flex-row lg:flex-col sm:justify-between">
      <div>
        <p class="text-info font-bold tracking-sp-06 uppercase text-s-12">
          Perpetuals wallet balance
        </p>
        <p class="font-bold text-s-32 lg:text-s-40 mt-1">
          {{ walletBalance }}
        </p>
        <p
          :class="pnlColorClass"
          class="inline-flex text-s-20 align-middle ml-1"
        >
          {{ pnlPercent }}
        </p>
        <div class="flex items-center gap-3 justify-start mt-3">
          <AppBaseButton
            @click="$emit('deposit')"
            class="min-w-[120px]"
            size="medium"
          >
            Deposit
          </AppBaseButton>
          <AppBaseButton
            is-outline
            @click="$emit('withdraw')"
            class="min-w-[120px]"
            size="medium"
          >
            Withdraw
          </AppBaseButton>
        </div>
      </div>
      <hr class="my-6 border-t-1 border-grey-5 sm:hidden lg:flex" />
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
const unrealizedPnl = computed(() => balance.value?.unrealizedPnl ?? '0')
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
  formatPnlPercent(unrealizedPnl.value, balance.value?.marginBalance),
)

const pnlColorClass = computed(() => pnlColor(unrealizedPnl.value))
const marginRatioColorClass = computed(() =>
  marginRatioColor(marginRatio.value),
)
</script>
