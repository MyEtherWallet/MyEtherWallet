<template>
  <div class="flex flex-col gap-6">
    <div
      class="grid grid-cols-12 w-full items-center gap-y-6 gap-x-4 lg:gap-x-6 lg:gap-y-10"
    >
      <div class="col-span-12 -mt-2">
        <module-stock-indexes class="-mx-1" />
        <module-search-stocks />
        <module-top-movers class="mt-6" />
      </div>
      <module-newly-added
        class="col-span-12 lg:col-span-4"
        v-if="isTradingRestrictedInRegion"
      />
      <module-newly-added-banner class="col-span-12 lg:col-span-4" v-else />
      <module-trending class="col-span-12 lg:col-span-4" />
      <module-news class="col-span-12 lg:col-span-4" />
      <module-all-stock class="col-span-12" />
    </div>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import ModuleStockIndexes from '@/modules/stocks/ModuleStockIndexes.vue'
import ModuleSearchStocks from '@/modules/stocks/ModuleSearchStocks.vue'
import ModuleTopMovers from '@/modules/stocks/ModuleTopMovers.vue'
import ModuleNewlyAdded from '@/modules/stocks/ModuleNewlyAdded.vue'
import ModuleNewlyAddedBanner from '@/modules/stocks/ModuleNewlyAddedBanner.vue'
import ModuleTrending from '@/modules/stocks/ModuleTrending.vue'
import ModuleNews from '@/modules/stocks/ModuleNews.vue'
import ModuleAllStock from '@/modules/stocks/ModuleAllStock.vue'
import { useStocksStore } from '@/stores/stocksStore'
import { useMarketStatus } from '@/modules/trade/composables'
const { isTradingRestrictedInRegion } = useMarketStatus()

const stocksStore = useStocksStore()
stocksStore.fetchStockOverview()
</script>
