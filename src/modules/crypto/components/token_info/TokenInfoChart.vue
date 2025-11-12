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
            <p>More</p>
            <chevron-down-icon class="w-4 h-4 ml-1" />
          </button>
        </template>
      </app-select>
    </template>
  </app-btn-group>
  <chart-price
    v-if="!isLoadingFetch && !notAvailable"
    :labels="labels"
    :points="points"
    :time-frame="selectedChartFilter.value"
    class="w-full h-[200px] sm:h-[320px]"
  />
  <div
    v-else
    class="w-full bg-surface h-[200px] sm:h-[320px] rounded-lg"
    :class="{ 'animate-pulse': isLoadingFetch }"
  >
    <div class="flex flex-col items-center h-full justify-center gap-2">
      <p v-if="notAvailable" class="text-s-14 text-info">No data available</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onBeforeUnmount } from 'vue'
import { useFetchMewApi } from '@/composables/useFetchMewApi'
import AppBtnGroup from '@/components/AppBtnGroup.vue'
import AppSelect from '@/components/AppSelect.vue'
import ChartPrice from '@/components/ChartPrice.vue'
import { ChevronDownIcon } from '@heroicons/vue/24/outline'
import { useAppBreakpoints } from '@/composables/useAppBreakpoints'
import type {
  GetWebTokenPriceChartByCoinResponse,
  GetWebTokenPriceChartPoint,
  WebTokenPriceChartInterval,
} from '@/mew_api/types'
import { useIntervalFn } from '@vueuse/core'

const props = defineProps({
  tokenId: {
    type: String,
    required: true,
  },
})
const { isXS } = useAppBreakpoints()

/** --------------------
 * Chart Filter
 --------------------*/

interface Item {
  label: string
  value: WebTokenPriceChartInterval
}
const chartFilterOptions = ref<Item[]>([
  { label: '1d', value: '1D' },
  { label: '7d', value: '7D' },
  { label: '1m', value: '1M' },
  { label: '3m', value: '3M' },
  { label: '1y', value: '1Y' },
  { label: 'all', value: 'ALL' },
])

const selectedChartFilter = ref(chartFilterOptions.value[0])

/** --------------------
 * FetchData
 --------------------*/

const storeData = ref<
  Map<WebTokenPriceChartInterval, GetWebTokenPriceChartPoint[]>
>(new Map())

/**
 * Clear cache every 5 minutes
 */
const { pause, isActive } = useIntervalFn(() => {
  storeData.value.clear()
}, 300000) // 5 min

onBeforeUnmount(() => {
  if (isActive) {
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

const endpoint = computed(() => {
  return `/v1/web/token-price-chart/coins/${props.tokenId}?interval=${selectedChartFilter.value.value}`
})

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
  .json<GetWebTokenPriceChartByCoinResponse>()

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
