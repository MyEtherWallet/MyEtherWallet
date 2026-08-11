<template>
  <div class="rounded-16 py-1 px-4 flex items-center justify-center gap-3">
    <p class="text-s-11 md:text-s-12 font-semibold text-nowrap">
      {{ stockIndex.symbol }}
    </p>
    <p
      class="text-s-9 md:text-s-11 font-semibold leading-p-150 text-nowrap"
      :class="{
        'text-fg': !stockIndex.priceChangePercentage24h,
        'text-error':
          stockIndex.priceChangePercentage24h &&
          stockIndex.priceChangePercentage24h < 0,
        'text-success':
          stockIndex.priceChangePercentage24h &&
          stockIndex.priceChangePercentage24h >= 0,
      }"
    >
      {{ getPercent }}
    </p>
    <table-sparkline
      v-if="stockIndex.sparkline24h"
      :points="stockIndex.sparkline24h"
      :width="60"
      :height="15"
      :max-points="40"
      :percent-change="stockIndex.priceChangePercentage24h"
    />
  </div>
</template>

<script setup lang="ts">
import TableSparkline from '@/components/TableSparkline.vue'
import { formatPercentageValue } from '@/utils/numberFormatHelper'
import { type StockBannerItem } from '@/mew_api/types'
import { computed } from 'vue'
const props = defineProps<{ stockIndex: StockBannerItem }>()

const getPercent = computed<string>(() => {
  return props.stockIndex.priceChangePercentage24h
    ? formatPercentageValue(props.stockIndex.priceChangePercentage24h).value
    : '-'
})
</script>
