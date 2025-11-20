<template>
  <div
    class="rounded-16 bg-white shadow-button py-1 px-4 flex items-center gap-4"
  >
    <div class="w-full">
      <p class="text-s-11 md:text-s-12 font-semibold text-nowrap">
        {{ stockIndex.name }}
      </p>
      <p
        class="text-s-9 md:text-s-11 font-semibold leading-p-150 text-nowrap"
        :class="{
          'text-error': stockIndex.percent_change_24h < 0,
          'text-success': stockIndex.percent_change_24h >= 0,
        }"
      >
        <span>
          {{ stockIndex.percent_change_24h < 0 ? '' : '+' }}
        </span>
        {{ formatPercentageValue(stockIndex.percent_change_24h).value }}
      </p>
    </div>
    <table-sparkline
      :points="stockIndex.sparkline_7d"
      :width="80"
      :height="35"
      :percent-change="stockIndex.percent_change_24h"
    />
  </div>
</template>

<script setup lang="ts">
import TableSparkline from '@/components/TableSparkline.vue'
import { formatPercentageValue } from '@/utils/numberFormatHelper'

interface Index {
  name: string
  percent_change_24h: number
  sparkline_7d: number[]
}
defineProps<{ stockIndex: Index }>()
</script>
