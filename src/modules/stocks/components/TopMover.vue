<template>
  <div
    class="rounded-16 bg-white shadow-button p-2 w-[200px] flex flex-col items-start"
  >
    <div class="flex items-center justify-start gap-3 my-2 mx-2 w-full">
      <app-token-logo
        :url="stock.iconPngUrl || stock.iconSvgUrl"
        :symbol="stock.primaryMarket.symbol"
        class="flex-none"
        :is-stock="true"
      />
      <div class="min-w-0">
        <app-token-symbol
          :symbol="stock.primaryMarket.symbol"
          :is-stock="true"
        />
        <app-tooltip
          :text="stock.underlyingMarket.name"
          v-if="
            stock.underlyingMarket.name &&
            stock.underlyingMarket.name.length > 12
          "
        >
          <p class="text-s-12 text-info truncate leading-tight max-w-[120px]">
            {{ stock.underlyingMarket.name }}
          </p>
        </app-tooltip>
        <p v-else class="text-s-12 text-info truncate pr-2">
          {{ stock.underlyingMarket.name }}
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
          'text-black': !stock.primaryMarket.priceChangePercentage24h,
          'text-error':
            stock.primaryMarket.priceChangePercentage24h &&
            parseFloat(stock.primaryMarket.priceChangePercentage24h) < 0,
          'text-success':
            stock.primaryMarket.priceChangePercentage24h &&
            parseFloat(stock.primaryMarket.priceChangePercentage24h) >= 0,
        }"
      >
        <span v-if="stock.primaryMarket.priceChangePercentage24h">
          {{
            parseFloat(stock.primaryMarket.priceChangePercentage24h) < 0
              ? ''
              : '+'
          }}
        </span>
        {{ getPriceChange }}
      </p>
      <top-mover-history-chart :data="sparkLine" class="max-h-[70px]" />
    </div>
  </div>
</template>

<script setup lang="ts">
import AppTooltip from '@/components/AppTooltip.vue'
import AppTokenSymbol from '@/components/AppTokenSymbol.vue'
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
  return props.stock.primaryMarket.price
    ? `$${formatFiatValue(props.stock.primaryMarket.price).value}`
    : '-'
})
const getPriceChange = computed(() => {
  return props.stock.primaryMarket.priceChangePercentage24h
    ? formatPercentageValue(
        parseFloat(props.stock.primaryMarket.priceChangePercentage24h),
      ).value
    : '-'
})

interface StockSparkline {
  timestamp: number
  price: number
}
const sparkLine = computed<StockSparkline[]>(() => {
  return props.stock.primaryMarket.priceHistory24h
    ? props.stock.primaryMarket.priceHistory24h
        .filter(
          (stock): stock is { timestamp: number; price: string } =>
            stock.price !== undefined && stock.timestamp !== undefined,
        )
        .map(stock => ({
          timestamp: stock.timestamp,
          price: parseFloat(stock.price),
        }))
    : []
})
</script>
