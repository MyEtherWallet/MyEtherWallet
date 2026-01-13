<template>
  <div
    class="rounded-16 bg-white shadow-button p-2 w-[200px] flex flex-col items-start"
  >
    <div class="flex items-center justify-start gap-3 my-2 mx-2 w-full">
      <app-token-logo
        :url="undefined"
        :symbol="stock.symbol"
        class="flex-none"
      />
      <div class="min-w-0">
        <app-tooltip
          :text="stock.name"
          v-if="stock.name && stock.name.length > 12"
        >
          <p class="text-s-15 font-medium truncate leading-tight max-w-[120px]">
            {{ stock.name }}
          </p>
        </app-tooltip>
        <p v-else class="text-s-15 font-medium truncate pr-2">
          {{ stock.name }}
        </p>
        <p class="text-s-12 text-info uppercase truncate">
          {{ stock.symbol }}
        </p>
      </div>
    </div>
    <div class="bg-mewBg rounded-12 mt-1 w-full">
      <p class="text-s-16 font-semibold mt-2 ml-6">
        {{ getPrice }}
      </p>
      <p
        class="text-s-9 md:text-s-11 font-semibold leading-p-150 text-nowrap ml-6 mb-2"
        :class="{
          'text-black': !stock.priceChangePercentage24h,
          'text-error':
            stock.priceChangePercentage24h &&
            stock.priceChangePercentage24h < 0,
          'text-success':
            stock.priceChangePercentage24h &&
            stock.priceChangePercentage24h >= 0,
        }"
      >
        <span v-if="stock.priceChangePercentage24h">
          {{ stock.priceChangePercentage24h < 0 ? '' : '+' }}
        </span>
        {{ getPriceChange }}
      </p>
      <top-mover-history-chart :data="sparkLine" class="max-h-[70px]" />
    </div>
  </div>
</template>

<script setup lang="ts">
import AppTooltip from '@/components/AppTooltip.vue'
import TopMoverHistoryChart from './TopMoverHistoryChart.vue'
import {
  formatPercentageValue,
  formatFiatValue,
} from '@/utils/numberFormatHelper'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import { type StockTopMoverItem } from '@/mew_api/types'
import { computed } from 'vue'

const props = defineProps<{ stock: StockTopMoverItem }>()

const getPrice = computed(() => {
  return props.stock.price
    ? `$${formatFiatValue(props.stock.price).value}`
    : '-'
})
const getPriceChange = computed(() => {
  return props.stock.priceChangePercentage24h
    ? formatPercentageValue(props.stock.priceChangePercentage24h).value
    : '-'
})

interface StockSparkline {
  timestamp: number
  price: number
}
const sparkLine = computed<StockSparkline[]>(() => {
  return props.stock.priceHistory24h
    ? props.stock.priceHistory24h.filter(
        (stock): stock is StockSparkline =>
          stock.price !== undefined && stock.timestamp !== undefined,
      )
    : []
})
</script>
