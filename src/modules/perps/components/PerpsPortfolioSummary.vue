<template>
  <app-sheet :is-elivated="false" sheet-class="!p-4 sm:!p-6 lg:!w-[300px]">
    <div class="flex flex-col sm:flex-row lg:flex-col sm:justify-between s">
      <div>
        <p class="text-info font-bold tracking-sp-06 uppercase text-s-12">
          Total account value
        </p>
        <p class="font-bold text-s-32 lg:text-s-40 mt-1">
          {{ formatUsd(marginBalance) }}
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
            Perpetuals Value
          </p>
          <p class="ml-2 font-medium">{{ formatUsd(walletBalance) }}</p>
        </div>
        <div class="flex items-center justify-between gap-4 w-full">
          <p class="text-info font-bold tracking-sp-06 uppercase text-s-11">
            Unrealized PnL
          </p>
          <p :class="pnlColorClass" class="ml-2 font-medium">
            {{ formatPnl(unrealizedPnl) }}
          </p>
        </div>
        <div class="flex items-center justify-between gap-4 w-full">
          <p class="text-info font-bold tracking-sp-06 uppercase text-s-11">
            Available Margin
          </p>
          <p class="ml-2 font-medium">{{ formatUsd(availableMargin) }}</p>
        </div>
        <div class="flex items-center justify-between gap-4 w-full">
          <p class="text-info font-bold tracking-sp-06 uppercase text-s-11">
            Volume (30d)
          </p>
          <p class="ml-2 font-medium">{{ formatUsd(volume30d) }}</p>
        </div>
      </div>
    </div>
  </app-sheet>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppSheet from '@/components/AppSheet.vue'
import {
  usePerpsBalance,
  usePerpsPortfolioSummary,
} from '../composables/usePerpsAuth'
import { formatUsd, formatPnl, pnlColor } from '../utils/formatters'

defineEmits<{
  deposit: []
  withdraw: []
}>()

const { balance } = usePerpsBalance()
const { summary } = usePerpsPortfolioSummary()
const marginBalance = computed(() => balance.value?.marginBalance ?? '0')
const unrealizedPnl = computed(() => balance.value?.unrealizedPnl ?? '0')
const walletBalance = computed(() => balance.value?.walletBalance ?? '0')
const availableMargin = computed(() => balance.value?.availableMargin ?? '0')
const volume30d = computed(() => summary.value?.volume30d ?? '0')

const pnlPercent = computed(() => {
  const margin = parseFloat(marginBalance.value)
  const pnl = parseFloat(unrealizedPnl.value)
  if (!margin || isNaN(pnl)) return '0.00%'
  const pct = (pnl / margin) * 100
  return `${pct >= 0 ? '+' : ''}${pct.toFixed(2)}%`
})

const pnlColorClass = computed(() => pnlColor(unrealizedPnl.value))
</script>
