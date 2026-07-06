<template>
  <app-sheet
    v-if="isWalletConnected"
    :is-elivated="false"
    sheet-class="!px-0 !pt-4 !pb-2 overflow-hidden w-full h-full flex flex-col justify-end gap-3 lg:gap-1"
  >
    <div class="flex items-start justify-between mb-auto px-5">
      <div class="flex items-center gap-1.5">
        <h2 class="text-s-20 font-bold leading-none">
          {{ t('portfolio.history.title') }}
        </h2>
        <app-tooltip :text="t('portfolio.history.tooltip')" />
      </div>
      <div class="text-right">
        <p
          class="font-bold text-s-11 tracking-sp-06 uppercase text-info leading-none mb-1"
        >
          {{ t('portfolio.history.last_24h') }}
        </p>
        <div v-if="!isLoadingBalances">
          <p class="text-s-20 font-semibold text-black leading-none mt-2">
            {{ lastTwentyFourHours.fiat.isLessThan(0) ? '-' : '+' }}${{
              formatFiatValue(lastTwentyFourHours.fiat.abs()).value
            }}
          </p>
          <span
            class="text-s-11 leading-none"
            :class="{
              'text-error': lastTwentyFourHours.fiat.isLessThan(0),
              'text-success': lastTwentyFourHours.fiat.isGreaterThan(0),
            }"
          >
            {{ lastTwentyFourHours.percentChange.isLessThan(0) ? '-' : '+'
            }}{{
              formatPercentageValue(lastTwentyFourHours.percentChange.abs())
                .value
            }}
          </span>
        </div>
        <div
          v-else
          class="h-11 w-[60px] bg-grey-10 rounded-xl animate-pulse"
        ></div>
      </div>
    </div>
    <div
      v-if="isFetching && !chartData.length"
      class="flex-1 bg-grey-10 rounded-xl animate-pulse mx-4 min-h-[150px]"
    ></div>
    <div v-else-if="!chartData.length" class="px-4 pb-3">
      <div
        class="flex-1 flex items-center justify-center bg-grey-5 rounded-xl min-h-[140px] w-full"
      >
        <p class="text-info text-center text-s-13">
          {{ t('portfolio.history.no_chart_data') }}
        </p>
      </div>
    </div>
    <history-chart v-else :data="chartData" class="-ml-[3px]" />
  </app-sheet>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import AppSheet from '@/components/AppSheet.vue'
import AppTooltip from '@/components/AppTooltip.vue'
import HistoryChart from './components/history/HistoryChart.vue'
import { useWalletStore } from '@/stores/walletStore'
import { useChainsStore } from '@/stores/chainsStore'
import {
  useFetchMewWalletApi,
  type PortfolioBalanceHistoryResponse,
} from '@/composables/useFetchMewWalletApi'
import { useFetchMewApi } from '@/composables/useFetchMewApi'
import { computed } from 'vue'
import BigNumber from 'bignumber.js'
import {
  formatFiatValue,
  formatPercentageValue,
} from '@/utils/numberFormatHelper'
import { type PortfolioHistoryResponse } from '@/mew_api/types'
import configs from '@/configs.js'

const { t } = useI18n()
const walletStore = useWalletStore()
const { isWalletConnected, allTokens, walletAddress, isLoadingBalances } =
  storeToRefs(walletStore)
const { selectedChain } = storeToRefs(useChainsStore())
const { useMEWWalletFetch } = useFetchMewWalletApi()
const { useMEWFetch } = useFetchMewApi()

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

interface Change {
  fiat: BigNumber
  percentChange: BigNumber
}
const lastTwentyFourHours = computed<Change>(() => {
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
    percentChange: percentChange,
  }
})

const CHAIN_TO_ZERION_MAP: Record<string, string> = {
  ETHEREUM: 'ETH',
  BSC: 'BSC',
  BNB: 'BNB',
  POLYGON: 'POLYGON',
  ZKSYNC: 'ZKSYNC_MAINNET',
  ARBITRUM: 'ARB',
  BASE: 'BASE',
  OPTIMISTIC_ETHEREUM: 'OP',
  FANTOM: 'FTM',
}

const mappedToChain = computed(() => {
  return CHAIN_TO_ZERION_MAP[selectedChain.value?.name ?? ''] || ''
})

// Chains present in CHAIN_TO_ZERION_MAP use the new balance-history endpoint.
// Anything else falls back to the legacy 7d back-projection endpoint below.
const isSupportedChain = computed(() => Boolean(mappedToChain.value))

const balanceHistoryUrl = computed(() => {
  if (isSupportedChain.value && walletAddress.value) {
    return `${configs.MEW_PURCHASE_BASE_URL}/v5/portfolio/balance-history?address=${walletAddress.value}&period=max&chain=${mappedToChain.value}`
  }
  return ''
})

// Fallback for unsupported networks: original 7d back-projection endpoint.
const legacyHistoryUrl = computed(() => {
  if (!isSupportedChain.value && selectedChain.value?.name && walletAddress.value) {
    return `/v1/web/chains/${selectedChain.value.name}/addresses/${walletAddress.value}/7d-balances-back-projection`
  }
  return ''
})

const { data: balanceHistory, isFetching: isFetchingBalanceHistory } =
  useMEWWalletFetch(balanceHistoryUrl, {
    refetch: true,
  })
    .get()
    .json<PortfolioBalanceHistoryResponse>()

const { data: legacyHistory, isFetching: isFetchingLegacy } = useMEWFetch(
  legacyHistoryUrl,
  {
    refetch: true,
  },
)
  .get()
  .json<PortfolioHistoryResponse>()

const isFetching = computed(
  () => isFetchingBalanceHistory.value || isFetchingLegacy.value,
)

const chartData = computed(() => {
  // Preferred: new balance-history response ([timestamp, value] tuples).
  const balances = balanceHistory.value?.balances
  if (balances) {
    return balances.map(([timestamp, value]) => ({
      timestamp: new Date(timestamp).getTime(),
      value: Number(value),
    }))
  }
  // Fallback: legacy response with parallel timestamps/values arrays.
  const legacy = legacyHistory.value
  if (legacy?.timestamps) {
    return legacy.timestamps.map((timestamp, index) => ({
      timestamp,
      value: legacy.values[index],
    }))
  }
  return []
})
</script>
