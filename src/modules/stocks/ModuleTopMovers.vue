<template>
  <div class="grid grid-cols-12 w-full items-stretch">
    <div class="col-span-12 gap-4">
      <div
        class="snap-x flex items-stretch justify-start gap-4 overflow-scroll-auto py-1 px-1"
      >
        <app-slide-group
          :totalItems="topMovers.length"
          title="Top Movers"
          paginateLocation="top"
        >
          <template
            v-for="(stock, idx) in topMovers"
            :key="`item-${idx}`"
            #[`item-${idx}`]
          >
            <top-mover :stock="stock" class="snap-center" />
          </template>
        </app-slide-group>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import TopMover from './components/TopMover.vue'
import AppSlideGroup from '@/components/app_slide_group/AppSlideGroup.vue'
import { useStocksStore } from '@/stores/stocksStore'

const stocksStore = useStocksStore()
const { topMovers } = storeToRefs(stocksStore)
</script>
