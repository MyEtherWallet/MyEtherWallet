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
import { formatPercentageValue } from '@/utils/numberFormatHelper'
import { useCurrency } from '@/composables/useCurrency'
import { usePortfolio24hChange } from '@/composables/usePortfolio24hChange'
import { type PortfolioHistoryResponse } from '@/mew_api/types'
import configs from '@/configs.js'

const { t } = useI18n()
const { formatFiat } = useCurrency()
const walletStore = useWalletStore()
const { isWalletConnected, walletAddress, isLoadingBalances } =
  storeToRefs(walletStore)
const { selectedChain } = storeToRefs(useChainsStore())
const { useMEWWalletFetch } = useFetchMewWalletApi()
const { useMEWFetch } = useFetchMewApi()

const { lastTwentyFourHours } = usePortfolio24hChange()

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

const isEvmAddress = (address: string): boolean =>
  /^0x[0-9a-fA-F]{40}$/.test(address)

// Skip the request when the connected address doesn't belong to the selected
// chain type — e.g. an EVM (0x…) address while the BITCOIN network is
// selected in the multi-address flow. The API rejects the mismatch
// (INVALID_BTC_ADDRESS_FORMAT).
const addressMatchesChain = computed(() => {
  const chain = selectedChain.value
  const address = walletAddress.value
  if (!chain?.name || !address) return false
  return (chain.type === 'EVM') === isEvmAddress(address)
})

const balanceHistoryUrl = computed(() => {
  const address = walletAddress.value
  if (!isSupportedChain.value || !addressMatchesChain.value || !address) {
    return ''
  }
  return `${configs.MEW_PURCHASE_BASE_URL}/v5/portfolio/balance-history?address=${address}&period=max&chain=${mappedToChain.value}`
})

// Fallback for unsupported networks: original 7d back-projection endpoint.
const legacyHistoryUrl = computed(() => {
  const chain = selectedChain.value
  const address = walletAddress.value
  if (isSupportedChain.value || !addressMatchesChain.value) return ''
  if (!chain?.name || !address) return ''
  return `/v1/web/chains/${chain.name}/addresses/${address}/7d-balances-back-projection`
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
