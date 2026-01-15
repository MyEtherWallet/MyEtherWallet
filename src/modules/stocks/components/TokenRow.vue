<template>
  <router-link
    class="flex gap-3 rounded-16 hoverBGWhite shadow-button py-2 px-3 items-center bg-white"
    :to="{
      name: TOKEN_INFO_ROUTE_NAMES.crypto,
      params: {
        tokenId: token.primaryMarket.symbol,
      },
    }"
  >
    <app-token-logo
      :url="token.iconPngUrl || token.iconSvgUrl"
      :symbol="token.primaryMarket.symbol"
    />
    <div class="truncate">
      <p class="uppercase font-medium truncate text-s-15">
        {{ truncate(token.primaryMarket.symbol || '', 7) }}
      </p>
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
import {
  formatPercentageValue,
  formatFiatValue,
} from '@/utils/numberFormatHelper'
import AppTooltip from '@/components/AppTooltip.vue'
import type { StockOverviewItem } from '@/mew_api/types'
import { truncate } from '@/utils/filters'
import { TOKEN_INFO_ROUTE_NAMES } from '@/router/routeNames'
import TableSparkline from '@/components/TableSparkline.vue'
import { computed } from 'vue'
const props = defineProps<{
  token: StockOverviewItem
}>()

const getPrice = computed(() => {
  return props.token.primaryMarket.price
    ? `$${formatFiatValue(props.token.primaryMarket.price).value}`
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
