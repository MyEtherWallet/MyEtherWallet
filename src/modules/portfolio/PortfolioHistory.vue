<template>
  <app-sheet
    v-if="isWalletConnected"
    :is-elivated="false"
    sheet-class="!px-0 !pt-4 !pb-2 overflow-hidden w-full h-full flex flex-col justify-end gap-3 lg:gap-1"
  >
    <div class="flex items-start justify-between mb-auto px-5">
      <div class="flex items-center gap-1.5">
        <h2 class="text-s-20 font-bold leading-none">{{ t('portfolio.history.title') }}</h2>
        <app-tooltip
          :text="t('portfolio.history.tooltip')"
        />
      </div>
      <div class="text-right">
        <p
          class="font-bold text-s-11 tracking-sp-06 uppercase text-info leading-none mb-1"
        >
          {{ t('portfolio.history.last_24h') }}
        </p>
        <div v-if="!isLoadingBalances">
          <p class="text-s-20 font-semibold text-black leading-none mt-2">
            {{ lastTwentyFourHours.fiat.isLessThan(0) ? '-' : '+'
            }}{{ formatFiat(lastTwentyFourHours.fiat.abs()).display }}
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
        <p class="text-info text-center text-s-13">{{ t('portfolio.history.no_chart_data') }}</p>
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
import { useFetchMewApi } from '@/composables/useFetchMewApi'
import { computed } from 'vue'
import { formatPercentageValue } from '@/utils/numberFormatHelper'
import { useCurrency } from '@/composables/useCurrency'
import { usePortfolio24hChange } from '@/composables/usePortfolio24hChange'
import { type PortfolioHistoryResponse } from '@/mew_api/types'

const { t } = useI18n()
const { formatFiat } = useCurrency()
const walletStore = useWalletStore()
const { isWalletConnected, walletAddress, isLoadingBalances } =
  storeToRefs(walletStore)
const { selectedChain } = storeToRefs(useChainsStore())
const { useMEWFetch } = useFetchMewApi()

const { lastTwentyFourHours } = usePortfolio24hChange()

const fetchUrl = computed(() => {
  if (selectedChain.value?.name && walletAddress.value) {
    return `/v1/web/chains/${selectedChain.value.name}/addresses/${walletAddress.value}/7d-balances-back-projection`
  }
  return ''
})

const { data: dataPrices, isFetching } = useMEWFetch(fetchUrl, {
  refetch: true,
})
  .get()
  .json<PortfolioHistoryResponse>()

const chartData = computed(() => {
  if (!dataPrices.value) return []
  const { timestamps, values } = dataPrices.value
  if (timestamps) {
    return timestamps.map((timestamp, index) => ({
      timestamp,
      value: values[index],
    }))
  }
  return []
})
</script>
