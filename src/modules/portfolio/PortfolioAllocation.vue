<template>
  <app-sheet
    v-if="isWalletConnected"
    sheet-class=" !px-4 !pt-3 pb-2 overflow-hidden "
  >
    <h2 class="text-s-20 font-bold w-full mb-1">Allocation</h2>

    <div
      class="flex flex-col xs:flex-row items-center sm:justify-between gap-4 w-full"
    >
      <AllocationChart :tokens="topTokens" :isLoading="isLoadingBalances" />
      <AllocationTokens :tokens="topTokens" :isLoading="isLoadingBalances" />
    </div>
  </app-sheet>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import AppSheet from '@/components/AppSheet.vue'
import AllocationTokens from './components/allocation/AllocationTokens.vue'
import AllocationChart from './components/allocation/AllocationChart.vue'
import { useWalletStore } from '@/stores/walletStore'
import { computed } from 'vue'
import { BigNumber } from 'bignumber.js'
import { formatPercentageValue } from '@/utils/numberFormatHelper'
import { type TokenAllocation } from '@/modules/portfolio/types'

const walletStore = useWalletStore()
const {
  isWalletConnected,
  isLoadingBalances,
  tokens,
  safeMainTokenBalance,
  totalFiatPortfolioValueBN,
  balanceFiatBN,
} = storeToRefs(walletStore)

const getTokenBalance = (contract: string) => {
  const tokenBalanceRaw = walletStore.getTokenBalance(contract)
  if (!tokenBalanceRaw) {
    return new BigNumber(0)
  }
  return BigNumber(tokenBalanceRaw.price || 0).times(
    BigNumber(tokenBalanceRaw.balance),
  )
}
const topTokens = computed<TokenAllocation[]>(() => {
  if (
    !isWalletConnected.value ||
    isLoadingBalances.value ||
    !safeMainTokenBalance.value
  ) {
    return []
  }
  const _tokens: TokenAllocation[] = tokens.value.map(token => {
    const percentage = totalFiatPortfolioValueBN.value.isZero()
      ? new BigNumber(0)
      : getTokenBalance(token.contract)
          .div(totalFiatPortfolioValueBN.value)
          .multipliedBy(100)
    return {
      name: token.name,
      symbol: token.symbol,
      icon: token.logo_url,
      percentage,
      formattedPercentage: formatPercentageValue(percentage).value,
      percentageNumber: percentage.toNumber(),
      id: token.coinId,
    }
  })

  const mainBalancePercentage = totalFiatPortfolioValueBN.value.isZero()
    ? new BigNumber(0)
    : balanceFiatBN.value.div(totalFiatPortfolioValueBN.value).multipliedBy(100)
  _tokens.push({
    name: safeMainTokenBalance.value.name,
    symbol: safeMainTokenBalance.value.symbol,
    icon: safeMainTokenBalance.value.logo_url,
    percentage: mainBalancePercentage,
    formattedPercentage: formatPercentageValue(mainBalancePercentage).value,
    percentageNumber: mainBalancePercentage.toNumber(),
    id: safeMainTokenBalance.value.coinId,
  })

  _tokens.sort((a, b) => {
    const aValue = a.percentage
    const bValue = b.percentage
    const compared = bValue.comparedTo(aValue)
    return compared ? compared : 0
  })
  return _tokens.splice(0, 5)
})
</script>
