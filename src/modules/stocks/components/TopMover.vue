<template>
  <div
    class="rounded-16 bg-white shadow-button p-2 w-[200px] flex flex-col items-start"
  >
    <div class="flex items-center justify-center gap-3 my-2 mx-2">
      <app-token-logo :url="stock.icon_url" :symbol="stock.ticker" />
      <div>
        <p class="text-s-14 font-semibold text-nowrap">
          {{ stock.name }}
        </p>
        <p class="text-s-11 md:text-s-12 text-info uppercase">
          {{ stock.ticker }}
        </p>
      </div>
    </div>
    <div class="bg-mewBg rounded-12 mt-1 w-full">
      <p class="text-s-16 font-semibold mt-2 ml-6">
        $ {{ formatFiatValue(stock.price).value }}
      </p>
      <p
        class="text-s-9 md:text-s-11 font-semibold leading-p-150 text-nowrap ml-6 mb-2"
        :class="{
          'text-error': stock.percent_change_24h < 0,
          'text-success': stock.percent_change_24h >= 0,
        }"
      >
        <span>
          {{ stock.percent_change_24h < 0 ? '' : '+' }}
        </span>
        {{ formatPercentageValue(stock.percent_change_24h).value }}
      </p>
      <top-mover-history-chart :data="stock.prices" class="max-h-[70px]" />
    </div>
  </div>
</template>

<script setup lang="ts">
import TopMoverHistoryChart from './TopMoverHistoryChart.vue'
import {
  formatPercentageValue,
  formatFiatValue,
} from '@/utils/numberFormatHelper'
import AppTokenLogo from '@/components/AppTokenLogo.vue'

interface Stock {
  name: string
  ticker: string
  price: number
  percent_change_24h: number
  prices: Array<{ timestamp: number; price: number }>
  icon_url: string
}
defineProps<{ stock: Stock }>()
</script>
