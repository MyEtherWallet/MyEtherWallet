<template>
  <div class="grid grid-cols-12 w-full gap-5 2xl:gap-10 items-stretch mb-2">
    <div class="col-span-12 gap-4">
      <app-slide-group :totalItems="stockIndexes.length">
        <template
          v-for="(index, idx) in stockIndexes"
          :key="`item-${idx}`"
          #[`item-${idx}`]
        >
          <stock-index :stockIndex="index" class="snap-center" />
        </template>
      </app-slide-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import StockIndex from './components/StockIndex.vue'
import AppSlideGroup from '@/components/app_slide_group/AppSlideGroup.vue'
interface Index {
  name: string
  percent_change_24h: number
  sparkline_7d: number[]
}
const stockIndexes = ref<Index[]>([
  {
    name: 'S&P 500',
    percent_change_24h: (Math.floor(Math.random() * 1000) - 1000) / 100,
    sparkline_7d: Array.from(
      { length: 24 },
      () => Math.floor(Math.random() * 1000) - 100,
    ),
  },
  {
    name: 'NASDAQ',
    percent_change_24h: (Math.floor(Math.random() * 1000) - 1000) / 100,
    sparkline_7d: Array.from(
      { length: 24 },
      () => Math.floor(Math.random() * 1000) - 100,
    ),
  },

  {
    name: 'Dow Jones',
    percent_change_24h: (Math.floor(Math.random() * 1000) - 1000) / 100,
    sparkline_7d: Array.from(
      { length: 24 },
      () => Math.floor(Math.random() * 1000) - 100,
    ),
  },
  {
    name: 'NYSE',
    percent_change_24h: (Math.floor(Math.random() * 1000) - 100) / 100,
    sparkline_7d: Array.from(
      { length: 24 },
      () => Math.floor(Math.random() * 1000) - 100,
    ),
  },
  {
    name: 'VIX',
    percent_change_24h: (Math.floor(Math.random() * 1000) - 100) / 100,
    sparkline_7d: Array.from(
      { length: 24 },
      () => Math.floor(Math.random() * 1000) - 100,
    ),
  },
])
</script>
