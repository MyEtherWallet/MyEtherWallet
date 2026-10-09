<template>
  <AppSegmentedControl
    :model-value="selectedChartFilter.value"
    :items="isXS ? chartFilterOptions.slice(0, 3) : chartFilterOptions"
    size="small"
    :label="$t('common.chart_range')"
    class="ml-auto mb-1 sm:mb-4"
    @update:model-value="selectChartFilter"
  >
    <app-select
      v-if="isXS"
      v-model:selected="selectedChartFilter"
      :options="chartFilterOptions.slice(3, chartFilterOptions.length)"
      position="-right-1"
      class="text-s-12"
    >
      <template #select-button="{ toggleSelect }">
        <button
          type="button"
          class="flex h-7 items-center rounded-3xl px-1.5 text-label-sm text-text-default hover:bg-background-alternative-hover"
          @click="toggleSelect"
        >
          <span class="px-1.5">{{ $t('common.more') }}</span>
          <AppIcon name="chevron-down" size="s" />
        </button>
      </template>
    </app-select>
  </AppSegmentedControl>
  <div class="h-[200px] sm:h-80">
    <chart-price
      v-if="!isLoadingFetch && !notAvailable"
      :labels="labels"
      :points="points"
      :time-frame="selectedChartFilter.value"
      class="w-full h-full"
    />
    <div
      v-else
      class="w-full bg-background-default-hover h-full rounded-lg"
      :class="{ 'animate-pulse': isLoadingFetch }"
    >
      <div class="flex flex-col items-center h-full justify-center gap-2">
        <p v-if="notAvailable" class="text-s-14 text-text-subtle">
          {{ $t('common.no_data_available') }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onBeforeUnmount, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useFetchMewApi } from '@/composables/useFetchMewApi'
import AppSegmentedControl from '@components/segmented_control/AppSegmentedControl.vue'
import AppSelect from '@/components/AppSelect.vue'
import ChartPrice from '@/components/ChartPrice.vue'
import AppIcon from '@/components/icon/AppIcon.vue'
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
  { label: t('common.chart_1d'), value: '1D' },
  { label: t('common.chart_7d'), value: '7D' },
  { label: t('common.chart_1m'), value: '1M' },
  { label: t('common.chart_3m'), value: '3M' },
  { label: t('common.chart_1y'), value: '1Y' },
  { label: t('common.chart_all'), value: 'ALL' },
])

const selectedChartFilter = ref<Item>(chartFilterOptions.value[0])

const selectChartFilter = (value: StockPriceChartInterval) => {
  selectedChartFilter.value =
    chartFilterOptions.value.find(opt => opt.value === value) ??
    selectedChartFilter.value
}

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
