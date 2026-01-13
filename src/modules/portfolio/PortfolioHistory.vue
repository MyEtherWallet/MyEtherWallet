<template>
  <app-sheet
    v-if="isWalletConnected"
    sheet-class="!px-5 !pt-4 !pb-5 overflow-hidden w-full h-full flex flex-col"
  >
    <div class="flex items-start justify-between mb-4">
      <div class="flex items-center gap-1.5 pt-0.5">
        <h2 class="text-s-20 font-bold leading-none">History</h2>
        <app-tooltip
          text="Approximate values based on current token holdings."
        />
      </div>
      <div class="text-right">
        <p
          class="font-bold text-s-11 tracking-sp-06 uppercase text-info leading-none mb-1"
        >
          Last 24h
        </p>
        <p
          class="text-s-20 text-success leading-none font-medium"
          :class="{ '!text-error': lastTwentyFourHours.isLessThan(0) }"
        >
          {{ lastTwentyFourHours.isLessThan(0) ? '-' : '+' }}${{
            formatFiatValue(lastTwentyFourHours.abs()).value
          }}
        </p>
      </div>
    </div>
    <div class="flex-1 flex flex-col items-center justify-center opacity-40">
      <p class="text-info text-center text-s-13 font-medium">
        Chart is coming soon
      </p>
    </div>
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
