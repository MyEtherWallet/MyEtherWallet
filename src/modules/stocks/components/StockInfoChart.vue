<template>
  <div class="w-full">
    <!-- <chart-price
      v-if="!isLoading && points.length > 0"
      :labels="labels"
      :points="points"
      class="w-full h-[200px] sm:h-[320px]"
    />
    <div
      v-else
      class="w-full bg-surface h-[200px] sm:h-[320px] rounded-lg flex flex-col items-center justify-center gap-2"
      :class="{ 'animate-pulse': isLoading }"
    >
      <p v-if="!isLoading && points.length === 0" class="text-s-14 text-info">
        No data available
      </p>
    </div> -->
  </div>
</template>

<script setup lang="ts">
// import { computed } from 'vue'
// // import ChartPrice from '@/components/ChartPrice.vue'
// import { useFetchMewApi } from '@/composables/useFetchMewApi'
// import type { GetWebStocksInfoPrimaryPriceChartResponse } from '@/mew_api/types'

// const props = defineProps({
//   symbol: {
//     type: String,
//     required: true,
//   },
// })

// const { useMEWFetch } = useFetchMewApi()

// const fetchUrl = computed(
//   () => `/v1/web/pages/stocks-info/stocks/${props.symbol}/primary-price-chart`,
// )

// const { data, isFetching: isLoading } = useMEWFetch(fetchUrl, {
//   refetch: true,
// })
//   .get()
//   .json<GetWebStocksInfoPrimaryPriceChartResponse>()

// const labels = computed(() => {
//   if (!data.value?.prices) return []
//   return data.value.prices.map(p => p.timestamp)
// })

// const points = computed(() => {
//   if (!data.value?.prices) return []
//   return data.value.prices.map(p => p.price)
// })
</script>
