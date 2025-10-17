<template>
  <app-sheet
    v-if="isWalletConnected"
    sheet-class=" !px-4 !pt-3 pb-2 overflow-hidden "
  >
    <div class="flex items-center w-full justify-between">
      <h2 class="text-s-20 font-bold mb-1">{{ $t('common.allocation') }}</h2>
      <allocation-dialog v-if="!isLoadingBalances" :tokens="topTokens" />
    </div>

    <div
      v-if="!isLoadingBalances && topTokens.length"
      class="flex flex-col xs:flex-row items-center sm:justify-between gap-4 w-full"
    >
      <AllocationChart
        :tokens="topTokens.slice(0, 5)"
        :isLoading="isLoadingBalances"
      />
      <AllocationTokens
        :tokens="topTokens.slice(0, 5)"
        :isLoading="isLoadingBalances"
      />
    </div>
    <div
      v-else-if="isLoadingBalances"
      class="bg-grey-10 rounded-2xl animate-pulse h-[140px]"
    ></div>
  </app-sheet>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import AppSheet from '@/components/AppSheet.vue'
import AllocationTokens from './components/allocation/AllocationTokens.vue'
import AllocationChart from './components/allocation/AllocationChart.vue'
import AllocationDialog from './components/allocation/AllocationDialog.vue'
import { useWalletStore } from '@/stores/walletStore'
import { computed } from 'vue'
import { BigNumber } from 'bignumber.js'
import {
  formatPercentageValue,
  formatFiatValue,
} from '@/utils/numberFormatHelper'
import { type TokenAllocation } from '@/modules/portfolio/types'

const walletStore = useWalletStore()
const {
  isWalletConnected,
  isLoadingBalances,
  tokens,
  safeMainTokenBalance,
  totalFiatPortfolioValueBN,
  balanceFiatBN,
  formattedBalanceFiat,
} = storeToRefs(walletStore)

/**
 *
 * @param contract - token contract address
 * @returns BigNumber - token balance in fiat value
 */
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
    const tokenBalanceFiatBN = getTokenBalance(token.contract)
    const percentage = totalFiatPortfolioValueBN.value.isZero()
      ? new BigNumber(0)
      : tokenBalanceFiatBN
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
      usdBalanceFormatted: formatFiatValue(tokenBalanceFiatBN).value,
      usdBalanceRaw: tokenBalanceFiatBN.toString(),
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
    usdBalanceFormatted: formattedBalanceFiat.value,
    usdBalanceRaw: formattedBalanceFiat.value,
  })

  _tokens.sort((a, b) => {
    const aValue = a.percentage
    const bValue = b.percentage
    const compared = bValue.comparedTo(aValue)
    return compared ? compared : 0
  })
  return _tokens
})
</script>
