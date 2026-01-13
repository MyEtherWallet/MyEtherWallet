<template>
  <router-link
    class="flex gap-3 rounded-16 hoverBGWhite shadow-button py-2 px-3 items-center bg-white"
    :to="{
      name: TOKEN_INFO_ROUTE_NAMES.crypto,
      params: {
        tokenId: token.symbol,
      },
    }"
  >
    <app-token-logo :url="undefined" :symbol="token.symbol" />
    <div class="truncate">
      <app-tooltip
        :text="token.name"
        v-if="token.name && token.name.length > 12"
      >
        <p
          class="hidden xs:block text-s-15 font-medium truncate leading-tight max-w-[120px] xs:max-w-full lg:max-w-[200px]"
        >
          {{ token.name }}
        </p>
      </app-tooltip>
      <p v-else class="truncate text-s-15 font-medium">
        {{ token.name || '' }}
      </p>
      <p
        class="xs:text-info font-medium xs:font-normal text-s-15 xs:text-s-12 uppercase"
      >
        {{ truncate(token.symbol || '', 7) }}
      </p>
    </div>
    <table-sparkline
      class="ml-auto mx-3"
      :points="token.sparkline24h || []"
      :width="40"
      :height="30"
      :max-points="34"
      fill
      :percent-change="token.priceChangePercentage24h"
    />
    <div>
      <p class="text-s-14 text-right font-medium">
        {{ getPrice }}
      </p>
      <p
        class="text-s-12 text-right"
        :class="{
          'text-black': !token.priceChangePercentage24h,
          'text-error':
            token.priceChangePercentage24h &&
            token.priceChangePercentage24h < 0,
          'text-success':
            token.priceChangePercentage24h &&
            token.priceChangePercentage24h >= 0,
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
  return props.token.price
    ? `$${formatFiatValue(props.token.price).value}`
    : '-'
})
const getPriceChange = computed(() => {
  return props.token.priceChangePercentage24h
    ? formatPercentageValue(props.token.priceChangePercentage24h).value
    : '-'
})
</script>
