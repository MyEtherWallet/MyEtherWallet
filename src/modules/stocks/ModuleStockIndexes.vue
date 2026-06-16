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
import StockIndex from './components/StockIndex.vue'
import AppSlideGroup from '@components/app_slide_group/AppSlideGroup.vue'
import { useStocksStore } from '@/stores/stocksStore'
import { storeToRefs } from 'pinia'
const stocksStore = useStocksStore()
const { banner: stockIndexes } = storeToRefs(stocksStore)
</script>
