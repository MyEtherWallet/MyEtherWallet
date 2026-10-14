import { computed, type ComputedRef } from 'vue'
import { storeToRefs } from 'pinia'
import BigNumber from 'bignumber.js'
import { useWalletStore } from '@/stores/walletStore'

export interface PortfolioChange {
  /** Absolute fiat gain/loss over the last 24h (positive = gain). */
  fiat: BigNumber
  /** Percentage change over the last 24h (positive = gain). */
  percentChange: BigNumber
}

/**
 * Portfolio value change over the last 24h, computed from the wallet's token
 * balances weighted by each token's `price_change_percentage_24h`. Extracted
 * verbatim from PortfolioHistory.vue so the Home Hero and the Portfolio page
 * share a single source of truth.
 */
export function usePortfolio24hChange(): {
  lastTwentyFourHours: ComputedRef<PortfolioChange>
} {
  const walletStore = useWalletStore()
  const { allTokens } = storeToRefs(walletStore)

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

  const lastTwentyFourHours = computed<PortfolioChange>(() => {
    const totalGainOrLoss = allTokens.value.reduce((acc, token) => {
      const percentChange = token.price_change_percentage_24h || 0
      const gainOrLoss = getGainOrLoss(percentChange, token.contract)
      return acc.plus(gainOrLoss)
    }, BigNumber(0))

    const totalValueNow = walletStore.totalFiatPortfolioValueBN
    const totalValueOld = totalValueNow.minus(totalGainOrLoss)

    const percentChange =
      totalValueOld.isZero() || totalValueOld.isNegative()
        ? BigNumber(0)
        : totalGainOrLoss.div(totalValueOld).multipliedBy(100)

    return {
      fiat: totalGainOrLoss,
      percentChange,
    }
  })

  return { lastTwentyFourHours }
}
