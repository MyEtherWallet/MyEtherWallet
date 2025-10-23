<template>
  <app-sheet
    v-if="isWalletConnected"
    sheet-class="!px-4 !pt-3 !pb-1 overflow-hidden  w-full"
  >
    <div class="flex items-start justify-between mb-2">
      <div class="flex items-end gap-1">
        <h2 class="text-s-20 font-bold">History</h2>
        <app-tooltip
          text="Aproximate values based on current token holdings."
        />
      </div>
      <div class="text-right">
        <p class="font-bold text-s-11 tracking-sp-06 uppercase leading-p-160">
          Last 24h
        </p>
        <p
          class="text-s-16 text-success leading-p-160 font-medium"
          :class="{ '!text-error': lastTwentyFourHours.isLessThan(0) }"
        >
          <span
            v-if="lastTwentyFourHours.isLessThan(0)"
            class="inline-block ml-1"
            >-</span
          >
          ${{ formatFiatValue(lastTwentyFourHours.abs()).value }}
        </p>
      </div>
    </div>
    <p class="text-info text-center text-s-12 mt-10">Chart is coming soon</p>
    <!-- <history-chart :data="tempData" /> -->
  </app-sheet>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import AppSheet from '@/components/AppSheet.vue'
import AppTooltip from '@/components/AppTooltip.vue'
// import HistoryChart from './components/history/HistoryChart.vue'
import { useWalletStore } from '@/stores/walletStore'
import { computed } from 'vue'
import BigNumber from 'bignumber.js'
import { formatFiatValue } from '@/utils/numberFormatHelper'

const walletStore = useWalletStore()
const { isWalletConnected, allTokens } = storeToRefs(walletStore)

const getTokenBalance = (contract: string) => {
  const tokenBalanceRaw = walletStore.getTokenBalance(contract)
  if (!tokenBalanceRaw) {
    return new BigNumber(0)
  }
  return BigNumber(tokenBalanceRaw.price || 0).times(
    BigNumber(tokenBalanceRaw.balance),
  )
}

const getGainOrLoss = (percent: number, contract: string) => {
  const newBalance = BigNumber(getTokenBalance(contract))
  const oldBalance = newBalance.dividedBy(
    BigNumber(1).plus(BigNumber(percent).dividedBy(100)),
  )
  return newBalance.minus(oldBalance)
}
const lastTwentyFourHours = computed(() => {
  return allTokens.value.reduce((acc, token) => {
    const percentChange = token.price_change_percentage_24h || 0
    const gainOrLoss = getGainOrLoss(percentChange, token.contract)
    return acc.plus(gainOrLoss)
  }, BigNumber(0))
})
</script>
