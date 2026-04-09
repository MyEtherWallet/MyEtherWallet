<template>
  <app-btn-group
    v-model:selected="selectedChartFilter"
    :disabled="isLoadingFetch"
    :btn-list="isXS ? chartFilterOptions.slice(0, 3) : chartFilterOptions"
    size="xs"
    class="ml-auto mb-1 sm:mb-4"
  >
    <template #btn-content="{ data }">
      {{ data.label }}
    </template>
    <template #custom>
      <app-select
        v-if="isXS"
        v-model:selected="selectedChartFilter"
        :options="chartFilterOptions.slice(3, chartFilterOptions.length)"
        position="-right-1"
        class="text-s-12"
      >
        <template #select-button="{ toggleSelect }">
          <button
            class="rounded-full hoverNoBG p-2 h-6 min-w-[46px] !text-s-12 flex items-center"
            @click="toggleSelect"
          >
            <p>{{ $t('common.more') }}</p>
            <chevron-down-icon class="w-4 h-4 ml-1" />
          </button>
        </template>
      </app-select>
    </template>
  </app-btn-group>
  <div class="h-[200px] sm:h-[320px]">
    <chart-price
      v-if="!isLoadingFetch && !notAvailable"
      :labels="labels"
      :points="points"
      :time-frame="selectedChartFilter.value"
      class="w-full h-full"
    />
    <div
      v-else
      class="w-full bg-surface h-full rounded-lg"
      :class="{ 'animate-pulse': isLoadingFetch }"
    >
      <div class="flex flex-col items-center h-full justify-center gap-2">
        <p v-if="notAvailable" class="text-s-14 text-info">{{ $t('common.no_data_available') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onBeforeUnmount, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useFetchMewApi } from '@/composables/useFetchMewApi'
import AppBtnGroup from '@/components/AppBtnGroup.vue'
import AppSelect from '@/components/AppSelect.vue'
import ChartPrice from '@/components/ChartPrice.vue'
import { ChevronDownIcon } from '@heroicons/vue/24/outline'
import { useAppBreakpoints } from '@/composables/useAppBreakpoints'
import type {
  GetWebStocksInfoPrimaryPriceChartResponse,
  StockChartPoint,
  StockPriceChartInterval,
} from '@/mew_api/types'
import { useIntervalFn } from '@vueuse/core'

const props = defineProps({
  symbol: {
    type: String,
    required: true,
  },
})
const { isXS } = useAppBreakpoints()
const { t } = useI18n()

/** --------------------
 * Chart Filter
 --------------------*/

interface Item {
  label: string
  value: StockPriceChartInterval
}
const chartFilterOptions = computed<Item[]>(() => [
  { label: t('stocks.chart_1d'), value: '1D' },
  { label: t('stocks.chart_7d'), value: '7D' },
  { label: t('stocks.chart_1m'), value: '1M' },
  { label: t('stocks.chart_3m'), value: '3M' },
  { label: t('stocks.chart_1y'), value: '1Y' },
  { label: t('stocks.chart_all'), value: 'ALL' },
])

const selectedChartFilter = ref<Item>(chartFilterOptions.value[0])

watch(chartFilterOptions, options => {
  selectedChartFilter.value =
    options.find(opt => opt.value === selectedChartFilter.value.value) ||
    options[0]
})

/** --------------------
 * FetchData
 --------------------*/

const storeData = ref<Map<StockPriceChartInterval, StockChartPoint[]>>(
  new Map(),
)

/**
 * Clear cache every 5 minutes
 */
const { pause, isActive } = useIntervalFn(() => {
  storeData.value.clear()
}, 300000) // 5 min

onBeforeUnmount(() => {
  if (isActive.value) {
    pause()
  }
})

const points = computed<number[]>(() => {
  const points =
    storeData.value
      .get(selectedChartFilter.value.value)
      ?.map(point => point.price) || []
  return points
})

const labels = computed<number[]>(() => {
  return (
    storeData.value
      .get(selectedChartFilter.value.value)
      ?.map(point => point.timestamp) || []
  )
})

const endpoint = computed(
  () =>
    `/v1/web/pages/stocks-info/stocks/${props.symbol}/primary-price-chart/?interval=${selectedChartFilter.value.value}`,
)
const refetch = computed(() => {
  return !storeData.value.has(selectedChartFilter.value.value)
})

const notAvailable = ref(false)

const { useMEWFetch } = useFetchMewApi()
const {
  data,
  onFetchResponse,
  isFetching: isLoadingFetch,
  onFetchError,
} = useMEWFetch(endpoint, { refetch: refetch })
  .get()
  .json<GetWebStocksInfoPrimaryPriceChartResponse>()

onFetchError(() => {
  notAvailable.value = true
})

onFetchResponse(() => {
  if (data.value?.prices) {
    notAvailable.value = false
    storeData.value.set(selectedChartFilter.value.value, data.value.prices)
  }
})
</script>

<style scoped>
/* Crisp lines in tiny canvases */
canvas {
  image-rendering: -webkit-optimize-contrast;
}
</style>
