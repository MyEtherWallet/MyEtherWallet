<template>
  <router-link
    class="flex gap-3 rounded-16 hoverBGWhite py-2 px-3 items-center bg-white"
    :to="{
      name: STOCK_INFO_ROUTE_NAMES.stocks,
      params: {
        symbol: token.primaryMarket.symbol,
      },
    }"
  >
    <app-token-logo
      :url="token.iconPngUrl || token.iconSvgUrl"
      :symbol="token.primaryMarket.symbol"
      :is-stock="true"
    />
    <div class="truncate">
      <app-token-symbol :symbol="token.primaryMarket.symbol" :is-stock="true" />
      <app-tooltip
        :text="token.underlyingMarket.name"
        v-if="
          token.underlyingMarket.name && token.underlyingMarket.name.length > 12
        "
      >
        <p
          class="hidden xs:block text-s-12 text-info truncate leading-tight max-w-[120px] xs:max-w-full lg:max-w-[200px]"
        >
          {{ token.underlyingMarket.name }}
        </p>
      </app-tooltip>
      <p
        v-else
        class="truncate text-s-12 text-info max-w-[120px] xs:max-w-full"
      >
        {{ token.underlyingMarket.name || '' }}
      </p>
    </div>
    <table-sparkline
      class="ml-auto mx-3"
      :points="token.primaryMarket.sparkline24h"
      :width="40"
      :height="30"
      :max-points="34"
      fill
      :percent-change="parseFloat(token.primaryMarket.priceChangePercentage24h)"
    />
    <div>
      <p class="text-s-14 text-right font-medium">
        {{ getPrice }}
      </p>
      <p
        class="text-s-12 text-right"
        :class="{
          'text-black': !token.primaryMarket.priceChangePercentage24h,
          'text-error':
            token.primaryMarket.priceChangePercentage24h &&
            parseFloat(token.primaryMarket.priceChangePercentage24h) < 0,
          'text-success':
            token.primaryMarket.priceChangePercentage24h &&
            parseFloat(token.primaryMarket.priceChangePercentage24h) >= 0,
        }"
      >
        {{ getPriceChange }}
      </p>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import AppTokenSymbol from '@/components/AppTokenSymbol.vue'
import { formatPercentageValue } from '@/utils/numberFormatHelper'
import { useCurrency } from '@/composables/useCurrency'
import AppTooltip from '@/components/AppTooltip.vue'
import type { StockTrendingItem } from '@/mew_api/types'
import { STOCK_INFO_ROUTE_NAMES } from '@/router/routeNames'
import TableSparkline from '@/components/TableSparkline.vue'
import { computed } from 'vue'
// Serves both `trending` and `newlyAdded` rows; only new listings carry
// description, so the row keys off the narrower trending shape (newlyAdded is
// assignable to it) and never reads description.
const props = defineProps<{
  token: StockTrendingItem
}>()

const { formatFiat } = useCurrency()

const getPrice = computed(() => {
  return props.token.primaryMarket.price
    ? formatFiat(props.token.primaryMarket.price).display
    : '-'
})
const getPriceChange = computed(() => {
  return props.token.primaryMarket.priceChangePercentage24h
    ? formatPercentageValue(
        parseFloat(props.token.primaryMarket.priceChangePercentage24h),
      ).value
    : '-'
})
</script>
